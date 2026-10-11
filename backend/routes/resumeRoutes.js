import express from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  generateAIContent,
  generatePDF,
  setPrimaryResume
} from '../controllers/resumeController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, getResumes);
router.get('/:id', protectRoute, getResumeById);
router.post('/', protectRoute, createResume);
router.put('/:id', protectRoute, updateResume);
router.put('/:id/primary', protectRoute, setPrimaryResume);
router.delete('/:id', protectRoute, deleteResume);
router.post('/generate-ai', protectRoute, generateAIContent);
router.post('/generate-pdf', protectRoute, generatePDF);

export default router;
