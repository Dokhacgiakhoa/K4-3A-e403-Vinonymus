'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ApiKeyManager } from '@/components/settings/api-key-manager';
import { MobileBottomNav } from '@/components/navigation/mobile-bottom-nav';
import { PwaShortcutButton } from '@/components/pwa/pwa-shortcut-button';

export default function SettingsPage() {
  return (
    <main className="h-dvh h-[100dvh] w-screen overflow-hidden bg-slate-950/20 backdrop-blur-xs text-slate-100 flex flex-col relative font-sans">
      {/* Top Main Navigation Header */}
      <header className="h-14 bg-slate-950/50 border-b border-slate-800/60 px-3 sm:px-4 md:px-6 flex items-center justify-between shrink-0 z-20 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity min-w-0">
          <img src="/aiia-logo.png?v=4" alt="AI in Action Logo" className="w-8 h-8 rounded-xl object-cover shadow-md border border-cyan-500/30 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight truncate">
              Sổ tay AI Thực chiến
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <span className="text-[10px] sm:text-xs text-slate-400/80 font-medium tracking-wide bg-slate-900/60 border border-slate-800/80 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl backdrop-blur-md whitespace-nowrap">
            Cập nhật cuối: 06/08/2026
          </span>
          <Link
            href="/"
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 hover:text-white text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span>Trở về</span>
          </Link>
        </div>
      </header>

      {/* Main Settings Content (Chỉ cuộn khu vực này, cố định Header & Bottom Nav) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 pb-28 lg:pb-8">
        <ApiKeyManager />
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (LUÔN CỐ ĐỊNH Ở ĐÁY MÀN HÌNH) */}
      <MobileBottomNav />
    </main>
  );
}
