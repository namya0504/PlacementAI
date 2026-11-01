import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  logoutUser,
  getCurrentUser,
  resendVerificationEmail,
  confirmEmailVerification,
  completeProfile,
  checkEmail,
  deactivateAccount,
  issueCsrfToken
} from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Rate limiter for authentication endpoints: max 20 requests per 15-minute window
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
});

// Lighter rate limit for the check-email probe (called while typing)
const checkEmailLimiter = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Too many email check requests. Please wait a moment.'
});

const csrfLimiter = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Too many session setup requests. Please wait a moment and try again.'
});

router.get('/check-email', checkEmailLimiter, checkEmail);
router.get('/csrf', csrfLimiter, issueCsrfToken);
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google-login', authLimiter, googleLogin);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/resend-verification', authLimiter, protectRoute, resendVerificationEmail);
router.post('/complete-profile', protectRoute, completeProfile);
router.post('/verify-email', protectRoute, confirmEmailVerification);
router.post('/logout', protectRoute, logoutUser);
router.get('/me', protectRoute, getCurrentUser);
router.post('/deactivate', protectRoute, deactivateAccount);

export default router;
