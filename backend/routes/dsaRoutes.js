import express from 'express';
import {
  getDsaTopics,
  getDsaTopicDetail,
  getDsaProblemDetail,
  markDsaSolutionViewed,
  runDsaCode,
  submitDsaCode,
  getDsaSubmissions
} from '../controllers/dsaController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/topics', protectRoute, getDsaTopics);
router.get('/topic/:topicId', protectRoute, getDsaTopicDetail);
router.get('/problem/:problemId', protectRoute, getDsaProblemDetail);
router.post('/view-solution', protectRoute, markDsaSolutionViewed);
router.post('/run', protectRoute, runDsaCode);
router.post('/submit', protectRoute, submitDsaCode);
router.get('/submissions', protectRoute, getDsaSubmissions);

export default router;
