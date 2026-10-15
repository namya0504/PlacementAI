// PlacementAI Central API Client Layer
const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawApiBase.endsWith('/api')
  ? rawApiBase
  : (rawApiBase ? `${rawApiBase}/api` : '/api');

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

// Fast in-memory GET cache with short TTL (15s) to eliminate duplicate calls during navigation
const getCache = new Map();
const CACHE_TTL_MS = 15000;

export const clearApiCache = () => {
  getCache.clear();
};

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false, customTimeout = null) => {
  const isGet = method.toUpperCase() === 'GET';
  const cacheKey = `${endpoint}`;

  // Serve from cache if available and fresh
  if (isGet) {
    const cached = getCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  } else {
    // Invalidate GET cache on mutations
    getCache.clear();
  }

  const headers = getAuthHeaders();
  if (isFormData) {
    delete headers['Content-Type'];
  }

  // Dynamic timeout: AI & heavy generation routes get 45s, normal requests get 25s
  const isHeavyAI = /aptitude|ats|resume|recommendations|study-plan|code-eval|hr-eval/i.test(endpoint);
  const timeoutMs = customTimeout || (isHeavyAI ? 45000 : 25000);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config = {
    method,
    headers,
    credentials: 'include',
    signal: controller.signal,
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let result = null;

    if (contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch {
        result = null;
      }
    } else {
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch {
        result = { message: text || '' };
      }
    }

    if (!response.ok) {
      const defaultMessage = response.status === 502
        ? 'Backend server is not running or unreachable (502 Bad Gateway). Please make sure the backend is started.'
        : `Request failed with status ${response.status}`;
      throw new Error(result?.message || defaultMessage);
    }

    const outputData = result?.data ?? result;
    if (isGet) {
      getCache.set(cacheKey, { timestamp: Date.now(), data: outputData });
    }
    return outputData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn(`API Timeout (${endpoint}): Request took more than 15s`);
      throw new Error('Server request timed out. Please check your network connection.');
    }
    console.warn(`API Call Error (${endpoint}):`, err.message);
    throw err;
  }
};

export const API = {
  apiCall,
  // Auth
  register: (userData) => apiCall('/auth/register', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  googleLogin: (socialData) => apiCall('/auth/google-login', 'POST', socialData),
  forgotPassword: (payloadOrEmail) => {
    const payload = typeof payloadOrEmail === 'string' ? { email: payloadOrEmail } : payloadOrEmail;
    return apiCall('/auth/forgot-password', 'POST', payload);
  },
  logout: () => apiCall('/auth/logout', 'POST'),
  getCurrentUser: () => apiCall('/auth/me', 'GET'),
  resendVerification: (data = {}) => apiCall('/auth/resend-verification', 'POST', data),
  verifyEmail: () => apiCall('/auth/verify-email', 'POST'),
  completeProfile: (profileData) => apiCall('/auth/complete-profile', 'POST', profileData),

  // Profile
  getProfile: () => apiCall('/profile', 'GET'),
  updateProfile: (profileData) => apiCall('/profile', 'PUT', profileData),
  uploadAvatar: (formData) => apiCall('/profile/upload-avatar', 'POST', formData, true),

  // Resume
  getResumes: () => apiCall('/resume', 'GET'),
  getResumeById: (id) => apiCall(`/resume/${id}`, 'GET'),
  saveResume: (resumeData) => apiCall('/resume', 'POST', resumeData),
  updateResume: (id, data) => apiCall(`/resume/${id}`, 'PUT', data),
  setPrimaryResume: (id) => apiCall(`/resume/${id}/primary`, 'PUT'),
  deleteResume: (id) => apiCall(`/resume/${id}`, 'DELETE'),
  generateAIContent: (payload) => apiCall('/resume/generate-ai', 'POST', payload),
  generatePDF: (resumeData) => apiCall('/resume/generate-pdf', 'POST', resumeData),

  // ATS
  analyzeATS: (formDataOrPayload, isFormData = false) => apiCall('/ats/analyze', 'POST', formDataOrPayload, isFormData),
  getATSHistory: () => apiCall('/ats/history', 'GET'),

  // Mock Tests & Aptitude
  getAptitudeQuestions: (params = '') => apiCall(`/mock-tests/questions${params}`, 'GET'),
  submitAptitudeTest: (results) => apiCall('/aptitude/submit', 'POST', results),
  startAptitudeTest: (payload) => apiCall('/aptitude/start', 'POST', payload),
  getActiveAptitudeTest: () => apiCall('/aptitude/active', 'GET'),
  abandonAptitudeTest: (payload) => apiCall('/aptitude/abandon', 'POST', payload),
  getAptitudeStats: () => apiCall('/aptitude/stats', 'GET'),

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
  getDownloadHistory: () => apiCall('/downloads/history', 'GET'),

  // Storage
  getStorageDownloadUrl: (storagePath) => apiCall(`/storage/download-url?storagePath=${encodeURIComponent(storagePath)}`, 'GET'),
  deleteStorageFile: (payload) => apiCall('/storage/file', 'DELETE', payload),

  // Onboarding
  uploadOnboardingResume: (formData) => apiCall('/onboarding/resume', 'POST', formData, true),
  analyzeOnboarding: (payload) => apiCall('/onboarding/analyze', 'POST', payload),
  confirmOnboarding: (payload) => apiCall('/onboarding/confirm', 'POST', payload),
  saveOnboardingStep: (payload) => apiCall('/onboarding/step', 'POST', payload),
  skipOnboarding: () => apiCall('/onboarding/skip', 'POST', {}),
  getOnboardingState: () => apiCall('/onboarding/state', 'GET'),
  toggleStudyPlanTask: (payload) => apiCall('/onboarding/study-plan/task', 'PUT', payload),
  getStudyPlan: () => apiCall('/onboarding/plan', 'GET')
};
