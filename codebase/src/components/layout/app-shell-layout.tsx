'use client';

import React, { useState, useEffect } from 'react';
import { MainHeader } from '@/components/layout/main-header';
import { MainFooter } from '@/components/layout/main-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { FloatingAiWidget } from '@/components/chat/floating-ai-widget';
import { GlobalFocusOverlay } from '@/components/learning/focus-mode-controller';
import { clientStorage, type StoredUser } from '@/lib/client-storage';

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const syncUser = () => {
      setCurrentUser(clientStorage.getUser());
    };
    syncUser();
    window.addEventListener('aiia_auth_changed', syncUser);
    return () => window.removeEventListener('aiia_auth_changed', syncUser);
  }, []);

  // 1. KHI CHƯA ĐĂNG NHẬP (GUEST): Dùng Top Header ngang truyền thống
  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-slate-100 font-sans">
        <MainHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
          {children}
        </main>
        <MainFooter />
        <FloatingAiWidget />
        <GlobalFocusOverlay />
      </div>
    );
  }

  // 2. KHI ĐÃ ĐĂNG NHẬP (FREE / PRO / ADMIN): BẬT NGAY SIDEBAR TRÁI, KHÔNG DÙNG TOP HEADER CỦA GUEST
  return (
    <div className="min-h-screen flex bg-transparent text-slate-100 font-sans">
      {/* LEFT SIDEBAR CHUẨN MỰC */}
      <AppSidebar user={currentUser} />

      {/* MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 space-y-6">
          {children}
        </main>
        <MainFooter />
      </div>

      {/* FLOATING AI ASSISTANT & GLOBAL FOCUS OVERLAYS */}
      <FloatingAiWidget />
      <GlobalFocusOverlay />
    </div>
  );
}
