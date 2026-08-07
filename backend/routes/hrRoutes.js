import express from 'express';
import { getHRQuestions, evaluateHRAnswer } from '../controllers/hrController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/questions', protectRoute, getHRQuestions);
router.post('/evaluate', protectRoute, evaluateHRAnswer);

export default router;
