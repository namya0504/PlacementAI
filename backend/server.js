import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { seedInitialData } from './firebase/seedData.js';

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

const app = express();

// Middlewares
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://placementai.vercel.app'] 
  : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

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
app.use('/api/mock-tests', aptitudeRoutes);
app.use('/api/technical', technicalRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/company', companyRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Seed Initial Data & Start Server
const PORT = config.port;

seedInitialData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PlacementAI Server running on port ${PORT} [${config.nodeEnv}]`);
  });
});
