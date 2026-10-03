import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Sparkles, Smartphone } from 'lucide-react';
import sound from '../../utils/soundFX';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Ilova brauzeringiz menyusi orqali (Bosh ekranga qo'shish / Установить приложение) o'rnatilishi mumkin.");
      return;
    }
    sound.playSuccess();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Alert Indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-rose-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-lg animate-fadeIn">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Siz offline rejimdasiz. MODERNO ilovasi lokal keshdan ishlamoqda.</span>
        </div>
      )}

      {/* Floating PWA Install Prompt Banner */}
      {showInstall && (
        <div className="fixed bottom-20 left-4 z-40 max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-indigo-500/30 p-3.5 shadow-2xl flex items-center justify-between gap-3 text-slate-800 dark:text-slate-100 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold">MODERNO ilovasini o'rnatish</p>
              <p className="text-[11px] text-slate-400">Tezkor ochilish va offline rejim</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition transform active:scale-95 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> O'rnatish
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
