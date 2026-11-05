import express from 'express';
import {
  startInterviewSession,
  getInterviewSessionState,
  submitInterviewAnswer,
  transitionInterviewRound,
  endInterviewSession,
  getInterviewReport,
  transcribeInterviewVoice,
  parseInterviewResume,
  inspectCandidateGitHub,
  getHRQuestions,
  evaluateHRAnswer,
  getHRHistory,
  getHRProgress
} from '../controllers/hrController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { uploadFile, uploadAudio } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Multi-Round Chat Interview Endpoints
router.post('/session/start', protectRoute, startInterviewSession);
router.get('/session/:sessionId/state', protectRoute, getInterviewSessionState);
router.post('/session/:sessionId/answer', protectRoute, submitInterviewAnswer);
router.post('/session/:sessionId/transition', protectRoute, transitionInterviewRound);
router.post('/session/:sessionId/end', protectRoute, endInterviewSession);
router.get('/session/:sessionId/report', protectRoute, getInterviewReport);

// Voice and Personalization Ingestion Endpoints
router.post('/voice/transcribe', protectRoute, uploadAudio.single('audio'), transcribeInterviewVoice);
router.post('/resume/parse', protectRoute, uploadFile.single('resume'), parseInterviewResume);
router.post('/github/inspect', protectRoute, inspectCandidateGitHub);

// Legacy Practice Endpoints
router.get('/questions', protectRoute, getHRQuestions);
router.post('/evaluate', protectRoute, evaluateHRAnswer);
router.get('/history', protectRoute, getHRHistory);
router.get('/progress', protectRoute, getHRProgress);

export default router;
