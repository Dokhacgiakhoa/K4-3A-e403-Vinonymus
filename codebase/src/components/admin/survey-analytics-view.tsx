'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Filter,
  Download,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Users,
  Search,
  ChevronDown,
  Quote,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import type {
  CleanedSurveyRecord,
  SurveyAnalyticsReport,
} from '@/lib/survey/data-cleaner';
import safeReportData from '@/data/survey-cleaned-sample.json';

export function SurveyAnalyticsView() {
  const [selectedBg, setSelectedBg] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<CleanedSurveyRecord | null>(null);

  // Báo cáo phân tích dữ liệu khảo sát (đã qua làm sạch & ẩn danh hóa hoàn toàn)
  const report = useMemo<SurveyAnalyticsReport>(() => {
    return safeReportData as unknown as SurveyAnalyticsReport;
  }, []);

  // Lọc dữ liệu hiển thị theo nhóm người học và từ khóa tìm kiếm
  const filteredRecords = useMemo(() => {
    return report.records.filter((r) => {
      const matchBg = selectedBg === 'all' || r.backgroundCategory === selectedBg;
      const matchQuery =
        searchQuery === '' ||
        r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.generalFeedback.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBg && matchQuery;
    });
  }, [report.records, selectedBg, searchQuery]);

  // Xuất file CSV đã làm sạch cho người dùng tải về
  const handleExportCsv = () => {
    const headers = [
      'Mã Khảo Sát',
      'Mã Học Viên',
      'Họ Và Tên',
      'Email (Đã Ẩn Danh)',
      'Nhóm Người Học',
      'Điểm Đánh Giá',
      'Nhận Diện Lỗ Hổng',
      'Thời Gian Mất Tìm Tài Liệu',
      'Tính Khả Thi',
      'Sẵn Sàng Dùng Thử',
      'Góp Ý Thực Tế',
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.studentId,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.maskedEmail,
      `"${r.backgroundLabel}"`,
      r.overallRating,
      `"${r.selfAwarenessLabel.replace(/"/g, '""')}"`,
      `"${r.timeWastedLabel}"`,
      `"${r.solutionFeasibility}"`,
      r.willingToTest ? 'Có' : 'Không',
      `"${(r.generalFeedback || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-khao-sat-hoc-vien-sach-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. HỘP BÁO CÁO ĐỘ TIN CẬY & LÀM SẠCH DỮ LIỆU */}
      <div className="rounded-3xl bg-[#0b1329] border border-teal-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Dữ Liệu Khảo Sát Đã Qua Lọc & Chuẩn Hóa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Báo Cáo Phân Tích Thực Tế Ý Kiến Học Viên (Khóa 4)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dữ liệu khảo sát từ Google Sheet đã được xử lý qua 4 bước: Lọc bản ghi thử nghiệm $\rightarrow$ Gộp lượt gửi trùng $\rightarrow$ Chuẩn hóa nhóm học viên $\rightarrow$ Ẩn danh hóa thông tin cá nhân.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all shrink-0 hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Tải Báo Cáo Sạch (Excel/CSV)</span>
          </button>
        </div>

        {/* 4 CHỈ SỐ LÀM SẠCH */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Lượt Điền Ban Đầu</div>
            <div className="text-2xl font-black text-slate-200 mt-1 font-mono">
              {report.hygiene.totalRawCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Dữ liệu thô từ Sheet</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Lượt Test Đã Loại Bỏ</div>
            <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
              -{report.hygiene.testRecordsRemoved}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Dòng thử nghiệm kỹ thuật</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Lượt Trùng Đã Gộp</div>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
              -{report.hygiene.duplicatesMerged}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Gửi nhiều lần cùng 1 mã</div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/40">
            <div className="text-[11px] text-teal-300 font-medium">Cỡ Mẫu Sạch Hợp Lệ (N)</div>
            <div className="text-2xl font-black text-teal-300 mt-1 font-mono">
              N = {report.hygiene.validCleanCount}
            </div>
            <div className="text-[10px] text-teal-400/70 mt-0.5">100% Học viên thực tế</div>
          </div>
        </div>
      </div>

      {/* 2. BỘ 4 CHỈ SỐ KẾT QUẢ QUAN TRỌNG NHẤT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-amber-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Điểm Đánh Giá Ý Tưởng</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-amber-300 font-mono">
              {report.kpis.averageRating}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 sao</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Đại đa số học viên đánh giá 5 sao cho giải pháp học tập thích ứng.
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-rose-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Không Tự Biết Điểm Hổng</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-rose-300 font-mono">
              {report.kpis.unawareGapsPercent}%
            </span>
            <span className="text-xs text-slate-400">học viên</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Chỉ phát hiện mình hổng kiến thức khi nộp lab bị lỗi hoặc fail testcase.
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-sky-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Mất &gt;15 Phút Tìm Link</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-sky-300 font-mono">
              {report.kpis.timeWastedOver15MinPercent}%
            </span>
            <span className="text-xs text-slate-400">học viên</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Lãng phí từ 15 đến hơn 45 phút mỗi buổi chỉ để nhặt tài liệu rải rác.
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-teal-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sẵn Sàng Thử Nghiệm</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-teal-300 font-mono">
              {report.kpis.willingToTestPercent}%
            </span>
            <span className="text-xs text-slate-400">đăng ký</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Học viên mong muốn nhận link và trải nghiệm ngay khi ra mắt.
          </p>
        </div>
      </div>

      {/* 3. BỘ LỌC ĐỐI TƯỢNG HỌC VIÊN */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Xem Theo Nhóm Học Viên:</span>
          </span>

          <button
            onClick={() => setSelectedBg('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedBg === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tất Cả ({report.hygiene.validCleanCount})
          </button>

          {report.backgroundDistribution.map((bg) => (
            <button
              key={bg.category}
              onClick={() => setSelectedBg(bg.category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedBg === bg.category
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {bg.label} ({bg.count})
            </button>
          ))}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã HV, họ tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* 4. CÁC BIỂU ĐỒ TRỰC QUAN CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BIỂU ĐỒ 1: TOP NHỮNG KHÓ KHĂN LỚN NHẤT KHI TỰ HỌC */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Những Khó Khăn Học Viên Gặp Phải Nhiều Nhất</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tỷ lệ học viên lựa chọn các rào cản khi học tập trên VLearn
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Đa lựa chọn</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {report.painPointsRanking.map((item, idx) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.shortLabel}</span>
                  </span>
                  <span className="font-mono font-bold text-rose-300 ml-2 shrink-0">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BIỂU ĐỒ 2: XẾP HẠNG TÍNH NĂNG ĐƯỢC MONG CHỜ NHẤT */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Xếp Hạng Tính Năng Học Viên Muốn Dùng Nhất</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mức độ kỳ vọng vào các giải pháp hỗ trợ học tập của nhóm
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Đa lựa chọn</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {report.featuresRanking.map((item, idx) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span>{item.shortLabel}</span>
                  </span>
                  <span className="font-mono font-bold text-teal-300 ml-2 shrink-0">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-400 to-teal-400'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. CƠ CẤU NGƯỜI HỌC VÀ THỜI GIAN LÃNG PHÍ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CƠ CẤU NGƯỜI HỌC */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Học Viên Tham Gia Khảo Sát Đến Từ Đâu?</span>
          </h3>

          <div className="space-y-3 pt-2">
            {report.backgroundDistribution.map((bg) => (
              <div key={bg.category} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-200 font-semibold">{bg.label}</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {bg.count} học viên ({bg.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${bg.color}`}
                    style={{ width: `${bg.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THỜI GIAN LÃNG PHÍ TÌM TÀI LIỆU */}
        <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Thời Gian Lãng Phí Tìm & Nhặt Tài Liệu Mỗi Buổi</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {report.timeWastedDistribution.map((t) => (
              <div
                key={t.label}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center"
              >
                <div className="text-xl font-extrabold text-amber-300 font-mono">
                  {t.percentage}%
                </div>
                <div className="text-xs text-slate-200 font-medium mt-1">{t.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{t.count} học viên</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Ý KIẾN CHIA SẺ THỰC TẾ TIÊU BIỂU (VOICE OF STUDENTS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Quote className="w-4 h-4 text-teal-400" />
              <span>Ý Kiến & Chia Sẻ Tiêu Biểu Từ Học Viên (Thực Chứng)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Những trích dẫn thực tế làm cơ sở cho giải pháp dự thi Track E
            </p>
          </div>
          <span className="text-xs text-teal-400 font-mono">Đã bảo mật danh tính</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.featuredFeedbacks.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-800/80 space-y-3 flex flex-col justify-between hover:border-teal-500/40 transition"
            >
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{item.feedback}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                <span className="font-semibold text-teal-300">{item.studentCode}</span>
                <span className="text-slate-400 text-[10px]">{item.backgroundLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. BẢNG DANH SÁCH HỌC VIÊN ĐÃ CHUẨN HÓA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              <span>Danh Sách Học Viên Đã Qua Làm Sạch ({filteredRecords.length} Bản Ghi)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Toàn bộ dữ liệu nhạy cảm (Email, MoMo, STK) đã được che mặt nạ an toàn
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Hiển thị {filteredRecords.length} / {report.hygiene.validCleanCount} học viên
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b1329] text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="p-3 rounded-l-xl">Mã HV</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Email (Bảo Mật)</th>
                <th className="p-3">Nhóm Người Học</th>
                <th className="p-3">Đánh Giá</th>
                <th className="p-3">Thời Gian Mất</th>
                <th className="p-3">Sẵn Sàng Test</th>
                <th className="p-3 rounded-r-xl text-center">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRecords.slice(0, 15).map((r) => (
                <tr key={r.id} className="hover:bg-[#0b1329]/50 transition">
                  <td className="p-3 font-mono font-bold text-teal-300">{r.studentId}</td>
                  <td className="p-3 font-medium text-white">{r.fullName}</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">{r.maskedEmail}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                      {r.backgroundLabel}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-300">
                    {r.overallRating} ★
                  </td>
                  <td className="p-3 text-slate-300 text-[11px]">{r.timeWastedLabel}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.willingToTest
                          ? 'bg-teal-950 text-teal-300 border border-teal-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {r.willingToTest ? 'Sẵn Sàng' : 'Chưa Chắc'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition"
                      title="Xem phản hồi chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP XEM CHI TIẾT 1 HỌC VIÊN */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-teal-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-fadeIn font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">
                  Chi Tiết Phản Hồi: {selectedRecord.fullName} ({selectedRecord.studentId})
                </h4>
                <p className="text-xs text-slate-400">{selectedRecord.backgroundLabel}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <span className="text-slate-400 block font-medium">Nhận diện lỗ hổng kiến thức:</span>
                <p className="text-slate-200 mt-0.5">{selectedRecord.selfAwarenessLabel}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Khó khăn gặp phải:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-200 mt-0.5">
                  {selectedRecord.painPoints.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Tính năng muốn dùng nhất:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-teal-300 mt-0.5">
                  {selectedRecord.mostWantedFeatures.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>

              {selectedRecord.generalFeedback && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-300 font-semibold block mb-1">Góp ý trực tiếp:</span>
                  <p className="text-slate-200 italic">&ldquo;{selectedRecord.generalFeedback}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
