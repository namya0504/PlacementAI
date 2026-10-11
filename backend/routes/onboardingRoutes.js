import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { uploadFile } from '../middlewares/uploadMiddleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import {
  uploadOnboardingResume,
  analyzeProfilesAndBuildPlan,
  confirmOnboarding,
  saveStepProgress,
  skipOnboarding,
  getOnboardingState,
  toggleStudyPlanTask,
  getStudyPlan
} from '../controllers/onboardingController.js';

const router = express.Router();

// Rate limiter for AI analysis endpoints: max 10 requests per 15-minute window
const analysisRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many analysis requests. Please wait a few minutes before trying again.'
});

// Resume upload (PDF/DOCX max 5MB)
router.post('/resume', protectRoute, uploadFile.single('resume'), uploadOnboardingResume);

// Grok AI Multi-Source Analysis (Resume + GitHub + LinkedIn)
router.post('/analyze', protectRoute, analysisRateLimiter, analyzeProfilesAndBuildPlan);

// Confirm and persist reviewed skills, projects, and target role
router.post('/confirm', protectRoute, confirmOnboarding);

// Save step progress for resuming on reload
router.post('/step', protectRoute, saveStepProgress);

// Skip onboarding
router.post('/skip', protectRoute, skipOnboarding);

// Get current state
router.get('/state', protectRoute, getOnboardingState);

// Toggle study plan task checkbox
router.put('/study-plan/task', protectRoute, toggleStudyPlanTask);

// Get active study plan and summary for Dashboard
router.get('/plan', protectRoute, getStudyPlan);

export default router;
