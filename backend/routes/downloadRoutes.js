import express from 'express';
import { recordDownload, getDownloadHistory } from '../controllers/downloadController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/record', protectRoute, recordDownload);
router.get('/history', protectRoute, getDownloadHistory);

export default router;
