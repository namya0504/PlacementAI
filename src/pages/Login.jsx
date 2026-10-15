import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { currentUser, login, loginWithSocial } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Helper to resolve the correct destination
  const getRedirectPath = (userObj) => {
    const fromPath = location.state?.from?.pathname
      ? `${location.state.from.pathname}${location.state.from.search || ''}`
      : null;

    if (userObj?.onboarding?.status === 'in_progress' || userObj?.onboarding?.status === 'not_started') {
      return '/onboarding';
    }
    return fromPath || '/dashboard';
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

  // If already authenticated, redirect smoothly
  useEffect(() => {
    if (currentUser && !loading) {
      const dest = getRedirectPath(currentUser);
      navigate(dest, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

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
      setError(err.message || 'Failed to log in. Please check your credentials.');
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
      const res = await API.forgotPassword(email.trim());
      setInfoMessage(res.message || 'Password reset instructions have been dispatched.');
    } catch (err) {
      setError(err.message || 'Unable to request password reset.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/90 relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Welcome Back!</h2>
            <p className="text-xs text-slate-500">Login to continue your placement preparation</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                {email && (
                  <span className={`text-[11px] font-medium ${isEmailValid ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isEmailValid ? '✓ Valid' : 'Invalid email'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  placeholder="e.g. candidate@domain.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="text-xs text-blue-600 hover:underline font-medium disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : <>Login <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">or continue with</span>
          </div>

          <div className="w-full">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-sm"
            >
              <FaGoogle className="text-red-500 text-sm" /> Continue with Google
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don't have an account? <Link to="/signup" state={location.state} className="text-blue-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
