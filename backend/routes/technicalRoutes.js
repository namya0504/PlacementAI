import express from 'express';
import {
  getTechnicalQuestions,
  submitMCQ,
  submitCode
} from '../controllers/technicalController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/questions', protectRoute, getTechnicalQuestions);
router.post('/submit-mcq', protectRoute, submitMCQ);
router.post('/submit-code', protectRoute, submitCode);

export default router;
