import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './paths';

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
const VerifyEmailPending = lazy(() => import('../pages/VerifyEmailPending'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-9 h-9 border-3 border-purple-500/20 border-t-purple-600 rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold text-slate-500 animate-pulse">Loading...</p>
    </div>
  );
}

/**
 * Route Guard for guest-only pages (Login, Signup).
 * If a student is already authenticated, redirect them directly to:
 * 1. Saved intended route (location.state.from), if any
 * 2. Onboarding wizard, if onboarding is incomplete
 * 3. Dashboard
 */
function PublicOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (currentUser) {
    // 1. Unverified email gate — must verify before onboarding
    if (currentUser.emailVerified === false) {
      return <Navigate to={ROUTES.verifyEmail} replace />;
    }

    // 2. Incomplete onboarding always takes priority for new / in-progress students
    if (currentUser.onboarding?.status === 'not_started' || currentUser.onboarding?.status === 'in_progress') {
      return <Navigate to={ROUTES.onboarding} replace />;
    }

    // 2. Resolve safe 'from' target (NEVER redirect an authenticated user to auth routes)
    const from = location.state?.from?.pathname
      ? `${location.state.from.pathname}${location.state.from.search || ''}`
      : null;

    const isAuthRoute = from && (from.startsWith(ROUTES.login) || from.startsWith(ROUTES.signup));
    if (from && !isAuthRoute) {
      return <Navigate to={from} replace />;
    }

    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children;
}

function CatchAllRoute() {
  const { currentUser } = useAuth();
  if (currentUser) {
    if (currentUser.emailVerified === false) {
      return <Navigate to={ROUTES.verifyEmail} replace />;
    }
    if (currentUser.onboarding?.status === 'not_started' || currentUser.onboarding?.status === 'in_progress') {
      return <Navigate to={ROUTES.onboarding} replace />;
    }
    return <Navigate to={ROUTES.dashboard} replace />;
  }
  return <Navigate to={ROUTES.home} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.login} element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path={ROUTES.signup} element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path={ROUTES.about} element={<About />} />
        <Route path={ROUTES.contact} element={<Contact />} />
        {/* Email verification gate — accessible when logged-in but not yet verified */}
        <Route path={ROUTES.verifyEmail} element={<VerifyEmailPending />} />

        {/* Authenticated Pages — each wrapped in ErrorBoundary so one broken page can't crash the app */}
        <Route path={ROUTES.onboarding}    element={<ProtectedRoute><ErrorBoundary><Onboarding /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.dashboard}     element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.resumeBuilder} element={<ProtectedRoute><ErrorBoundary><ResumeBuilder /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.templates}     element={<ProtectedRoute><ErrorBoundary><Templates /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.atsChecker}    element={<ProtectedRoute><ErrorBoundary><ATSChecker /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.placementPrep} element={<ProtectedRoute><ErrorBoundary><Aptitude /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.aptitude}      element={<ProtectedRoute><ErrorBoundary><Aptitude /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.technical}     element={<ProtectedRoute><ErrorBoundary><Technical /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.hrInterview}   element={<ProtectedRoute><ErrorBoundary><HRInterview /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.companyPrep}   element={<ProtectedRoute><ErrorBoundary><CompanyPrep /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.progress}      element={<ProtectedRoute><ErrorBoundary><MyProgress /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.profile}       element={<ProtectedRoute><ErrorBoundary><Profile /></ErrorBoundary></ProtectedRoute>} />
        <Route path={ROUTES.settings}      element={<ProtectedRoute><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </Suspense>
  );
}
