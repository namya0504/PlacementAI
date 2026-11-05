import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordReset
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
 * Format informative user-facing error messages for common Firebase Auth errors
 */
const formatAuthError = (err) => {
  const code = err?.code || '';
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'this domain';

  if (code === 'auth/invalid-api-key') {
    return 'Authentication service configuration error. Please refresh the page or try again.';
  }
  if (code === 'auth/unauthorized-domain') {
    return `Firebase domain not authorized: "${currentHostname}" is not registered in your Firebase project. Please add "${currentHostname}" (or "vercel.app") in Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
  }
  if (code === 'auth/popup-blocked') {
    return `Sign-in popup was blocked by your browser. Please allow popups for ${currentHostname} or click the button again.`;
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in popup was closed before completing.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Google sign-in request was cancelled. Please try again.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection issue. Please check your internet connectivity.';
  }
  return err?.message || 'Google sign-in was unable to complete. Please try again.';
};

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
      message: formatAuthError(err)
    };
  }
};

/**
 * Initiates Google Sign-In using full-page redirect (ideal for mobile or blocked popups)
 */
export const signInWithGoogleRedirect = async () => {
  return signInWithRedirect(clientAuth, googleProvider);
};

/**
 * Checks for and resolves pending Google redirect sign-in result on page load
 */
export const checkGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(clientAuth);
    if (result && result.user) {
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
    }
    return null;
  } catch (err) {
    console.warn('Firebase Google Redirect Result notice:', err.code, err.message);
    return {
      success: false,
      error: err.code || err.message,
      message: formatAuthError(err)
    };
  }
};

/**
 * Signs a user into Firebase client SDK with email + password.
 * Used after backend registration to establish a client session so that
 * sendEmailVerification() can be called on behalf of the newly created user.
 */
export const signInToFirebaseClient = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(clientAuth, email.trim().toLowerCase(), password);
    return { success: true, user: result.user };
  } catch (err) {
    console.warn('Firebase client sign-in notice:', err.code, err.message);
    return { success: false, error: err.code, message: err.message };
  }
};

/**
 * Sends a Firebase verification email to the currently signed-in Firebase client user.
 * Returns { success, error? }.  Requires clientAuth.currentUser to be set first.
 */
export const sendFirebaseVerificationEmail = async () => {
  const user = clientAuth.currentUser;
  if (!user) {
    return { success: false, error: 'no_session', message: 'No active Firebase client session' };
  }
  // Reload to get the freshest emailVerified state before sending
  try { await user.reload(); } catch (_) {}
  if (user.emailVerified) {
    return { success: true, alreadyVerified: true };
  }
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (err) {
    console.warn('Firebase sendEmailVerification notice:', err.code, err.message);
    const code = err?.code || '';
    if (code === 'auth/too-many-requests') {
      return { success: false, error: code, message: 'Too many requests. Please wait a few minutes before requesting another email.' };
    }
    return { success: false, error: code, message: err.message };
  }
};

/**
 * Checks whether the currently signed-in Firebase client user has verified their email.
 * Reloads the user from Firebase first so the result is always fresh.
 */
export const checkFirebaseEmailVerified = async () => {
  const user = clientAuth.currentUser;
  if (!user) return { verified: false, error: 'no_session' };
  try {
    await user.reload();
    return { verified: user.emailVerified === true };
  } catch (err) {
    console.warn('Firebase user.reload() notice:', err.message);
    return { verified: false, error: err.message };
  }
};

/**
 * Sends a password reset email via Firebase Auth (client SDK).
 * Firebase handles the reset link, email delivery, and the hosted reset page.
 * This is the canonical forgot-password flow — no backend round-trip needed.
 */
export const sendFirebasePasswordReset = async (email) => {
  try {
    await firebaseSendPasswordReset(clientAuth, email.trim().toLowerCase());
    return { success: true };
  } catch (err) {
    console.warn('Firebase sendPasswordResetEmail notice:', err.code, err.message);
    const code = err?.code || '';
    let message = 'Failed to send password reset email. Please try again.';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
      // Return success to prevent email enumeration — same generic UX as backend
      return { success: true };
    }
    if (code === 'auth/too-many-requests') {
      message = 'Too many reset attempts. Please wait a moment and try again.';
    }
    if (code === 'auth/network-request-failed') {
      message = 'Network error. Please check your internet connection.';
    }
    return { success: false, error: code, message };
  }
};
