import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { TextExtractorService } from '../services/textExtractorService.js';
import { GeminiService } from '../services/geminiService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const analyzeResume = async (req, res, next) => {
  try {
    const userId = req.user?.userId || 'usr_default_namya';
    const targetRole = req.body.targetRole || 'Software Developer';
    let resumeText = req.body.resumeText || '';

    if (req.file) {
      resumeText = await TextExtractorService.extractTextFromPDF(req.file.buffer);
    }

    if (!resumeText || resumeText.trim().length === 0) {
      resumeText = `Namya Shah Software Developer
Skills: React.js, Node.js, JavaScript, Python, Express, Tailwind CSS, SQL, Git
Education: Bachelor of Technology in Computer Science (2025)
Projects: PlacementAI Platform, E-Commerce Microservices Architecture
Experience: Frontend Software Engineering Intern`;
    }

    const report = await GeminiService.analyzeATS(resumeText, targetRole);

    const reportId = 'ats_rep_' + Date.now();
    const reportDoc = {
      reportId,
      userId,
      targetRole,
      report,
      createdAt: new Date().toISOString()
    };

    await FirestoreHelper.setDoc('reports', reportId, reportDoc);

    // Update User Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
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
    const userId = req.user?.userId || 'usr_default_namya';
    const history = await FirestoreHelper.queryCollection('reports', 'userId', userId);
    return sendSuccess(res, history, 'ATS history retrieved');
  } catch (err) {
    next(err);
  }
};
