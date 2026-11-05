// Firebase Configuration & Service Initializer
// Sanitizes incoming environment variables and applies verified project credentials as default fallback.

const sanitize = (val, fallback) => {
  if (!val || typeof val !== 'string') return fallback;
  const cleaned = val.trim().replace(/^["']+|["']+$/g, '');
  if (!cleaned || cleaned === 'undefined' || cleaned === 'null') return fallback;
  return cleaned;
};

const rawApiKey = sanitize(import.meta.env.VITE_FIREBASE_API_KEY, 'AIzaSyBd2Zoslz2SoI1kkkzHJ4nrFYEXHWH8d3w');
const validApiKey = (rawApiKey.startsWith('AIza') && rawApiKey.length >= 35)
  ? rawApiKey
  : 'AIzaSyBd2Zoslz2SoI1kkkzHJ4nrFYEXHWH8d3w';

const firebaseConfig = {
  apiKey: validApiKey,
  authDomain: sanitize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'placementai-11ba6.firebaseapp.com'),
  projectId: sanitize(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'placementai-11ba6'),
  storageBucket: sanitize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'placementai-11ba6.firebasestorage.app'),
  messagingSenderId: sanitize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, '741583360825'),
  appId: sanitize(import.meta.env.VITE_FIREBASE_APP_ID, '1:741583360825:web:e3cd6155e03cf1cb1b8ee8')
};

export default firebaseConfig;
