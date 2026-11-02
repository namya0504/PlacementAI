// PlacementAI Central API Client Layer
const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawApiBase.endsWith('/api')
  ? rawApiBase
  : (rawApiBase ? `${rawApiBase}/api` : '/api');

let csrfToken = null;
let csrfTokenRequest = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (!csrfTokenRequest) {
    csrfTokenRequest = fetch(`${API_BASE_URL}/auth/csrf`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not establish a secure session. Please try again.');
        const result = await response.json();
        const token = result?.data?.csrfToken;
        if (typeof token !== 'string' || !token) throw new Error('Could not establish a secure session. Please try again.');
        csrfToken = token;
        return token;
      })
      .finally(() => { csrfTokenRequest = null; });
  }
  return csrfTokenRequest;
};

const getAuthHeaders = () => ({});

// Fast in-memory GET cache with short TTL (15s) to eliminate duplicate calls during navigation
const getCache = new Map();
const CACHE_TTL_MS = 15000;

export const clearApiCache = () => {
  getCache.clear();
};

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false, customTimeout = null) => {
  const isGet = method.toUpperCase() === 'GET';
  const cacheKey = `${endpoint}`;
  // check-email probes are always live — never serve from cache
  const skipCache = isGet && endpoint.startsWith('/auth/check-email');

  // Serve from cache if available and fresh
  if (isGet && !skipCache) {
    const cached = getCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  } else if (!isGet) {
    // Invalidate GET cache on mutations
    getCache.clear();
  }

  const headers = getAuthHeaders();
  if (body && !isFormData) headers['Content-Type'] = 'application/json';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    headers['X-CSRF-Token'] = await getCsrfToken();
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
      const apiError = new Error(result?.message || defaultMessage);
      if (result?.errorCode) apiError.errorCode = result.errorCode;
      throw apiError;
    }

    const outputData = result?.data ?? result;
    if (isGet && !skipCache) {
      getCache.set(cacheKey, { timestamp: Date.now(), data: outputData });
    }
    return outputData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn(`API Timeout (${endpoint}): Request timed out after ${timeoutMs / 1000}s`);
      throw new Error('Server request timed out. Please check your network connection.');
    }
    console.warn(`API Call Error (${endpoint}):`, err.message);
    throw err;
  }
};

export const API = {
  apiCall,
  // Auth
  checkEmail: (email) => apiCall(`/auth/check-email?email=${encodeURIComponent(email)}`, 'GET'),
  register: (userData) => apiCall('/auth/register', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  googleLogin: (socialData) => apiCall('/auth/google-login', 'POST', socialData),
  forgotPassword: (payloadOrEmail) => {
    const payload = typeof payloadOrEmail === 'string' ? { email: payloadOrEmail } : payloadOrEmail;
    return apiCall('/auth/forgot-password', 'POST', payload);
  },
  logout: () => apiCall('/auth/logout', 'POST'),
  deactivateAccount: () => apiCall('/auth/deactivate', 'POST'),
  getCurrentUser: () => apiCall('/auth/me', 'GET'),
  resendVerification: (data = {}) => apiCall('/auth/resend-verification', 'POST', data),
  verifyEmail: () => apiCall('/auth/verify-email', 'POST'),
  completeProfile: (profileData) => apiCall('/auth/complete-profile', 'POST', profileData),

  // GitHub
  fetchGitHubRepos: (username) => apiCall(`/github/repos?username=${encodeURIComponent(username)}`, 'GET'),

  // Profile
  getProfile: () => apiCall('/profile', 'GET'),
  updateProfile: (profileData) => apiCall('/profile', 'PUT', profileData),
  uploadAvatar: (formData) => apiCall('/profile/upload-avatar', 'POST', formData, true),
  getProfileResume: () => apiCall('/profile/resume', 'GET'),
  uploadProfileResume: (formData) => apiCall('/profile/upload-resume', 'POST', formData, true),
  deleteProfileResume: () => apiCall('/profile/resume', 'DELETE'),
  scanGitHubProfile: (payload) => apiCall('/profile/scan-github', 'POST', payload),
  syncProfileSources: (payload = {}) => apiCall('/profile/sync-sources', 'POST', payload),
  getResumeVersionHistory: () => apiCall('/profile/resume/history', 'GET'),
  saveWebResumeVersion: (payload) => apiCall('/profile/resume/save-version', 'POST', payload),
  deleteResumeVersion: (versionId) => apiCall(`/profile/resume/version/${versionId}`, 'DELETE'),

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
  getAptitudeHistory: () => apiCall('/aptitude/history', 'GET'),

  // Technical Practice
  getTechnicalQuestions: (params = '') => apiCall(`/technical/questions${params}`, 'GET'),
  submitTechnicalMCQ: (payload) => apiCall('/technical/submit-mcq', 'POST', payload),
  submitTechnicalCode: (payload) => apiCall('/technical/submit-code', 'POST', payload),
  getTechnicalHistory: () => apiCall('/technical/history', 'GET'),

  // HR Interview
  getHRQuestions: (round = 1, generate = false) => apiCall(`/hr/questions?round=${round}${generate ? '&generate=true' : ''}`, 'GET'),
  evaluateHRAnswer: (payload) => apiCall('/hr/evaluate', 'POST', payload),
  getHRHistory: () => apiCall('/hr/history', 'GET'),
  getHRProgress: () => apiCall('/hr/progress', 'GET'),

  // Company Prep
  getCompanies: () => apiCall('/company', 'GET'),
  getCompanyById: (id) => apiCall(`/company/${id}`, 'GET'),
  getCompanyPrepGuide: (companyName, refresh = false) => apiCall(`/company/prep/${encodeURIComponent(companyName)}${refresh ? '?refresh=true' : ''}`, 'GET'),

  // Combined Progress
  getCombinedProgress: (period = 'all') => apiCall(`/progress/combined?period=${period}`, 'GET'),
  getProgressInsights: (period = 'all', refresh = false) => apiCall(`/progress/insights?period=${period}${refresh ? '&refresh=true' : ''}`, 'GET'),

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
