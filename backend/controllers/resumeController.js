import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import {
  uploadFile,
  validateFile,
  generateStoragePath,
  getSignedDownloadUrl,
  getFileUrl
} from '../services/storageService.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { PDFService } from '../services/pdfService.js';
import { SocialProfileService } from '../services/socialProfileService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

/**
 * Calculates a dynamic resume score based on section completeness and depth.
 */
function evaluateResumeScore(data) {
  let score = 0;
  if (data.personalInfo?.fullName && data.personalInfo?.email) score += 15;
  if (data.summary && data.summary.trim().length > 40) score += 15;
  if (Array.isArray(data.education) && data.education.length > 0) score += 20;
  
  const skillCount = Array.isArray(data.skills) ? data.skills.length : 0;
  score += Math.min(20, skillCount * 4); // Up to 20 pts for 5+ skills

  const projectCount = Array.isArray(data.projects) ? data.projects.length : 0;
  score += Math.min(20, projectCount * 10); // Up to 20 pts for 2+ projects

  if (Array.isArray(data.experience) && data.experience.length > 0) score += 10;
  return Math.min(100, Math.max(score, 40));
}

export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const list = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
    const enriched = await Promise.all(
      list.map(async (r) => {
        let downloadUrl = r.pdfUrl || '';
        if (r.storageProvider === 'supabase' && r.storagePath) {
          try {
            downloadUrl = await getSignedDownloadUrl(r.bucketName || 'resumes', r.storagePath, 3600);
          } catch (e) {
            // fallback
          }
        }
        return {
          ...r,
          downloadUrl: downloadUrl || r.pdfUrl || ''
        };
      })
    );
    return sendSuccess(res, enriched, 'Resumes retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const setPrimaryResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const list = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
    const exists = list.find(r => r.resumeId === id);
    if (!exists) {
      return sendError(res, 'Resume not found', 404);
    }
    for (const r of list) {
      await FirestoreHelper.setDoc('resumes', r.resumeId, { isPrimary: r.resumeId === id }, true);
    }
    return sendSuccess(res, { primaryResumeId: id }, 'Primary resume updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await FirestoreHelper.getDoc('resumes', id);

    if (!resume) {
      return sendError(res, 'Resume not found', 404);
    }

    if (resume.userId !== req.user.userId) {
      return sendError(res, 'Access denied', 403);
    }

    const skills = await FirestoreHelper.queryCollection('skills', 'resumeId', id);
    const projects = await FirestoreHelper.queryCollection('projects', 'resumeId', id);
    const certificates = await FirestoreHelper.queryCollection('certificates', 'resumeId', id);

    // Resolve PDF URL (signed URL for Supabase records, legacy URL for old)
    let pdfUrl = resume.pdfUrl || '';
    if (resume.storageProvider === 'supabase' && resume.storagePath) {
      try {
        pdfUrl = await getFileUrl(resume, 'pdfUrl');
      } catch (err) {
        // Keep existing pdfUrl
      }
    }

    return sendSuccess(res, {
      ...resume,
      pdfUrl,
      skills: skills.length > 0 ? skills : resume.skills || [],
      projects: projects.length > 0 ? projects : resume.projects || [],
      certificates: certificates.length > 0 ? certificates : resume.certificates || []
    }, 'Resume details retrieved');
  } catch (err) {
    next(err);
  }
};

