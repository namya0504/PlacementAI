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

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const user = await API.register({ name, email, password });
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
      const email = profileInfo.email || `candidate_${Date.now().toString(36)}@placementai.edu`;
      const name = profileInfo.name || 'Student Candidate';
      const user = await API.googleLogin({ providerName, name, email, photoURL: profileInfo.photoURL });
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

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginWithSocial,
    logout,
    updateProfileData,
    updateOnboardingState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

