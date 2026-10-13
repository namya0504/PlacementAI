import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import firebaseConfig from './config';

// Initialize Firebase App instance safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const clientAuth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Initiates authentic Google Sign-In with popup
 * Returns the signed Firebase idToken for backend verification
 */
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(clientAuth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      success: true,
      idToken,
      user: {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        uid: result.user.uid
      }
    };
  } catch (err) {
    console.warn('Firebase Google Sign-In notice:', err.code, err.message);
    return {
      success: false,
      error: err.code || err.message,
      message: err.message
    };
  }
};

/**
 * Sends verification email via Firebase Auth built-in email service if user is signed in on client
 */
export const triggerFirebaseEmailVerification = async () => {
  if (clientAuth.currentUser) {
    try {
      await sendEmailVerification(clientAuth.currentUser);
      return { success: true };
    } catch (err) {
      console.warn('Firebase client sendEmailVerification notice:', err.message);
      return { success: false, error: err.message };
    }
  }
  return { success: false, error: 'No active client auth session' };
};
