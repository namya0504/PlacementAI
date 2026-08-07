import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Also check if timer mock banner should show after 4s for demonstration
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('placement_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('PlacementAI Web App installed to your device home screen!');
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('placement_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl p-5 shadow-2xl border border-slate-200/80 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 font-outfit text-base">Install PlacementAI</h4>
            <p className="text-xs text-slate-500">Add to your home screen for a better app experience.</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleInstall}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition"
        >
          <Download className="w-4 h-4" /> Install App
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
