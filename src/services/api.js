// PlacementAI Central API Client Layer
const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawApiBase.endsWith('/api')
  ? rawApiBase
  : (rawApiBase ? `${rawApiBase}/api` : '/api');

export const warmUpBackend = () => {
  try {
    fetch(`${API_BASE_URL}/health`, { method: 'GET' }).catch(() => {});
  } catch {}
};

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

const TOKEN_STORAGE_KEY = 'placement_ai_auth_token';

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setStoredToken = (token, rememberMe = true) => {
  try {
    if (token) {
      if (rememberMe) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {}
};

export const clearStoredToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('placement_ai_user');
    sessionStorage.removeItem('placement_ai_user');
    // Clear any residual placement_ai token or user keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('placement_ai_') || key.startsWith('firebase:authUser'))) {
        localStorage.removeItem(key);
      }
    }
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('placement_ai_') || key.startsWith('firebase:authUser'))) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {}
};

const getAuthHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// In-memory GET cache with per-endpoint TTLs to eliminate duplicate calls during navigation.
// Endpoints matching a prefix key use that TTL; all others fall back to 15s.
const getCache = new Map();
const CACHE_TTL_MAP = {
  '/profile':       60_000,  // 60s — profile data changes infrequently
  '/company':      300_000,  // 5 min — company lists rarely change
  '/onboarding/plan': 300_000, // 5 min — study plan is static between edits
  '/hr/questions': 300_000,  // 5 min — question bank is static
  '/aptitude/active': 5_000, // 5s — active test state must stay fresh
};
const DEFAULT_CACHE_TTL_MS = 15_000;

/** Returns the TTL (ms) for a given endpoint path. */
function getCacheTtl(endpoint) {
  for (const [prefix, ttl] of Object.entries(CACHE_TTL_MAP)) {
    if (endpoint.startsWith(prefix)) return ttl;
  }
  return DEFAULT_CACHE_TTL_MS;
}

export const clearApiCache = () => {
  getCache.clear();
};

/**
 * Clears only cache entries whose key starts with the given prefix.
 * Use this for targeted invalidation after mutations (e.g. '/resume' after a save).
 */
export const clearApiCachePrefix = (prefix) => {
  for (const key of getCache.keys()) {
    if (key.startsWith(prefix)) getCache.delete(key);
  }
};

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false, customTimeout = null) => {
  const isGet = method.toUpperCase() === 'GET';
  const cacheKey = `${endpoint}`;
  // Endpoints that must always return fresh data — never serve from cache
  const skipCache = isGet && (
    endpoint.startsWith('/auth/check-email') ||
    endpoint === '/profile/resume' ||
    endpoint.includes('generate=true')
  );

  // Serve from cache if available and fresh
  if (isGet && !skipCache) {
    const cached = getCache.get(cacheKey);
    const ttl = getCacheTtl(endpoint);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
  } else if (!isGet) {
    // Scoped cache invalidation on mutations — clear only the affected endpoint group
    const mutationPrefixes = {
      '/resume':      ['/resume'],
      '/profile':     ['/profile'],
      '/ats':         ['/ats'],
      '/onboarding':  ['/onboarding'],
      '/aptitude':    ['/aptitude', '/mock-tests'],
      '/technical':   ['/technical'],
      '/hr':          ['/hr'],
      '/progress':    ['/progress', '/dashboard'],
      '/dashboard':   ['/dashboard', '/progress'],
      '/downloads':   ['/downloads'],
      '/storage':     ['/storage'],
      '/github':      ['/github'],
    };
    let cleared = false;
    for (const [prefix, targets] of Object.entries(mutationPrefixes)) {
      if (endpoint.startsWith(prefix)) {
        targets.forEach(t => clearApiCachePrefix(t));
        cleared = true;
        break;
      }
    }
    // Fallback: clear everything if no specific mapping found
    if (!cleared) getCache.clear();
  }

  const headers = getAuthHeaders();
  if (body && !isFormData) headers['Content-Type'] = 'application/json';
  const isPublicAuthPost = ['/auth/login', '/auth/register', '/auth/google-login', '/auth/google', '/auth/forgot-password', '/auth/logout'].includes(endpoint);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase()) && !headers.Authorization && !isPublicAuthPost) {
    try {
      const csrf = await getCsrfToken();
      if (csrf) headers['X-CSRF-Token'] = csrf;
    } catch {
      // CSRF token is best-effort when Authorization header is present
    }
  }

  // Dynamic timeout: AI & heavy generation routes get 75s, normal requests get 55s (allows Render cold start)
  const isHeavyAI = /aptitude|ats|resume|recommendations|study-plan|code-eval|hr-eval/i.test(endpoint);
  const timeoutMs = customTimeout || (isHeavyAI ? 75000 : 55000);

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
      if (result?.data) apiError.data = result.data;
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
    if (err.message === 'Failed to fetch') {
      throw new Error('Backend server is not running on port 5000. Please ensure both frontend and backend are running (npm run dev).');
    }
    throw err;
  }
};

export const API = {
  apiCall,
  // Auth
  checkEmail: (email) => apiCall(`/auth/check-email?email=${encodeURIComponent(email)}`, 'GET'),
  register: async (userData) => {
    const result = await apiCall('/auth/register', 'POST', userData);
    if (result?.token) setStoredToken(result.token, true);
    return result;
  },
  login: async (credentials, rememberMe = true) => {
    const result = await apiCall('/auth/login', 'POST', credentials);
    if (result?.token) setStoredToken(result.token, rememberMe);
    return result;
  },
  googleLogin: async (socialData) => {
    const result = await apiCall('/auth/google-login', 'POST', socialData);
    if (result?.token) setStoredToken(result.token, true);
    return result;
  },
  forgotPassword: (payloadOrEmail) => {
    const payload = typeof payloadOrEmail === 'string' ? { email: payloadOrEmail } : payloadOrEmail;
    return apiCall('/auth/forgot-password', 'POST', payload);
  },
  logout: async () => {
    try {
      await apiCall('/auth/logout', 'POST');
    } catch {
      // Best-effort backend notification
    } finally {
      clearStoredToken();
    }
  },
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
  runTechnicalCode: (payload) => apiCall('/technical/run-code', 'POST', payload),
  submitTechnicalCode: (payload) => apiCall('/technical/submit-code', 'POST', payload),
  getTechnicalHistory: () => apiCall('/technical/history', 'GET'),

  // HR Interview
  startInterviewSession: (payload) => apiCall('/hr/session/start', 'POST', payload),
  getInterviewSessionState: (sessionId) => apiCall(`/hr/session/${sessionId}/state`, 'GET'),
  submitInterviewAnswer: (sessionId, payload) => apiCall(`/hr/session/${sessionId}/answer`, 'POST', payload),
  transitionInterviewRound: (sessionId) => apiCall(`/hr/session/${sessionId}/transition`, 'POST'),
  endInterviewSession: (sessionId) => apiCall(`/hr/session/${sessionId}/end`, 'POST'),
  getInterviewReport: (sessionId) => apiCall(`/hr/session/${sessionId}/report`, 'GET'),
  transcribeInterviewVoice: (formData) => apiCall('/hr/voice/transcribe', 'POST', formData, true, 30000),
  parseInterviewResume: (formData) => apiCall('/hr/resume/parse', 'POST', formData, true, 30000),
  inspectCandidateGitHub: (payload) => apiCall('/hr/github/inspect', 'POST', payload),
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
