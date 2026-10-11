import express from 'express';
import {
  startTest,
  submitTest,
  getActiveTest,
  abandonTest,
  getAptitudeStats
} from '../controllers/aptitudeSessionController.js';
import { getAptitudeQuestions, submitAptitudeTest } from '../controllers/aptitudeController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// New Secure Two-Phase Aptitude API
router.post('/start', protectRoute, startTest);
router.post('/submit', protectRoute, submitTest);
router.get('/active', protectRoute, getActiveTest);
router.post('/abandon', protectRoute, abandonTest);
router.get('/stats', protectRoute, getAptitudeStats);

// Legacy Endpoints for Backward Compatibility
router.get('/questions', protectRoute, getAptitudeQuestions);
router.post('/legacy-submit', protectRoute, submitAptitudeTest);

export default router;
