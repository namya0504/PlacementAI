import React, { createContext, useContext, useEffect, useState } from 'react';
import { API, clearApiCache, getStoredToken, setStoredToken, clearStoredToken } from '../services/api';

const AuthContext = createContext();
const LEGACY_AUTH_CACHE_KEY = 'placement_ai_user';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      // Previous versions stored the bearer token with the cached profile.
      try {
        localStorage.removeItem(LEGACY_AUTH_CACHE_KEY);
      } catch {
        // Session restoration uses the HttpOnly cookie and does not require browser storage.
      }

      try {
        const authService = await import('../services/firebase/authService');
        const redirectResult = authService.checkGoogleRedirectResult
          ? await authService.checkGoogleRedirectResult()
          : null;

        if (redirectResult?.success) {
          clearApiCache();
          await API.googleLogin({
            idToken: redirectResult.idToken,
            providerName: 'google',
            name: redirectResult.user.displayName,
            photoURL: redirectResult.user.photoURL
          });
        }

        let token = getStoredToken();
        if (!token && authService.clientAuth?.currentUser) {
          try {
            const fbIdToken = await authService.clientAuth.currentUser.getIdToken();
            if (fbIdToken) {
              setStoredToken(fbIdToken, true);
              token = fbIdToken;
            }
          } catch {}
        }

        const user = await API.getCurrentUser();
        if (user?.token) setStoredToken(user.token, true);
        if (active) setCurrentUser(user || null);
      } catch (error) {
        const message = String(error?.message || '').toLowerCase();
        const isUnauthenticated = message.includes('401') || message.includes('unauthorized') || message.includes('token') || message.includes('invalid-api-key');
        if (active && isUnauthenticated) {
          clearStoredToken();
          setCurrentUser(null);
        }
        if (!isUnauthenticated) console.warn('Session restore notice:', error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();
    return () => { active = false; };
  }, []);

  const login = async (email, password, rememberMe = true) => {
    clearApiCache();
    // Keep the global loading state limited to initial session restoration so
    // ProtectedRoute does not unmount the login form while it is submitting.
    const user = await API.login({ email, password }, rememberMe);
    if (user?.token) setStoredToken(user.token, rememberMe);
    setCurrentUser(user);

    // Keep Firebase client session established in the background
    try {
      const { signInToFirebaseClient } = await import('../services/firebase/authService');
      await signInToFirebaseClient(email, password);
    } catch (_) {}

    return user;
  };

  const signup = async (nameOrData, emailArg, passwordArg, extraData = {}) => {
    clearApiCache();
    const payload = (typeof nameOrData === 'object' && nameOrData !== null)
      ? nameOrData
      : { name: nameOrData, email: emailArg, password: passwordArg, ...extraData };

    const user = await API.register(payload);
    if (user?.token) setStoredToken(user.token, true);
    setCurrentUser(user);

    // Keep a Firebase client session for verification email actions. The API
    // session itself is held in the HttpOnly backend cookie.
    const plainEmail = (payload.email || '').trim().toLowerCase();
    const plainPassword = payload.password || '';
    try {
      const { signInToFirebaseClient, sendFirebaseVerificationEmail } = await import('../services/firebase/authService');
      const fbSignIn = await signInToFirebaseClient(plainEmail, plainPassword);
      if (fbSignIn.success) {
        const fbVerify = await sendFirebaseVerificationEmail();
        if (!fbVerify.success && !fbVerify.alreadyVerified) {
          console.warn('Firebase email verification send notice:', fbVerify.message);
        }
      } else {
        console.warn('Firebase client sign-in after registration notice:', fbSignIn.message);
      }
    } catch (error) {
      console.warn('Firebase post-registration sign-in notice:', error.message);
    }

    return user;
  };

  const loginWithSocial = async (providerName, profileInfo = {}) => {
    if (!providerName || providerName.toLowerCase() !== 'google') {
      throw new Error('This social sign-in provider is not supported.');
    }

    const { signInWithGooglePopup } = await import('../services/firebase/authService');
    const googleResult = await signInWithGooglePopup();
    if (!googleResult.success) {
      if (googleResult.error === 'auth/popup-closed-by-user' || googleResult.error === 'auth/cancelled-popup-request') {
        throw new Error('Google sign-in popup was closed.');
      }
      throw new Error(googleResult.message || 'Google sign-in could not complete. Check your browser popup settings.');
    }

    clearApiCache();
    const user = await API.googleLogin({
      idToken: googleResult.idToken,
      providerName,
      name: googleResult.user.displayName || profileInfo.name,
      photoURL: googleResult.user.photoURL || profileInfo.photoURL
    });
    if (user?.token) setStoredToken(user.token, true);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    clearApiCache();
    clearStoredToken();
    setCurrentUser(null);
    return API.logout().catch(() => {});
  };

  const updateCurrentUser = (updatedFields) => {
    setCurrentUser((previous) => previous ? { ...previous, ...updatedFields } : previous);
  };

  const updateProfileData = (updatedFields) => {
    setCurrentUser((previous) => previous ? { ...previous, ...updatedFields } : previous);
  };

  const updateOnboardingState = (onboardingData) => {
    setCurrentUser((previous) => previous ? {
      ...previous,
      onboarding: { ...(previous.onboarding || {}), ...onboardingData }
    } : previous);
  };

  const completeProfile = async (profileData) => {
    const response = await API.completeProfile(profileData);
    const updated = {
      ...(currentUser || {}),
      ...profileData,
      ...(response || {}),
      needsProfileCompletion: false
    };
    setCurrentUser(updated);
    return updated;
  };

  const value = {
    currentUser,
    user: currentUser,
    loading,
    login,
    signup,
    loginWithSocial,
    logout,
    updateCurrentUser,
    updateProfileData,
    updateOnboardingState,
    completeProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
