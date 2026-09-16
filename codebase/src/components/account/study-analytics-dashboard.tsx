'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Timer, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight,
  Target,
  Award,
  BookOpen,
  Zap,
  ShieldCheck,
  Eye,
  MousePointerClick,
  Info
} from 'lucide-react';
import { 
  getStudyAnalyticsData, 
  formatSecondsToTime, 
  type StudyAnalyticsData,
  TARGET_STUDY_HOURS
} from '@/lib/study-timer';

export function StudyAnalyticsDashboard() {
  const [data, setData] = useState<StudyAnalyticsData>(() => getStudyAnalyticsData());
  const [hoveredDay, setHoveredDay] = useState<{ date: string; minutes: number } | null>(null);

  // Sync dữ liệu từ localStorage khi có sự kiện học tập thực tế
  useEffect(() => {
    const refreshData = () => {
      setData(getStudyAnalyticsData());
    };

    refreshData();
    window.addEventListener('aiia_study_timer_tick', refreshData);
    window.addEventListener('aiia_learning_activity', refreshData);

    return () => {
      window.removeEventListener('aiia_study_timer_tick', refreshData);
      window.removeEventListener('aiia_learning_activity', refreshData);
    };
  }, []);

  const totalHours = data.totalStudyHours;
  const progressPercent = Math.min(100, Math.round((totalHours / TARGET_STUDY_HOURS) * 1000) / 10);

  return (
    <div className="space-y-8 animate-fadeIn font-sans">

      {/* ========================================================================= */}
      {/* 0. PROOF OF REAL LEARNING: CƠ CHẾ THẨM ĐỊNH HỌC THẬT (ANTI-CHEAT / AFK)   */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1426] via-[#0f1d3d] to-[#0b1426] border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Cơ Chế Thẩm Định Học Thực Tế (Proof of Real Learning)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  Active Security
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Hệ Thống Không Đếm Giờ Tự Động Khi Chỉ Đăng Nhập
              </h2>
            </div>
          </div>

          <Link
            href="/learning"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Vào Bàn Học Để Tích Lũy Giờ →</span>
          </Link>
        </div>

        {/* 3 Verification Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#070e1f]/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs font-mono">
              <Target className="w-4 h-4 text-sky-400 shrink-0" />
              <span>1. Kiểm Soát Ngữ Cảnh</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Chỉ kích hoạt bộ đếm khi bạn đang ở trong <strong>/learning</strong> (đọc giáo trình, giải lab) hoặc <strong>/test</strong> (thi mô phỏng). Trang Hồ sơ hay Cài đặt hoàn toàn không đếm giờ.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#070e1f]/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs font-mono">
              <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>2. Chống Treo Tab Ngầm</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              API <code className="text-indigo-300 font-mono">document.visibilityState</code> lập tức đóng băng bộ đếm nếu bạn chuyển sang tab khác (Facebook, YouTube) hoặc thu nhỏ cửa sổ.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#070e1f]/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
              <MousePointerClick className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3. Anti-AFK (5 Phút)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Bộ đếm chỉ ghi nhận khi có tương tác học tập thực chất (gõ code, submit trắc nghiệm, lật trang). Di chuột lấy lệ hoặc bỏ máy quá 5 phút sẽ tự động dừng đếm.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BỘ ĐẾM THỜI GIAN HÔM NAY & ĐỒNG HỒ 1000H AI THỰC CHIẾN                 */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a]/95 border border-sky-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          
          {/* Study Time Counter */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10 shrink-0">
              <Timer className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Trạng Thái: Tạm Dừng (Trang Hồ Sơ Không Tính Giờ)</span>
                </span>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                {formatSecondsToTime(data.todaySeconds)}
              </div>
              <p className="text-xs text-slate-300">
                Thời gian học thực tế hôm nay được lưu giữ chính xác. Bộ đếm sẽ tự động tiếp tục khi bạn mở bài học tại <strong>/learning</strong>.
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-[#0b1329] border border-slate-800 text-center min-w-[105px]">
              <div className="text-[11px] text-slate-300 font-mono uppercase font-bold flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Tuần Này</span>
              </div>
              <div className="text-lg font-black text-sky-400 font-mono mt-0.5">
                6.5 Giờ
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-[#0b1329] border border-slate-800 text-center min-w-[105px]">
              <div className="text-[11px] text-slate-300 font-mono uppercase font-bold flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tháng Này</span>
              </div>
              <div className="text-lg font-black text-indigo-400 font-mono mt-0.5">
                {totalHours} Giờ
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-[#0b1329] border border-slate-800 text-center min-w-[105px]">
              <div className="text-[11px] text-slate-300 font-mono uppercase font-bold flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mục Tiêu</span>
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                1000 Giờ
              </div>
            </div>
          </div>

        </div>

        {/* 1000 Hours Progress Bar Gauge */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 font-mono">
            <span className="text-slate-200 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tiến Độ Hành Trình 1000 Giờ Kỹ Sư AI Thực Chiến</span>
            </span>
            <span className="text-sky-300 font-bold">
              {totalHours}h / 1000h ({progressPercent}% Hoàn Thành) • Còn lại {Math.max(0, Math.round((1000 - totalHours) * 10) / 10)}h
            </span>
          </div>

          <div className="w-full h-4 rounded-full bg-slate-900 border border-slate-700/80 p-0.5 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-500 relative"
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
          <p className="text-[11px] text-slate-300">
            * Khung 1000 giờ tự học chuyên sâu theo thang đo Bloom và khung năng lực SFIA v8 để đạt cấp độ Kỹ sư AI độc lập.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DASHBOARD CHUỖI STREAK & BẢN ĐỒ NHIỆT HOẠT ĐỘNG 30 NGÀY (HEATMAP)     */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a]/95 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase font-mono border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Dashboard Chuỗi Học Liên Tục (Streak)</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide mt-1">
              Bản Đồ Hoạt Động & Chuỗi Ngày Học Tập 30 Ngày
            </h2>
            <p className="text-xs text-slate-300">
              Học ít nhất 15 phút mỗi ngày tại Bàn Học để duy trì ngọn lửa Streak và không bị đứt chuỗi.
            </p>
          </div>

          {/* Streak Numbers */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-[10px] text-amber-300/80 font-mono uppercase font-bold">Chuỗi Hiện Tại</div>
                <div className="text-xl font-black text-amber-300 font-mono">{data.currentStreak} Ngày 🔥</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Kỷ Lục Chuỗi</div>
                <div className="text-xl font-black text-yellow-300 font-mono">{data.bestStreak} Ngày</div>
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Activity Heatmap Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Lưới Hoạt Động (Mỗi ô đại diện 1 ngày trong 30 ngày qua):</span>
            <div className="flex items-center gap-2 text-[11px]">
              <span>Ít</span>
              <span className="w-3.5 h-3.5 rounded bg-slate-800 inline-block border border-slate-700" title="0 phút" />
              <span className="w-3.5 h-3.5 rounded bg-sky-900/60 inline-block border border-sky-800" title="1-30 phút" />
              <span className="w-3.5 h-3.5 rounded bg-sky-500 inline-block border border-sky-400" title="31-90 phút" />
              <span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block border border-amber-300" title=">90 phút" />
              <span>Nhiều</span>
            </div>
          </div>

          {/* Grid Squares */}
          <div className="p-4 rounded-2xl bg-[#080e21] border border-slate-800 overflow-x-auto">
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-2 min-w-[500px]">
              {data.dailyHeatmap.map((day, idx) => {
                let colorClass = 'bg-slate-800/80 border-slate-700/60 text-slate-500';
                if (day.intensity === 1) colorClass = 'bg-sky-900/70 border-sky-700 text-sky-300';
                if (day.intensity === 2) colorClass = 'bg-sky-500 border-sky-400 text-slate-950 font-bold';
                if (day.intensity === 3) colorClass = 'bg-amber-400 border-amber-300 text-slate-950 font-bold shadow-sm shadow-amber-400/30';

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay({ date: day.date, minutes: day.minutes })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-9 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-110 ${colorClass}`}
                  >
                    <span className="text-[10px] font-mono leading-none">{idx + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* Hover Tooltip display */}
            <div className="mt-3 text-center text-xs font-mono text-slate-300 h-5">
              {hoveredDay ? (
                <span className="text-sky-300 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                  📅 {hoveredDay.date}: Đã học {hoveredDay.minutes} phút
                </span>
              ) : (
                <span className="text-slate-500 text-[11px]">Rê chuột vào từng ô vuông để xem chi tiết thời gian học mỗi ngày</span>
              )}
            </div>
          </div>

          {/* Streak Milestones Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {[
              { days: 3, label: '3 Ngày', desc: 'Khởi động', unlocked: true },
              { days: 7, label: '7 Ngày', desc: 'Chiến binh', unlocked: false },
              { days: 14, label: '14 Ngày', desc: 'Kiên trì', unlocked: false },
              { days: 30, label: '30 Ngày', desc: 'Bứt phá', unlocked: false },
              { days: 100, label: '100 Ngày', desc: 'Kỹ sư AI', unlocked: false }
            ].map((m) => (
              <div 
                key={m.days}
                className={`p-3 rounded-2xl border text-center space-y-1 transition ${
                  m.unlocked 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-xs font-bold font-mono flex items-center justify-center gap-1">
                  {m.unlocked ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> : <Flame className="w-3.5 h-3.5" />}
                  <span>{m.label}</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider">{m.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BẢNG THỐNG KÊ PHÂN BỔ THỜI GIAN THEO 4 CẤP ĐỘ SFIA (LEVEL 1 ĐẾN 4)     */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a]/95 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/10 text-sky-300 text-xs font-bold uppercase font-mono border border-sky-500/30">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Phân Bổ Thời Gian 4 Phân Tầng SFIA</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide mt-1">
              Bảng Thống Kê Giờ Học & Mức Độ Hoàn Thành
            </h2>
            <p className="text-xs text-slate-300">
              Chi tiết số giờ đã đầu tư cho từng Level kỹ thuật và tiến độ 12 bài tập Assignment thực chiến.
            </p>
          </div>

          <Link
            href="/learning"
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-1.5"
          >
            <span>Học Tiếp Cấp Độ 2 →</span>
          </Link>
        </div>

        {/* Table Distribution */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/60">
                <th className="py-3 px-4 rounded-l-xl">Cấp Độ SFIA</th>
                <th className="py-3 px-4">Định Vị Người Học</th>
                <th className="py-3 px-4 text-center">Modules Hoàn Thành</th>
                <th className="py-3 px-4 text-center">Thời Gian Đã Học</th>
                <th className="py-3 px-4 text-center">Khung Đề Xuất</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Tiến Độ %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-sans">
              {data.levelDistribution.map((lvl) => {
                const percent = Math.round((lvl.studiedHours / lvl.targetHours) * 100);
                const isCompleted = lvl.completedModules === lvl.totalModules && lvl.studiedHours > 0;

                return (
                  <tr key={lvl.levelCode} className="hover:bg-slate-850/50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-sky-400">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30">
                        {lvl.levelCode}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{lvl.levelName.split(':')[0]}</div>
                      <div className="text-[11px] text-slate-400">{lvl.levelName.split(':')[1]}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="font-bold text-emerald-400">{lvl.completedModules}</span>
                      <span className="text-slate-500"> / {lvl.totalModules}</span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-white">
                      {lvl.studiedHours} Giờ
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-slate-400">
                      {lvl.targetHours} Giờ
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 rounded-full" 
                            style={{ width: `${Math.min(100, Math.max(percent, isCompleted ? 100 : 5))}%` }} 
                          />
                        </div>
                        <span className="font-mono font-bold text-sky-400 min-w-[35px] text-right">
                          {isCompleted ? '100%' : `${percent}%`}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. NHẬT KÝ CÁC PHIÊN HỌC TẬP GẦN NHẤT (RECENT STUDY SESSIONS LOG)         */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a]/95 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Nhật Ký Phiên Học Gần Nhất
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Xác thực thao tác thật</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {data.recentSessions.map((sess) => (
            <div key={sess.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-200 truncate">{sess.moduleName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{sess.dateStr}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                  {sess.level}
                </span>
                <span className="px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 font-mono font-bold text-sky-400">
                  ⏱ {sess.durationMinutes} Phút
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
