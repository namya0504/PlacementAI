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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync latest profile/stats on initial load if user logged in
    if (currentUser?.token) {
      API.getCurrentUser()
        .then(user => {
          if (user) {
            setCurrentUser(prev => {
              const updated = { ...prev, ...user };
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
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await API.login({ email, password });
      setCurrentUser(user);
      localStorage.setItem('placement_ai_user', JSON.stringify(user));
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (nameOrData, email, password, extraData = {}) => {
    setLoading(true);
    try {
      const payload = (typeof nameOrData === 'object' && nameOrData !== null)
        ? nameOrData
        : { name: nameOrData, email, password, ...extraData };
      const user = await API.register(payload);
      setCurrentUser(user);
      localStorage.setItem('placement_ai_user', JSON.stringify(user));
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginWithSocial = async (providerName, profileInfo = {}) => {
    setLoading(true);
    try {
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
          setLoading(false);
          throw new Error('Google sign-in popup was closed.');
        } else {
          console.warn('Google popup notice:', googleRes.message);
          if (!email) {
            throw new Error(googleRes.message || 'Google sign-in was unable to complete. Please check your browser popup settings.');
          }
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
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    API.logout().catch(() => { });
    setCurrentUser(null);
    localStorage.removeItem('placement_ai_user');
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
      needsProfileCompletion: false
    };
    setCurrentUser(updated);
    localStorage.setItem('placement_ai_user', JSON.stringify(updated));
    return updated;
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginWithSocial,
    logout,
    updateProfileData,
    updateOnboardingState,
    completeProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

