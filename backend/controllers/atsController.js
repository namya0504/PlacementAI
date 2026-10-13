import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { TextExtractorService } from '../services/textExtractorService.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

/**
 * Formats structured resume data from PlacementAI into clean ATS-parseable text.
 */
export function formatResumeToCleanText(data) {
  if (!data) return '';
  const personal = data.personalInfo || {};
  const sections = [];

  // Personal Info
  const headerParts = [personal.fullName || data.fullName, personal.email || data.email, personal.phone || data.phone, personal.location || data.location].filter(Boolean);
  if (headerParts.length) sections.push(headerParts.join(' | '));
  if (personal.linkedIn || personal.github) {
    sections.push([personal.linkedIn, personal.github].filter(Boolean).join(' '));
  }

  // Target Role
  if (data.role || personal.role) {
    sections.push(`Target Role: ${data.role || personal.role}`);
  }

  // Summary
  const summary = data.summary || personal.summary;
  if (summary) {
    sections.push(`PROFESSIONAL SUMMARY\n${summary}`);
  }

  // Skills
  const rawSkills = data.skills || personal.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills.map(s => (typeof s === 'string' ? s : s.name)).filter(Boolean)
    : (rawSkills ? [String(rawSkills)] : []);
  if (skills.length) {
    sections.push(`TECHNICAL SKILLS\n${skills.join(', ')}`);
  }

  // Experience
  if (Array.isArray(data.experience) && data.experience.length) {
    const expText = data.experience.map(e => {
      const titleLine = [e.title, e.company, e.duration].filter(Boolean).join(' - ');
      const desc = e.description || (Array.isArray(e.bullets) ? e.bullets.join('\n') : '');
      return `${titleLine}\n${desc}`;
    }).join('\n\n');
    sections.push(`PROFESSIONAL EXPERIENCE\n${expText}`);
  }

  // Projects
  if (Array.isArray(data.projects) && data.projects.length) {
    const projText = data.projects.map(p => {
      const titleLine = [p.title || p.name, p.technologies || p.tech].filter(Boolean).join(' | ');
      const desc = p.description || (Array.isArray(p.bullets) ? p.bullets.join('\n') : '');
      return `${titleLine}\n${desc}`;
    }).join('\n\n');
    sections.push(`PROJECTS\n${projText}`);
  }

  // Education
  if (Array.isArray(data.education) && data.education.length) {
    const eduText = data.education.map(e => {
      const degLine = [e.degree, e.institution || e.college, e.year].filter(Boolean).join(' - ');
      const gpa = e.gpa ? `GPA: ${e.gpa}` : '';
      return [degLine, gpa].filter(Boolean).join('\n');
    }).join('\n\n');
    sections.push(`EDUCATION\n${eduText}`);
  }

  // Certifications
  const certs = data.certificates || data.certifications;
  if (Array.isArray(certs) && certs.length) {
    const certText = certs.map(c => (typeof c === 'string' ? c : (c.name || c.title))).filter(Boolean).join(', ');
    sections.push(`CERTIFICATIONS\n${certText}`);
  }

  return sections.join('\n\n');
}

export const analyzeResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let targetRole = (req.body.targetRole || '').trim();
    let resumeText = req.body.resumeText || '';

    // If explicit resumeId provided (e.g. user selected from their saved resumes)
    if (req.body.resumeId) {
      const savedDoc = await FirestoreHelper.getDoc('resumes', req.body.resumeId);
      if (savedDoc && savedDoc.userId === userId) {
        console.log(`[ATS] Using selected resume doc: ${req.body.resumeId}`);
        resumeText = savedDoc.parsedText || formatResumeToCleanText(savedDoc);
        if (savedDoc.role && !targetRole) targetRole = savedDoc.role;
      }
    }

    // If targetRole wasn't explicitly provided, check user's profile
    if (!targetRole) {
      const userDoc = await FirestoreHelper.getDoc('users', userId);
      const profileDoc = await FirestoreHelper.getDoc('profiles', `prof_${userId}`);
      targetRole = (profileDoc?.targetRole || profileDoc?.role || userDoc?.targetRole || userDoc?.role || '').trim();
    }

    // If a file was uploaded, extract text from it (PDF or DOCX)
    if (req.file) {
      console.log(`[ATS] File received: name=${req.file.originalname}, size=${req.file.size}, mime=${req.file.mimetype}`);
      resumeText = await TextExtractorService.extractTextFromFile(req.file.buffer, req.file.mimetype);
      console.log(`[ATS] Extracted text length: ${resumeText?.length || 0}`);
    }

    // If text extraction yielded nothing (e.g. scanned PDF or image-based canvas export)
    // or if requested directly, look up user's saved resumes in PlacementAI
    if (!resumeText || resumeText.trim().length < 10) {
      console.log(`[ATS] File text empty or image-based. Checking user's PlacementAI saved resumes for userId: ${userId}`);
      const userResumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
      if (userResumes && userResumes.length > 0) {
        // Use primary resume or most recently created/updated resume
        const primaryResume = userResumes.find(r => r.isPrimary) || userResumes[userResumes.length - 1];
        console.log(`[ATS] Rescuing with saved resume: ${primaryResume.title || primaryResume.resumeId}`);
        resumeText = primaryResume.parsedText || formatResumeToCleanText(primaryResume);
        if (primaryResume.role && !targetRole) {
          targetRole = primaryResume.role;
        }
      } else {
        // Fallback to student profile if available
        const profile = await FirestoreHelper.getDoc('profiles', `prof_${userId}`);
        if (profile && (profile.skills?.length || profile.branch)) {
          console.log(`[ATS] Rescuing with user profile data`);
          resumeText = formatResumeToCleanText({ personalInfo: profile, ...profile });
        }
      }
    }

    if (!resumeText || resumeText.trim().length < 10) {
      return sendError(
        res,
        'Could not extract text from this resume, and no saved resume was found in your account. Please create your resume using the Resume Builder or paste your text directly.',
        400
      );
    }

    const studentContext = await getStudentContext(userId);
    const report = await GrokService.analyzeATS(resumeText, targetRole, studentContext);

    const reportId = 'ats_rep_' + userId + '_' + Date.now();
    const reportDoc = {
      reportId,
      userId,
      targetRole,
      report,
      createdAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('ats_results', reportId, reportDoc);

    // Update User Placement Readiness
    const readiness = (await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId)) || {};
    const updatedStats = {
      ...readiness,
      atsScore: report.overallScore
    };
    updatedStats.overallReadiness = calculatePlacementReadiness(updatedStats);

    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedStats);

    return sendSuccess(res, report, 'ATS Analysis completed successfully');
  } catch (err) {
    next(err);
  }
};

export const getATSHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const history = await FirestoreHelper.queryCollection('ats_results', 'userId', userId);
    return sendSuccess(res, history, 'ATS history retrieved');
  } catch (err) {
    next(err);
  }
};
