import express from 'express';
import {
  getDsaTopics,
  getDsaTopicDetail,
  getDsaProblemDetail,
  markDsaSolutionViewed,
  runDsaCode,
  submitDsaCode,
  getDsaSubmissions,
  askDsaTutorChat
} from '../controllers/dsaController.js';
import {
  getTopicTest,
  submitTopicTest,
  getTopicTestReports,
  getUserTopicBadges
} from '../controllers/dsaTestController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/topics', protectRoute, getDsaTopics);
router.get('/topic/:topicId', protectRoute, getDsaTopicDetail);
router.get('/problem/:problemId', protectRoute, getDsaProblemDetail);
router.post('/problem/:problemId/tutor-chat', protectRoute, askDsaTutorChat);
router.post('/view-solution', protectRoute, markDsaSolutionViewed);
router.post('/run', protectRoute, runDsaCode);
router.post('/submit', protectRoute, submitDsaCode);
router.get('/submissions', protectRoute, getDsaSubmissions);

// Topic Assessment (Test), Evaluation & Badge endpoints
router.get('/topic/:topicId/test', protectRoute, getTopicTest);
router.post('/topic/:topicId/test/submit', protectRoute, submitTopicTest);
router.get('/topic/:topicId/test/reports', protectRoute, getTopicTestReports);
router.get('/badges', protectRoute, getUserTopicBadges);

export default router;

