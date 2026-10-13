import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  logoutUser,
  getCurrentUser,
  resendVerificationEmail,
  confirmEmailVerification
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

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google-login', authLimiter, googleLogin);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/resend-verification', authLimiter, resendVerificationEmail);
router.post('/verify-email', protectRoute, confirmEmailVerification);
router.post('/logout', protectRoute, logoutUser);
router.get('/me', protectRoute, getCurrentUser);

export default router;
