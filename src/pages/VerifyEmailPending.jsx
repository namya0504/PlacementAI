import React, { useState, useEffect, useRef } from 'react';
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
  const verificationLink = location.state?.verificationLink || currentUser?.verificationLink;

  // If user is already verified (e.g. navigated here manually after verifying),
  // redirect them to onboarding or dashboard immediately.
  useEffect(() => {
    if (currentUser?.emailVerified === true) {
      const dest = (currentUser.onboarding?.status === 'not_started' || currentUser.onboarding?.status === 'in_progress')
        ? '/onboarding'
        : '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [currentUser, navigate]);

  const [resendStatus, setResendStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [resendMsg, setResendMsg] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // seconds remaining
  const cooldownRef = useRef(null);

  // Start 60-second cooldown after a send so the button re-enables automatically
  const startCooldown = () => {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  /**
   * Resend flow:
   * 1. Try Firebase client SDK (sendFirebaseVerificationEmail) — works when the user
   *    has an active Firebase client session (signed in right after signup on this device).
   * 2. Fall back to backend API (POST /auth/resend-verification) which uses
   *    Firebase Admin generateEmailVerificationLink + SMTP transporter.
   */
  const handleResend = async () => {
    setResendStatus('sending');
    setResendMsg('');
    try {
      const { sendFirebaseVerificationEmail } = await import('../services/firebase/authService');
      const fbResult = await sendFirebaseVerificationEmail();

      if (fbResult.success) {
        if (fbResult.alreadyVerified) {
          // User is already verified — just go to onboarding
          updateCurrentUser({ emailVerified: true });
          navigate('/onboarding', { replace: true });
          return;
        }
        setResendStatus('sent');
        setResendMsg('Verification email sent! Please check your inbox (and spam folder).');
        startCooldown();
        return;
      }

      // Firebase client has no session — fall back to backend
      if (fbResult.error === 'auth/too-many-requests') {
        setResendStatus('error');
        setResendMsg(fbResult.message || 'Too many requests. Please wait a few minutes before trying again.');
        return;
      }

      // no_session or any other Firebase error: use backend SMTP path
      const res = await API.resendVerification({ email });
      setResendStatus('sent');
      setResendMsg('Verification email sent! Please check your inbox (and spam folder).');
      startCooldown();
    } catch (err) {
      setResendStatus('error');
      setResendMsg(err.message || 'Failed to resend email. Please try again.');
    }
  };

  /**
   * Verification check flow:
   * 1. First check Firebase client (user.reload() + emailVerified) — instant, no round-trip.
   * 2. If client says verified OR has no session, hit /auth/me which syncs Firebase Admin → Firestore.
   */
  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    setResendMsg('');
    try {
      // Step 1: Check via Firebase client SDK (reload from Firebase Auth directly)
      const { checkFirebaseEmailVerified } = await import('../services/firebase/authService');
      const clientCheck = await checkFirebaseEmailVerified();

      if (clientCheck.verified) {
        // Firebase client confirms verified — hit /auth/me to sync Firestore then navigate
        const user = await API.getCurrentUser();
        updateCurrentUser({ emailVerified: true, ...(user || {}) });
        navigate('/onboarding', { replace: true });
        return;
      }

      // Step 2: No client session or not yet verified — poll backend which syncs Firebase Admin → Firestore
      const user = await API.getCurrentUser();
      if (user?.emailVerified) {
        updateCurrentUser({ emailVerified: true });
        navigate('/onboarding', { replace: true });
      } else {
        setResendMsg('Email not verified yet. Please click the link in your inbox, then come back and try again.');
      }
    } catch (err) {
      setResendMsg(err.message || 'Could not check verification status. Please try again.');
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleSimulateVerify = async () => {
    try {
      setCheckingVerification(true);
      setResendMsg('');
      await API.verifyEmail();
      updateCurrentUser({ emailVerified: true });
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setResendMsg(err.message || 'Verification update failed.');
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#EAEBF4] space-y-6 text-center">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto shadow-xs">
            <MailCheck className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Check Your Inbox</h2>
            <p className="text-sm text-slate-500">
              A verification link has been sent to
            </p>
            <p className="text-sm font-bold text-[#7C3AED] break-all">{email}</p>
            <p className="text-xs text-slate-400 pt-1">
              Click the <strong>Verify My Email Address</strong> button in that email, then come back here and press <em>"I've verified my email"</em>.
            </p>
            <p className="text-xs text-slate-400">
              Can't find it? Check your <strong>spam / junk</strong> folder.
            </p>
          </div>

          {/* Feedback message */}
          {resendMsg && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2 text-left ${
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
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checkingVerification
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Checking...</>
                : <>I've verified my email <ArrowRight className="w-4 h-4" /></>}
            </button>

            <button
              onClick={handleResend}
              disabled={resendStatus === 'sending' || resendCooldown > 0}
              className="w-full py-2.5 rounded-xl border border-[#EAEBF4] text-slate-700 font-semibold text-sm hover:bg-purple-50 hover:text-[#7C3AED] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {resendStatus === 'sending'
                ? <><RefreshCw className="w-4 h-4 animate-spin text-[#7C3AED]" /> Sending...</>
                : resendCooldown > 0
                ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resend in {resendCooldown}s</>
                : <>Resend verification email</>}
            </button>

            {verificationLink && (
              <a
                href={verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-purple-200 bg-purple-50/70 text-[#7C3AED] font-semibold text-xs hover:bg-purple-100 transition flex items-center justify-center gap-1.5"
              >
                Open Verification Link (Direct) <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}

            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={handleSimulateVerify}
                disabled={checkingVerification}
                className="w-full py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition flex items-center justify-center gap-1.5"
              >
                ⚡ Instant Verify (Dev Mode)
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Wrong account?{' '}
            <button onClick={handleLogout} className="text-[#7C3AED] font-semibold hover:underline">
              Sign out and start over
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
