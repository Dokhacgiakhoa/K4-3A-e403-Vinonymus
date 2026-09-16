'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Home, 
  Flame, 
  Bot, 
  GraduationCap, 
  ClipboardCheck, 
  Cpu, 
  BookOpen, 
  Library,
  Compass,
  Settings, 
  LogOut, 
  ShieldAlert, 
  Crown,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { FocusModeButton } from '@/components/learning/focus-mode-controller';
import { DisclaimerModal } from '@/components/legal/disclaimer-modal';

interface AppSidebarProps {
  user: StoredUser;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);

  const mainNav = [
    { href: '/', label: 'Trang Chủ', icon: Home },
    { href: '/learning', label: 'Thư Viện Học Tập', icon: Library },
    { href: '/planner', label: 'Study Planner', icon: Compass },
    { href: '/learning?mode=ai_roadmap', label: 'Lộ Trình AI Mentor', icon: Bot, isPro: true },
    { href: '/test', label: 'Khảo Thí SFIA', icon: ClipboardCheck },
    { href: '/architecture', label: 'Kiến Trúc Kỹ Thuật', icon: Cpu },
    { href: '/instruction', label: 'Hướng Dẫn Học', icon: Compass },
  ];

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?')) {
      clientStorage.clearUser();
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/learning') {
      return (pathname === '/learning' || pathname.startsWith('/learning/')) && mode !== 'ai_roadmap' && mode !== 'gamified';
    }
    if (href === '/learning?mode=ai_roadmap') {
      return pathname === '/learning' && (mode === 'ai_roadmap' || mode === 'gamified');
    }
    const baseHref = href.split('?')[0] || href;
    return pathname.startsWith(baseHref);
  };

  return (
    <>
      <aside 
        className={`sticky top-0 h-screen shrink-0 bg-[#080f24]/80 backdrop-blur-xl border-r border-slate-700/60 flex flex-col justify-between z-40 font-sans select-none transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & TOGGLE BUTTON                                             */}
        {/* ========================================================================= */}
        <div className={`border-b border-slate-800/60 flex items-center shrink-0 ${
          isCollapsed ? 'p-3 justify-center' : 'p-3.5 justify-between gap-2'
        }`}>
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
                <img 
                  src="/aiia-logo.png" 
                  alt="AIIA Logo" 
                  className="w-8 h-8 rounded-lg object-contain bg-[#0b1329] p-0.5 shrink-0" 
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-sm tracking-tight truncate">TỰ HỌC AI</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono text-sky-300 bg-sky-500/15 border border-sky-500/30 shrink-0">
                      K.AI Labs
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate font-mono">
                    Chuẩn khung năng lực SFIA (v8)
                  </div>
                </div>
              </Link>

              {/* Nút thu gọn phẳng, không viền */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Thu gọn menu"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Nút mở rộng phẳng, không viền */
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              title="Mở rộng menu"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN NAVIGATION LIST                                                   */}
        {/* ========================================================================= */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar space-y-1 ${
          isCollapsed ? 'p-1.5' : 'p-2.5'
        }`}>
          {mainNav.map((item, idx) => {
            const active = isActiveRoute(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center rounded-xl text-sm transition-colors cursor-pointer ${
                  isCollapsed
                    ? 'w-10 h-10 mx-auto justify-center p-0'
                    : 'justify-between gap-3 px-3 py-2.5'
                } ${
                  active
                    ? 'bg-sky-500/15 text-sky-300 font-bold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${
                    active ? 'text-sky-400' : 'text-slate-400'
                  }`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.isPro && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    user.plan === 'pro'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    PRO
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM UTILITIES & USER PROFILE                                        */}
        {/* ========================================================================= */}
        <div className={`border-t border-slate-700/60 bg-[#060c1d]/75 backdrop-blur-xl space-y-1 shrink-0 ${
          isCollapsed ? 'p-1.5' : 'p-2.5'
        }`}>
          
          {/* Admin Management Link (Chỉ hiển thị cho Admin) */}
          {((user.role as string) === 'admin' || (user.tier as string) === 'Admin') && (
            <Link
              href="/admin"
              className={`flex items-center rounded-xl text-sm transition-colors ${
                isCollapsed
                  ? 'w-10 h-10 mx-auto justify-center p-0'
                  : 'gap-2.5 px-3 py-2.5'
              } ${
                pathname === '/admin'
                  ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                  : 'text-red-400/80 hover:text-red-300 hover:bg-red-950/30 border border-transparent font-medium'
              }`}
              title={isCollapsed ? "Quản Trị Hệ Thống" : undefined}
            >
              <ShieldAlert className="w-[18px] h-[18px] text-red-400 shrink-0" />
              {!isCollapsed && <span>Quản Trị Hệ Thống</span>}
            </Link>
          )}

          {/* Account & Profile link */}
          <Link
            href="/account"
            className={`flex items-center rounded-xl text-sm transition-colors ${
              isCollapsed
                ? 'w-10 h-10 mx-auto justify-center p-0'
                : 'gap-2.5 px-3 py-2.5'
            } ${
              pathname === '/account'
                ? 'bg-sky-500/15 text-sky-300 font-bold border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium'
            }`}
            title={isCollapsed ? "Hồ Sơ & Tài Khoản" : undefined}
          >
            <Settings className={`w-[18px] h-[18px] shrink-0 ${pathname === '/account' ? 'text-sky-400' : 'text-slate-400'}`} />
            {!isCollapsed && <span>Hồ Sơ & Tài Khoản</span>}
          </Link>

          {/* Legal link - PHẲNG, KHÔNG KHUNG */}
          <button
            type="button"
            onClick={() => setShowDisclaimerModal(true)}
            className={`flex items-center rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors text-left cursor-pointer border border-transparent font-medium ${
              isCollapsed
                ? 'w-10 h-10 mx-auto justify-center p-0'
                : 'w-full gap-2.5 px-3 py-2.5'
            }`}
            title={isCollapsed ? "Miễn Trừ NDA & Bản Quyền" : undefined}
          >
            <ShieldAlert className="w-[18px] h-[18px] text-amber-400/80 shrink-0" />
            {!isCollapsed && <span>Miễn Trừ NDA & Bản Quyền</span>}
          </button>

          {/* Focus Mode Button - PHẲNG, KHÔNG KHUNG */}
          <div className="pt-0.5">
            <FocusModeButton isCompact={isCollapsed} />
          </div>

          {/* User Profile Bar */}
          <div className={`pt-2 border-t border-slate-800/60 flex items-center ${
            isCollapsed ? 'flex-col gap-1.5 justify-center' : 'justify-between gap-2 px-1'
          }`}>
            <Link 
              href="/account"
              className={`flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity ${
                isCollapsed ? 'justify-center' : 'flex-1'
              }`}
              title={`Tài khoản: ${user.name}`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-200 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 font-mono">
                    {(user.role as string) === 'admin' || (user.tier as string) === 'Admin' ? (
                      <span className="text-red-400 font-bold">ADMIN CONSOLE</span>
                    ) : user.plan === 'pro' || user.tier === 'Pro' ? (
                      <span className="text-amber-400 font-medium">PRO MEMBER</span>
                    ) : (
                      <span>FREE PLAN</span>
                    )}
                  </div>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer shrink-0"
              title="Đăng xuất"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </div>

        </div>
      </aside>

      {/* DISCLAIMER MODAL */}
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
    </>
  );
}
