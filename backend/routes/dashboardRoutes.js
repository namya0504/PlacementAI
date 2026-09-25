import express from 'express';
import { getDashboardStats, getAIRecommendations } from '../controllers/dashboardController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/stats', protectRoute, getDashboardStats);
router.get('/recommendations', protectRoute, rateLimiter({ maxRequests: 20 }), getAIRecommendations);

export default router;
