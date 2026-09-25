import express from 'express';
import { getCompanies, getCompanyById, getCompanyPrepGuide } from '../controllers/companyController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.use(protectRoute);

router.get('/', getCompanies);
router.get('/prep/:companyName', rateLimiter({ maxRequests: 20 }), getCompanyPrepGuide);
router.get('/:id', getCompanyById);

export default router;
