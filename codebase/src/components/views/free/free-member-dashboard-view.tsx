'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Target,
  Award,
  Layers,
  Zap,
  TrendingUp
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { SFIA_COMMUNITY_DATA } from '@/data/sfia-community-data';

export function FreeMemberDashboardView() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(clientStorage.getUser());
    };
    syncUser();
    window.addEventListener('aiia_auth_changed', syncUser);
    return () => window.removeEventListener('aiia_auth_changed', syncUser);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* 1. STUDENT WELCOME & 1000H STATUS CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-sky-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center font-black text-2xl shrink-0 shadow-inner">
            {(currentUser?.name || 'H').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Xin chào, {currentUser?.name || 'Học Viên AI'}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 font-mono text-xs font-bold border border-slate-700">
                THÀNH VIÊN FREE (CỘNG ĐỒNG)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Bạn đang ở không gian tự học <strong>1000 Giờ AI Thực Chiến</strong> theo chuẩn quốc tế SFIA 8 (Level 1 Đến Level 4).
            </p>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-[#0b1329] border border-slate-800 text-center min-w-[95px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Streak</span>
            </div>
            <div className="text-base font-black text-amber-400 font-mono">
              3 Ngày
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#0b1329] border border-slate-800 text-center min-w-[95px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Đã Tích Lũy</span>
            </div>
            <div className="text-base font-black text-sky-400 font-mono">
              12.5h / 1000h
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#0b1329] border border-slate-800 text-center min-w-[95px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cấp Độ</span>
            </div>
            <div className="text-base font-black text-emerald-400 font-mono">
              SFIA L1
            </div>
          </div>
        </div>
      </div>

      {/* 2. UPGRADE TO PRO CALLOUT BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0f172a] to-indigo-500/15 border border-amber-500/40 p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase font-mono">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Mở Khóa Không Gian Executive Cockpit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Nâng Cấp Gói Pro VIP (Học Viên Kỹ Sư AI Thực Chiến)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kích hoạt Trợ lý AI Mentor 1-on-1 ghim nổi phân tích lộ trình 4 Sprints độc bản, Radar đo lường năng lực 6 bậc Bloom và 0% banner quảng cáo.
          </p>
        </div>

        <Link
          href="/account"
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Nâng Cấp Pro VIP (Chỉ từ 99k/tháng) →</span>
        </Link>
      </div>

      {/* 3. FREE LEARNING WORKSPACE: 67 SFIA MODULES & CÂY KỸ NĂNG */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>Tiến Độ Giáo Trình & Roadmap Cây Kỹ Năng Chuẩn</span>
            </h2>
            <p className="text-xs text-slate-300">
              Tài khoản Free mở khóa toàn diện 67 Chuyên đề, 150+ Đề Lab và Cây kỹ năng tổng quan (chưa cá nhân hóa).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/learning"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 text-xs font-bold uppercase tracking-wider transition shrink-0 shadow-md shadow-sky-500/20"
            >
              Cây Kỹ Năng Tổng Quan →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['L1', 'L2', 'L3', 'L4'].map((lvl, idx) => {
            const levelNames = ['Level 1: Non-tech', 'Level 2: Business', 'Level 3: Tech-base', 'Level 4: AI-base'];
            const mods = SFIA_COMMUNITY_DATA.curriculumModules.filter(m => m.levelCode === lvl);

            return (
              <div key={lvl} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 hover:border-sky-500/50 transition">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
                    {lvl}
                  </span>
                  <span className="text-xs font-bold text-slate-200">{levelNames[idx]}</span>
                </div>

                <div className="space-y-2">
                  {mods.map(m => (
                    <div key={m.id} className="p-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-xs flex items-center justify-between gap-2">
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

      {/* 4. MOCK TEST PREPARATION CALLOUT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase font-mono">
            Phòng Khảo Thí Mô Phỏng
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            Đánh Giá Năng Lực Với 5 Bài Mock Exam Chuẩn SFIA
          </h3>
          <p className="text-xs text-slate-300">
            Làm bài thi trắc nghiệm khách quan chuẩn 70% đạt để kiểm chứng kiến thức của bạn.
          </p>
        </div>

        <Link
          href="/test"
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shrink-0"
        >
          Vào Phòng Thi /test →
        </Link>
      </div>

    </div>
  );
}
