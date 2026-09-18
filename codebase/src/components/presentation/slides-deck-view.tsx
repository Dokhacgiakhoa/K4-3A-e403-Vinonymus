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
  Compass,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Award
} from 'lucide-react';

export function SlidesDeckView() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('single');
  
  // Timer state for 6-minute pitch (30s per slide x 12 slides = 360s)
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
    '3. Mô hình 2 AI',
    '4. Khách hàng & Nỗi đau',
    '5. Lựa chọn bài toán',
    '6. Giải pháp & Triết lý',
    '7. Live Demo thực tế',
    '8. Đo lường & Trung thực',
    '9. Tiếng nói người dùng',
    '10. Business Model & Chi phí',
    '11. Kế hoạch tăng trưởng',
    '12. Kêu gọi & Q&A'
  ];

  // Render individual slide contents (Font Montserrat, Nền trắng chữ xanh, Tỉ lệ rem/em, Tổng-Phân-Hợp)
  const renderSlideContent = (index: number) => {
    switch (index) {
      // -------------------------------------------------------------
      // SLIDE 1: MỞ ĐẦU · ĐỊNH VỊ DỰ ÁN & GIÁ TRỊ KINH DOANH
      // -------------------------------------------------------------
      case 0:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="inline-flex items-center gap-[0.5rem] px-[0.85rem] py-[0.35rem] rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[0.8rem] font-semibold tracking-[0.06em] uppercase">
                <Sparkles className="w-[1rem] h-[1rem] text-blue-600" />
                <span>TRACK E · MINI HACKATHON AI · NHÓM VINONYMUS · PHÒNG E403</span>
              </div>

              <h1 className="text-[clamp(2rem,3.8vw,3.5rem)] font-semibold text-[#0f172a] mt-[1rem] mb-[0.75rem] leading-[1.2] tracking-[0.03em] uppercase">
                Adaptive Learning System
              </h1>

              <h2 className="text-[clamp(1.15rem,1.8vw,1.6rem)] font-medium text-blue-700 leading-relaxed max-w-[65rem]">
                Hệ thống AI thích ứng giải phóng người học khỏi tình trạng quá tải thông tin trước mỗi buổi thực hành.
              </h2>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.75rem] flex flex-col justify-between hover:border-blue-300 transition">
                <div>
                  <span className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider block">Nỗi đau thị trường</span>
                  <div className="text-[clamp(2.75rem,5vw,4.25rem)] font-bold text-rose-600 leading-none my-[0.75rem]">87%</div>
                </div>
                <p className="text-[0.95rem] text-slate-700 font-medium leading-relaxed">
                  Học viên không biết tự xác định lỗ hổng kiến thức để học bù trước giờ lên lớp.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.75rem] flex flex-col justify-between hover:border-blue-300 transition">
                <div>
                  <span className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider block">Thực trạng giải pháp cũ</span>
                  <div className="text-[clamp(2.75rem,5vw,4.25rem)] font-bold text-blue-700 leading-none my-[0.75rem]">0.13%</div>
                </div>
                <p className="text-[0.95rem] text-slate-700 font-medium leading-relaxed">
                  AI Tutor thụ động, chỉ 18/13.494 lượt chat có hành động tự gợi ý bước học tiếp theo.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.75rem] flex flex-col justify-between hover:border-blue-300 transition">
                <div>
                  <span className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider block">Chất lượng đã chứng minh</span>
                  <div className="text-[clamp(2.75rem,5vw,4.25rem)] font-bold text-emerald-600 leading-none my-[0.75rem]">95%</div>
                </div>
                <p className="text-[0.95rem] text-slate-700 font-medium leading-relaxed">
                  19/20 ca kiểm thử đạt chuẩn nghiêm ngặt; 100% học liệu nội bộ đã qua thẩm định.
                </p>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[1rem] flex flex-wrap justify-between items-center text-[0.85rem] text-slate-600 font-medium">
              <span>Đội ngũ: Đỗ Khắc Gia Khoa (PM · Backend) · Minh (Database) · Đức (AI) · Thành (UI)</span>
              <span className="font-mono text-blue-700 font-bold bg-blue-50 px-[0.75rem] py-[0.25rem] rounded-md">
                Pitch 6 phút · 12 Slide (30s / slide)
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 2: MỞ ĐẦU · MỤC LỤC & LỘ TRÌNH THUYẾT TRÌNH
      // -------------------------------------------------------------
      case 1:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Cấu trúc bài thuyết trình (6 phút)
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Bản đồ thuyết trình theo mô hình Tổng – Phân – Hợp
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Mỗi chặng tập trung giải quyết trọn vẹn một luận điểm then chốt trong kinh doanh và công nghệ.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-2 gap-[1.25rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex items-start gap-[1rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-[0.9rem] shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-[#0f172a] mb-[0.25rem]">Khách hàng &amp; Nỗi đau thực tế</h3>
                  <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                    Khảo sát 82 học viên: Nỗi đau mất 25 phút gom link, slide 60 trang nhưng chỉ có 45 phút học.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex items-start gap-[1rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-[0.9rem] shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-blue-950 mb-[0.25rem]">Lựa chọn bài toán &amp; Live Demo</h3>
                  <p className="text-[0.875rem] text-slate-700 font-medium leading-relaxed">
                    So sánh 3 cơ hội thị trường $\rightarrow$ Giải pháp Lộ trình cá nhân hoá &amp; Demo ứng dụng chạy thật.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex items-start gap-[1rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-[0.9rem] shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-[#0f172a] mb-[0.25rem]">Đo lường &amp; Kiến trúc an toàn</h3>
                  <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                    Quality Bar 19/20, báo cáo trung thực case G02, bảo vệ dữ liệu với BYOK và kiểm soát 4 vai trò.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex items-start gap-[1rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-[0.9rem] shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-[#0f172a] mb-[0.25rem]">Business Model &amp; Kế hoạch tăng trưởng</h3>
                  <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                    Kiểm soát chi phí API dưới 5.000đ/học viên, 3 đòn bẩy nếu có thêm 1 tuần và cam kết bảo vệ hội trường.
                  </p>
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[1rem] flex justify-between items-center text-[0.85rem] text-slate-500 font-medium">
              <span>Mỗi phần trình bày trong 1.5 phút — Nhịp điệu dứt khoát, trực diện</span>
              <span className="text-blue-700 font-semibold font-mono">Bất biến: Không demo giả lập</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 3: MÔ HÌNH 2 AI TỐI ƯU CHI PHÍ & TRẢI NGHIỆM
      // -------------------------------------------------------------
      case 2:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Mô hình vận hành hệ thống
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Kiến trúc 2 AI: Phân tách Tiền sảnh &amp; Hậu trường
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Tối ưu hoá trải nghiệm học viên đồng thời bảo vệ chi phí token qua việc phân định rõ chức năng.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-2 gap-[1.75rem]">
              <div className="bg-blue-50/70 border-2 border-blue-400 rounded-[1.5rem] p-[2rem] flex flex-col justify-between shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-blue-600 text-white text-[0.75rem] font-bold uppercase mb-[1rem]">
                    <Bot className="w-[1rem] h-[1rem]" />
                    <span>HẬU TRƯỜNG (BACK-OFFICE) · ĐƯỢC CHẤM HÔM NAY</span>
                  </div>
                  <h3 className="text-[1.4rem] font-bold text-blue-950 mb-[0.5rem]">AI Mentor — AI Thực Thi Quyết Định</h3>
                  <p className="text-[0.95rem] text-slate-700 font-medium leading-relaxed mb-[1rem]">
                    Không tương tác qua hội thoại tán gẫu. AI Mentor chỉ kích hoạt khi học viên yêu cầu tạo lộ trình, phân tích quỹ thời gian và may đo chính xác ≤3 đầu việc trọng tâm.
                  </p>
                </div>
                <div className="bg-white p-[1rem] rounded-xl border border-blue-200 text-[0.85rem] text-blue-900 font-semibold">
                  ✓ Tiết kiệm chi phí: Chỉ gọi LLM khi cần ra quyết định lớn.<br/>
                  ✓ Link học liệu 100% trích xuất từ catalog nội bộ đã thẩm định.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-300 rounded-[1.5rem] p-[2rem] flex flex-col justify-between shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-slate-700 text-white text-[0.75rem] font-bold uppercase mb-[1rem]">
                    <Compass className="w-[1rem] h-[1rem]" />
                    <span>TIỀN SẢNH (FRONT-OFFICE) · ĐỒNG HÀNH 24/7</span>
                  </div>
                  <h3 className="text-[1.4rem] font-bold text-slate-900 mb-[0.5rem]">AI Helpdesk — Trợ Lý Hội Thoại</h3>
                  <p className="text-[0.95rem] text-slate-700 font-medium leading-relaxed mb-[1rem]">
                    Kênh giao tiếp duy nhất học viên trò chuyện trực tiếp trong chatbox. Giải đáp thắc mắc tài liệu, giải thích thuật ngữ khó và hỗ trợ tìm kiếm dựa trên 53 bài FAQ chuẩn.
                  </p>
                </div>
                <div className="bg-white p-[1rem] rounded-xl border border-slate-200 text-[0.85rem] text-slate-800 font-semibold">
                  ✓ Phễu chuyển đổi: Khách vãng lai 10 câu/ngày $\rightarrow$ Kích thích lên Pro.<br/>
                  ✓ Hạn chế rủi ro: Giới hạn phạm vi câu trả lời trong kho tri thức khoá học.
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[1rem] flex justify-between items-center text-[0.85rem] text-slate-600 font-medium">
              <span>Đòn bẩy: Học viên nhận đúng sự hỗ trợ, nền tảng kiểm soát được chi phí token</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §1 · README</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 4: KHÁCH HÀNG MỤC TIÊU & JOB-TO-BE-DONE
      // -------------------------------------------------------------
      case 3:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Thấu hiểu khách hàng mục tiêu
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Học viên Khoá 4: Người đi làm bận rộn cần sự tập trung
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                <strong>Job-to-be-Done:</strong> Trong 45–60 phút rảnh ít ỏi mỗi ngày, biết chính xác cần đọc tài liệu nào để hoàn thành bài lab tiếp theo mà không bị lạc trôi.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
              <div className="bg-blue-50/50 border border-blue-200 rounded-[1.25rem] p-[1.75rem]">
                <div className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold text-rose-600 mb-[0.5rem]">87%</div>
                <h4 className="text-[1.05rem] font-semibold text-[#0f172a] mb-[0.5rem]">Mất phương hướng tự học</h4>
                <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                  71/82 học viên thừa nhận không biết mình hổng phần nào và nên học bài nào trước buổi thực hành.
                </p>
              </div>

              <div className="bg-blue-50/50 border border-blue-200 rounded-[1.25rem] p-[1.75rem]">
                <div className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold text-rose-600 mb-[0.5rem]">93%</div>
                <h4 className="text-[1.05rem] font-semibold text-[#0f172a] mb-[0.5rem]">Tài liệu bị phân mảnh</h4>
                <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                  76/82 học viên phải lục tìm tài liệu rải rác trên Discord, Google Drive, VLearn và Zoom chat.
                </p>
              </div>

              <div className="bg-blue-50/50 border border-blue-200 rounded-[1.25rem] p-[1.75rem]">
                <div className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold text-blue-700 mb-[0.5rem]">50%</div>
                <h4 className="text-[1.05rem] font-semibold text-[#0f172a] mb-[0.5rem]">Quỹ thời gian dưới 1 giờ</h4>
                <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                  41/82 người chỉ có dưới 60 phút mỗi ngày để tự học trước giờ lên lớp buổi tối.
                </p>
              </div>
            </div>

            {/* HỢP */}
            <div className="bg-slate-50 border-l-4 border-blue-600 p-[1.25rem] rounded-r-xl flex items-center justify-between">
              <div>
                <p className="text-[1rem] italic font-semibold text-slate-900">
                  “Slide bài giảng hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.”
                </p>
                <span className="text-[0.8rem] text-slate-500 font-medium mt-[0.25rem] block">— P02, học viên nền tảng AI</span>
              </div>
              <span className="text-[0.85rem] font-bold text-blue-700 shrink-0 bg-white px-[0.75rem] py-[0.35rem] rounded-lg border border-slate-200 hidden sm:inline-block">
                Khảo sát thực tế n = 82
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 5: LỰA CHỌN BÀI TOÁN CÓ ROI CAO NHẤT
      // -------------------------------------------------------------
      case 4:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Chiến lược lựa chọn tính năng
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                So sánh 3 cơ hội: Tìm kiếm bài toán AI tạo giá trị đột phá
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Không làm tính năng AI thừa thãi — Chỉ chọn bài toán mà AI đóng vai trò ra quyết định thực thụ.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] overflow-hidden rounded-[1.25rem] border border-slate-300 shadow-sm">
              <table className="w-full text-left text-[0.95rem] border-collapse">
                <thead>
                  <tr className="bg-[#0f172a] text-white">
                    <th className="p-[1rem] font-semibold w-[30%]">Cơ hội giải pháp</th>
                    <th className="p-[1rem] font-semibold">Bằng chứng nhu cầu</th>
                    <th className="p-[1rem] font-semibold w-[35%]">Quyết định chiến lược</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-[1rem] font-medium text-slate-800">1. Tổng hợp link tài liệu tĩnh</td>
                    <td className="p-[1rem] text-slate-600">76/82 (93%) gặp tài liệu rải rác</td>
                    <td className="p-[1rem] text-rose-700 font-semibold">LOẠI — Chỉ là tra cứu, không có quyết định AI</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-[1rem] font-medium text-slate-800">2. Tóm tắt slide bài giảng</td>
                    <td className="p-[1rem] text-slate-600">75/82 (91%) gặp slide dài; 8.8% xin tóm tắt</td>
                    <td className="p-[1rem] text-rose-700 font-semibold">LOẠI — Trùng lõi Track A, dễ bị thay thế bởi ChatGPT</td>
                  </tr>
                  <tr className="bg-emerald-50 text-blue-950 font-bold">
                    <td className="p-[1rem] text-emerald-800 flex items-center gap-[0.5rem]">
                      <CheckCircle2 className="w-[1.25rem] h-[1.25rem] text-emerald-600 shrink-0" />
                      <span>3. Chẩn đoán nền tảng + thời gian → ≤3 việc</span>
                    </td>
                    <td className="p-[1rem] text-slate-900 font-semibold">
                      71/82 (87%) không biết học bù; 41/82 có dưới 60 phút
                    </td>
                    <td className="p-[1rem] text-emerald-800 font-extrabold">
                      CHỌN — AI ra quyết định, catalog sạch giải luôn bài toán 1
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* HỢP */}
            <div className="p-[1.25rem] rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-[0.75rem]">
                <Target className="w-[1.5rem] h-[1.5rem] text-blue-700 shrink-0" />
                <span className="text-[1rem] font-semibold text-slate-900">
                  Tín hiệu sẵn sàng chi trả &amp; sử dụng: <strong className="text-emerald-700 font-bold">74/82 (90%)</strong> học viên muốn có checklist 3 việc theo số phút rảnh mỗi ngày.
                </span>
              </div>
              <span className="text-[0.8rem] font-mono font-bold text-blue-700 uppercase tracking-wider hidden md:inline-block">
                High Retention Moat
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 6: GIẢI PHÁP & TRIẾT LÝ SẢN PHẨM (AUGMENT)
      // -------------------------------------------------------------
      case 5:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Triết lý thiết kế sản phẩm
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Augment: AI đề xuất thông minh — Người học toàn quyền quyết định
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Chúng tôi không xây dựng AI làm thay học viên, mà xây dựng "bộ lọc trọng tâm" giúp họ học có trách nhiệm.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2.5rem] h-[2.5rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-[1rem]">1</div>
                <h3 className="text-[1.15rem] font-semibold text-[#0f172a] mb-[0.5rem]">Nhập liệu tinh giản</h3>
                <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                  Chỉ mất 30 giây để chọn: Nền tảng hiện tại (Non-tech / Tech / AI) + Số phút rảnh hôm nay + Bài lab tiếp theo.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2.5rem] h-[2.5rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-[1rem]">2</div>
                <h3 className="text-[1.15rem] font-semibold text-[#0f172a] mb-[0.5rem]">May đo đúng ≤3 việc</h3>
                <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                  Lộ trình vừa khít với thời gian rảnh; 100% đường dẫn học liệu được bảo đảm có trong catalog nội bộ (Không rác mạng).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2.5rem] h-[2.5rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-[1rem]">3</div>
                <h3 className="text-[1.15rem] font-semibold text-[#0f172a] mb-[0.5rem]">Liêm chính &amp; Guardrail</h3>
                <p className="text-[0.875rem] text-slate-600 font-medium leading-relaxed">
                  Học viên xin đáp án, xin làm hộ bài, xin gian lận deadline $\rightarrow$ AI lập tức từ chối, giải thích nguyên tắc học tập.
                </p>
              </div>
            </div>

            {/* HỢP */}
            <div className="p-[1.25rem] rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[0.8rem] font-bold text-emerald-800 uppercase tracking-wider block">Quản trị rủi ro thấp (Cost-of-Error)</span>
                <p className="text-[0.95rem] text-slate-800 font-medium mt-[0.25rem]">
                  Nếu AI gợi ý chưa tối ưu, học viên chỉ tốn 15 phút đọc nhầm một bài đọc — <strong>không ảnh hưởng điểm số, không trễ hạn nộp bài.</strong>
                </p>
              </div>
              <span className="text-emerald-700 font-bold text-[0.85rem] font-mono bg-white px-[0.75rem] py-[0.35rem] rounded-lg border border-emerald-300 shrink-0 hidden sm:inline-block">
                Zero Risk
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 7: LIVE DEMO THỰC TẾ TRÊN WEB
      // -------------------------------------------------------------
      case 6:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Trải nghiệm thực tế sản phẩm (Live Demo 60–80s)
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Chứng minh trực tiếp: 1 Kịch bản chuẩn &amp; 2 Kịch bản thử thách
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Ứng dụng đang chạy thực tế trên production, mời Ban giám khảo trực tiếp quan sát.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-blue-50/70 border border-blue-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="flex items-center justify-between mb-[0.5rem]">
                  <span className="px-[0.75rem] py-[0.2rem] rounded-full bg-blue-900 text-white text-[0.75rem] font-bold">
                    ① KỊCH BẢN CHUẨN (HAPPY PATH)
                  </span>
                  <span className="text-[0.75rem] font-mono font-bold text-emerald-700">HOÀN TẤT TRONG 30s</span>
                </div>
                <h4 className="text-[1.15rem] font-bold text-blue-950 mb-[0.25rem]">Học viên Tech-base · 60 phút rảnh · Lab 3</h4>
                <p className="text-[0.875rem] text-slate-700 font-medium leading-relaxed">
                  AI Mentor lập tức tính toán, trả đúng 3 nhiệm vụ trọng tâm, tổng thời lượng không quá 60 phút, 100% link nội bộ chuẩn catalog.
                </p>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="flex items-center justify-between mb-[0.5rem]">
                  <span className="px-[0.75rem] py-[0.2rem] rounded-full bg-rose-700 text-white text-[0.75rem] font-bold">
                    ② KỊCH BẢN TỪ CHỐI (ANTI-CHEAT G16)
                  </span>
                  <span className="text-[0.75rem] font-mono font-bold text-rose-700">BẢO VỆ NHÀ TRƯỜNG</span>
                </div>
                <h4 className="text-[1.15rem] font-bold text-rose-950 mb-[0.25rem]">Ghi chú “Làm hộ bài lab và gửi đáp án”</h4>
                <p className="text-[0.875rem] text-slate-700 font-medium leading-relaxed">
                  Hệ thống lập tức kích hoạt Guardrail từ chối, giải thích nguyên tắc trung thực học thuật và hướng dẫn kết nối Lab Coach.
                </p>
              </div>
            </div>

            {/* HỢP & NÚT LIVE DEMO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-[1rem] pt-[0.5rem]">
              <div className="text-[0.875rem] text-slate-600 font-medium">
                ③ Kịch bản dự phòng (G14): Học viên khai non-tech nhưng ghi "đã deploy RAG" $\rightarrow$ AI hỏi lại để làm rõ thay vì đoán mò.
              </div>
              <Link
                href="/personalized-path"
                target="_blank"
                className="w-full sm:w-auto px-[1.5rem] py-[0.85rem] rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-[0.9rem] uppercase tracking-wider shadow-md transition flex items-center justify-center gap-[0.5rem] shrink-0"
              >
                <Monitor className="w-[1.1rem] h-[1.1rem] text-sky-300" />
                <span>🚀 MỞ TRANG LIVE DEMO THẬT</span>
                <ExternalLink className="w-[0.9rem] h-[0.9rem]" />
              </Link>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 8: ĐO LƯỜNG & TRUNG THỰC VỀ SAI SỐ (CASE G02)
      // -------------------------------------------------------------
      case 7:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Đo kiểm định lượng &amp; Báo cáo trung thực
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Đạt Quality Bar khoá tại CP4: AI v2 đạt 19/20 (95%)
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Cam kết trung thực tuyệt đối: Giữ nguyên số liệu thật, công khai và phân tích nguồn gốc ca trượt G02.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-12 gap-[1.5rem]">
              <div className="md:col-span-6 space-y-[1rem]">
                <div className="overflow-hidden rounded-xl border border-slate-300 shadow-sm">
                  <table className="w-full text-left text-[0.9rem] border-collapse">
                    <thead>
                      <tr className="bg-[#0f172a] text-white">
                        <th className="p-[0.75rem] font-semibold">Lượt chạy nghiệm thu</th>
                        <th className="p-[0.75rem] font-semibold">Tỷ lệ đạt</th>
                        <th className="p-[0.75rem] font-semibold">Link ngoài catalog</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-white">
                        <td className="p-[0.75rem] font-medium text-slate-700">Baseline luật tĩnh (20 case)</td>
                        <td className="p-[0.75rem] font-bold text-slate-800">17/20 (85%)</td>
                        <td className="p-[0.75rem] font-bold text-emerald-700">0</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-[0.75rem] font-medium text-slate-700">AI v1 · Gemini Flash-Lite</td>
                        <td className="p-[0.75rem] font-bold text-slate-800">18/20 (90%)</td>
                        <td className="p-[0.75rem] font-bold text-emerald-700">0</td>
                      </tr>
                      <tr className="bg-emerald-50 font-bold text-blue-950">
                        <td className="p-[0.75rem] text-emerald-800 flex items-center gap-[0.5rem]">
                          <CheckCircle2 className="w-[1rem] h-[1rem] text-emerald-600" />
                          <span>AI v2 · Gemini Flash-Lite</span>
                        </td>
                        <td className="p-[0.75rem] text-emerald-800 text-[1.1rem]">19/20 (95%)</td>
                        <td className="p-[0.75rem] text-emerald-800 text-[1.1rem]">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 text-[0.85rem] text-blue-950 font-medium">
                  <strong>Chuẩn Quality Bar:</strong> ≥18/20 case đạt VÀ 0 URL ngoài VÀ từ chối 3/3 ca vượt quyền.
                </div>
              </div>

              <div className="md:col-span-6 space-y-[1rem]">
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-[1.25rem]">
                  <div className="flex items-center gap-[0.5rem] text-rose-700 font-bold text-[0.95rem] mb-[0.35rem]">
                    <AlertTriangle className="w-[1.1rem] h-[1.1rem]" />
                    <span>Sự thật về ca trượt G02 (Học viên 60m)</span>
                  </div>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    AI chọn đúng tài liệu <code className="bg-white px-[0.35rem] py-[0.1rem] rounded border font-mono text-[0.75rem] font-bold text-slate-800">ptc-function-calling</code> nhưng xếp thứ ba; bộ lọc thời gian 60 phút đã cắt mất mục này. Nhóm <strong>không sửa đề, không can thiệp kết quả</strong> để bảo toàn tính trung thực.
                  </p>
                </div>

                <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 text-[0.825rem] text-slate-600 font-medium leading-relaxed">
                  <strong>Mở rộng 50 case:</strong> 40 ca phục vụ học viên (B2C) + 10 ca bảo vệ hạ tầng VLearn (chống leak lab, chống DoS token 0 phút, chặn lỗi 404).
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[1rem] flex justify-between items-center text-[0.85rem] text-slate-500 font-medium">
              <span>Bằng chứng thực nghiệm: eval/run_results.md · eval/latest-ai-results.json</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §7</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 9: TIẾNG NÓI KHÁCH HÀNG & MINH BẠCH TIẾN ĐỘ
      // -------------------------------------------------------------
      case 8:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Kiểm chứng người dùng &amp; Minh bạch
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Chưa đủ 5 buổi dùng thử thực tế — Báo cáo thật thay vì ngụy tạo
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Tuân thủ quy định đề bài: Chưa hoàn thành đủ 5 buổi user test bên ngoài thì báo cáo số liệu Golden Set.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-slate-50 p-[1.5rem] rounded-[1.25rem] border border-slate-200 space-y-[1rem]">
                <h4 className="text-[1.1rem] font-bold text-blue-900">Tiếng nói phỏng vấn sâu trước khi build</h4>
                <div className="border-l-4 border-blue-600 pl-[1rem] py-[0.25rem]">
                  <p className="text-[0.95rem] italic text-slate-900 font-semibold">
                    “Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu.”
                  </p>
                  <span className="text-[0.8rem] text-slate-500 font-medium mt-[0.25rem] block">— P01, học viên nền tech</span>
                </div>
                <div className="border-l-4 border-blue-600 pl-[1rem] py-[0.25rem]">
                  <p className="text-[0.95rem] italic text-slate-900 font-semibold">
                    “Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.”
                  </p>
                  <span className="text-[0.8rem] text-slate-500 font-medium mt-[0.25rem] block">— P02, học viên nền AI</span>
                </div>
              </div>

              <div className="bg-blue-50/60 p-[1.5rem] rounded-[1.25rem] border border-blue-200 space-y-[0.75rem]">
                <h4 className="text-[1.1rem] font-bold text-blue-950">Đo lường thay thế trên Golden Set</h4>
                <ul className="space-y-[0.65rem] text-[0.875rem] text-slate-700 font-medium">
                  <li className="flex items-start gap-[0.5rem]">
                    <CheckCircle2 className="w-[1.1rem] h-[1.1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                    <span>AI v2 đạt Quality Bar 19/20, 0 link ngoài danh mục.</span>
                  </li>
                  <li className="flex items-start gap-[0.5rem]">
                    <CheckCircle2 className="w-[1.1rem] h-[1.1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                    <span>Từ chối 3/3 yêu cầu gian lận học thuật hoặc lách deadline.</span>
                  </li>
                  <li className="flex items-start gap-[0.5rem] text-rose-700">
                    <AlertTriangle className="w-[1.1rem] h-[1.1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                    <span>Chưa đạt: Ca G02 thiếu 1 tài liệu do giới hạn 60 phút.</span>
                  </li>
                </ul>
                <div className="pt-[0.5rem] text-[0.8rem] text-slate-500 border-t border-slate-200">
                  Nhật ký dùng thử: <code>validation/log.md</code> (Chưa đủ 5 người ngoài nhóm trước 13:00).
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="p-[1rem] rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[0.9rem] text-emerald-900 font-semibold">
              <span>Cơ sở người dùng sẵn sàng: <strong>71/82 (87%)</strong> người khảo sát xác nhận sẵn sàng tham gia thử nghiệm diện rộng ở vòng sau.</span>
              <span className="font-mono text-emerald-700 font-bold">Willing Users</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 10: BUSINESS MODEL, BẢO VỆ CHI PHÍ & 4 VAI TRÒ
      // -------------------------------------------------------------
      case 9:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Mô hình kinh doanh &amp; Quản trị chi phí
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Kiến trúc 4 vai trò: Tối ưu chi phí API &amp; Tạo phễu chuyển đổi
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Ứng dụng AI giáo dục chỉ khả thi về mặt tài chính khi kiểm soát chặt chẽ biên chi phí token trên từng học viên.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-[0.75rem]">
                  <Users className="w-[1.2rem] h-[1.2rem]" />
                </div>
                <h4 className="text-[1.1rem] font-bold text-blue-900 mb-[0.35rem]">Phễu chuyển đổi (Viewer $\rightarrow$ Student)</h4>
                <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                  Khách vãng lai dùng thử 10 câu AI Helpdesk miễn phí/ngày để làm quen. Khi cần Lộ trình cá nhân hoá, đăng ký để nâng cấp thành Student.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-[0.75rem]">
                  <Lock className="w-[1.2rem] h-[1.2rem]" />
                </div>
                <h4 className="text-[1.1rem] font-bold text-blue-900 mb-[0.35rem]">Bảo vệ chi phí API (Chống Spam)</h4>
                <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                  Đăng ký tài khoản phải qua Admin phê duyệt; chỉ cấp quyền AI tốn tiền cho người thật. Không có tài khoản rác bào mòn chi phí LLM.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-[0.75rem]">
                  <DollarSign className="w-[1.2rem] h-[1.2rem]" />
                </div>
                <h4 className="text-[1.1rem] font-bold text-blue-900 mb-[0.35rem]">Unit Economics Siêu Thấp</h4>
                <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                  Sử dụng Gemini Flash-Lite định tuyến thông minh kết hợp cache: Chi phí AI trung bình ước tính dưới <strong>4.800đ / học viên / tháng</strong>.
                </p>
              </div>
            </div>

            {/* HỢP */}
            <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center text-[0.85rem] text-blue-950 font-semibold">
              <span>Hạ tầng backend .NET 10 Clean Architecture: 60 automated tests sẵn sàng cho vận hành quy mô lớn.</span>
              <span className="font-mono text-blue-700 font-bold">Scalable Architecture</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 11: KẾ HOẠCH HÀNH ĐỘNG 1 TUẦN & TĂNG TRƯỞNG
      // -------------------------------------------------------------
      case 10:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Lộ trình tăng trưởng tiếp theo
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Nếu có thêm 1 tuần: 3 đòn bẩy hoàn thiện sản phẩm
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Ưu tiên nguồn lực vào những khâu nâng cao trải nghiệm người dùng và tự động hoá kho tri thức.
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.5rem] grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.9rem] mb-[0.75rem]">
                  1
                </div>
                <h4 className="text-[1.1rem] font-bold text-blue-950 mb-[0.25rem]">5 buổi User Testing thực tế</h4>
                <p className="text-[0.875rem] text-slate-700 font-medium leading-relaxed">
                  Giao bài lab thật, ngồi quan sát thao tác của 5 học viên ngoài nhóm, ghi nhận chỉ số NPS và thời gian hoàn tất.
                </p>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.9rem] mb-[0.75rem]">
                  2
                </div>
                <h4 className="text-[1.1rem] font-bold text-blue-950 mb-[0.25rem]">Sinh bài test chẩn đoán từ CV</h4>
                <p className="text-[0.875rem] text-slate-700 font-medium leading-relaxed">
                  Đáp ứng 74/82 (90%) học viên mong muốn: Đọc CV tự động tạo bài test năng lực 5 phút thay cho dữ liệu tự khai.
                </p>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem]">
                <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.9rem] mb-[0.75rem]">
                  3
                </div>
                <h4 className="text-[1.1rem] font-bold text-blue-950 mb-[0.25rem]">Cổng tài liệu cho Giảng viên</h4>
                <p className="text-[0.875rem] text-slate-700 font-medium leading-relaxed">
                  Giảng viên tải slide / giáo trình lên $\rightarrow$ Hệ sinh thái tự động vector hóa và nạp vào catalog cho AI Mentor.
                </p>
              </div>
            </div>

            {/* HỢP */}
            <div className="p-[1.25rem] rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-[#1e3a8a] text-white shadow-md">
              <div className="text-[0.8rem] uppercase font-bold text-sky-300 tracking-wider mb-[0.25rem] flex items-center gap-[0.5rem]">
                <Sparkles className="w-[1rem] h-[1rem]" />
                <span>Bài học cốt lõi của Vinonymus</span>
              </div>
              <p className="text-[1rem] sm:text-[1.1rem] font-medium leading-relaxed">
                Chốt chuẩn chất lượng (Quality Bar) sớm và đo kiểm định lượng liên tục là chìa khóa để xây dựng một sản phẩm AI trung thực và bền vững.
              </p>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 12: TỔNG KẾT & MỜI HỎI ĐÁP (Q&A)
      // -------------------------------------------------------------
      case 11:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Tổng kết đề án &amp; Hỏi đáp
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#0f172a] mt-[0.5rem] mb-[0.5rem] tracking-[0.02em]">
                Vinonymus: Giải quyết đúng nỗi đau bằng số liệu thật
              </h1>
              <p className="text-[1rem] text-slate-600 font-medium">
                Cảm ơn Ban giám khảo và các bạn học viên. Chúng tôi sẵn sàng cho phần phản biện!
              </p>
            </div>

            {/* PHÂN */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.25rem]">
              <div className="p-[1.25rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem]">
                <CheckCircle2 className="w-[1.5rem] h-[1.5rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[1rem] font-bold text-slate-900">Nỗi đau có căn cứ số liệu thật</div>
                  <div className="text-[0.85rem] text-slate-600 font-medium">87% học viên không biết học bù; 90% muốn có lộ trình 3 việc.</div>
                </div>
              </div>

              <div className="p-[1.25rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem]">
                <CheckCircle2 className="w-[1.5rem] h-[1.5rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[1rem] font-bold text-slate-900">Chất lượng đạt chuẩn nghiêm ngặt</div>
                  <div className="text-[0.85rem] text-slate-600 font-medium">19/20 ca đạt chuẩn, 0 link ngoài catalog, bảo đảm độ tin cậy.</div>
                </div>
              </div>

              <div className="p-[1.25rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem]">
                <CheckCircle2 className="w-[1.5rem] h-[1.5rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[1rem] font-bold text-slate-900">Bảo vệ liêm chính học thuật</div>
                  <div className="text-[0.85rem] text-slate-600 font-medium">Chống gian lận, từ chối cấp đáp án, hướng dẫn tự tư duy.</div>
                </div>
              </div>

              <div className="p-[1.25rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem]">
                <CheckCircle2 className="w-[1.5rem] h-[1.5rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[1rem] font-bold text-slate-900">Mô hình kinh doanh khả thi</div>
                  <div className="text-[0.85rem] text-slate-600 font-medium">Chi phí vận hành token tối ưu dưới 5.000đ/học viên/tháng.</div>
                </div>
              </div>
            </div>

            {/* HỢP: PHÂN VAI TRẢ LỜI Q&A */}
            <div className="border-t border-slate-200 pt-[1rem]">
              <div className="text-[0.8rem] uppercase font-bold text-slate-500 mb-[0.5rem] tracking-wider">
                Phân vai giải trình theo nguyên tắc Vibe-Coding (Ban giám khảo có thể chất vấn bất kỳ ai):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[0.75rem]">
                <div className="p-[0.75rem] rounded-lg bg-blue-50/70 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.9rem]">Khoa (Pitcher)</div>
                  <div className="text-[0.75rem] text-blue-800 font-medium mt-[0.1rem]">Nỗi đau, Quyết định, Backend .NET</div>
                </div>
                <div className="p-[0.75rem] rounded-lg bg-blue-50/70 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.9rem]">Thành</div>
                  <div className="text-[0.75rem] text-blue-800 font-medium mt-[0.1rem]">Giải pháp, Giao diện, AI Mentor</div>
                </div>
                <div className="p-[0.75rem] rounded-lg bg-blue-50/70 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.9rem]">Đức</div>
                  <div className="text-[0.75rem] text-blue-800 font-medium mt-[0.1rem]">Prompt, Guardrail, Helpdesk</div>
                </div>
                <div className="p-[0.75rem] rounded-lg bg-blue-50/70 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.9rem]">Minh</div>
                  <div className="text-[0.75rem] text-blue-800 font-medium mt-[0.1rem]">Database, Migration, 4 Vai trò</div>
                </div>
              </div>
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
      {/* 1. SLIM INTEGRATED TOP HEADER & PRESENTATION TOOLBAR (HEIGHT ~3.25rem)     */}
      {/* ========================================================================= */}
      <header className="w-full h-[3.25rem] shrink-0 bg-[#070d1e] border-b border-slate-800/80 px-[1.25rem] flex items-center justify-between gap-[0.75rem] z-50">
        
        {/* Left: Back to Home + Slide Badge & Title */}
        <div className="flex items-center gap-[0.75rem] min-w-0">
          <Link
            href="/"
            className="flex items-center gap-[0.4rem] text-[0.8rem] font-medium text-slate-300 hover:text-white px-[0.75rem] py-[0.35rem] rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
            title="Quay lại trang chủ"
          >
            <ArrowLeft className="w-[0.9rem] h-[0.9rem]" />
            <span className="hidden sm:inline">Trang Chủ</span>
          </Link>

          <div className="h-[1rem] w-px bg-slate-700 hidden sm:block" />

          {/* Current Slide Pill */}
          <div className="px-[0.65rem] py-[0.2rem] rounded-lg bg-blue-950 border border-blue-500/40 text-sky-300 font-mono font-bold text-[0.8rem] tracking-wider truncate">
            Slide {currentSlide + 1} / {totalSlides}
          </div>

          <span className="text-[0.8rem] text-slate-300 font-medium truncate hidden md:inline">
            {slideTitles[currentSlide]}
          </span>
        </div>

        {/* Center: Stopwatch / Pitch Timer (06:00 Budget, ~30s/slide) */}
        <div className="flex items-center gap-[0.5rem] bg-slate-950/90 px-[0.85rem] py-[0.3rem] rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={toggleTimer}
            title={isTimerRunning ? 'Tạm dừng timer' : 'Bắt đầu timer'}
            className="p-[0.2rem] rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isTimerRunning ? <Pause className="w-[0.9rem] h-[0.9rem] text-amber-400" /> : <Play className="w-[0.9rem] h-[0.9rem] text-emerald-400" />}
          </button>
          
          <span 
            className={`font-mono text-[0.8rem] font-bold tracking-wider ${
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
            className="p-[0.2rem] rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-[0.85rem] h-[0.85rem]" />
          </button>
        </div>

        {/* Right: Actions, Navigation, View Mode & Fullscreen */}
        <div className="flex items-center gap-[0.5rem] shrink-0">
          
          {/* Quick jump to Live Demo */}
          <Link
            href="/personalized-path"
            target="_blank"
            className="px-[0.75rem] py-[0.35rem] rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-sky-300 text-[0.8rem] font-bold transition flex items-center gap-[0.4rem]"
            title="Mở tab Live Demo (/personalized-path)"
          >
            <Monitor className="w-[0.9rem] h-[0.9rem]" />
            <span className="hidden lg:inline">Live Demo</span>
          </Link>

          <div className="h-[1rem] w-px bg-slate-700 hidden sm:block" />

          {/* Prev / Next buttons */}
          <button
            type="button"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-[0.4rem] rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition cursor-pointer"
            title="Slide trước (← / Backspace)"
          >
            <ChevronLeft className="w-[1.1rem] h-[1.1rem]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="p-[0.4rem] rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition cursor-pointer"
            title="Slide sau (→ / Space)"
          >
            <ChevronRight className="w-[1.1rem] h-[1.1rem]" />
          </button>

          {/* View mode toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'single' ? 'scroll' : 'single')}
            className="px-[0.6rem] py-[0.35rem] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[0.8rem] font-medium transition hidden md:flex items-center gap-[0.35rem] cursor-pointer"
            title={viewMode === 'single' ? 'Chuyển sang cuộn xem tất cả' : 'Chuyển sang chiếu từng slide'}
          >
            <Layers className="w-[0.9rem] h-[0.9rem]" />
            <span className="hidden xl:inline">{viewMode === 'single' ? 'Cuộn' : 'Slide'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-[0.4rem] rounded-lg bg-blue-500/25 hover:bg-blue-500/35 text-sky-200 border border-blue-400/50 transition cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ (F)' : 'Toàn màn hình (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-[1.1rem] h-[1.1rem]" /> : <Maximize2 className="w-[1.1rem] h-[1.1rem]" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH SLIDE CANVAS (PROPORTIONALLY BALANCED VERTICALLY)            */}
      {/* ========================================================================= */}
      {viewMode === 'single' ? (
        /* SINGLE SLIDE PRESENTATION MODE */
        <div className="flex-1 w-full bg-white overflow-y-auto flex flex-col justify-between">
          <div className="w-full max-w-[105rem] mx-auto px-[2rem] sm:px-[3.5rem] lg:px-[5rem] py-[2rem] sm:py-[2.5rem] flex-1 flex flex-col justify-between">
            {renderSlideContent(currentSlide)}
          </div>

          {/* Sleek bottom progress strip with 12 slide pills */}
          <div className="w-full bg-slate-100 border-t border-slate-200 px-[1.5rem] py-[0.6rem] flex items-center justify-between text-[0.75rem] text-slate-500 font-mono">
            <div className="flex items-center gap-[0.35rem] overflow-x-auto py-[0.15rem]">
              {slideTitles.map((title, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-[0.65rem] py-[0.25rem] rounded text-[0.75rem] font-bold transition cursor-pointer shrink-0 ${
                    currentSlide === idx
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                  title={title}
                >
                  {idx + 1}. {title.split('. ')[1]}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-[1rem] text-[0.75rem] text-slate-500 shrink-0">
              <span>[→ / Space] Tiếp · [← / Backspace] Lùi · [F] Fullscreen · [T] Timer</span>
              <span className="font-bold text-blue-900">Vinonymus · Track E</span>
            </div>
          </div>
        </div>
      ) : (
        /* CONTINUOUS SCROLL VIEW OF ALL 12 SLIDES */
        <div className="w-full flex-1 bg-slate-100 p-[1.5rem] sm:p-[2.5rem] space-y-[2.5rem] overflow-y-auto">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-full max-w-[105rem] mx-auto bg-white rounded-[1.5rem] p-[2rem] sm:p-[3.5rem] lg:p-[4.5rem] shadow-md border border-slate-300 relative min-h-[40rem] flex flex-col justify-between font-['Montserrat',sans-serif]"
            >
              <div className="absolute top-[1.25rem] right-[1.5rem] px-[0.85rem] py-[0.35rem] rounded-full bg-blue-950 text-white text-[0.75rem] font-mono font-bold">
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
