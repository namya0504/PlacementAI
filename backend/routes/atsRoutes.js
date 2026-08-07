import express from 'express';
import { analyzeResume, getATSHistory } from '../controllers/atsController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { uploadFile } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze', protectRoute, uploadFile.single('resume'), analyzeResume);
router.get('/history', protectRoute, getATSHistory);

export default router;
