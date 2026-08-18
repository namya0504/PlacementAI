import express from 'express';
import { getCompanies, getCompanyById } from '../controllers/companyController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectRoute);

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

export default router;
