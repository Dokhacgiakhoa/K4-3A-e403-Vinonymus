'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Sparkles,
  Users,
  Award,
  Star,
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { CurriculumIngestionModal } from '@/components/admin/CurriculumIngestionModal';
import { SurveyAnalyticsView } from '@/components/admin/survey-analytics-view';

export function AdminCockpitDashboardView() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [showIngestionModal, setShowIngestionModal] = useState<boolean>(false);

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
      {/* CỬA SỔ NẠP GIÁO TRÌNH */}
      <CurriculumIngestionModal
        isOpen={showIngestionModal}
        onClose={() => setShowIngestionModal(false)}
        onSubjectPublished={() => setShowIngestionModal(false)}
      />

      {/* 1. TIÊU ĐỀ TRUNG TÂM QUẢN TRỊ (NGÔN TỪ THÂN THIỆN, DỄ HIỂU) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-teal-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/40 text-teal-400 flex items-center justify-center font-black text-2xl shrink-0 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Trung Tâm Quản Trị & Báo Cáo Khảo Sát Học Viên
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 font-mono text-xs font-bold border border-teal-800">
                QUẢN TRỊ VIÊN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Tổng hợp dữ liệu thực tế từ học viên khóa 4, quản trị giáo trình chuẩn SFIA và trích xuất bằng chứng phục vụ bài toán Track E.
            </p>
          </div>
        </div>

        {/* NÚT THAO TÁC QUẢN TRỊ GIÁO TRÌNH */}
        <button
          onClick={() => setShowIngestionModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Quản Trị Giáo Trình AI →</span>
        </button>
      </div>

      {/* 2. CÁC CHỈ SỐ TỔNG QUAN HỆ THỐNG */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Mẫu Khảo Sát Sạch</div>
          <div className="text-2xl font-extrabold text-teal-400 font-mono mt-1">N = 48</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Học viên đã lọc rác & test</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Đánh Giá Ý Tưởng</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">4.9 / 5.0</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mức độ cấp thiết cao</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Sẵn Sàng Dùng Thử</div>
          <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">&gt; 90%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Học viên đăng ký sớm</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Giáo Trình SFIA</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">12 / 12</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mô-đun chuẩn hóa</div>
        </div>
      </div>

      {/* 3. BẢNG BÁO CÁO PHÂN TÍCH KHẢO SÁT CHUYÊN SÂU (ĐÃ QUA LÀM SẠCH) */}
      <SurveyAnalyticsView />
    </div>
  );
}
