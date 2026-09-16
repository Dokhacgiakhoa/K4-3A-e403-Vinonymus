'use client';

import React from 'react';
import { 
  Sparkles, 
  Crown, 
  Check, 
  Bot, 
  Target, 
  Swords, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';

interface ProUpgradeCardProps {
  onUpgradeSuccess: () => void;
  onRequireLogin: () => void;
}

export function ProUpgradeCard({ onUpgradeSuccess, onRequireLogin }: ProUpgradeCardProps) {
  const currentUser = clientStorage.getUser();

  const handleActivatePro = () => {
    if (!currentUser) {
      onRequireLogin();
      return;
    }
    clientStorage.upgradeToPro();
    onUpgradeSuccess();
  };

  const proFeatures = [
    {
      icon: Bot,
      title: 'Lộ Trình AI Mentor Độc Bản (4 Sprints 7 Ngày)',
      desc: 'Tự động phân tích xuất phát điểm & quỹ thời gian để lược bỏ bài thừa, may đo lộ trình riêng biệt.'
    },
    {
      icon: Zap,
      title: 'Cố Vấn 1-on-1 Trực Tiếp Với AI Mentor',
      desc: 'Hỏi đáp chuyên sâu, hướng dẫn gỡ lỗi code và nhận lời khuyên chiến lược theo từng Sprint.'
    },
    {
      icon: Swords,
      title: 'Thử Thách Boss Fights Thực Chiến',
      desc: 'Dự án Mini-Project tổng hợp kiểm tra năng lực thực tế sau mỗi chặng 7 ngày.'
    },
    {
      icon: Award,
      title: 'Chấm Điểm Đề Thi & Cấp Chứng Chỉ SFIA Verified',
      desc: 'AI Examiner chấm điểm đề thi tự luận chuẩn SFIA 8 và cấp chứng nhận định danh.'
    }
  ];

  const freeFeatures = [
    'Truy cập toàn bộ 12 Modules giáo trình chuẩn SFIA 8',
    'Xem và sao chép toàn bộ mã nguồn thực hành',
    'Làm phòng học Micro-Quiz tương tác không giới hạn',
    'Tích lũy giờ học vào Đồng Hồ 1000 Giờ',
    'Duy trì và theo dõi chuỗi học tập (🔥 Streak)'
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#131e3a] to-[#0b1329] border border-cyan-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Tri Thức Mở • Trả Phí Cho Cá Nhân Hóa</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Mở Khóa Lộ Trình AI Mentor & Tính Năng Nâng Cao
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Toàn bộ 12 modules giáo trình lý thuyết là <strong>Mở và Miễn Phí 100%</strong>. Gói <strong>Pro Cá Nhân Hóa</strong> giúp bạn có một AI Mentor đồng hành 1-on-1, may đo lộ trình 4 Sprints tối ưu riêng cho mục tiêu công việc của bạn.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleActivatePro}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 hover:opacity-95 transition cursor-pointer flex items-center gap-2 mx-auto"
            >
              <Crown className="w-5 h-5 text-slate-950" />
              <span>{currentUser ? 'Kích Hoạt Gói Pro / Trải Nghiệm AI Mentor' : 'Đăng Nhập Để Mở Khóa Gói Pro'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Grid (Free vs Pro) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FREE TIER CARD */}
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
                Thành Viên Tự Học (Free)
              </span>
              <span className="text-lg font-black text-white">0 VNĐ</span>
            </div>

            <h3 className="text-lg font-bold text-white">Miễn Phí Toàn Bộ Lý Thuyết</h3>
            <p className="text-xs text-slate-400">
              Dành cho bạn muốn tự tra cứu, tự học theo giáo trình bách khoa toàn thư SFIA 8.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              {freeFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400">
            ✅ Đã được kích hoạt sẵn cho tài khoản của bạn
          </div>
        </div>

        {/* PRO PERSONALIZATION CARD */}
        <div className="rounded-3xl bg-[#0f172a] border border-cyan-500/50 p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative ring-2 ring-cyan-500/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Cá Nhân Hóa Độc Bản (Pro)
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Khuyên Dùng ⭐
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Đồng Hành 1-on-1 Cùng AI Mentor</h3>
            <p className="text-xs text-slate-300">
              Dành cho bạn muốn tiết kiệm thời gian, có lộ trình tinh gọn đúng background và hỗ trợ giải đáp tức thì.
            </p>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              {proFeatures.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{feat.title}</p>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleActivatePro}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Mở Khóa Tính Năng Pro Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
