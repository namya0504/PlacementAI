// Firebase Configuration & Service Initializer
// Uses environment variables if set (VITE_FIREBASE_*), with project credentials as default fallback.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBd2Zoslz2SoI1kkkzHJ4nrFYEXHWH8d3w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placementai-11ba6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placementai-11ba6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placementai-11ba6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "741583360825",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:741583360825:web:e3cd6155e03cf1cb1b8ee8"
};

export default firebaseConfig;
