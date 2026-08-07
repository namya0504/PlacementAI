import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  logoutUser,
  getCurrentUser
} from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/logout', protectRoute, logoutUser);
router.get('/me', protectRoute, getCurrentUser);

export default router;
