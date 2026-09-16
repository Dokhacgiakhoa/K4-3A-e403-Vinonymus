'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BookOpen, Bot, Key, Smartphone, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { clientStorage, type ApiKeyHealthStatus } from '@/lib/client-storage';

function MobileBottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') || 'guidebook' : 'guidebook';

  const [keyStatus, setKeyStatus] = useState<ApiKeyHealthStatus>('missing');

  const updateKeyStatus = () => {
    setKeyStatus(clientStorage.getApiKeyHealthStatus());
  };

  useEffect(() => {
    updateKeyStatus();
    const handleCustomEvent = () => updateKeyStatus();
    window.addEventListener('aiia_key_status_changed', handleCustomEvent);
    window.addEventListener('storage', handleCustomEvent);

    return () => {
      window.removeEventListener('aiia_key_status_changed', handleCustomEvent);
      window.removeEventListener('storage', handleCustomEvent);
    };
  }, []);

  const isSettingsActive = pathname === '/settings';
  const isChatActive = pathname === '/' && currentTab === 'chat';
  const isShortcutActive = pathname === '/' && currentTab === 'shortcut';
  const isGuidebookActive = pathname === '/' && (currentTab === 'guidebook' || (!currentTab && !isSettingsActive));

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-3 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] grid grid-cols-4 gap-1 shadow-2xl">
      {/* 1. TRANG SỔ TAY */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all duration-200 border ${
          isGuidebookActive
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        }`}
      >
        <BookOpen className="w-4.5 h-4.5 shrink-0" />
        <span className="text-[10px] tracking-tight">Sổ tay</span>
      </Link>

      {/* 2. TRANG HỎI K.AI */}
      <Link
        href="/?tab=chat"
        className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all duration-200 border ${
          isChatActive
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
            : 'border-transparent text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60'
        }`}
      >
        <Bot className="w-4.5 h-4.5 shrink-0" />
        <span className="text-[10px] tracking-tight">Hỏi K.AI</span>
      </Link>

      {/* 3. TRANG API KEY */}
      <Link
        href="/settings"
        className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all duration-200 border ${
          isSettingsActive
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
            : keyStatus === 'missing'
            ? 'border-transparent text-rose-400 hover:bg-rose-500/10'
            : keyStatus === 'error'
            ? 'border-transparent text-amber-400 hover:bg-amber-500/10'
            : 'border-transparent text-emerald-400 hover:bg-emerald-500/10'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Key className="w-4.5 h-4.5 shrink-0" />
          {keyStatus === 'missing' && (
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
          {keyStatus === 'error' && (
            <AlertTriangle className="absolute -top-1 -right-1.5 w-3 h-3 text-amber-400 animate-bounce" />
          )}
          {keyStatus === 'ok' && (
            <CheckCircle2 className="absolute -top-1 -right-1.5 w-3 h-3 text-emerald-400" />
          )}
        </div>
        <span className="text-[10px] tracking-tight truncate">
          {keyStatus === 'missing' ? 'Thiếu Key' : keyStatus === 'error' ? 'Key lỗi' : 'API Key'}
        </span>
      </Link>

      {/* 4. TRANG PHÍM TẮT */}
      <Link
        href="/?tab=shortcut"
        className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all duration-200 border ${
          isShortcutActive
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        }`}
      >
        <Smartphone className="w-4.5 h-4.5 shrink-0" />
        <span className="text-[10px] tracking-tight">Phím tắt</span>
      </Link>
    </nav>
  );
}

export function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavContent />
    </Suspense>
  );
}
