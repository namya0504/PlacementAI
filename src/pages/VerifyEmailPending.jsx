import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function VerifyEmailPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const email = location.state?.email || currentUser?.email || 'your email address';

  const [resendStatus, setResendStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [resendMsg, setResendMsg] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);

  const handleResend = async () => {
    setResendStatus('sending');
    setResendMsg('');
    try {
      await API.resendVerification();
      setResendStatus('sent');
      setResendMsg('Verification email sent! Please check your inbox and spam folder.');
    } catch (err) {
      setResendStatus('error');
      setResendMsg(err.message || 'Failed to resend email. Please try again.');
    }
  };

  // Poll /auth/me to see if the backend has picked up the Firebase verification signal
  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    setResendMsg('');
    try {
      const user = await API.getCurrentUser();
      if (user?.emailVerified) {
        // Update AuthContext + localStorage so the rest of the app sees verified=true
        updateCurrentUser({ emailVerified: true });
        navigate('/onboarding', { replace: true });
      } else {
        setResendMsg('Email not verified yet. Please click the link in your inbox, then try again.');
      }
    } catch (err) {
      setResendMsg(err.message || 'Could not check verification status. Please try again.');
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/90 space-y-6 text-center">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <MailCheck className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Verify Your Email</h2>
            <p className="text-sm text-slate-500">
              We've sent a verification link to
            </p>
            <p className="text-sm font-bold text-purple-700 break-all">{email}</p>
            <p className="text-xs text-slate-400 pt-1">
              Click the link in that email to activate your account, then come back here.
            </p>
          </div>

          {/* Feedback message */}
          {resendMsg && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 text-left ${
              resendStatus === 'sent'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {resendStatus === 'sent'
                ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                : <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />}
              <span>{resendMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleCheckVerification}
              disabled={checkingVerification}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checkingVerification
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Checking...</>
                : <>I've verified my email <ArrowRight className="w-4 h-4" /></>}
            </button>

            <button
              onClick={handleResend}
              disabled={resendStatus === 'sending' || resendStatus === 'sent'}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {resendStatus === 'sending'
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</>
                : resendStatus === 'sent'
                ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Email sent</>
                : <>Resend verification email</>}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Wrong account?{' '}
            <button onClick={handleLogout} className="text-purple-600 font-semibold hover:underline">
              Sign out and start over
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
