'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, UserCircle, LogOut, Award, Sparkles, ChevronDown, Target } from 'lucide-react';
import { DisclaimerModal } from '@/components/legal/disclaimer-modal';
import { AuthModal } from '@/components/auth/auth-modal';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { FocusModeController } from '@/components/learning/focus-mode-controller';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function MainHeader() {
  const pathname = usePathname();
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/learning', label: 'LEARNING' },
    { href: '/test', label: 'TEST' },
    { href: '/instruction', label: 'INSTRUCTION' },
    { href: '/contact', label: 'SURVEY' },
  ];

  // Desktop Sliding Pill State & Refs
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Mobile Sliding Pill State & Refs
  const mobileItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [mobilePillStyle, setMobilePillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Recalculate sliding pill positions on route change or resize
  useEffect(() => {
    const activeIndex = navItems.findIndex((item) =>
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
    );

    if (activeIndex !== -1) {
      // Desktop pill
      const desktopEl = itemRefs.current[activeIndex];
      if (desktopEl) {
        setPillStyle({
          left: desktopEl.offsetLeft,
          width: desktopEl.offsetWidth,
          opacity: 1,
        });
      }

      // Mobile pill
      const mobileEl = mobileItemRefs.current[activeIndex];
      if (mobileEl) {
        setMobilePillStyle({
          left: mobileEl.offsetLeft,
          width: mobileEl.offsetWidth,
          opacity: 1,
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    const updateAuth = () => {
      setCurrentUser(clientStorage.getUser());
    };
    updateAuth();
    window.addEventListener('aiia_auth_changed', updateAuth);
    return () => window.removeEventListener('aiia_auth_changed', updateAuth);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b1329]/95 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Name */}
            <Link 
              href="/"
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-sky-500/20 border border-sky-400/40 shrink-0 group-hover:scale-105 transition-transform bg-[#0f172a] flex items-center justify-center">
                <img 
                  src="/aiia-logo.png?v=4" 
                  alt="AI in Action Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base md:text-lg tracking-tight text-white">
                    AI in Action
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono">
                    K.AI Labs
                  </span>
                </div>
                <p className="text-[11px] text-sky-300/80 font-normal hidden md:block">
                  Chuẩn Khung Năng Lực SFIA (v8)
                </p>
              </div>
            </Link>

            {/* Desktop Center Navigation Links WITH SMOOTH SLIDING WHITE PILL */}
            <nav className="relative hidden lg:flex items-center p-1 rounded-full bg-[#070d1e]/85 border border-slate-800/90 shadow-inner">
              
              {/* SMOOTH SLIDING WHITE ACTIVE PILL INDICATOR */}
              <div 
                className="absolute top-1 bottom-1 bg-white rounded-full shadow-md shadow-white/20 transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              />

              {navItems.map((item, idx) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    href={item.href}
                    className={`relative z-10 px-4 py-1.5 rounded-full text-xs transition-colors duration-250 tracking-wider select-none ${
                      isActive
                        ? 'text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white font-medium'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Action: Focus, NDA & Tài Khoản */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle compact />
              
              {/* Focus Mode Button */}
              <div className="hidden md:flex items-center">
                <FocusModeController />
              </div>

              {/* Legal Disclaimer Button */}
              <button
                onClick={() => setShowDisclaimerModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold transition shadow-sm"
                title="Tuyên bố pháp lý & Miễn trừ trách nhiệm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="tracking-wider">NDA</span>
              </button>

              {/* User / Account Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f172a] hover:bg-slate-800 border border-sky-500/50 text-xs text-sky-300 font-bold shadow-sm transition"
                  >
                    <UserCircle className="w-4 h-4 text-sky-400" />
                    <span className="max-w-[110px] truncate">{currentUser.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                      currentUser.role === 'admin' || currentUser.tier === 'Admin'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : currentUser.tier === 'Pro'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}>
                      {currentUser.role === 'admin' || currentUser.tier === 'Admin' ? 'Admin' : currentUser.tier || 'Free'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f172a]/95 border border-sky-500/40 p-4 shadow-2xl backdrop-blur-xl z-50 space-y-3">
                      <div className="border-b border-slate-800 pb-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-6 h-6 text-sky-400" />
                          <div>
                            <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#070d1e] border border-slate-800">
                          <span className="text-slate-400">Phân hạng:</span>
                          <span className="font-bold text-sky-400">
                            {currentUser.role === 'admin' || currentUser.tier === 'Admin'
                              ? '🛡️ Quản Trị Viên (Admin)'
                              : currentUser.tier === 'Pro'
                              ? '👑 Pro VIP (Học viên)'
                              : 'Free (Cộng đồng)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#070d1e] border border-slate-800">
                          <span className="text-slate-400">Cấp độ SFIA:</span>
                          <span className="font-bold text-emerald-400">{currentUser.currentLevel || 'SFIA L1 (Follow)'}</span>
                        </div>
                      </div>

                      {/* QUICK ROLE / TIER SWITCHER DEMO */}
                      <div className="p-2.5 rounded-xl bg-[#070d1e] border border-slate-800 space-y-1.5">
                        <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Trải nghiệm các loại tài khoản:</div>
                        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                          <button
                            onClick={() => {
                              const updated: StoredUser = { ...currentUser, tier: 'Free', plan: 'free', role: 'student' };
                              clientStorage.saveUser(updated);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                              currentUser.tier !== 'Pro' && currentUser.role !== 'admin'
                                ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-sm'
                                : 'bg-[#0b1329] text-slate-400 hover:text-white border-slate-800'
                            }`}
                          >
                            Free
                          </button>
                          <button
                            onClick={() => {
                              const updated: StoredUser = { ...currentUser, tier: 'Pro', plan: 'pro', role: 'student' };
                              clientStorage.saveUser(updated);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                              currentUser.tier === 'Pro' && currentUser.role !== 'admin'
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-sm'
                                : 'bg-[#0b1329] text-slate-400 hover:text-white border-slate-800'
                            }`}
                          >
                            Pro VIP
                          </button>
                          <button
                            onClick={() => {
                              const updated: StoredUser = { ...currentUser, tier: 'Admin', plan: 'admin', role: 'admin' };
                              clientStorage.saveUser(updated);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                              currentUser.role === 'admin' || currentUser.tier === 'Admin'
                                ? 'bg-red-500 text-white border-red-400 font-extrabold shadow-sm'
                                : 'bg-[#0b1329] text-slate-400 hover:text-white border-slate-800'
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <div className="pt-1 space-y-2">
                        <Link
                          href="/account"
                          onClick={() => setShowProfileMenu(false)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition uppercase tracking-wider shadow-sm"
                        >
                          <UserCircle className="w-3.5 h-3.5 text-slate-950" />
                          <span>Vào Trang Tài Khoản →</span>
                        </Link>

                        <button
                          onClick={() => {
                            clientStorage.clearUser();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Đăng Xuất Khỏi Thiết Bị</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 text-slate-200 hover:text-white text-xs font-bold transition shadow-sm"
                >
                  <UserCircle className="w-4 h-4 text-sky-400" />
                  <span className="uppercase tracking-wider">Tài Khoản</span>
                </button>
              )}

            </div>

          </div>
        </div>

        {/* MOBILE HORIZONTAL NAVIGATION MENU WITH SLIDING PILL */}
        <div className="lg:hidden border-t border-slate-800 bg-[#070d1e]/80">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="relative flex space-x-1.5 overflow-x-auto py-2 p-1">
              
              {/* Mobile Sliding White Active Pill */}
              <div 
                className="absolute top-2 bottom-2 bg-white rounded-full shadow-md shadow-white/20 transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                style={{
                  left: `${mobilePillStyle.left}px`,
                  width: `${mobilePillStyle.width}px`,
                  opacity: mobilePillStyle.opacity,
                }}
              />

              {navItems.map((item, idx) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    ref={(el) => { mobileItemRefs.current[idx] = el; }}
                    href={item.href}
                    className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs transition-colors duration-250 whitespace-nowrap tracking-wider select-none ${
                      isActive
                        ? 'text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white font-medium'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* DISCLAIMER MODAL */}
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
}
