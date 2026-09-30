import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const rawJwtSecret = process.env.JWT_SECRET;
if (!rawJwtSecret || rawJwtSecret.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is missing or insecure (< 32 characters). Server halted.');
  } else {
    console.warn('⚠️ WARNING: JWT_SECRET is missing or insecure (< 32 chars). Set a strong secret in production.');
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: rawJwtSecret || 'dev_fallback_placement_ai_secret_key_minimum_32_chars',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'placementai-app',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'placementai-app.appspot.com'
  },
  ai: {
    xaiKey: process.env.XAI_API_KEY || process.env.GROK_API_KEY || '',
    judge0Key: process.env.JUDGE0_API_KEY || ''
  }
};
