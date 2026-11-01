import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Laptop,
  BookOpen
} from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ROUTES } from '../routes/paths';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { currentUser, loading: authLoading, login, loginWithSocial } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Helper to resolve the correct destination after login
  const getRedirectPath = (userObj) => {
    const fromPath = location.state?.from?.pathname
      ? `${location.state.from.pathname}${location.state.from.search || ''}`
      : null;

    if (userObj?.emailVerified === false) {
      return ROUTES.verifyEmail;
    }
    if (userObj?.onboarding?.status === 'in_progress' || userObj?.onboarding?.status === 'not_started') {
      return ROUTES.onboarding;
    }
    return fromPath || ROUTES.dashboard;
  };

  // Check URL parameters for email verification or registration feedback
  useEffect(() => {
    const verifyEmailParam = searchParams.get('verifyEmail');
    const registeredParam = searchParams.get('registered');

    if (verifyEmailParam) {
      setEmail(verifyEmailParam);
      setInfoMessage('Verification link accessed. Please log in to complete verification.');
    } else if (registeredParam === 'true') {
      setInfoMessage('Account created successfully! Please sign in with your credentials.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser && !authLoading) {
      if (currentUser.emailVerified === false) {
        navigate(ROUTES.verifyEmail, { replace: true });
        return;
      }
      const dest = getRedirectPath(currentUser);
      navigate(dest, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    if (!isEmailValid) {
      setError('Please provide a valid email format');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      const dest = getRedirectPath(user);
      navigate(dest, { replace: true });
    } catch (err) {
      if (err.errorCode === 'EMAIL_NOT_FOUND') {
        setError('No account found with this email. Check for typos or sign up for a new account.');
      } else if (err.errorCode === 'WRONG_PASSWORD') {
        setError("Incorrect password. Try again, or use 'Forgot Password' to reset it.");
      } else if (err.errorCode === 'ACCOUNT_DEACTIVATED') {
        setError(err.message || 'This account has been deactivated.');
      } else {
        setError(err.message || 'Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email.trim() || !isEmailValid) {
      setError('Please enter your email address first to receive password reset instructions.');
      return;
    }

    try {
      setForgotLoading(true);
      const { sendFirebasePasswordReset } = await import('../services/firebase/authService');
      const firebaseResult = await sendFirebasePasswordReset(email.trim());

      if (firebaseResult.success) {
        setInfoMessage('Password reset email sent! Check your inbox (and spam folder).');
        return;
      }

      const res = await API.forgotPassword(email.trim());
      setInfoMessage(res?.message || 'Password reset instructions have been dispatched.');
    } catch (err) {
      setError(err.message || 'Unable to request password reset. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError('');
      setInfoMessage('');
      setLoading(true);
      const user = await loginWithSocial(provider);
      const dest = getRedirectPath(user);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || 'Social authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Decorative Side Cards matching Reference Screen */}
        <div className="hidden xl:flex flex-col items-center gap-4 absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-90">
          <div className="w-56 p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-[#EAEBF4] shadow-xl space-y-3 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">AI-Powered Placement</h4>
            <p className="text-xs text-slate-500">Prepare for top tech companies with intelligent mock tests.</p>
          </div>
        </div>

        <div className="hidden xl:flex flex-col items-center gap-4 absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-90">
          <div className="w-56 p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-[#EAEBF4] shadow-xl space-y-3 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Placement Preparation</h4>
            <p className="text-xs text-slate-500">Track aptitude, coding &amp; mock interview readiness live.</p>
          </div>
        </div>

        {/* Main Login Card Matching Reference UI */}
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#EAEBF4] relative z-10 space-y-6">
          
          {/* Brand Logo & Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shadow-sm shadow-purple-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit">
                Placement<span className="text-[#7C3AED]">AI</span>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Welcome Back! <span className="text-xl">👋</span>
            </h2>
            <p className="text-xs text-slate-500">
              Log in to continue your placement journey
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email / College ID Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or College ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-sm transition"
                  placeholder="name@college.edu or candidate@domain.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-sm transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#7C3AED] border-slate-300 rounded focus:ring-[#7C3AED]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="text-xs text-[#7C3AED] hover:text-[#6D28D9] font-semibold hover:underline disabled:opacity-50"
              >
                {forgotLoading ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>

            {/* Solid Purple Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-100 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">
              or continue with
            </span>
          </div>

          {/* Social Login Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-xs"
          >
            <FaGoogle className="text-red-500 text-sm" />
            <span>Continue with Google</span>
          </button>

          {/* Footer Register Link */}
          <p className="text-center text-xs text-slate-500 pt-1">
            Don't have an account?{' '}
            <Link
              to={ROUTES.signup}
              state={location.state}
              className="text-[#7C3AED] font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
