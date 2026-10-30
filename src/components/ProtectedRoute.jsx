import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route Guard to protect private pages from unauthenticated access.
 * Also gates unverified users — they can only access /verify-email-pending.
 */
export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Unverified users can only visit the verification-pending page.
  // All other protected routes redirect back to that page.
  if (currentUser.emailVerified === false && location.pathname !== '/verify-email-pending') {
    return <Navigate to="/verify-email-pending" replace />;
  }

  return children;
}
