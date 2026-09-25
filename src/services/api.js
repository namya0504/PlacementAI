// PlacementAI Central API Client Layer
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = () => {
  const savedUser = localStorage.getItem('placement_ai_user');
  let token = null;
  if (savedUser) {
    try {
      token = JSON.parse(savedUser).token;
    } catch (e) {}
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = getAuthHeaders();
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const config = {
    method,
    headers,
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }
    return result.data || result;
  } catch (err) {
    console.warn(`API Call Error (${endpoint}):`, err.message);
    throw err;
  }
};

export const API = {
  // Auth
  register: (userData) => apiCall('/auth/register', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  googleLogin: (socialData) => apiCall('/auth/google-login', 'POST', socialData),
  logout: () => apiCall('/auth/logout', 'POST'),
  getCurrentUser: () => apiCall('/auth/me', 'GET'),

  // Profile
  getProfile: () => apiCall('/profile', 'GET'),
  updateProfile: (profileData) => apiCall('/profile', 'PUT', profileData),
  uploadAvatar: (formData) => apiCall('/profile/upload-avatar', 'POST', formData, true),

  // Resume
  getResumes: () => apiCall('/resume', 'GET'),
  getResumeById: (id) => apiCall(`/resume/${id}`, 'GET'),
  saveResume: (resumeData) => apiCall('/resume', 'POST', resumeData),
  updateResume: (id, data) => apiCall(`/resume/${id}`, 'PUT', data),
  deleteResume: (id) => apiCall(`/resume/${id}`, 'DELETE'),
  generateAIContent: (payload) => apiCall('/resume/generate-ai', 'POST', payload),
  generatePDF: (resumeData) => apiCall('/resume/generate-pdf', 'POST', resumeData),

  // ATS
  analyzeATS: (formDataOrPayload, isFormData = false) => apiCall('/ats/analyze', 'POST', formDataOrPayload, isFormData),
  getATSHistory: () => apiCall('/ats/history', 'GET'),

  // Mock Tests & Aptitude
  getAptitudeQuestions: (params = '') => apiCall(`/mock-tests/questions${params}`, 'GET'),
  submitAptitudeTest: (results) => apiCall('/mock-tests/submit', 'POST', results),

  // Technical Practice
  getTechnicalQuestions: (params = '') => apiCall(`/technical/questions${params}`, 'GET'),
  submitTechnicalMCQ: (payload) => apiCall('/technical/submit-mcq', 'POST', payload),
  submitTechnicalCode: (payload) => apiCall('/technical/submit-code', 'POST', payload),

  // HR Interview
  getHRQuestions: (round = 1, generate = false) => apiCall(`/hr/questions?round=${round}${generate ? '&generate=true' : ''}`, 'GET'),
  evaluateHRAnswer: (payload) => apiCall('/hr/evaluate', 'POST', payload),

  // Company Prep
  getCompanies: () => apiCall('/company', 'GET'),
  getCompanyById: (id) => apiCall(`/company/${id}`, 'GET'),
  getCompanyPrepGuide: (companyName, refresh = false) => apiCall(`/company/prep/${encodeURIComponent(companyName)}${refresh ? '?refresh=true' : ''}`, 'GET'),

  // Dashboard & Recommendations
  getDashboardStats: () => apiCall('/dashboard/stats', 'GET'),
  getAIRecommendations: (refresh = false) => apiCall(`/dashboard/recommendations${refresh ? '?refresh=true' : ''}`, 'GET'),
  recordDownload: (payload) => apiCall('/downloads/record', 'POST', payload),
  getDownloadHistory: () => apiCall('/downloads/history', 'GET')
};
