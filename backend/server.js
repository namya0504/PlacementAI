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

const app = express();

// Security & Middleware Configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL].filter(Boolean) 
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser tools (no origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy violation: Origin ${origin} is not allowed`));
  }, 
  credentials: true 
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

// API Routes Mounting (with and without /api prefix for cloud hosting tolerance)
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
  ['onboarding', onboardingRoutes]
];

routes.forEach(([path, router]) => {
  app.use(`/api/${path}`, router);
  app.use(`/${path}`, router);
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
