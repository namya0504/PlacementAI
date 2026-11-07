import express from 'express';
import {
  getTechnicalQuestions,
  submitMCQ,
  runCode,
  submitCode,
  getTechnicalHistory
} from '../controllers/technicalController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/questions', protectRoute, getTechnicalQuestions);
router.post('/submit-mcq', protectRoute, submitMCQ);
router.post('/run-code', protectRoute, runCode);
router.post('/submit-code', protectRoute, submitCode);
router.get('/history', protectRoute, getTechnicalHistory);

export default router;
