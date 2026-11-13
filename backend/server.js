import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { seedInitialData } from './firebase/seedData.js';
import { sanitizeInputs, securityHeaders } from './middlewares/securityMiddleware.js';
import { generalApiLimiter } from './middlewares/rateLimiter.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import atsRoutes from './routes/atsRoutes.js';
import aptitudeRoutes from './routes/aptitudeRoutes.js';
import technicalRoutes from './routes/technicalRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import storageRoutes from './routes/storageRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

const app = express();
app.set('trust proxy', 1);

// Disable fingerprinting header
app.disable('x-powered-by');

// Response Compression — shrinks JSON payloads by up to 75-80%
app.use(compression({
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Comprehensive Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // allows Google OAuth / Firebase popups without blocking
  dnsPrefetchControl: { allow: true },
  hidePoweredBy: true,
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

app.use(securityHeaders);

// Security & Middleware Configuration: parse comma-separated FRONTEND_URL and include localhost dev origins
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

const baseAllowedOrigins = [
  ...configuredOrigins,
  'https://placement-ai-nu.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser tools (no origin header)
    if (!origin) return callback(null, true);

    try {
      const hostname = new URL(origin).hostname;
      if (
        baseAllowedOrigins.includes(origin) ||
        hostname.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
    } catch {}

    // Reject with a proper CORS error so the browser gets a clear message
    return callback(new Error(`CORS: Origin "${origin}" is not allowed`));
  }, 
  credentials: true,
  maxAge: 86400, // Cache CORS preflight for 24 hours to eliminate redundant OPTIONS latency
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Cache-Control', 'Pragma']
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Input sanitization against Prototype Pollution, Null-bytes, and XSS
app.use(sanitizeInputs);

// General Rate Limiter for all API routes (DDoS & brute-force defense)
app.use('/api', generalApiLimiter);

// Health Check Endpoints (High-speed, unthrottled)
app.get(['/health', '/api/health'], (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({
    status: 'OK',
    service: 'PlacementAI Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting — all routes served under /api prefix only
const routes = [
  ['auth', authRoutes],
  ['profile', profileRoutes],
  ['resume', resumeRoutes],
  ['ats', atsRoutes],
  ['aptitude', aptitudeRoutes],
  ['mock-tests', aptitudeRoutes],
  ['technical', technicalRoutes],
  ['hr', hrRoutes],
  ['dashboard', dashboardRoutes],
  ['downloads', downloadRoutes],
  ['company', companyRoutes],
  ['storage', storageRoutes],
  ['onboarding', onboardingRoutes],
  ['github', githubRoutes],
  ['progress', progressRoutes]
];

routes.forEach(([path, router]) => {
  app.use(`/api/${path}`, router);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server with tuned Keep-Alive settings & Seed Initial Data
const PORT = config.port;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PlacementAI Server running on port ${PORT} [${config.nodeEnv}]`);
  seedInitialData().catch(err => {
    console.warn('⚠️ Initial data seeding notice:', err.message);
  });
});

// Tune keep-alive timeouts to prevent connection drops behind reverse proxies (Render, Cloudflare, Vercel)
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
