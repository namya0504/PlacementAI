// Firebase Configuration & Service Initializer
// Replace values with your actual Firebase project config when deploying to production

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBd2Zoslz2SoI1kkkzHJ4nrFYEXHWH8d3w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placementai-11ba6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placementai-11ba6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placementai-11ba6.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "106615825457481324812",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:106615825457481324812:web:abcdef123456"
};

export default firebaseConfig;
