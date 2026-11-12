import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { seedInitialData } from './firebase/seedData.js';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';

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

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

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
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Cache-Control', 'Pragma']
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoints
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'PlacementAI Backend API',
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

// Start Server & Seed Initial Data in background
const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PlacementAI Server running on port ${PORT} [${config.nodeEnv}]`);
  seedInitialData().catch(err => {
    console.warn('⚠️ Initial data seeding notice:', err.message);
  });
});
