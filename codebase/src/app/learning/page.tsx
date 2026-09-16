'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Library,
  Flame, 
  Bot, 
  Sparkles,
  ArrowLeft,
  Crown,
  Lock
} from 'lucide-react';
import { CurriculumView } from '@/components/sfia/curriculum-view';
import { GamifiedPathView } from '@/components/learning/GamifiedPathView';
import { AIMentorWizard } from '@/components/learning/ai-mentor-wizard';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { AuthModal } from '@/components/auth/auth-modal';

function LearningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get('mode');

  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    const sync = () => {
      setCurrentUser(clientStorage.getUser());
    };
    sync();
    window.addEventListener('aiia_auth_changed', sync);
    return () => window.removeEventListener('aiia_auth_changed', sync);
  }, []);

  const isPro = currentUser?.tier === 'Pro' || currentUser?.plan === 'pro';

  // isMentorMode = true khi người dùng đang ở Lộ Trình AI Mentor hoặc Học Vượt Ải
  const isMentorMode = modeParam === 'ai_roadmap' || modeParam === 'gamified';
  const currentMentorTab = modeParam === 'gamified' ? 'gamified' : 'ai_roadmap';

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12 w-full">
      
      {/* ========================================================================= */}
      {/* TRƯỜNG HỢP 1: LỘ TRÌNH AI MENTOR & VƯỢT ẢI (?mode=ai_roadmap | ?mode=gamified)*/}
      {/* ========================================================================= */}
      {isMentorMode ? (
        <div className="space-y-6">
          {/* TOP BAR ĐIỀU HƯỚNG AI MENTOR */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#080f24]/90 border border-sky-500/30 backdrop-blur-xl shadow-lg">
            
            {/* Nút quay lại Thư Viện Học Tập */}
            <Link
              href="/learning"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>Thư Viện Học Tập Mở</span>
            </Link>

            {/* 2 Tabs: Lộ Trình AI Cá Nhân Hóa vs Học Tương Tác Vượt Ải */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push('/learning?mode=ai_roadmap')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  currentMentorTab === 'ai_roadmap'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Lộ Trình AI Cá Nhân Hóa</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/learning?mode=gamified')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  currentMentorTab === 'gamified'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Roadmap Cây Kỹ Năng</span>
              </button>
            </div>
          </div>

          {/* NỘI DUNG TƯƠNG ỨNG */}
          {!currentUser ? (
            /* TRƯỜNG HỢP GUEST TRUY CẬP TRỰC TIẾP ?mode= -> YÊU CẦU ĐĂNG KÝ (0đ) */
            <div className="p-8 sm:p-12 rounded-3xl bg-[#080f24] border border-sky-500/30 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  Đăng Ký Tài Khoản Miễn Phí Để Mở Khóa Roadmap
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lộ trình học tập và Cây kỹ năng cần tài khoản để ghi nhận chuỗi ngày học Streak, tích lũy 1000h và lưu trạng thái vượt ải của bạn.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  Đăng Ký Tài Khoản (0đ) Ngay →
                </button>
                <Link
                  href="/learning"
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
                >
                  Xem Danh Mục Khóa Học
                </Link>
              </div>
            </div>
          ) : currentMentorTab === 'ai_roadmap' ? (
            /* TRƯỜNG HỢP LỘ TRÌNH AI MENTOR CÁ NHÂN HÓA */
            !isPro ? (
              /* THÀNH VIÊN FREE: HIỂN THỊ PHỄU NÂNG CẤP PRO ĐỂ ĐƯỢC CÁ NHÂN HÓA LỘ TRÌNH */
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0b1329] to-indigo-500/15 border border-amber-500/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center lg:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase font-mono">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Đặc Quyền Dành Riêng Cho Học Viên Pro VIP</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      AI Mentor 1-on-1 Cá Nhân Hóa Lộ Trình 4 Sprints
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                      Tài khoản Free đang học theo <strong>Roadmap Cây Kỹ Năng Chuẩn Tổng Quan</strong>. Nâng cấp Pro VIP để kích hoạt AI Mentor 1-on-1: Thẩm định hồ sơ CV, chẩn đoán năng lực thực tế và may đo lộ trình 4 Sprints độc bản (12-16 môn trọng tâm nhất) phù hợp 100% mục tiêu của bạn.
                    </p>
                  </div>

                  <Link
                    href="/account"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Nâng Cấp Pro VIP Để Cá Nhân Hóa →</span>
                  </Link>
                </div>

                {/* Bản demo AI Mentor Wizard cho phép làm thử khảo sát */}
                <div className="w-full opacity-90">
                  <AIMentorWizard 
                    onRoadmapGenerated={() => {}}
                    onCancel={() => router.push('/learning')}
                  />
                </div>
              </div>
            ) : (
              /* HỌC VIÊN PRO VIP: TOÀN QUYỀN TRẢI NGHIỆM AI MENTOR CÁ NHÂN HÓA */
              <div className="w-full">
                <AIMentorWizard 
                  onRoadmapGenerated={() => {}}
                  onCancel={() => router.push('/learning')}
                />
              </div>
            )
          ) : (
            <GamifiedPathView />
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* TRƯỜNG HỢP 2: THƯ VIỆN HỌC TẬP MỞ (/learning)                             */
        /* ========================================================================= */
        <CurriculumView />
      )}

      {/* POPUP AUTH CHO GUEST */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user as StoredUser);
          setShowAuthModal(false);
        }}
      />

    </div>
  );
}

export default function LearningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Đang tải bàn học...</div>}>
      <LearningContent />
    </Suspense>
  );
}
