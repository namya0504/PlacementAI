import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Toast Context ────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />,
  error:   <AlertCircle  className="w-4 h-4 text-red-600   shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
  info:    <Info          className="w-4 h-4 text-blue-500  shrink-0 mt-0.5" />,
};

const STYLES = {
  success: 'border-green-200 bg-green-50  text-green-900',
  error:   'border-red-200   bg-red-50    text-red-900',
  warning: 'border-amber-200 bg-amber-50  text-amber-900',
  info:    'border-blue-200  bg-blue-50   text-blue-900',
};

// Individual toast item
function ToastItem({ id, type = 'info', message, onDismiss }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-2.5 px-4 py-3 rounded-2xl border shadow-lg shadow-slate-200/60 text-xs font-semibold max-w-xs w-full pointer-events-auto animate-toast-in ${STYLES[type]}`}
    >
      {ICONS[type]}
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="opacity-60 hover:opacity-100 transition shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Toast container — fixed top-right, z-70
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div
      aria-label="Notifications"
      className="fixed top-5 right-5 z-[70] flex flex-col gap-2.5 pointer-events-none"
      style={{ maxWidth: '20rem' }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]); // cap at 5
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg, duration)         => addToast(msg, 'success', duration),
    error:   (msg, duration = 6000)  => addToast(msg, 'error',   duration),
    warning: (msg, duration)         => addToast(msg, 'warning', duration),
    info:    (msg, duration)         => addToast(msg, 'info',    duration),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
