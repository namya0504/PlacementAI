import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protectRoute, getDashboardStats);

export default router;
