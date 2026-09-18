'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MainHeader } from '@/components/layout/main-header';
import { MainFooter } from '@/components/layout/main-footer';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { FloatingAiWidget } from '@/components/chat/floating-ai-widget';
import { GlobalFocusOverlay } from '@/components/learning/focus-mode-controller';
import { clientStorage, type StoredUser } from '@/lib/client-storage';

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const isFullWidthPage = pathname === '/about';

  useEffect(() => {
    setMounted(true);
    const syncUser = () => {
      setCurrentUser(clientStorage.getUser());
    };
    syncUser();
    window.addEventListener('aiia_auth_changed', syncUser);
    return () => window.removeEventListener('aiia_auth_changed', syncUser);
  }, []);

  // Khi đang xem Slide (/about): bung toàn bộ màn hình, không bị header/footer bóp nghẹt
  if (isFullWidthPage) {
    return (
      <div className="min-h-screen w-full bg-[#070d1e] text-slate-100 font-sans flex flex-col">
        <main className="flex-1 w-full p-0 m-0 overflow-x-hidden flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  // 1. KHI CHƯA ĐĂNG NHẬP (GUEST): Dùng Top Header ngang truyền thống
  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-100 font-sans">
        <MainHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
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
    <div className="min-h-screen flex bg-transparent text-slate-900 dark:text-slate-100 font-sans">
      {/* LEFT SIDEBAR CHUẨN MỰC */}
      <AppSidebar user={currentUser} />

      {/* MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className={`flex-1 w-full mx-auto space-y-6 ${
          isFullWidthPage ? 'px-2 sm:px-4 pt-2 pb-8' : 'max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12'
        }`}>
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
