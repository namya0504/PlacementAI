import express from 'express';
import { getCombinedProgress, getProgressInsights } from '../controllers/progressController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/combined', protectRoute, getCombinedProgress);
router.get('/insights', protectRoute, getProgressInsights);

export default router;
