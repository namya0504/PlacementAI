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

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'PlacementAI Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/mock-tests', aptitudeRoutes);
app.use('/api/technical', technicalRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/onboarding', onboardingRoutes);

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
