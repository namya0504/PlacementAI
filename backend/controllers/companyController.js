import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import { GrokService } from '../services/grokService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getCompanies = async (req, res, next) => {
  try {
    let list = await FirestoreHelper.queryCollection('companies');
    
    // If no companies in store, seed the core list
    if (!list || list.length === 0) {
      const defaultCompanies = [
        { id: 'comp_tcs', companyName: 'TCS', industry: 'IT Services', logo: '💼', role: 'Ninja & Digital Developer' },
        { id: 'comp_infosys', companyName: 'Infosys', industry: 'IT Services', logo: '🔷', role: 'Systems Engineer & Specialist Programmer' },
        { id: 'comp_amazon', companyName: 'Amazon', industry: 'E-commerce & Cloud', logo: '📦', role: 'Software Development Engineer (SDE-1)' },
        { id: 'comp_google', companyName: 'Google', industry: 'Internet & Tech', logo: '🌐', role: 'Software Engineer (L3)' },
        { id: 'comp_microsoft', companyName: 'Microsoft', industry: 'Software & Cloud', logo: '🪟', role: 'Software Engineer' },
        { id: 'comp_wipro', companyName: 'Wipro', industry: 'IT Consulting', logo: '🌿', role: 'Project Engineer (Elite/Turbo)' }
      ];

      for (const comp of defaultCompanies) {
        await FirestoreHelper.setDoc('companies', comp.id, comp);
      }
      list = defaultCompanies;
    }

    return sendSuccess(res, list, 'Companies retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let company = await FirestoreHelper.getDoc('companies', id);
    
    // If not found by ID, try finding by companyName
    if (!company) {
      const all = await FirestoreHelper.queryCollection('companies');
      company = all.find(c => c.companyName?.toLowerCase() === id.toLowerCase() || c.id === id);
    }

    if (!company) {
      return sendError(res, 'Company not found', 404);
    }

    return sendSuccess(res, company, 'Company retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Generate in-depth dynamic placement preparation guide for any company using Grok AI.
 */
export const getCompanyPrepGuide = async (req, res, next) => {
  try {
    const { companyName } = req.params;
    const forceRefresh = req.query.refresh === 'true';
    const userId = req.user?.userId;

    if (!companyName) {
      return sendError(res, 'Company name is required', 400);
    }

    const docId = `prep_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const cached = await FirestoreHelper.getDoc('company_preps', docId);

    if (cached && !forceRefresh) {
      return sendSuccess(res, cached.guide, 'Company prep guide retrieved (cached)');
    }

    const studentContext = await getStudentContext(userId);
    const guide = await GrokService.generateCompanyPrep(companyName, studentContext);

    await FirestoreHelper.setDoc('company_preps', docId, {
      docId,
      companyName,
      guide,
      generatedAt: new Date().toISOString()
    });

    return sendSuccess(res, guide, 'Company prep guide generated successfully');
  } catch (err) {
    next(err);
  }
};
