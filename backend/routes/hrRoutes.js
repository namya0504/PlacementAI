import express from 'express';
import { getHRQuestions, evaluateHRAnswer, getHRHistory, getHRProgress } from '../controllers/hrController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/questions', protectRoute, getHRQuestions);
router.post('/evaluate', protectRoute, evaluateHRAnswer);
router.get('/history', protectRoute, getHRHistory);
router.get('/progress', protectRoute, getHRProgress);

export default router;
