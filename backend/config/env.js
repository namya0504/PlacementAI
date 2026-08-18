import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'placement_ai_secret_key_2026',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'placementai-app',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'placementai-app.appspot.com'
  },
  ai: {
    geminiKey: process.env.GEMINI_API_KEY || '',
    grokKey: process.env.GROK_API_KEY || ''
  }
};
