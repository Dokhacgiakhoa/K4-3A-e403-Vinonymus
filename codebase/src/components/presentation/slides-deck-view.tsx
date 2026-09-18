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
  Info,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Bot,
  UserCheck,
  GraduationCap,
  Clock,
  BookOpen,
  Database,
  Lock,
  ListChecks,
  Compass
} from 'lucide-react';

export function SlidesDeckView() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('single');
  
  // Timer state for 6-minute pitch (30s per slide x 12 slides)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 12;

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
      } else if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        goToSlide(parseInt(e.key, 10) - 1);
      } else if (e.key === '0') {
        e.preventDefault();
        goToSlide(9);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideTitles = [
    '1. Bìa dự án',
    '2. Mục lục',
    '3. Tổng quan 2 AI',
    '4. User & Job',
    '5. Vì sao chọn',
    '6. Giải pháp',
    '7. Live Demo',
    '8. Kết quả đo',
    '9. Người dùng thật',
    '10. Kiến trúc an toàn',
    '11. Kế hoạch 1 tuần',
    '12. Tổng kết & Q&A'
  ];

  // Render individual slide contents (Font Montserrat, Nền trắng chữ xanh)
  const renderSlideContent = (index: number) => {
    switch (index) {
      // -------------------------------------------------------------
      // SLIDE 1: MỞ ĐẦU · BÌA DỰ ÁN
      // -------------------------------------------------------------
      case 0:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>NHÓM VINONYMUS · TRACK E · PHÒNG E403 · CỤM C2</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] mt-4 sm:mt-6 mb-4 leading-tight tracking-tight">
                ADAPTIVE LEARNING SYSTEM
              </h1>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1d4ed8] leading-snug max-w-5xl">
                Trước mỗi buổi lab, AI Mentor chỉ cho học viên Khoá 4 đúng ≤3 việc cần học — vừa quỹ thời gian, kèm link đã kiểm chứng.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 max-w-5xl">
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-6">
                  <div className="text-4xl sm:text-5xl font-black text-rose-600">87%</div>
                  <div className="text-sm sm:text-base text-slate-700 font-semibold mt-2">
                    71/82 học viên không tự xác định được phần cần học bù trước buổi lab.
                  </div>
                </div>
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-6">
                  <div className="text-4xl sm:text-5xl font-black text-blue-700">0.13%</div>
                  <div className="text-sm sm:text-base text-slate-700 font-semibold mt-2">
                    Lượt chat AI Tutor VLearn tự gợi ý bước học tiếp theo (18/13.494).
                  </div>
                </div>
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-6">
                  <div className="text-4xl sm:text-5xl font-black text-emerald-700">19/20</div>
                  <div className="text-sm sm:text-base text-slate-700 font-semibold mt-2">
                    AI v2 đạt chuẩn Quality Bar khoá tại CP4, 0 link ngoài catalog.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-6 flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-600 font-semibold">
              <span>Thành viên: Đỗ Khắc Gia Khoa (PM · Backend) · Minh (Database) · Đức (AI) · Thành (UI)</span>
              <span className="font-mono text-blue-700 font-bold">Thời lượng pitch: 6 phút (30s / slide)</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 2: MỞ ĐẦU · MỤC LỤC RÕ RÀNG
      // -------------------------------------------------------------
      case 1:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Mục lục · Cấu trúc bài thuyết trình (6 phút)
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-6 leading-tight">
                4 phần rõ ràng: Mở bài – Thân bài A – Thân bài B – Kết luận
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                {/* Phần 1 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2.5 text-blue-700 font-bold text-base lg:text-lg mb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    <span>MỞ ĐẦU (1 phút · Slide 1–3)</span>
                  </div>
                  <ul className="space-y-1.5 text-sm lg:text-base text-slate-700 font-medium pl-9 list-disc">
                    <li>Bối cảnh Khoá 4 &amp; Nỗi đau dữ liệu thật</li>
                    <li>Mục lục toàn diện</li>
                    <li>Mô hình 2 AI: AI Mentor (thực thi) vs AI Helpdesk (trò chuyện)</li>
                  </ul>
                </div>

                {/* Phần 2 */}
                <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 lg:p-6 hover:border-blue-400 transition">
                  <div className="flex items-center gap-2.5 text-blue-800 font-bold text-base lg:text-lg mb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center text-xs">2</span>
                    <span>THÂN BÀI A · YÊU CẦU ĐỀ (2.5 phút · Slide 4–8)</span>
                  </div>
                  <ul className="space-y-1.5 text-sm lg:text-base text-slate-800 font-medium pl-9 list-disc">
                    <li>User &amp; Job: 87% không biết học bù, 93% tài liệu rải rác</li>
                    <li>Vì sao chọn tính năng: Loại 2 ứng viên, chọn chẩn đoán thời gian</li>
                    <li>Giải pháp Augment &amp; LIVE DEMO trên web thật</li>
                    <li>Kết quả đo lường Quality Bar &amp; sự thật về case G02</li>
                  </ul>
                </div>

                {/* Phần 3 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2.5 text-blue-700 font-bold text-base lg:text-lg mb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>THÂN BÀI B · MỞ RỘNG (1.5 phút · Slide 9–10)</span>
                  </div>
                  <ul className="space-y-1.5 text-sm lg:text-base text-slate-700 font-medium pl-9 list-disc">
                    <li>Người dùng thật nói gì &amp; Bằng chứng Golden Set</li>
                    <li>Kiến trúc an toàn: BYOK trên browser, Zod guardrail, .NET 10 CQRS, 4 vai trò</li>
                  </ul>
                </div>

                {/* Phần 4 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:p-6 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2.5 text-blue-700 font-bold text-base lg:text-lg mb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">4</span>
                    <span>KẾT LUẬN (1 phút · Slide 11–12)</span>
                  </div>
                  <ul className="space-y-1.5 text-sm lg:text-base text-slate-700 font-medium pl-9 list-disc">
                    <li>Nếu có thêm 1 tuần: 5 user test, test CV, thư viện giảng viên</li>
                    <li>Bài học lớn nhất: Đo sớm, số thật &amp; Mời Ban giám khảo Q&amp;A</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Cam kết: Phần nào chưa xong ghi rõ "Đang triển khai" và không demo giả tạo</span>
              <span className="font-mono text-blue-700">spec.md §9 · AGENTS.md</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 3: MỞ ĐẦU · TỔNG QUAN 2 AI
      // -------------------------------------------------------------
      case 2:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Mở đầu · Định vị hệ thống
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-6 leading-tight">
                Một hệ thống học thích ứng — Hai AI phân vai độc lập
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* AI MENTOR */}
                <div className="bg-blue-50/70 border-2 border-blue-400 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase mb-4">
                      <Bot className="w-4 h-4" />
                      <span>PHẦN ĐƯỢC CHẤM HÔM NAY · ĐÃ CHẠY</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-blue-900 mb-2">
                      AI Mentor — AI Thực Thi
                    </h2>
                    <p className="text-base lg:text-lg text-slate-700 font-medium leading-relaxed mb-4">
                      <strong>Không trò chuyện bằng chatbox.</strong> AI Mentor chạy ngầm phía sau, đọc dữ liệu nền tảng và thời gian rảnh của học viên để đưa ra quyết định lập lộ trình ≤3 việc.
                    </p>
                    <div className="p-3.5 bg-white rounded-xl border border-blue-200 text-sm text-blue-950 font-semibold">
                      ✓ Tính năng: Lộ trình cá nhân hoá (/personalized-path)<br/>
                      ✓ Trọng tâm: Quyết định học gì trước, bỏ gì lại, link 100% catalog.
                    </div>
                  </div>
                </div>

                {/* AI HELPDESK */}
                <div className="bg-slate-50 border border-slate-300 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-white text-xs font-bold uppercase mb-4">
                      <Compass className="w-4 h-4" />
                      <span>AI HỖ TRỢ TƯƠNG TÁC · ĐÃ CHẠY</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">
                      AI Helpdesk — AI Trò Chuyện
                    </h2>
                    <p className="text-base lg:text-lg text-slate-700 font-medium leading-relaxed mb-4">
                      <strong>AI duy nhất học viên nói chuyện cùng trong chatbox.</strong> Hỗ trợ tra cứu nhanh tài liệu, hỏi đáp thắc mắc lý thuyết và câu hỏi thường gặp (FAQ).
                    </p>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 font-semibold">
                      ✓ Dựa trên kho 53 bài FAQ &amp; RAG vector tìm kiếm.<br/>
                      ✓ Hạn mức: Khách 10 câu/ngày · Học viên không giới hạn.
                    </div>
                  </div>
                </div>
              </div>

              {/* Data evidence footer */}
              <div className="mt-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold flex flex-wrap justify-between items-center">
                <span>Dữ liệu nền tảng: Khảo sát 82 học viên · 13.494 lượt chat AI Tutor VLearn · 779 tin Discord · 2 phỏng vấn sâu</span>
                <span className="font-mono text-blue-700 font-bold">spec.md §1</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold">
              Khoá 4 · AI in Action · Track E: Adaptive Learning System
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 4: THÂN BÀI A · 1/6: USER & JOB
      // -------------------------------------------------------------
      case 3:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài A · 1/6: User &amp; Job
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-3 leading-tight">
                Học viên Khoá 4 trước mỗi buổi lab: không biết phải học bù phần nào
              </h1>
              <p className="text-base sm:text-xl lg:text-2xl text-slate-700 leading-relaxed font-medium">
                <strong className="text-blue-900">Job:</strong> với quỹ thời gian rảnh hôm nay và trình độ của mình, biết chính xác cần học gì để làm kịp bài lab tiếp theo.
              </p>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-6">
                <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-200/90 shadow-sm">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-rose-600 leading-none">87%</div>
                  <div className="text-base sm:text-lg text-slate-800 mt-3 leading-snug font-bold">
                    71/82 học viên không tự xác định được phần cần học bù trước buổi lab.
                  </div>
                </div>
                <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-200/90 shadow-sm">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-rose-600 leading-none">93%</div>
                  <div className="text-base sm:text-lg text-slate-800 mt-3 leading-snug font-bold">
                    76/82 học viên gặp tình trạng tài liệu rải rác nhiều nơi (Discord, Zoom, Drive, VLearn, GitHub).
                  </div>
                </div>
                <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-200/90 shadow-sm">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-blue-700 leading-none">0.13%</div>
                  <div className="text-base sm:text-lg text-slate-800 mt-3 leading-snug font-bold">
                    lượt chat AI Tutor VLearn tự gợi ý bước học tiếp theo (18/13.494 lượt).
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-6 border-l-6 border-blue-600 pl-5 py-2.5 bg-slate-50 rounded-r-2xl">
                <p className="text-lg sm:text-xl italic text-blue-950 font-semibold leading-relaxed">
                  “Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.”
                </p>
                <div className="text-sm text-slate-500 mt-1 font-medium">
                  — P02, học viên nền AI (phỏng vấn sâu ngày 16/9)
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Nguồn: khảo sát form n = 82 · vlearn-pack 13.494 lượt chat · phỏng vấn P02 16/9</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §1</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 5: THÂN BÀI A · 2/6: VÌ SAO CHỌN TÍNH NĂNG
      // -------------------------------------------------------------
      case 4:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài A · 2/6: Vì sao chọn tính năng
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                3 ứng viên — chọn cái có “một quyết định AI” rõ ràng
              </h1>

              {/* Selection Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-300 shadow-sm mt-4">
                <table className="w-full text-left text-sm sm:text-base border-collapse">
                  <thead>
                    <tr className="bg-[#0f172a] text-white">
                      <th className="p-4 font-bold w-[34%]">Ứng viên giải pháp</th>
                      <th className="p-4 font-bold">Bằng chứng thực nghiệm</th>
                      <th className="p-4 font-bold w-[30%]">Quyết định lựa chọn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white">
                      <td className="p-4 font-semibold text-slate-900">(1) Tổng hợp link tài liệu phân mảnh</td>
                      <td className="p-4 text-slate-700">76/82 (93%) gặp tài liệu rải rác</td>
                      <td className="p-4 text-rose-700 font-bold">Loại — chỉ là tra cứu, không có quyết định AI</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-4 font-semibold text-slate-900">(2) Tóm tắt trọng tâm bài giảng</td>
                      <td className="p-4 text-slate-700">75/82 (91%) gặp slide dài; 8.8% chat xin tóm tắt</td>
                      <td className="p-4 text-rose-700 font-bold">Loại — trùng lõi Track A (AI Tutor)</td>
                    </tr>
                    <tr className="bg-emerald-50 font-bold text-blue-950">
                      <td className="p-4 text-emerald-800 flex items-center gap-2 text-base lg:text-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>(3) Chẩn đoán nền tảng + thời gian → ≤3 việc</span>
                      </td>
                      <td className="p-4 text-slate-900">
                        71/82 (87%) không biết học bù; 41/82 (50%) rảnh dưới 1 tiếng
                      </td>
                      <td className="p-4 text-emerald-800 font-extrabold">
                        CHỌN — catalog đã kiểm chứng giải luôn một phần (1)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signal */}
              <div className="mt-6 p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-blue-700 tracking-wider block">Tín hiệu chấp nhận giải pháp</span>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    <span className="text-emerald-700 text-2xl sm:text-3xl font-black">74/82 (90%)</span> học viên muốn dùng checklist 3 việc theo số phút rảnh mỗi ngày.
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-extrabold font-mono">
                  Strong Demand
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Nguồn: bảng impact spec.md §2 · khảo sát n = 82 · docs/research/evidence-mining.md</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §2</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 6: THÂN BÀI A · 3/6: GIẢI PHÁP
      // -------------------------------------------------------------
      case 5:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài A · 3/6: Giải pháp
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                Lộ trình cá nhân hoá: Tối đa 3 việc, kèm link đã kiểm chứng
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">1</div>
                  <h2 className="text-lg lg:text-xl font-bold text-blue-900 mb-2">Khai báo đơn giản</h2>
                  <p className="text-sm lg:text-base text-slate-700 font-medium leading-relaxed">
                    Học viên chỉ cần chọn nền tảng (non-tech / tech / AI), số phút rảnh hôm nay và bài lab tiếp theo cần học.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">2</div>
                  <h2 className="text-lg lg:text-xl font-bold text-blue-900 mb-2">Quyết định AI có căn cứ</h2>
                  <p className="text-sm lg:text-base text-slate-700 font-medium leading-relaxed">
                    AI Mentor trả đúng <strong>≤3 việc trọng tâm</strong>, có lý do rõ ràng, thời lượng vừa vặn và link <strong>chỉ lấy từ catalog đã kiểm chứng</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">3</div>
                  <h2 className="text-lg lg:text-xl font-bold text-blue-900 mb-2">Bảo vệ &amp; Guardrail</h2>
                  <p className="text-sm lg:text-base text-slate-700 font-medium leading-relaxed">
                    Dưới 30 phút hoặc mâu thuẫn $\rightarrow$ <strong>hỏi lại</strong>. Xin làm hộ, xin đáp án lab, xin deadline $\rightarrow$ <strong>từ chối ngay</strong>.
                  </p>
                </div>
              </div>

              {/* Augment Callout */}
              <div className="mt-6 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <h3 className="text-base lg:text-lg font-bold text-emerald-800 mb-1">
                  Mức tự động hoá: Augment (Hỗ trợ ra quyết định)
                </h3>
                <p className="text-sm lg:text-base text-slate-800 font-medium leading-relaxed">
                  AI chỉ đề xuất, học viên tự tick hoàn thành, tự đổi thứ tự. <strong>Cost-of-error cực thấp:</strong> gợi ý sai chỉ mất vài chục phút đọc nhầm tài liệu — hoàn toàn không ảnh hưởng điểm số, không trễ hạn nộp.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Luồng chi tiết: docs/05-ui-flow.md · docs/04-ai-pipeline.md</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §4, §6</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 7: THÂN BÀI A · 3/6: LIVE DEMO TRÊN SÂN KHẤU
      // -------------------------------------------------------------
      case 6:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài A · 3/6: Live Demo trên sân khấu (60–80s)
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                Chứng minh thực tế: 1 Case chuẩn &amp; 2 Case khó
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-4">
                {/* Case 1 */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-900 text-white text-xs font-bold">
                      ① Case chuẩn (Happy Path)
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">ĐÃ CHẠY THẬT</span>
                  </div>
                  <h3 className="text-lg font-bold text-blue-950 mb-1">Nền Tech · 60 phút · Lab tiếp theo</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    AI sinh đúng 3 nhiệm vụ, tổng thời lượng không vượt quá 60 phút, 100% link nằm trong catalog đã xác thực, có nhãn "AI".
                  </p>
                </div>

                {/* Case 2 */}
                <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-rose-700 text-white text-xs font-bold">
                      ② Case từ chối (Guardrail G16)
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-700">BẢO VỆ VLEARN</span>
                  </div>
                  <h3 className="text-lg font-bold text-rose-950 mb-1">Ghi chú “Làm hộ bài lab / cho đáp án”</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    AI Mentor từ chối dứt khoát, viện dẫn nguyên tắc liêm chính học thuật và chỉ đường kết nối với Lab Coach. Tuyệt đối không leak đáp án.
                  </p>
                </div>
              </div>

              {/* Case 3 & Invitation */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-600 block">③ Case hỏi lại khi mâu thuẫn (G14)</span>
                  <span className="text-sm text-slate-800 font-semibold">
                    Khai non-tech nhưng nói “đã deploy RAG production” $\rightarrow$ AI hỏi lại thay vì bịa đặt đoán mò.
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold font-mono shrink-0">
                  Thẻ mời BGK thử
                </span>
              </div>

              {/* ACTION BUTTON */}
              <div className="mt-5">
                <Link
                  href="/personalized-path"
                  target="_blank"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-3"
                >
                  <Monitor className="w-5 h-5 text-sky-300" />
                  <span>🚀 MỞ TRANG LIVE DEMO THỰC TẾ (/personalized-path)</span>
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Web: k4-3a-e403-vinonymus.kailabs.io.vn/personalized-path · Có video dự phòng</span>
              <span className="font-mono text-blue-700 font-bold">CP5 Demo Video</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 8: THÂN BÀI A · 4/6: KẾT QUẢ ĐO LƯỜNG
      // -------------------------------------------------------------
      case 7:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài A · 4/6: Kết quả đo
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                Đạt Quality Bar khoá tại CP4: AI v2 19/20, 0 link ngoài catalog
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 mt-3">
                {/* Metric Table */}
                <div className="md:col-span-6 space-y-4">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-slate-800 font-semibold">
                    Quality Bar (khoá 21:00 · 17/9): ≥18/20 case đạt VÀ 0 URL ngoài VÀ 3/3 refuse.
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-300 shadow-sm">
                    <table className="w-full text-left text-sm lg:text-base border-collapse">
                      <thead>
                        <tr className="bg-[#0f172a] text-white">
                          <th className="p-3.5 font-bold">Lượt chạy thử nghiệm</th>
                          <th className="p-3.5 font-bold">Tỷ lệ đạt</th>
                          <th className="p-3.5 font-bold">Link ngoài</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="bg-white">
                          <td className="p-3.5 font-medium text-slate-800">Baseline luật tĩnh (20 case)</td>
                          <td className="p-3.5 font-bold text-slate-800">17/20 · 85%</td>
                          <td className="p-3.5 text-emerald-700 font-bold">0</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="p-3.5 font-medium text-slate-800">AI v1 · Gemini Flash-Lite</td>
                          <td className="p-3.5 font-bold text-slate-800">18/20 · 90%</td>
                          <td className="p-3.5 text-emerald-700 font-bold">0</td>
                        </tr>
                        <tr className="bg-emerald-50 font-bold text-blue-950">
                          <td className="p-3.5 text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>AI v2 · Gemini Flash-Lite</span>
                          </td>
                          <td className="p-3.5 text-emerald-800 text-lg font-black">19/20 · 95%</td>
                          <td className="p-3.5 text-emerald-800 text-lg font-black">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Failure Case G02 */}
                <div className="md:col-span-6 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-300">
                    <h3 className="text-base font-bold text-rose-700 flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Failure đáng kể nhất: Case G02 (Nói thật)</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Gemini chọn đúng tài liệu <code className="bg-white px-1.5 py-0.5 rounded border text-xs font-mono font-bold text-slate-900">ptc-function-calling</code> nhưng xếp thứ ba; hậu kiểm giới hạn 60 phút loại mất item này. Không bịa link, không rơi về baseline — nhóm giữ nguyên con số 19/20, không sửa để lấy điểm ảo.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    <span className="font-bold text-blue-950 flex items-center gap-1 mb-1">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span>Bộ mở rộng 50 case 2 đối tượng:</span>
                    </span>
                    40 case nhu cầu học viên + 10 case bảo vệ nền tảng VLearn (chống leak lab, chống lách deadline, chống DoS, lỗi 404).
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Nguồn: eval/run_results.md · eval/latest-ai-results.json</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §7</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 9: THÂN BÀI B · 5/6: NGƯỜI DÙNG THẬT NÓI GÌ
      // -------------------------------------------------------------
      case 8:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài B · 5/6: Người dùng thật nói gì
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                Chưa hoàn thành 5 buổi dùng thử — Nói thẳng thay vì tô vẽ
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Real interview */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-lg font-bold text-blue-900">Phỏng vấn sâu trước khi build (16/9)</h3>
                  <div className="border-l-4 border-blue-600 pl-4 py-1.5">
                    <p className="text-base italic text-slate-900 font-semibold">
                      “Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu.”
                    </p>
                    <span className="text-xs text-slate-500 block mt-1 font-medium">— P01, học viên nền tech</span>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4 py-1.5">
                    <p className="text-base italic text-slate-900 font-semibold">
                      “Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.”
                    </p>
                    <span className="text-xs text-slate-500 block mt-1 font-medium">— P02, học viên nền AI</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-sm font-bold text-emerald-800">
                    ✓ 71/82 (87%) người khảo sát xác nhận sẵn sàng dùng thử ở vòng tiếp theo.
                  </div>
                </div>

                {/* Golden set instead */}
                <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-200 space-y-3.5">
                  <h3 className="text-lg font-bold text-blue-950">Đo kiểm bằng Golden Set (Theo luật đề §5.1)</h3>
                  <ul className="space-y-3 text-sm sm:text-base text-slate-800 font-medium">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>AI v2 <strong>đạt</strong> Quality Bar: 19/20 case, 0 link ngoài catalog.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>3/3 case ngoài phạm vi</strong> (xin đáp án, nộp muộn, system prompt) $\rightarrow$ <strong>từ chối</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-rose-700">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <span>Chưa đạt: <strong>G02</strong> — thiếu 1 tài liệu do giới hạn 60 phút.</span>
                    </li>
                  </ul>
                  <div className="pt-2 text-xs text-slate-500 border-t border-slate-200">
                    Nhật ký dùng thử: <code>validation/log.md</code> (chưa đủ 5 người ngoài nhóm trước hạn nộp).
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Nguồn: docs/research/survey-log.md · 02-guide §5.1</span>
              <span className="font-mono text-blue-700 font-bold">validation/log.md</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 10: THÂN BÀI B · KIẾN TRÚC KỸ THUẬT AN TOÀN
      // -------------------------------------------------------------
      case 9:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Thân bài B · Kiến trúc kỹ thuật &amp; An toàn
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                An toàn trước, AI sau: Bảo vệ dữ liệu &amp; Nền tảng
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">BYOK Trình Duyệt</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    API key người dùng chỉ nằm tại LocalStorage trình duyệt, gửi kèm từng request, server không lưu trữ, không log.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Pipeline Định Tuyến &amp; Hậu Kiểm</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Validate Zod $\rightarrow$ Luật cứng $\rightarrow$ Router gọi 7 LLMs $\rightarrow$ Hậu kiểm catalog (loại bỏ 100% URL không xác thực).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">.NET 10 CQRS &amp; 4 Vai Trò</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Clean Architecture, 60 unit/integration tests tự động. Kiểm soát 4 vai trò (Viewer, Student, Lecturer, Admin) chống lạm dụng chi phí LLM.
                  </p>
                </div>
              </div>

              {/* Invariant */}
              <div className="mt-5 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-slate-800 font-semibold">
                Bất biến #4: Nội dung người dùng nhập luôn là <strong>DỮ LIỆU</strong>, không phải lệnh — bọc trong thẻ XML riêng biệt trước khi nạp prompt.
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Tài liệu: docs/02-kien-truc.md · docs/04-ai-pipeline.md · docs/06-backend-dotnet.md</span>
              <span className="font-mono text-blue-700 font-bold">AGENTS.md</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 11: KẾT LUẬN · NẾU CÓ THÊM 1 TUẦN
      // -------------------------------------------------------------
      case 10:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Kết luận · Kế hoạch hành động
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mt-2 mb-4 leading-tight">
                Nếu có thêm 1 tuần: 3 việc ưu tiên trỏ thẳng vào lỗ hổng
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-4">
                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm mb-3">1</div>
                  <h3 className="text-lg font-bold text-blue-950 mb-1.5">5 buổi user test thật</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Giao task, ngồi im quan sát, ghi quote nguyên văn — hoàn thành đúng phần còn thiếu ở mốc CP5.
                  </p>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm mb-3">2</div>
                  <h3 className="text-lg font-bold text-blue-950 mb-1.5">Bài test chẩn đoán từ CV</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    74/82 (90%) học viên muốn có; thay thế dữ liệu tự khai bằng năng lực đo kiểm khách quan.
                  </p>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm mb-3">3</div>
                  <h3 className="text-lg font-bold text-blue-950 mb-1.5">Thư viện tài liệu giảng viên</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Giảng viên tự tải tài liệu lên, AI Mentor tự động nạp vào thư viện thay cho catalog soạn tay.
                  </p>
                </div>
              </div>

              {/* Core Lesson */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-[#1e3a8a] text-white shadow-lg">
                <div className="text-xs uppercase font-extrabold text-sky-300 tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span>Bài học lớn nhất của nhóm Vinonymus</span>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed">
                  Chốt chuẩn “đạt” (Quality Bar) và đo kiểm bằng Golden Set từ sớm giúp nhóm tự tin báo cáo bằng số liệu thật — kể cả khi con số đó chưa hoàn hảo.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Chi tiết 31 task: docs/hackathon/tasks-he-thong-4-vai-tro.md</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §9</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 12: KẾT LUẬN · TỔNG KẾT & HỎI ĐÁP
      // -------------------------------------------------------------
      case 11:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif]">
            <div>
              <div className="text-sm sm:text-base font-bold text-blue-700 tracking-wider uppercase">
                Kết luận · Tổng kết &amp; Hỏi đáp (Q&amp;A)
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] mt-2 mb-6 leading-tight">
                Cảm ơn Ban giám khảo — Mời đặt câu hỏi
              </h1>

              {/* 4 Key Commitments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-base font-bold text-slate-900">Nỗi đau có số liệu thật</div>
                    <div className="text-sm text-slate-600 font-medium">87% học viên không biết học bù phần nào (71/82 người khảo sát).</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-base font-bold text-slate-900">AI Mentor đạt chuẩn chất lượng</div>
                    <div className="text-sm text-slate-600 font-medium">19/20 case đạt, 0 URL ngoài catalog đã kiểm chứng.</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-base font-bold text-slate-900">Biết từ chối, biết hỏi lại</div>
                    <div className="text-sm text-slate-600 font-medium">3/3 case gian lận bị chặn, bảo vệ liêm chính học thuật VLearn.</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-base font-bold text-slate-900">Trung thực tuyệt đối</div>
                    <div className="text-sm text-slate-600 font-medium">Nêu rõ case trượt G02, nói thẳng phần đang làm, không demo khống.</div>
                  </div>
                </div>
              </div>

              {/* Team Q&A Roles */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl">
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-extrabold text-blue-950 text-base">Khoa (Pitcher)</div>
                  <div className="text-xs text-blue-800 font-semibold mt-0.5">Nỗi đau, Quyết định, Backend</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-extrabold text-blue-950 text-base">Thành</div>
                  <div className="text-xs text-blue-800 font-semibold mt-0.5">Giải pháp, UI, AI Mentor</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-extrabold text-blue-950 text-base">Đức</div>
                  <div className="text-xs text-blue-800 font-semibold mt-0.5">Prompt, Eval, Helpdesk</div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-extrabold text-blue-950 text-base">Minh</div>
                  <div className="text-xs text-blue-800 font-semibold mt-0.5">Database, 4 Vai trò, Schema</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 mt-4 text-xs text-slate-500 font-semibold flex justify-between">
              <span>Repo: github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus</span>
              <span className="font-mono text-blue-700 font-bold">K4-3A-E403 · Vinonymus</span>
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
      className={`w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Montserrat',sans-serif] select-none ${
        isFullscreen ? 'h-screen overflow-hidden' : ''
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. SLIM INTEGRATED TOP HEADER & PRESENTATION TOOLBAR (HEIGHT ~48px)       */}
      {/* ========================================================================= */}
      <header className="w-full h-12 shrink-0 bg-[#070d1e] border-b border-slate-800/80 px-3 sm:px-5 flex items-center justify-between gap-2 z-50">
        
        {/* Left: Back to Home + Slide Badge & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
            title="Quay lại trang chủ"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trang Chủ</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Current Slide Pill */}
          <div className="px-2.5 py-0.5 rounded-lg bg-blue-950 border border-blue-500/40 text-sky-300 font-mono font-bold text-xs truncate">
            Slide {currentSlide + 1} / {totalSlides}
          </div>

          <span className="text-xs text-slate-300 font-medium truncate hidden md:inline">
            {slideTitles[currentSlide]}
          </span>
        </div>

        {/* Center: Stopwatch / Pitch Timer (06:00 Budget, ~30s/slide) */}
        <div className="flex items-center gap-2 bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={toggleTimer}
            title={isTimerRunning ? 'Tạm dừng timer' : 'Bắt đầu timer'}
            className="p-0.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          
          <span 
            className={`font-mono text-xs font-bold tracking-wider ${
              timerSeconds >= 345 
                ? 'text-rose-400 animate-pulse font-black' 
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
            className="p-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Actions, Navigation, View Mode & Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Quick jump to Live Demo */}
          <Link
            href="/personalized-path"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-sky-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Mở tab Live Demo (/personalized-path)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Live Demo</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Prev / Next buttons */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition cursor-pointer"
            title="Slide trước (← / Backspace)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition cursor-pointer"
            title="Slide sau (→ / Space)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* View mode toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'single' ? 'scroll' : 'single')}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition hidden md:flex items-center gap-1 cursor-pointer"
            title={viewMode === 'single' ? 'Chuyển sang cuộn xem tất cả' : 'Chuyển sang chiếu từng slide'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{viewMode === 'single' ? 'Cuộn' : 'Slide'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-blue-500/25 hover:bg-blue-500/35 text-sky-200 border border-blue-400/50 transition cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ (F)' : 'Toàn màn hình (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH SLIDE CANVAS (WHITE BG, BLUE TEXT, MONTSERRAT FONT)          */}
      {/* ========================================================================= */}
      {viewMode === 'single' ? (
        /* SINGLE SLIDE PRESENTATION MODE */
        <div className="flex-1 w-full bg-white overflow-y-auto flex flex-col justify-between">
          <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 py-8 sm:py-10 lg:py-12 flex-1 flex flex-col justify-between">
            {renderSlideContent(currentSlide)}
          </div>

          {/* Sleek bottom progress strip with 12 slide pills */}
          <div className="w-full bg-slate-100 border-t border-slate-200 px-3 sm:px-5 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
              {slideTitles.map((title, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold transition cursor-pointer shrink-0 ${
                    currentSlide === idx
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                  title={title}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-500 shrink-0">
              <span>[→ / Space] Tiếp · [← / Backspace] Lùi · [F] Fullscreen · [T] Timer · [1-9, 0] Slide</span>
              <span className="font-bold text-blue-900">Vinonymus · Track E</span>
            </div>
          </div>
        </div>
      ) : (
        /* CONTINUOUS SCROLL VIEW OF ALL 12 SLIDES */
        <div className="w-full flex-1 bg-slate-100 p-4 sm:p-8 space-y-8 overflow-y-auto">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-full max-w-[1700px] mx-auto bg-white rounded-2xl p-6 sm:p-12 lg:p-16 shadow-md border border-slate-300 relative min-h-[600px] flex flex-col justify-between font-['Montserrat',sans-serif]"
            >
              <div className="absolute top-4 right-6 px-3 py-1 rounded-full bg-blue-950 text-white text-xs font-mono font-bold">
                Slide {idx + 1} / {totalSlides} · {slideTitles[idx]}
              </div>
              {renderSlideContent(idx)}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
