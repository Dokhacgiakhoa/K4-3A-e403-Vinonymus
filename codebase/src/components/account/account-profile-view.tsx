'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Key, 
  CreditCard, 
  LogOut, 
  Clock, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  ArrowRight,
  QrCode,
  Layers,
  FileCheck,
  Check,
  Bot,
  TrendingUp
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { ApiKeyManager } from '@/components/settings/api-key-manager';
import { AuthModal } from '@/components/auth/auth-modal';
import { SFIA_COMMUNITY_DATA } from '@/data/sfia-community-data';
import { UserProfileEditor } from '@/components/settings/user-profile-editor';
import { FocusModeController } from '@/components/learning/focus-mode-controller';
import { StudyAnalyticsDashboard } from '@/components/account/study-analytics-dashboard';
import { CertificateModal } from '@/components/learning/certificate-modal';

export function AccountProfileView() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ANALYTICS' | 'CERTIFICATES' | 'OVERVIEW' | 'TESTS' | 'API_KEYS' | 'PRO_UPGRADE'>('PROFILE');
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const update = () => {
      setCurrentUser(clientStorage.getUser());
    };
    update();
    window.addEventListener('aiia_auth_changed', update);
    return () => window.removeEventListener('aiia_auth_changed', update);
  }, []);

  const handleLogout = () => {
    clientStorage.clearUser();
    setCurrentUser(null);
  };

  const handleUpgradeToProMock = () => {
    if (!currentUser) return;
    const updated: StoredUser = {
      ...currentUser,
      tier: 'Pro'
    };
    clientStorage.saveUser(updated);
    setCurrentUser(updated);
  };

  // NẾU CHƯA ĐĂNG NHẬP
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 font-sans animate-fadeIn">
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => setCurrentUser(user as StoredUser)}
        />

        <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-8 sm:p-12 text-center backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/30 mx-auto flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
            <UserCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329] border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Hồ Sơ Năng Lực Kỹ Sư AI Thực Chiến</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
              Bạn Chưa Đăng Nhập
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Đăng nhập để theo dõi lộ trình tự học 12 Modules SFIA, lưu kết quả 5 bài Mock Exam và thiết lập cấu hình API Key cá nhân.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              <span>Đăng Nhập Hoặc Đăng Ký Ngay →</span>
            </button>
            <Link
              href="/learning"
              className="px-6 py-3 rounded-full bg-[#0b1329] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider transition"
            >
              <span>Xem Giáo Trình Mở</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ĐÃ ĐĂNG NHẬP
  const mockInvoiceCode = `PRO-${currentUser.email.split('@')[0]?.toUpperCase() || 'USER'}-2026`;
  const amount = billingCycle === 'monthly' ? 99000 : 999000;
  const vietQrUrl = `https://img.vietqr.io/image/MB-0388888888-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(mockInvoiceCode)}&accountName=AI%20IN%20ACTION%20LABS`;

  return (
    <div className="w-full space-y-6 font-sans animate-fadeIn">
      
      {/* 1. PROFILE HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* User Info Avatar */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 p-0.5 shadow-xl shadow-sky-500/20 shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0b1329] flex items-center justify-center text-sky-300 text-2xl sm:text-3xl font-bold font-mono uppercase">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight truncate">
                  {currentUser.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border font-mono ${
                  currentUser.tier === 'Pro' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                }`}>
                  {currentUser.tier === 'Pro' ? '★ Học Viên Pro VIP' : 'Thành Viên Free'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{currentUser.email}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentUser.currentLevel || 'SFIA Level 1 (Follow)'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Focus Mode Button */}
            <FocusModeController />

            {currentUser.tier !== 'Pro' && (
              <button
                onClick={() => setActiveTab('PRO_UPGRADE')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Nâng Cấp Pro VIP</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-[#0b1329] hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất</span>
            </button>
          </div>

        </div>

        {/* 5 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8">
          <div 
            onClick={() => setActiveTab('OVERVIEW')}
            className="p-4 rounded-2xl bg-[#0b1329]/65 border border-sky-500/30 backdrop-blur-xl shadow-lg text-center cursor-pointer hover:border-sky-400/80 hover:scale-[1.02] transition-all"
            title="Nhấn để xem Tiến độ lộ trình"
          >
            <div className="text-2xl font-bold text-sky-400 font-mono">12/12</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium flex items-center justify-center gap-1">
              <span>Modules SFIA</span>
              <span className="text-[10px] text-slate-400 font-mono">→</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('ANALYTICS')}
            className="p-4 rounded-2xl bg-[#0b1329]/65 border border-emerald-500/30 backdrop-blur-xl shadow-lg text-center cursor-pointer hover:border-emerald-400/80 hover:scale-[1.02] transition-all"
            title="Nhấn để xem Dashboard Chuỗi Streak chi tiết"
          >
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              <span className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>3 Ngày</span>
              </span>
            </div>
            <div className="text-xs text-emerald-300 mt-0.5 font-medium flex items-center justify-center gap-1">
              <span>Chuỗi Học Liên Tục</span>
              <span className="text-[10px] text-slate-400 font-mono">→</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('ANALYTICS')}
            className="p-4 rounded-2xl bg-[#0b1329]/65 border border-teal-500/30 backdrop-blur-xl shadow-lg text-center cursor-pointer hover:border-teal-400/80 hover:scale-[1.02] transition-all"
            title="Nhấn để xem Bộ đếm 1000h chi tiết"
          >
            <div className="text-2xl font-bold text-teal-400 font-mono">12.5h / 1000h</div>
            <div className="text-xs text-teal-300 mt-0.5 font-medium flex items-center justify-center gap-1">
              <span>Đã Tích Lũy 1000h</span>
              <span className="text-[10px] text-slate-400 font-mono">→</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('TESTS')}
            className="p-4 rounded-2xl bg-[#0b1329]/65 border border-sky-500/30 backdrop-blur-xl shadow-lg text-center cursor-pointer hover:border-sky-400/80 hover:scale-[1.02] transition-all"
            title="Nhấn để xem 5 bài test"
          >
            <div className="text-2xl font-bold text-sky-300 font-mono">5/5 Test</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium flex items-center justify-center gap-1">
              <span>Đề Thi Sẵn Sàng</span>
              <span className="text-[10px] text-slate-400 font-mono">→</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('CERTIFICATES')}
            className="p-4 rounded-2xl bg-[#0b1329]/65 border border-amber-500/40 backdrop-blur-xl shadow-lg text-center cursor-pointer hover:border-amber-400 hover:scale-[1.02] transition-all col-span-2 sm:col-span-1"
            title="Nhấn để xem Chứng chỉ SFIA"
          >
            <div className="text-2xl font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-amber-400" />
              <span>SFIA v8</span>
            </div>
            <div className="text-xs text-amber-300 mt-0.5 font-medium flex items-center justify-center gap-1">
              <span>Chứng Chỉ & Thành Tựu</span>
              <span className="text-[10px] text-amber-400 font-mono">→</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. NAVIGATION TABS - 7 TABS BỐ TRÍ KHOA HỌC */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center ${
            activeTab === 'PROFILE'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <UserCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">Hồ Sơ & Năng Lực AI</span>
        </button>

        <button
          onClick={() => setActiveTab('CERTIFICATES')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center ${
            activeTab === 'CERTIFICATES'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-400/25'
              : 'bg-[#0f172a] text-amber-300 hover:text-white hover:bg-slate-800/80 border border-amber-500/30'
          }`}
        >
          <Award className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="truncate">Chứng Chỉ & Thành Tựu</span>
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center ${
            activeTab === 'ANALYTICS'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="truncate">Thống Kê 1000h & Streak</span>
        </button>

        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center ${
            activeTab === 'OVERVIEW'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span className="truncate">Tiến Độ 12 Modules SFIA</span>
        </button>

        <button
          onClick={() => setActiveTab('TESTS')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center ${
            activeTab === 'TESTS'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span className="truncate">Lịch Sử Bài Test & Điểm</span>
        </button>

        <button
          onClick={() => setActiveTab('API_KEYS')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center ${
            activeTab === 'API_KEYS'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <Key className="w-4 h-4 shrink-0" />
          <span className="truncate">Cấu Hình API Key (BYOK)</span>
        </button>

        <button
          onClick={() => setActiveTab('PRO_UPGRADE')}
          className={`px-3.5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center col-span-2 sm:col-span-1 lg:col-span-2 ${
            activeTab === 'PRO_UPGRADE'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-400/20'
              : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span className="truncate">Gói Pro & Thanh Toán VietQR</span>
        </button>
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB 0: PROFILE & AI COMPETENCY VERIFICATION */}
      {activeTab === 'PROFILE' && (
        <div className="space-y-6">
          <UserProfileEditor onLogout={handleLogout} />
        </div>
      )}

      {/* TAB: CERTIFICATES & SFIA RECOGNITION */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                  Chứng Nhận Chuẩn Quốc Tế
                </span>
                <span className="text-xs text-slate-400 font-mono">SFIA v8 Level 4</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                Chứng Chỉ Hoàn Thành Kỹ Sư AI Thực Chiến & Thành Tựu
              </h2>
              <p className="text-xs text-slate-300">
                Ghi nhận nỗ lực 1000 giờ tự học, 19 chuyên đề & đồ án System Design thực chiến
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Xem Toàn Màn Hình & In PDF (A4) →</span>
            </button>
          </div>

          {/* Certificate Interactive Preview Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c142b] via-[#080d1d] to-[#040711] border-2 border-amber-500/40 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            {/* Background Glow & Watermark */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <img 
                  src="/aiia-logo.png" 
                  alt="AIIA Logo" 
                  className="w-10 h-10 rounded-xl object-contain bg-[#0b1329] p-1 border border-amber-500/40 shadow-md" 
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                    K.AI Labs • K.Tech Architecture
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">
                    SFIA Standard Foundation (v8)
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  Chứng chỉ số hoàn thành khóa học thực chiến
                </p>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase tracking-wider">
                  Kỹ Sư AI Thực Chiến
                </h3>
                <p className="text-xs font-mono text-amber-300/80">
                  SFIA (v8) LEVEL 4: ENABLE • ARCHITECT & SYSTEM DESIGN
                </p>
              </div>

              {/* Recipient Box */}
              <div className="py-4 px-6 rounded-2xl bg-[#060c1d]/90 border border-amber-500/30 inline-block min-w-[280px] sm:min-w-[400px]">
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  Trân trọng chứng nhận học viên:
                </p>
                <p className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">
                  {currentUser.name ? currentUser.name.toUpperCase() : 'HỌC VIÊN K.AI LABS'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email: {currentUser.email || 'hocvien@kai-labs.edu.vn'}
                </p>
              </div>

              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                Đã hoàn thành xuất sắc 1000 giờ tự học, 19 chuyên đề thực chiến từ Level 0 đến Level 4, vượt qua các bài kiểm tra trắc nghiệm và đồ án System Design do AI chấm điểm tự động.
              </p>

              {/* Certificate Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3 rounded-xl bg-[#060c1d]/80 border border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">MÃ ĐỊNH DANH (ID):</div>
                  <div className="font-mono text-amber-300 font-bold">AIIA-SFIA-2026-784912</div>
                </div>
                <div className="p-3 rounded-xl bg-[#060c1d]/80 border border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">KHUNG NĂNG LỰC:</div>
                  <div className="font-mono text-emerald-300 font-bold">SFIA (v8) Level 4</div>
                </div>
                <div className="p-3 rounded-xl bg-[#060c1d]/80 border border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">TRẠNG THÁI:</div>
                  <div className="font-mono text-sky-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Đã Xác Thực (Active)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Certificate Preview */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Mở Toàn Màn Hình & In / Xuất PDF (A4)</span>
                </button>
                <Link
                  href="/test"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Xem Lại Kết Quả Bài Test (/test)</span>
                </Link>
              </div>

            </div>
          </div>

          {/* Achievements & Milestones Gallery */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bộ Sưu Tập Huy Hiệu & Cột Mốc Danh Dự</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-teal-500/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold">
                  ⏱️
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Huy Hiệu 1000h Kiên Trì</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tích lũy thời gian học tập tập trung không xao nhãng với bộ đếm giờ Pomodoro.
                </p>
                <span className="inline-block text-[10px] font-mono text-teal-400">Đã kích hoạt</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-amber-500/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
                  🎖️
                </div>
                <h4 className="text-xs font-bold text-white uppercase">SFIA L4 Architect</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Đạt năng lực Enable: thiết kế hệ thống Multi-Agent, Hybrid RAG và triển khai vLLM.
                </p>
                <span className="inline-block text-[10px] font-mono text-amber-400">Đã cấp chứng nhận</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-emerald-500/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                  🛡️
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Clean Code Anti-Crash</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tuân thủ tuyệt đối quy tắc phòng chống lỗi hồi quy, kiểm tra null/undefined an toàn.
                </p>
                <span className="inline-block text-[10px] font-mono text-emerald-400">Chuẩn Clean Code</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-sky-500/30 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center justify-center font-bold">
                  🏆
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Chinh Phục 5 Bài Test</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Vượt qua 5 bài thi trắc nghiệm và bài tự luận kiến trúc do AI đánh giá độc lập.
                </p>
                <span className="inline-block text-[10px] font-mono text-sky-400">Hoàn thành 5/5 Test</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: STUDY TIMER, STREAK & 1000H TIME STATS */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <StudyAnalyticsDashboard />
        </div>
      )}
      
      {/* TAB 2: OVERVIEW & 12 MODULES PROGRESS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wide">
                Lộ Trình Tự Học 4 Cấp Độ SFIA (v8)
              </h2>
              <p className="text-xs text-slate-300">
                12 Chuyên đề kỹ thuật thực chiến từ Level 1 đến Level 4
              </p>
            </div>
            <Link
              href="/learning"
              className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shrink-0"
            >
              <span>Vào Bàn Học /learning →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['L1', 'L2', 'L3', 'L4'].map((lvlCode, idx) => {
              const levelNames = ['Level 1: Non-tech', 'Level 2: Business', 'Level 3: Tech-base', 'Level 4: AI-base'];
              const modulesForLevel = SFIA_COMMUNITY_DATA.curriculumModules.filter(m => m.levelCode === lvlCode);

              return (
                <div key={lvlCode} className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 font-mono text-xs font-bold">
                      {lvlCode}
                    </span>
                    <span className="text-xs font-bold text-slate-300">{levelNames[idx]}</span>
                  </div>

                  <div className="space-y-2">
                    {modulesForLevel.map(m => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-[#070d1e] border border-slate-800/80 text-xs flex items-center justify-between gap-2">
                        <span className="font-mono text-slate-400">{m.id}</span>
                        <span className="text-slate-200 truncate flex-1 font-medium">{m.title.split('•')[1] || m.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/learning"
                    className="block text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition"
                  >
                    Học Cấp Độ Này →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TESTS HISTORY */}
      {activeTab === 'TESTS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wide">
                Ngân Hàng Bài Thi Mô Phỏng & Đánh Giá Năng Lực
              </h2>
              <p className="text-xs text-slate-300">
                5 Bài thi chuẩn hóa quốc tế SFIA (v8) & Bloom&apos;s Taxonomy
              </p>
            </div>
            <Link
              href="/test"
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shrink-0"
            >
              <span>Phòng Thi Mô Phỏng /test →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SFIA_COMMUNITY_DATA.mockTests.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">
                    {t.id}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">⏱ {t.durationMinutes} Phút</span>
                </div>
                <h3 className="text-sm font-bold text-white">{t.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-mono">Chuẩn đạt: {t.passingScore}%</span>
                  <Link
                    href="/test"
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-sky-400 transition"
                  >
                    Bắt Đầu Làm Bài
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: API KEYS MANAGER (BYOK) */}
      {activeTab === 'API_KEYS' && (
        <div className="space-y-6">
          <ApiKeyManager />
        </div>
      )}

      {/* TAB 4: PRO UPGRADE & VIETQR */}
      {activeTab === 'PRO_UPGRADE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Plan Details */}
          <div className="rounded-3xl bg-[#0f172a]/90 border border-amber-500/40 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase font-mono">
                  Gói Tài Khoản Chuyên Sâu
                </span>
                {/* Switcher Tháng / Năm */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070d1e] border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tháng (99k)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      billingCycle === 'yearly'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Năm (999k)</span>
                    <span className="text-[9px] px-1 py-0.2 bg-emerald-700 text-white rounded-full font-black">-16%</span>
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                Học Viên Kỹ Sư AI Thực Chiến Pro
              </h2>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {billingCycle === 'monthly' ? '99.000 VNĐ' : '999.000 VNĐ'}{' '}
                <span className="text-xs text-slate-400 font-normal">
                  {billingCycle === 'monthly' ? '/ Tháng' : '/ Năm (Tiết kiệm 16%)'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Không giới hạn truy cập 12 Modules & 12 Assignments thực chiến</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chấm điểm tự động 5 bài Test mô phỏng NDA kèm báo cáo lỗ hổng chi tiết</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cố vấn AI Mentor 1-on-1 điều chỉnh lộ trình 4 Sprints theo kinh nghiệm của bạn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chứng nhận hoàn thành chuẩn quốc tế SFIA (v8) xác thực số</span>
              </div>
            </div>

            {currentUser.tier === 'Pro' ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bạn Đang Sở Hữu Tài Khoản Pro VIP Đang Kích Hoạt</span>
              </div>
            ) : (
              <button
                onClick={handleUpgradeToProMock}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Kích Hoạt Nhanh Trải Nghiệm Pro (Thử Nghiệm)
              </button>
            )}
          </div>

          {/* VietQR Payment Box */}
          <div className="rounded-3xl bg-[#0f172a]/90 border border-slate-800 p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <QrCode className="w-4 h-4" />
                <span>Thanh Toán Tự Động VietQR 24/7</span>
              </div>
              <h3 className="text-lg font-bold text-white">Quét Mã QR Bằng Ứng Dụng Ngân Hàng</h3>
              <p className="text-xs text-slate-400">
                Hệ thống tự động kích hoạt tài khoản Pro ngay khi nhận được thanh toán
              </p>
            </div>

            {/* QR Image */}
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-sky-500/50 p-2 bg-white shadow-2xl">
              <img 
                src={vietQrUrl} 
                alt="VietQR Pro Payment"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Invoice Info */}
            <div className="w-full p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-xs font-mono flex items-center justify-between gap-2">
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Mã hóa đơn chuyển khoản:</div>
                <div className="text-amber-400 font-bold">{mockInvoiceCode}</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(mockInvoiceCode);
                  setCopiedInvoice(true);
                  setTimeout(() => setCopiedInvoice(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                {copiedInvoice ? 'Đã chép' : 'Copy'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* MODAL XUẤT CHỨNG CHỈ SFIA CHUẨN QUỐC TẾ */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        defaultUserName={currentUser.name}
      />

    </div>
  );
}
