import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { storage } from '../firebase/firebaseAdmin.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { PDFService } from '../services/pdfService.js';
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
    return sendSuccess(res, list, 'Resumes retrieved successfully');
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

    return sendSuccess(res, {
      ...resume,
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
      role = 'Software Developer',
      templateId = 'modern',
      personalInfo = {},
      summary = '',
      experience = [],
      education = [],
      skills = [],
      projects = [],
      certificates = []
    } = req.body;

    const resumeData = {
      resumeId,
      userId,
      title,
      role,
      templateId,
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
    const { type, role, skills, experienceYears, projectName, techStack } = req.body;

    if (type === 'summary') {
      const summary = await GrokService.generateSummary(role, skills, experienceYears, studentContext);
      return sendSuccess(res, { summary }, 'Professional summary generated');
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
    const userId = req.user?.userId || 'usr_anon';
    const resumeData = req.body;
    const pdfBuffer = await PDFService.generateResumePDF(resumeData);
    
    let pdfUrl = '';
    const resumeId = resumeData.resumeId || 'res_' + userId + '_' + Date.now();

    if (storage) {
      const bucket = storage.bucket();
      const fileName = `resumes/${resumeId}_${Date.now()}.pdf`;
      const file = bucket.file(fileName);
      
      await file.save(pdfBuffer, {
        metadata: { contentType: 'application/pdf' }
      });
      await file.makePublic();
      pdfUrl = file.publicUrl();
    } else {
      throw new Error('Firebase storage is not configured.');
    }

    await FirestoreHelper.setDoc('resumes', resumeId, { pdfUrl }, true);

    return sendSuccess(res, { pdfUrl, fileName: `${resumeData.personalInfo?.fullName || 'Resume'}.pdf` }, 'PDF generated successfully');
  } catch (err) {
    next(err);
  }
};
