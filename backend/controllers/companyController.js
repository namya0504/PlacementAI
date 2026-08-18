import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getCompanies = async (req, res, next) => {
  try {
    const list = await FirestoreHelper.queryCollection('companies');
    return sendSuccess(res, list, 'Companies retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await FirestoreHelper.getDoc('companies', id);
    if (!company) {
      return sendError(res, 'Company not found', 404);
    }
    return sendSuccess(res, company, 'Company retrieved successfully');
  } catch (err) {
    next(err);
  }
};
