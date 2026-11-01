import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isAppleMobile = /iPad|iPhone|iPod/.test(window.navigator.userAgent)
      || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    let wasDismissed = false;
    try {
      wasDismissed = localStorage.getItem('placement_pwa_dismissed') === 'true';
    } catch {
      // Keep install guidance available when browser storage is disabled.
    }
    if (isStandalone || wasDismissed) return undefined;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    const installedHandler = () => setShowBanner(false);

    setIsIOS(isAppleMobile);
    if (isAppleMobile) setShowBanner(true);
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } finally {
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } else if (isIOS) {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('placement_pwa_dismissed', 'true');
    } catch {
      // Dismissing the banner should still work when browser storage is disabled.
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl p-5 shadow-2xl border border-slate-200/80 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] flex items-center justify-center text-white shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 font-outfit text-base">Install PlacementAI</h4>
            <p className="text-xs text-slate-500">Add to your home screen for a better app experience.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          aria-label="Dismiss install suggestion"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showInstructions && isIOS && (
        <p className="mb-3 rounded-lg bg-[#EDE9FE] px-3 py-2 text-xs text-[#7C3AED]" role="status">
          Tap Share, then choose “Add to Home Screen”.
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleInstall}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 hover:shadow-lg transition"
        >
          <Download className="w-4 h-4" /> {isIOS ? 'How to install' : 'Install App'}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
