import express from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/profileController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { uploadFile } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, getProfile);
router.put('/', protectRoute, updateProfile);
router.post('/upload-avatar', protectRoute, uploadFile.single('avatar'), uploadAvatar);

export default router;
