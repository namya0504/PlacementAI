import express from 'express';
import { getProfile, updateProfile, uploadAvatar, uploadProfileResume, deleteProfileResume, getProfileResume } from '../controllers/profileController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { uploadFile } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, getProfile);
router.put('/', protectRoute, updateProfile);
router.post('/upload-avatar', protectRoute, uploadFile.single('avatar'), uploadAvatar);

// Profile Resume (user's own uploaded resume file)
router.get('/resume', protectRoute, getProfileResume);
router.post('/upload-resume', protectRoute, uploadFile.single('resume'), uploadProfileResume);
router.delete('/resume', protectRoute, deleteProfileResume);

export default router;
