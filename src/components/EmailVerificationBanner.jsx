import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';

export default function EmailVerificationBanner() {
  const { currentUser, updateProfileData } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info' | 'success' | 'error'

  if (!currentUser || currentUser.emailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage('');
      const res = await API.resendVerification({ email: currentUser.email });
      try {
        const { triggerFirebaseEmailVerification } = await import('../services/firebase/authService');
        await triggerFirebaseEmailVerification();
      } catch (clientMailErr) {
        // Handled silently
      }
      setMessageType('success');
      setMessage(res.message || 'Verification email sent to your inbox! Please check your email.');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Failed to send verification link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVerify = async () => {
    try {
      setLoading(true);
      setMessage('');
      await API.verifyEmail();
      updateProfileData({ emailVerified: true });
      setMessageType('success');
      setMessage('Email verified successfully! You have full access.');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Verification update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-300/40 text-amber-900 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Mail className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Your email <strong className="font-semibold text-slate-900">{currentUser.email}</strong> is unverified.
          </span>
          {message && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                messageType === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : messageType === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {message}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResend}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-50 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 text-xs"
          >
            {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
            Resend Email
          </button>

          <button
            onClick={handleSimulateVerify}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 text-xs"
          >
            Mark Verified
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-900 p-1 rounded-md transition-colors"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
