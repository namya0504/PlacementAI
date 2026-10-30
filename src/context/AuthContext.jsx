import React, { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('placement_ai_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      if (parsed?.photoURL && (parsed.photoURL.includes('base.') || !parsed.photoURL.startsWith('http'))) {
        parsed.photoURL = '';
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Start loading=true so ProtectedRoute / PublicOnlyRoute wait for the initial
  // session sync to complete before making any routing decisions.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        setLoading(false);
      }
    };

    // Check if user returned from Google Redirect sign-in flow, then sync session
    import('../services/firebase/authService')
      .then(mod => (mod.checkGoogleRedirectResult ? mod.checkGoogleRedirectResult() : null))
      .then(async (redirectRes) => {
        if (redirectRes && redirectRes.success) {
          const user = await API.googleLogin({
            idToken: redirectRes.idToken,
            providerName: 'google',
            name: redirectRes.user.displayName,
            email: redirectRes.user.email,
            photoURL: redirectRes.user.photoURL
          });
          setCurrentUser(user);
          localStorage.setItem('placement_ai_user', JSON.stringify(user));
        }
      })
      .catch(err => {
        console.warn('Google redirect sign-in check notice:', err.message);
      })
      .finally(() => {
        // Sync latest profile/stats on initial load if user is already logged in
        if (currentUser?.token) {
          API.getCurrentUser()
            .then(user => {
              if (user) {
                setCurrentUser(prev => {
                  const updated = {
                    ...prev,
                    ...user,
                    // Always keep the JWT token — /auth/me response does not include it
                    token: prev?.token
                  };
                  localStorage.setItem('placement_ai_user', JSON.stringify(updated));
                  return updated;
                });
              }
            })
            .catch(err => {
              console.warn('User session sync notice:', err.message);
              if (err.message && (err.message.includes('401') || err.message.toLowerCase().includes('token') || err.message.toLowerCase().includes('unauthorized'))) {
                setCurrentUser(null);
                localStorage.removeItem('placement_ai_user');
              }
            })
            .finally(finish);
        } else {
          finish();
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    // NOTE: Do NOT touch global `loading` here — it is only for the mount-time
    // session sync. Each page (Login.jsx, Signup.jsx) manages its own local
    // loading state. Setting global loading=true here would cause PublicOnlyRoute
    // to unmount the Login form mid-submit, breaking the navigation.
    const user = await API.login({ email, password });
    setCurrentUser(user);
    localStorage.setItem('placement_ai_user', JSON.stringify(user));
    return user;
  };

  const signup = async (nameOrData, emailArg, passwordArg, extraData = {}) => {
    const payload = (typeof nameOrData === 'object' && nameOrData !== null)
      ? nameOrData
      : { name: nameOrData, email: emailArg, password: passwordArg, ...extraData };

    // 1. Create the account via backend (Firestore + Firebase Admin)
    const user = await API.register(payload);
    setCurrentUser(user);
    localStorage.setItem('placement_ai_user', JSON.stringify(user));

    // 2. Establish a Firebase client session so sendEmailVerification works.
    //    This signs in silently — it does NOT affect navigation.
    //    Password comes from the original payload since we need it here.
    const plainEmail = (payload.email || '').trim().toLowerCase();
    const plainPassword = payload.password || '';
    try {
      const { signInToFirebaseClient, sendFirebaseVerificationEmail } = await import('../services/firebase/authService');
      const fbSignIn = await signInToFirebaseClient(plainEmail, plainPassword);
      if (fbSignIn.success) {
        // 3. Firebase sends the verification email to the user's real inbox
        const fbVerify = await sendFirebaseVerificationEmail();
        if (!fbVerify.success && !fbVerify.alreadyVerified) {
          console.warn('Firebase email verification send notice:', fbVerify.message);
        }
      } else {
        console.warn('Firebase client sign-in after registration notice:', fbSignIn.message);
      }
    } catch (fbErr) {
      // Non-fatal — backend SMTP fallback may have already dispatched the email
      console.warn('Firebase post-registration sign-in notice:', fbErr.message);
    }

    return user;
  };

  const loginWithSocial = async (providerName, profileInfo = {}) => {
    let idToken = null;
    let email = profileInfo.email;
    let name = profileInfo.name;
    let photoURL = profileInfo.photoURL;

    if (providerName && providerName.toLowerCase() === 'google') {
      const { signInWithGooglePopup } = await import('../services/firebase/authService');
      const googleRes = await signInWithGooglePopup();

      if (googleRes.success) {
        idToken = googleRes.idToken;
        email = googleRes.user.email;
        name = googleRes.user.displayName;
        photoURL = googleRes.user.photoURL;
      } else if (googleRes.error === 'auth/popup-closed-by-user' || googleRes.error === 'auth/cancelled-popup-request') {
        throw new Error('Google sign-in popup was closed.');
      } else {
        throw new Error(googleRes.message || 'Google sign-in was unable to complete. Please check your browser popup settings.');
      }
    }

    email = email || `candidate_${Date.now().toString(36)}@placementai.edu`;
    name = name || 'Student Candidate';

    const user = await API.googleLogin({
      idToken,
      providerName,
      name,
      email,
      photoURL
    });

    setCurrentUser(user);
    localStorage.setItem('placement_ai_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    API.logout().catch(() => { });
    setCurrentUser(null);
    localStorage.removeItem('placement_ai_user');
  };

  // Merge arbitrary fields into currentUser (used by email verification, profile updates, etc.)
  const updateCurrentUser = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('placement_ai_user', JSON.stringify(merged));
      return merged;
    });
  };

  const updateProfileData = (updatedFields) => {
    API.updateProfile(updatedFields).catch(() => { });
    setCurrentUser(prev => {
      const newObj = { ...prev, ...updatedFields };
      localStorage.setItem('placement_ai_user', JSON.stringify(newObj));
      return newObj;
    });
  };

  const updateOnboardingState = (onboardingData) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        onboarding: { ...(prev.onboarding || {}), ...onboardingData }
      };
      localStorage.setItem('placement_ai_user', JSON.stringify(updated));
      return updated;
    });
  };

  const completeProfile = async (profileData) => {
    const res = await API.completeProfile(profileData);
    const updated = {
      ...(currentUser || {}),
      ...profileData,
      ...(res || {}),
      // Always preserve the JWT token — backend completeProfile response doesn't include it
      token: (res?.token) || currentUser?.token,
      needsProfileCompletion: false
    };
    setCurrentUser(updated);
    localStorage.setItem('placement_ai_user', JSON.stringify(updated));
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

