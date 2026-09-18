'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw, 
  ExternalLink, 
  Layers, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export function SlidesDeckView() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('single');
  
  // Timer state for 6-minute pitch
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 6;

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer interval
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning((prev) => !prev);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToSlide = (idx: number) => {
    if (idx >= 0 && idx < totalSlides) {
      setCurrentSlide(idx);
    }
  };

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        goToSlide(parseInt(e.key, 10) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideTitles = [
    '1. User & Job',
    '2. Vì sao chọn',
    '3. Giải pháp & Demo',
    '4. Kết quả đo',
    '5. Người dùng thật',
    '6. Nếu có thêm 1 tuần'
  ];

  // Render individual slide contents
  const renderSlideContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex flex-col justify-between h-full text-[#14213d] select-text">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a6f97] tracking-wider uppercase">
                1 · User &amp; Job
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213d] mt-2 mb-4 leading-tight">
                Học viên Khoá 4 trước mỗi buổi lab: không biết phải học bù phần nào
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed">
                <strong className="text-[#14213d]">Job:</strong> với quỹ thời gian rảnh hôm nay và trình độ của mình, biết chính xác cần học gì để làm kịp bài lab tiếp theo.
              </p>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
                <div className="bg-[#f1f6fa] rounded-2xl p-5 sm:p-6 border border-[#c9d6e2]/60 shadow-sm">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#c1121f] leading-none">87%</div>
                  <div className="text-sm sm:text-base text-[#3d4a5c] mt-3 leading-snug font-medium">
                    71/82 học viên không tự xác định được phần cần học bù trước buổi lab
                  </div>
                </div>
                <div className="bg-[#f1f6fa] rounded-2xl p-5 sm:p-6 border border-[#c9d6e2]/60 shadow-sm">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#c1121f] leading-none">93%</div>
                  <div className="text-sm sm:text-base text-[#3d4a5c] mt-3 leading-snug font-medium">
                    76/82 học viên gặp tình trạng tài liệu rải rác nhiều nơi (Discord, Zoom, Drive, VLearn, GitHub)
                  </div>
                </div>
                <div className="bg-[#f1f6fa] rounded-2xl p-5 sm:p-6 border border-[#c9d6e2]/60 shadow-sm">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#c1121f] leading-none">0.13%</div>
                  <div className="text-sm sm:text-base text-[#3d4a5c] mt-3 leading-snug font-medium">
                    lượt chat AI Tutor VLearn tự gợi ý bước học tiếp theo (18/13.494 lượt)
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-6 border-l-4 border-[#2a6f97] pl-4 py-2 bg-slate-50 rounded-r-xl">
                <p className="text-base sm:text-lg italic text-[#14213d] font-medium">
                  “Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.”
                </p>
                <div className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
                  — P02, học viên nền AI (phỏng vấn sâu ngày 16/9)
                </div>
              </div>
            </div>

            {/* Footer citation */}
            <div className="border-t border-[#dde5ec] pt-3 mt-4 text-xs text-[#6b7785] flex flex-wrap justify-between items-center">
              <span>Nguồn: khảo sát form n = 82 (17/9, tự khai, mẫu tự nguyện) · vlearn-pack 13.494 lượt chat · phỏng vấn P02 16/9</span>
              <span className="font-mono text-[#2a6f97] font-semibold">spec.md §1</span>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col justify-between h-full text-[#14213d] select-text">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a6f97] tracking-wider uppercase">
                2 · Vì sao chọn tính năng này
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213d] mt-2 mb-4 leading-tight">
                3 ứng viên — chọn cái có “một quyết định AI” rõ ràng
              </h1>

              {/* Selection Table */}
              <div className="overflow-hidden rounded-2xl border border-[#c9d6e2] mt-4 shadow-sm">
                <table className="w-full text-left text-sm sm:text-base border-collapse">
                  <thead>
                    <tr className="bg-[#14213d] text-white">
                      <th className="p-3.5 sm:p-4 font-semibold w-[32%]">Ứng viên</th>
                      <th className="p-3.5 sm:p-4 font-semibold">Bằng chứng</th>
                      <th className="p-3.5 sm:p-4 font-semibold w-[28%]">Quyết định</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c9d6e2]">
                    <tr className="bg-white hover:bg-slate-50/50">
                      <td className="p-3.5 sm:p-4 font-medium">(1) Tổng hợp link tài liệu phân mảnh</td>
                      <td className="p-3.5 sm:p-4 text-slate-700">76/82 (93%) gặp tài liệu rải rác</td>
                      <td className="p-3.5 sm:p-4 text-rose-700 font-semibold">Loại — chỉ là tra cứu, không có quyết định AI</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50/50">
                      <td className="p-3.5 sm:p-4 font-medium">(2) Tóm tắt trọng tâm bài giảng</td>
                      <td className="p-3.5 sm:p-4 text-slate-700">75/82 (91%) gặp slide dài; 8.8% lượt chat VLearn xin tóm tắt</td>
                      <td className="p-3.5 sm:p-4 text-rose-700 font-semibold">Loại — trùng lõi Track A (AI Tutor)</td>
                    </tr>
                    <tr className="bg-[#e3f1e8] font-semibold text-[#14213d]">
                      <td className="p-3.5 sm:p-4 text-[#2d6a4f] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                        <span>(3) Chẩn đoán nền tảng + thời gian → ≤3 việc trọng tâm</span>
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-800">
                        71/82 (87%) không biết học bù phần nào; 41/82 (50%) rảnh dưới 1 tiếng
                      </td>
                      <td className="p-3.5 sm:p-4 text-[#2d6a4f] font-bold">
                        Chọn — catalog đã kiểm chứng giải luôn một phần (1)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Highlight callout */}
              <div className="mt-6 p-4 rounded-xl bg-[#f1f6fa] border border-[#c9d6e2]/80 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-[#2a6f97] tracking-wider block">Tín hiệu chấp nhận thị trường</span>
                  <div className="text-base sm:text-lg text-[#14213d] font-bold mt-0.5">
                    <span className="text-[#2d6a4f] text-xl font-extrabold">74/82 (90%)</span> học viên muốn dùng checklist 3 việc theo số phút rảnh mỗi ngày.
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#2d6a4f]/15 text-[#2d6a4f] rounded-full text-xs font-bold font-mono">
                  Strong Demand
                </span>
              </div>
            </div>

            {/* Footer citation */}
            <div className="border-t border-[#dde5ec] pt-3 mt-4 text-xs text-[#6b7785] flex flex-wrap justify-between items-center">
              <span>Nguồn: bảng impact spec.md §2 · khảo sát n = 82 · mining docs/research/evidence-mining.md</span>
              <span className="font-mono text-[#2a6f97] font-semibold">spec.md §2</span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col justify-between h-full text-[#14213d] select-text">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a6f97] tracking-wider uppercase">
                3 · Giải pháp &amp; demo live
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213d] mt-2 mb-3 leading-tight">
                Lộ trình cá nhân hoá: AI Mentor đề xuất tối đa 3 việc, kèm link đã kiểm chứng
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4">
                {/* Left Column: Solution details */}
                <div className="md:col-span-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h2 className="text-base sm:text-lg font-bold text-[#2a6f97] mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>Luồng hoạt động 3 bước</span>
                    </h2>
                    <ul className="space-y-2 text-sm sm:text-base text-slate-700 list-disc list-inside">
                      <li>Học viên chọn <strong>nền tảng</strong> (non-tech / tech / AI) → <strong>số phút rảnh</strong> + <strong>bài lab</strong> → ghi chú.</li>
                      <li>AI Mentor trả checklist <strong>≤3 việc</strong>, có lý do, thời lượng, link <strong>chỉ lấy từ catalog đã xác thực</strong>.</li>
                      <li>Thiếu thông tin → <strong>hỏi lại</strong>; Xin làm hộ / đáp án / gia hạn → <strong>từ chối ngay</strong>.</li>
                    </ul>
                  </div>

                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                    <h2 className="text-sm sm:text-base font-bold text-[#2d6a4f] mb-1">
                      Mức tự động hoá: Augment (Hỗ trợ ra quyết định)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      AI chỉ đề xuất, học viên tự tick hoàn thành hoặc đổi thứ tự. <strong>Cost-of-error cực thấp:</strong> nếu gợi ý sai chỉ tốn vài chục phút đọc nhầm, hoàn toàn không mất điểm, không trễ hạn.
                    </p>
                  </div>
                </div>

                {/* Right Column: Demo Cases on Stage */}
                <div className="md:col-span-6 space-y-3.5">
                  <div className="bg-[#f1f6fa] rounded-xl p-4 border border-[#c9d6e2]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#14213d] text-white text-xs font-bold">
                        ① Case chuẩn (Happy Path)
                      </span>
                      <span className="text-xs text-emerald-700 font-bold font-mono">30s demo</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Khai nền tech-base, 60 phút rảnh, bài lab tiếp theo → AI sinh 3 việc trọng tâm, tổng thời gian ≤ 60m, link chuẩn catalog, nhãn AI rõ ràng.
                    </p>
                  </div>

                  <div className="bg-[#f1f6fa] rounded-xl p-4 border border-[#c9d6e2]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c1121f] text-white text-xs font-bold">
                        ② Case khó (Từ chối &amp; Hỏi lại)
                      </span>
                      <span className="text-xs text-rose-700 font-bold font-mono">Bảo vệ VLearn</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Ghi chú <em>“Làm hộ bài lab / cho đáp án”</em> → AI từ chối, giải thích liêm chính và gợi ý liên hệ Lab Coach (G16). Hoặc khai non-tech nhưng nói <em>“làm RAG production”</em> → AI hỏi lại (G14).
                    </p>
                  </div>

                  {/* QUICK JUMP TO LIVE DEMO BUTTON */}
                  <div className="pt-1">
                    <Link
                      href="/personalized-path"
                      target="_blank"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#14213d] to-[#2a6f97] hover:from-[#1b2a4a] hover:to-[#1e5474] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 group"
                    >
                      <Monitor className="w-4 h-4 text-sky-300 group-hover:scale-110 transition-transform" />
                      <span>🚀 Mở Trang Live Demo (/personalized-path)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer citation */}
            <div className="border-t border-[#dde5ec] pt-3 mt-4 text-xs text-[#6b7785] flex flex-wrap justify-between items-center">
              <span>Web: k4-3a-e403-vinonymus.kailabs.io.vn/personalized-path · luồng chi tiết docs/05-ui-flow.md</span>
              <span className="font-mono text-[#2a6f97] font-semibold">spec.md §4, §6</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col justify-between h-full text-[#14213d] select-text">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a6f97] tracking-wider uppercase">
                4 · Kết quả đo
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213d] mt-2 mb-4 leading-tight">
                Đạt Quality Bar khoá tại CP4: AI v2 19/20, 0 link ngoài catalog
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2">
                {/* Left Column: Metric Table */}
                <div className="md:col-span-6 space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                    <strong className="text-[#14213d]">Quality Bar (khoá 21:00 · 17/9):</strong> ≥18/20 case đạt <span className="font-bold text-[#2a6f97]">VÀ</span> 0 URL ngoài catalog <span className="font-bold text-[#2a6f97]">VÀ</span> 3/3 case G16–G18 trả <em>refuse</em>.
                  </div>

                  <div className="overflow-hidden rounded-xl border border-[#c9d6e2]">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#14213d] text-white">
                          <th className="p-3 font-semibold">Lượt chạy thử nghiệm</th>
                          <th className="p-3 font-semibold">Tỷ lệ đạt</th>
                          <th className="p-3 font-semibold">Link ngoài</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c9d6e2]">
                        <tr className="bg-white">
                          <td className="p-3 font-medium">Baseline luật tĩnh (20 case)</td>
                          <td className="p-3 font-semibold">17/20 · 85%</td>
                          <td className="p-3 text-emerald-700 font-bold">0</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="p-3 font-medium">AI v1 · Gemini Flash-Lite</td>
                          <td className="p-3 font-semibold">18/20 · 90%</td>
                          <td className="p-3 text-emerald-700 font-bold">0</td>
                        </tr>
                        <tr className="bg-[#e3f1e8] font-bold text-[#14213d]">
                          <td className="p-3 text-[#2d6a4f] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                            <span>AI v2 · Gemini Flash-Lite</span>
                          </td>
                          <td className="p-3 text-[#2d6a4f] text-base">19/20 · 95%</td>
                          <td className="p-3 text-[#2d6a4f] text-base">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Transparent Failure G02 & 50-Case Baseline */}
                <div className="md:col-span-6 space-y-3.5">
                  <div className="bg-[#f1f6fa] rounded-2xl p-4 sm:p-5 border border-[#c9d6e2]">
                    <h2 className="text-sm sm:text-base font-bold text-[#c1121f] flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Failure đáng kể nhất: Case G02</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Gemini chọn đúng tài liệu <code className="bg-white px-1.5 py-0.5 rounded border text-xs font-mono">ptc-function-calling</code> nhưng xếp thứ ba; hậu kiểm giới hạn 60 phút đã loại mất item này. Không bịa link, không rơi về baseline — nhóm quyết định <strong>giữ nguyên case và số 19/20</strong>, không sửa để lấy điểm ảo.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#3d4a5c] leading-relaxed">
                    <span className="font-bold text-[#14213d] flex items-center gap-1 mb-1">
                      <Info className="w-3.5 h-3.5 text-sky-600" />
                      <span>Minh bạch về bộ mở rộng 50 case:</span>
                    </span>
                    Bộ mở rộng 50 case hiện đạt 50/50 theo luật baseline, bao quát cả 2 đối tượng: 40 case nhu cầu học viên + 10 case bảo vệ hệ thống VLearn (chống leak lab, chống lách deadline, chống DoS, 404).
                  </div>
                </div>
              </div>
            </div>

            {/* Footer citation */}
            <div className="border-t border-[#dde5ec] pt-3 mt-4 text-xs text-[#6b7785] flex flex-wrap justify-between items-center">
              <span>Nguồn: eval/run_results.md lượt 0–3 · eval/latest-ai-results.json</span>
              <span className="font-mono text-[#2a6f97] font-semibold">spec.md §7</span>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col justify-between h-full text-[#14213d] select-text">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a6f97] tracking-wider uppercase">
                5 · User thật nói gì
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213d] mt-2 mb-4 leading-tight">
                Chưa hoàn thành 5 buổi cho người ngoài dùng thử — nói thẳng thay vì tô vẽ
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                {/* Left Column: Real interview quotes */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h2 className="text-base font-bold text-[#2a6f97]">
                    Phỏng vấn trước khi build (16/9)
                  </h2>
                  <div className="border-l-4 border-[#2a6f97] pl-3 py-1">
                    <p className="text-sm sm:text-base italic text-[#14213d]">
                      “Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu.”
                    </p>
                    <span className="text-xs text-slate-500 block mt-1">— P01, học viên nền tech</span>
                  </div>
                  <div className="border-l-4 border-[#2a6f97] pl-3 py-1">
                    <p className="text-sm sm:text-base italic text-[#14213d]">
                      “Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.”
                    </p>
                    <span className="text-xs text-slate-500 block mt-1">— P02, học viên nền AI</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-[#2d6a4f]">
                    ✓ 71/82 (87%) người khảo sát xác nhận sẵn sàng dùng thử ở các vòng sau.
                  </div>
                </div>

                {/* Right Column: Golden Set verification */}
                <div className="bg-[#f1f6fa] p-5 rounded-2xl border border-[#c9d6e2] space-y-3.5">
                  <h2 className="text-base font-bold text-[#14213d]">
                    Thay cho validation: Đo kiểm bằng Golden Set
                  </h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                      <span>AI v2 <strong>đạt</strong> Quality Bar: 19/20 case, 0 link ngoài catalog.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                      <span><strong>3/3 case ngoài phạm vi</strong> (xin đáp án, nộp muộn, đòi system prompt) → <strong>từ chối dứt khoát</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[#c1121f]">
                      <AlertTriangle className="w-4 h-4 text-[#c1121f] shrink-0 mt-0.5" />
                      <span>Chưa đạt: <strong>G02</strong> — thiếu 1 tài liệu do giới hạn thời lượng 60 phút.</span>
                    </li>
                  </ul>
                  <div className="pt-2 text-xs text-slate-500 border-t border-slate-200">
                    Nhật ký dùng thử: <code className="font-mono text-[#14213d]">validation/log.md</code> (chưa đủ 5 người ngoài nhóm trước hạn nộp).
                  </div>
                </div>
              </div>
            </div>

            {/* Footer citation */}
            <div className="border-t border-[#dde5ec] pt-3 mt-4 text-xs text-[#6b7785] flex flex-wrap justify-between items-center">
              <span>Nguồn: docs/research/survey-log.md · eval/run_results.md</span>
              <span className="font-mono text-[#2a6f97] font-semibold">02-guide §5.1</span>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col justify-between h-full text-[#14213d] select-text">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#2a6f97] tracking-wider uppercase">
                6 · Nếu có thêm 1 tuần
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14213d] mt-2 mb-4 leading-tight">
                3 việc ưu tiên, đều trỏ về lỗ hổng đang có
              </h1>

              {/* 3 Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-4">
                <div className="bg-[#f1f6fa] rounded-2xl p-5 border border-[#c9d6e2] shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-[#14213d] text-white flex items-center justify-center font-bold text-sm mb-3">
                    1
                  </div>
                  <h2 className="text-base font-bold text-[#14213d] mb-1.5">Cho 5 người thật dùng thử</h2>
                  <p className="text-xs sm:text-sm text-[#3d4a5c] leading-relaxed">
                    Giao task, ngồi im quan sát, ghi quote nguyên văn — giải quyết đúng phần còn thiếu ở slide 5.
                  </p>
                </div>

                <div className="bg-[#f1f6fa] rounded-2xl p-5 border border-[#c9d6e2] shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-[#14213d] text-white flex items-center justify-center font-bold text-sm mb-3">
                    2
                  </div>
                  <h2 className="text-base font-bold text-[#14213d] mb-1.5">Bài test chẩn đoán từ CV</h2>
                  <p className="text-xs sm:text-sm text-[#3d4a5c] leading-relaxed">
                    74/82 (90%) học viên muốn có bài test ngắn; thay nền tảng tự khai bằng năng lực đo kiểm khách quan.
                  </p>
                </div>

                <div className="bg-[#f1f6fa] rounded-2xl p-5 border border-[#c9d6e2] shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-[#14213d] text-white flex items-center justify-center font-bold text-sm mb-3">
                    3
                  </div>
                  <h2 className="text-base font-bold text-[#14213d] mb-1.5">Thư viện tài liệu giảng viên</h2>
                  <p className="text-xs sm:text-sm text-[#3d4a5c] leading-relaxed">
                    Giảng viên tải tài liệu lên, AI Mentor tự động nạp vào thư viện thay cho catalog soạn tay thủ công.
                  </p>
                </div>
              </div>

              {/* Key Takeaway Box */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#14213d] text-white shadow-lg">
                <div className="text-xs uppercase font-bold text-sky-400 tracking-wider mb-1">
                  Bài học lớn nhất của nhóm Vinonymus
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  Chốt chuẩn “đạt” (Quality Bar) và đo kiểm bằng Golden Set từ sớm giúp nhóm tự tin báo cáo bằng số liệu thật — kể cả khi con số đó chưa hoàn hảo.
                </p>
              </div>

              {/* Team Footnote */}
              <div className="mt-4 text-xs text-slate-500 font-medium">
                Nhóm Vinonymus · Track E · Lớp 3A · Phòng E403 · Khoa (PM · Backend) · Minh (Database) · Đức (AI) · Thành (UI)
              </div>
            </div>

            {/* Footer citation */}
            <div className="border-t border-[#dde5ec] pt-3 mt-4 text-xs text-[#6b7785] flex flex-wrap justify-between items-center">
              <span>Repo: github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus</span>
              <span className="font-mono text-[#2a6f97] font-semibold">tasks-he-thong-4-vai-tro.md</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full bg-slate-950 text-slate-100 flex flex-col font-sans transition-all duration-200 select-none ${
        isFullscreen ? 'h-screen p-2 sm:p-4' : 'min-h-[calc(100vh-140px)] py-4'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP CONTROL TOOLBAR                                                    */}
      {/* ========================================================================= */}
      <div className="w-full max-w-7xl mx-auto mb-3 px-3 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        {/* Left: Slide Indicator & Mode switcher */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-[#14213d] border border-sky-500/40 text-sky-300 font-mono font-bold text-xs">
            Slide {currentSlide + 1} / {totalSlides}
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {slideTitles[currentSlide]}
          </span>
        </div>

        {/* Center: Stopwatch / Timer (06:00 budget) */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={toggleTimer}
            title={isTimerRunning ? 'Tạm dừng timer' : 'Bắt đầu timer'}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          
          <span 
            className={`font-mono text-xs font-bold ${
              timerSeconds >= 345 
                ? 'text-rose-400 animate-pulse' 
                : timerSeconds >= 300 
                  ? 'text-amber-400' 
                  : 'text-sky-400'
            }`}
          >
            {formatTime(timerSeconds)} / 06:00
          </span>

          <button
            type="button"
            onClick={resetTimer}
            title="Reset timer về 00:00"
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Actions & Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Previous / Next buttons */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* View Mode Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'single' ? 'scroll' : 'single')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition hidden md:flex items-center gap-1.5 cursor-pointer"
            title={viewMode === 'single' ? 'Chuyển sang cuộn xem tất cả' : 'Chuyển sang chiếu từng slide'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === 'single' ? 'Dạng cuộn' : 'Dạng slide'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition flex items-center justify-center cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ (F)' : 'Toàn màn hình (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SLIDE DISPLAY AREA                                                     */}
      {/* ========================================================================= */}
      {viewMode === 'single' ? (
        /* SINGLE SLIDE PRESENTATION MODE (16:9 RATIO STAGE) */
        <div className="flex-1 w-full flex items-center justify-center px-1 sm:px-4">
          <div className="w-full max-w-6xl aspect-[16/9] bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-slate-700/60 overflow-hidden relative transition-all">
            {renderSlideContent(currentSlide)}
          </div>
        </div>
      ) : (
        /* CONTINUOUS SCROLL VIEW OF ALL 6 SLIDES */
        <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-full aspect-[16/9] bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-slate-700/60 overflow-hidden relative"
            >
              <div className="absolute top-3 right-4 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono">
                Slide {idx + 1}
              </div>
              {renderSlideContent(idx)}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BOTTOM SLIDE THUMBNAIL QUICK-BAR                                       */}
      {/* ========================================================================= */}
      <div className="w-full max-w-7xl mx-auto mt-4 px-2">
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {slideTitles.map((title, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                goToSlide(idx);
                setViewMode('single');
              }}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                currentSlide === idx && viewMode === 'single'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="text-[10px] sm:text-xs font-mono font-bold truncate">
                {title}
              </div>
            </button>
          ))}
        </div>

        {/* Keyboard shortcut legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-2 px-1 font-mono">
          <span>Phím tắt: [→ / Space] Tiếp · [← / Backspace] Lùi · [F] Toàn màn hình · [T] Bật/Tắt Timer · [1-6] Chọn slide</span>
          <span className="text-slate-400">CP6 · Track E · Vinonymus</span>
        </div>
      </div>

    </div>
  );
}
