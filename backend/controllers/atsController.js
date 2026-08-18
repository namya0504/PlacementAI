import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { TextExtractorService } from '../services/textExtractorService.js';
import { GeminiService } from '../services/geminiService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

export const analyzeResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const targetRole = req.body.targetRole || 'Software Developer';
    let resumeText = req.body.resumeText || '';

    if (req.file) {
      resumeText = await TextExtractorService.extractTextFromPDF(req.file.buffer);
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return sendError(res, 'Resume text extraction failed. Please upload a valid readable PDF.', 400);
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

    await FirestoreHelper.setDoc('ats_results', reportId, reportDoc);

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
    const userId = req.user.userId;
    const history = await FirestoreHelper.queryCollection('ats_results', 'userId', userId);
    return sendSuccess(res, history, 'ATS history retrieved');
  } catch (err) {
    next(err);
  }
};
