// Firebase Configuration & Service Initializer
// Replace values with your actual Firebase project config when deploying to production

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForPlacementAITesting123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placementai-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placementai-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placementai-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

export default firebaseConfig;