export const createResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const resumeId = 'res_' + userId + '_' + Date.now();

    const {
      title = 'My Professional Resume',
      role = '',
      templateId = 'modern',
      templateOptions = {},
      templateVersion = 1,
      personalInfo = {},
      summary = '',
      experience = [],
      education = [],
      skills = [],
      projects = [],
      certificates = []
    } = req.body;

    let studentRole = (role || '').trim();
    if (!studentRole) {
      const userDoc = await FirestoreHelper.getDoc('users', userId);
      studentRole = userDoc?.targetRole || userDoc?.role || '';
    }

    const resumeData = {
      resumeId,
      userId,
      title,
      role: studentRole,
      templateId,
      templateOptions,
      templateVersion,
      personalInfo,
      summary,
      experience,
      education,
      pdfUrl: '',
      createdAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('resumes', resumeId, resumeData);

    // Store skills references
    if (Array.isArray(skills)) {
      for (const s of skills) {
        const skillId = 'sk_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const name = typeof s === 'string' ? s : s.name;
        await FirestoreHelper.setDoc('skills', skillId, { skillId, resumeId, name, category: 'Technical' });
      }
    }

    // Store projects references
    if (Array.isArray(projects)) {
      for (const p of projects) {
        const projectId = 'proj_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        await FirestoreHelper.setDoc('projects', projectId, { projectId, resumeId, ...p });
      }
    }

    // Store certificates references
    if (Array.isArray(certificates)) {
      for (const c of certificates) {
        const certificateId = 'cert_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        await FirestoreHelper.setDoc('certificates', certificateId, { certificateId, resumeId, ...c });
      }
    }

    // Calculate dynamic completeness score
    const dynamicResumeScore = evaluateResumeScore({ personalInfo, summary, education, skills, projects, experience });

    // Update User Readiness Stats
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const resumesCreated = (readiness.resumesCreated || 0) + 1;
    const updatedReadiness = {
      ...readiness,
      resumesCreated,
      resumeScore: dynamicResumeScore
    };
    updatedReadiness.overallReadiness = calculatePlacementReadiness(updatedReadiness);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedReadiness);

    return sendSuccess(res, { resumeId, ...resumeData, skills, projects, certificates }, 'Resume saved successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await FirestoreHelper.getDoc('resumes', id);
    if (!existing) {
      return sendError(res, 'Resume not found', 404);
    }

    if (existing.userId !== req.user.userId) {
      return sendError(res, 'Access denied', 403);
    }

    const updated = await FirestoreHelper.setDoc('resumes', id, req.body, true);

    // Update score if content fields changed
    const dynamicResumeScore = evaluateResumeScore({ ...existing, ...req.body });
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + req.user.userId) || {};
    const updatedReadiness = {
      ...readiness,
      resumeScore: dynamicResumeScore
    };
    updatedReadiness.overallReadiness = calculatePlacementReadiness(updatedReadiness);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + req.user.userId, updatedReadiness);

    return sendSuccess(res, updated, 'Resume updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await FirestoreHelper.getDoc('resumes', id);
    if (!existing) {
      return sendError(res, 'Resume not found', 404);
    }
    
    if (existing.userId !== req.user.userId) {
      return sendError(res, 'Access denied', 403);
    }

    await FirestoreHelper.deleteDoc('resumes', id);
    return sendSuccess(res, { id }, 'Resume deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const generateAIContent = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const studentContext = await getStudentContext(userId);
    const { 
      type, 
      role, 
      skills, 
      experienceYears, 
      projectName, 
      techStack,
      education,
      projects,
      certifications,
      experience,
      github,
      linkedin
    } = req.body;

    if (type === 'summary') {
      const targetGithub = github || studentContext?.profile?.github;
      const targetLinkedin = linkedin || studentContext?.profile?.linkedIn;

      let socialContext = null;
      if (targetGithub || targetLinkedin) {
        try {
          socialContext = await SocialProfileService.getSocialProfileContext(targetGithub, targetLinkedin);
        } catch (socialErr) {
          console.warn('[ResumeController] Social profile lookup notice:', socialErr.message);
        }
      }

      const summary = await GrokService.generateSummary({
        role,
        skills,
        experienceYears,
        education,
        projects,
        certifications,
        experience,
        github: targetGithub,
        linkedin: targetLinkedin,
        socialContext,
        studentContext
      });
      return sendSuccess(res, { 
        summary, 
        socialEnriched: !!(socialContext?.github || socialContext?.linkedin) 
      }, 'Professional summary generated');
    }

    if (type === 'projectBullets') {
      const bullets = await GrokService.generateProjectBullets(projectName, techStack, studentContext);
      return sendSuccess(res, { bullets }, 'Project bullets generated');
    }

    if (type === 'skillSuggestions') {
      const suggestions = await GrokService.generateSkillSuggestions(role, studentContext);
      return sendSuccess(res, { suggestions }, 'Skill suggestions generated');
    }

    return sendError(res, 'Invalid generation type requested', 400);
  } catch (err) {
    next(err);
  }
};

export const generatePDF = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 'Authentication required to generate PDF', 401);
    }

    const resumeData = req.body;
    const resumeId = resumeData.resumeId || 'res_' + userId + '_' + Date.now();

    // IDOR Defense: If an existing resumeId is supplied, verify ownership
    if (resumeData.resumeId) {
      const existing = await FirestoreHelper.getDoc('resumes', resumeData.resumeId);
      if (existing && existing.userId && existing.userId !== userId) {
        return sendError(res, 'Access denied: You do not have permission to modify this resume', 403);
      }
    }

    const pdfBuffer = await PDFService.generateResumePDF(resumeData);
    
    // Validate the generated PDF
    const validation = validateFile('resumes', 'application/pdf', pdfBuffer.length);
    if (!validation.valid) {
      return sendError(res, validation.error, 400);
    }

    // Generate safe storage path and upload to Supabase
    const storagePath = generateStoragePath('resumes', userId, 'application/pdf', resumeId);
    const result = await uploadFile('resumes', storagePath, pdfBuffer, 'application/pdf');

    // Get a signed URL to return to the frontend
    const signedUrl = await getSignedDownloadUrl('resumes', storagePath, 300);

    // Update Firestore with both legacy and new fields
    await FirestoreHelper.setDoc('resumes', resumeId, {
      pdfUrl: signedUrl,
      userId,
      storageProvider: 'supabase',
      storagePath: result.storagePath,
      pdfFileName: storagePath.split('/').pop(),
      pdfFileType: 'application/pdf',
      pdfFileSize: pdfBuffer.length,
      pdfUploadedAt: new Date().toISOString()
    }, true);

    return sendSuccess(res, {
      pdfUrl: signedUrl,
      fileName: `${resumeData.personalInfo?.fullName || 'Resume'}.pdf`,
      storagePath: result.storagePath
    }, 'PDF generated successfully');
  } catch (err) {
    next(err);
  }
};
