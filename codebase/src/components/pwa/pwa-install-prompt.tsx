'use client';

import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="lg:hidden fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 bg-gradient-to-r from-blue-900/90 to-cyan-900/90 backdrop-blur-md border border-cyan-500/40 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-white transition-all animate-bounce-subtle">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-cyan-300" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Cài đặt AIIA Notebook</h4>
          <p className="text-xs text-slate-300">Thêm Sổ tay vào màn hình chính để tra cứu cực nhanh!</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-medium rounded-lg shadow flex items-center gap-1 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Cài ngay
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
