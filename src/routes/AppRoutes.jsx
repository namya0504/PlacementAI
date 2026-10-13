import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Dynamic code-splitting: routes are fetched on demand instead of all at once
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ResumeBuilder = lazy(() => import('../pages/ResumeBuilder'));
const Templates = lazy(() => import('../pages/Templates'));
const ATSChecker = lazy(() => import('../pages/ATSChecker'));
const Aptitude = lazy(() => import('../pages/Aptitude'));
const Technical = lazy(() => import('../pages/Technical'));
const HRInterview = lazy(() => import('../pages/HRInterview'));
const CompanyPrep = lazy(() => import('../pages/CompanyPrep'));
const MyProgress = lazy(() => import('../pages/MyProgress'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Onboarding = lazy(() => import('../pages/Onboarding'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-9 h-9 border-3 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold text-slate-500 animate-pulse">Loading...</p>
    </div>
  );
}

/**
 * Route Guard for guest/public-only pages (Home, Login, Signup).
 * If a student is already authenticated, redirect them directly to /dashboard.
 */
function PublicOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return null;
  }
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function CatchAllRoute() {
  const { currentUser } = useAuth();
  return <Navigate to={currentUser ? '/dashboard' : '/'} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages (Redirects authenticated students to /dashboard) */}
        <Route path="/" element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authenticated Pages */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/ats-checker" element={<ProtectedRoute><ATSChecker /></ProtectedRoute>} />
        <Route path="/placement-prep" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
        <Route path="/placement-prep/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
        <Route path="/placement-prep/technical" element={<ProtectedRoute><Technical /></ProtectedRoute>} />
        <Route path="/placement-prep/hr-interview" element={<ProtectedRoute><HRInterview /></ProtectedRoute>} />
        <Route path="/placement-prep/company" element={<ProtectedRoute><CompanyPrep /></ProtectedRoute>} />
        <Route path="/my-progress" element={<ProtectedRoute><MyProgress /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </Suspense>
  );
}
