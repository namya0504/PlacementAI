import express from 'express';
import { getAptitudeQuestions, submitAptitudeTest } from '../controllers/aptitudeController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/questions', protectRoute, getAptitudeQuestions);
router.post('/submit', protectRoute, submitAptitudeTest);

export default router;
