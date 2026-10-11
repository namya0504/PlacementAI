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

function sanitizeEnvString(val, fallback = '') {
  if (!val || typeof val !== 'string') return fallback;
  let str = val.trim();
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    str = str.slice(1, -1).trim();
  }
  return str || fallback;
}

function sanitizePrivateKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return '';
  let key = rawKey.trim();

  // Strip wrapping quotes if present
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // Convert literal \n or \\n to real newlines and strip \r
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r/g, '');

  return key;
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: sanitizeEnvString(process.env.NODE_ENV, 'development'),
  jwtSecret: rawJwtSecret || 'dev_fallback_placement_ai_secret_key_minimum_32_chars',
  firebase: {
    projectId: sanitizeEnvString(process.env.FIREBASE_PROJECT_ID, 'placementai-app'),
    clientEmail: sanitizeEnvString(process.env.FIREBASE_CLIENT_EMAIL),
    privateKey: sanitizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    storageBucket: sanitizeEnvString(process.env.FIREBASE_STORAGE_BUCKET, 'placementai-app.appspot.com')
  },
  supabase: {
    url: sanitizeEnvString(process.env.SUPABASE_URL),
    serviceRoleKey: sanitizeEnvString(process.env.SUPABASE_SERVICE_ROLE_KEY)
  },
  ai: {
    xaiKey: sanitizeEnvString(process.env.XAI_API_KEY || process.env.GROK_API_KEY),
    judge0Key: sanitizeEnvString(process.env.JUDGE0_API_KEY)
  }
};
