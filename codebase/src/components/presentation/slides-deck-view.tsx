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
  Award,
  HelpCircle,
  FileText,
  Search,
  Zap,
  ArrowRight,
  ShieldAlert,
  Flame,
  MessageSquare,
  Cpu,
  Check,
  X,
  Code2,
  Workflow,
  Share2
} from 'lucide-react';

function FlowArrow({ className = "w-[0.9rem] h-[0.9rem] text-blue-600" }: { className?: string }) {
  return (
    <span className="inline-flex items-center justify-center align-middle mx-[0.3rem] text-inherit" aria-hidden="true">
      <ArrowRight className={`${className} stroke-[2.75]`} />
    </span>
  );
}

export function SlidesDeckView() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('single');
  
  // Timer state for pitch control (06:00 Budget)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 13;

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
    '1. Bìa Dự Án & Định Vị',
    '2. Bản Đồ Thuyết Trình',
    '3. Thực Trạng & Điểm Nghẽn',
    '4. Nghịch Lý Chatbot AI',
    '5. Chọn Bài Toán Cho AI',
    '6. Hai AI, Hai Vai Trò',
    '7. Trải Nghiệm 30 Giây',
    '8. Demo Trực Tiếp',
    '9. Kết Quả Đo Lường',
    '10. Vận Hành & 4 Vai Trò',
    '11. Kế Hoạch Tăng Trưởng',
    '12. Tổng Kết & Hỏi Đáp',
    '13. Cảm Ơn'
  ];

  // Render individual slide contents
  const renderSlideContent = (index: number) => {
    switch (index) {
      // -------------------------------------------------------------
      // SLIDE 1: BÌA DỰ ÁN & ĐỊNH VỊ GIẢI PHÁP (CHUẨN KEYNOTE / BGK)
      // -------------------------------------------------------------
      case 0:
        return (
          <div className="relative flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-900 overflow-hidden rounded-[1.25rem]">
            {/* Background Aesthetic Glow Accents */}
            <div className="absolute -top-[5rem] -right-[5rem] w-[22rem] h-[22rem] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-[6rem] -left-[6rem] w-[24rem] h-[24rem] bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

            {/* HEADER: METADATA CUỘC THI */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-[0.5rem] px-[0.85rem] py-[0.35rem] rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[0.78rem] font-bold tracking-[0.06em] uppercase shadow-xs">
                <Sparkles className="w-[0.95rem] h-[0.95rem] text-blue-600" />
                <span>MINI HACKATHON AI · TRACK E: LÀN MỞ (PHẠM VI ĐÀO TẠO AI20K) · CỤM C2 · PHÒNG E403</span>
              </div>

              {/* TÊN DỰ ÁN & ĐỀ TÀI */}
              <div className="mt-[1.25rem] mb-[0.75rem]">
                <div className="text-[0.85rem] font-bold text-slate-500 uppercase tracking-[0.1em] mb-[0.25rem]">
                  Dự án Khởi nghiệp Sản phẩm AI · Nhóm Vinonymus
                </div>
                <h1 className="text-[clamp(2.4rem,4.5vw,4rem)] font-bold text-[#0a192f] leading-[1.1] tracking-[0.01em] uppercase">
                  ADAPTIVE LEARNING SYSTEM
                </h1>
                <h2 className="text-[clamp(1.15rem,2.1vw,1.65rem)] font-semibold text-blue-700 mt-[0.5rem] leading-snug">
                  Hệ Thống Học Tập Thích Ứng Cá Nhân Hoá Cho Kỷ Nguyên Trí Tuệ Nhân Tạo
                </h2>
              </div>

              {/* SLOGAN & GIẢI PHÁP CỐT LÕI */}
              <p className="text-[0.95rem] sm:text-[1.05rem] text-slate-700 font-medium leading-relaxed max-w-[62rem]">
                <strong>Ý tưởng chính:</strong> Thay vì đưa thêm tài liệu hay một chatbot ngồi chờ người học hỏi, AI Mentor chọn sẵn <em>tối đa 3 việc</em> vừa với số phút rảnh hôm nay — cho cả người chưa biết code lẫn người đã biết code.
              </p>
            </div>

            {/* PHÂN: 4 TRỤ CỘT ĐỊNH VỊ DỰ ÁN */}
            <div className="relative z-10 my-[1.25rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1rem]">
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-rose-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-[0.5rem]">
                  <Target className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Bài toán thực tế</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">Thừa Tài Liệu, Thiếu Định Hướng</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  87% học viên không biết mình hổng ở đâu; tài liệu rải rác ở 5 kênh.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-blue-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-[0.5rem]">
                  <Bot className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-blue-700 uppercase tracking-wider">Mô hình sản phẩm</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">Hai AI, Hai Vai Trò</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  <strong>AI Mentor</strong> chạy ngầm, tự lên lộ trình; <strong>AI Helpdesk</strong> trò chuyện, tra cứu FAQ 24/7.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-emerald-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-[0.5rem]">
                  <ShieldCheck className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-emerald-700 uppercase tracking-wider">Phần được chấm</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">AI Mentor Lên Lộ Trình</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  Chạy thật tại <code>/personalized-path</code>: tối đa 3 việc, link chỉ lấy từ thư viện của khoá.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-indigo-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-[0.5rem]">
                  <TrendingUp className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-indigo-700 uppercase tracking-wider">Vận hành tiết kiệm</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">1 Lần Gọi AI / Lộ Trình</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  Gọi AI một lần mỗi lộ trình; tài khoản phải được Admin duyệt mới dùng AI.
                </p>
              </div>
            </div>

            {/* FOOTER: ĐỘI NGŨ VINONYMUS & VAI TRÒ */}
            <div className="relative z-10 border-t border-slate-200/90 pt-[0.85rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-[0.5rem] text-[0.8rem]">
              <div className="flex flex-wrap items-center gap-[0.4rem] text-slate-700 font-medium">
                <span className="font-bold text-slate-900 bg-slate-100 px-[0.5rem] py-[0.15rem] rounded text-[0.75rem] uppercase tracking-wider">Đội ngũ:</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Đỗ Khắc Gia Khoa</strong> (Lead · Backend)</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Nguyễn Việt Thành</strong> (AI Mentor)</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Đinh Ngọc Đức</strong> (AI Helpdesk · UI)</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Trần Nhật Minh</strong> (Database)</span>
              </div>
              <div className="font-mono text-blue-800 font-bold bg-blue-50 border border-blue-200 px-[0.65rem] py-[0.2rem] rounded-md shrink-0 text-[0.75rem]">
                Khoá 4 · Lớp 3A · AI20K
              </div>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 2: MỤC LỤC & BẢN ĐỒ THUYẾT TRÌNH (INVESTOR VIEW)
      // -------------------------------------------------------------
      case 1:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Bố cục bài trình bày
              </div>
              <h1 className="text-[clamp(1.5rem,2.8vw,2.4rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em] flex flex-wrap items-center gap-[0.4rem]">
                <span>3 Phần:</span>
                <span className="inline-flex items-center gap-[0.35rem] bg-rose-50 text-rose-800 px-[0.65rem] py-[0.15rem] rounded-lg text-[0.85em] border border-rose-200">
                  Vấn Đề
                </span>
                <ArrowRight className="w-[1.2rem] h-[1.2rem] text-slate-400 stroke-[3] shrink-0" />
                <span className="inline-flex items-center gap-[0.35rem] bg-blue-50 text-blue-700 px-[0.65rem] py-[0.15rem] rounded-lg text-[0.85em] border border-blue-200">
                  Giải Pháp
                </span>
                <ArrowRight className="w-[1.2rem] h-[1.2rem] text-slate-400 stroke-[3] shrink-0" />
                <span className="inline-flex items-center gap-[0.35rem] bg-emerald-50 text-emerald-800 px-[0.65rem] py-[0.15rem] rounded-lg text-[0.85em] border border-emerald-200">
                  Bằng Chứng
                </span>
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Người học đang gặp khó gì, nhóm giải quyết thế nào, và bằng chứng sản phẩm chạy được.
              </p>
            </div>

            {/* PHÂN: 3 TRỤ CỘT LUẬN ĐIỂM CÓ MŨI TÊN NỐI */}
            <div className="my-[1.25rem] grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-[0.75rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs hover:border-rose-300 transition">
                <div>
                  <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-[0.95rem] mb-[0.75rem]">
                    I
                  </div>
                  <h3 className="text-[1.15rem] font-bold text-slate-900 mb-[0.4rem]">BỐI CẢNH &amp; ĐIỂM NGHẼN</h3>
                  <div className="text-[0.8rem] font-semibold text-rose-700 mb-[0.5rem]">Thực trạng thị trường đào tạo AI</div>
                  <ul className="space-y-[0.4rem] text-[0.85rem] text-slate-700 font-medium">
                    <li>• 87% không tự biết cần bù phần nào</li>
                    <li>• 93% gặp tài liệu rải rác ở 5 kênh</li>
                    <li>• 18/13.494 lượt chat AI tự gợi ý bước tiếp</li>
                  </ul>
                </div>
                <div className="mt-[1rem] pt-[0.75rem] border-t border-slate-200 text-[0.75rem] text-slate-600 font-semibold">
                  Luận điểm: nhu cầu có thật, đo bằng khảo sát 82 học viên
                </div>
              </div>

              {/* MŨI TÊN NỐI 1 -> 2 */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-[2.25rem] h-[2.25rem] rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                  <ArrowRight className="w-[1.1rem] h-[1.1rem] stroke-[2.75]" />
                </div>
              </div>

              <div className="bg-blue-50/40 border border-blue-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs hover:border-blue-400 transition">
                <div>
                  <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-[0.95rem] mb-[0.75rem]">
                    II
                  </div>
                  <h3 className="text-[1.15rem] font-bold text-blue-950 mb-[0.4rem]">GIẢI PHÁP</h3>
                  <div className="text-[0.8rem] font-semibold text-blue-700 mb-[0.5rem]">Sản phẩm làm gì</div>
                  <ul className="space-y-[0.4rem] text-[0.85rem] text-slate-700 font-medium">
                    <li>• ≤3 việc, vừa số phút rảnh</li>
                    <li>• 2 AI: AI Mentor + AI Helpdesk</li>
                    <li>• 30 giây khai báo, 3 thông tin</li>
                  </ul>
                </div>
                <div className="mt-[1rem] pt-[0.75rem] border-t border-blue-200 text-[0.75rem] text-blue-900 font-semibold">
                  Luận điểm: AI chọn giúp việc mà người học khó tự chọn
                </div>
              </div>

              {/* MŨI TÊN NỐI 2 -> 3 */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-[2.25rem] h-[2.25rem] rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                  <ArrowRight className="w-[1.1rem] h-[1.1rem] stroke-[2.75]" />
                </div>
              </div>

              <div className="bg-emerald-50/40 border border-emerald-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs hover:border-emerald-400 transition">
                <div>
                  <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-[0.95rem] mb-[0.75rem]">
                    III
                  </div>
                  <h3 className="text-[1.15rem] font-bold text-slate-900 mb-[0.4rem]">BẰNG CHỨNG</h3>
                  <div className="text-[0.8rem] font-semibold text-emerald-800 mb-[0.5rem]">Chạy thật, đo thật</div>
                  <ul className="space-y-[0.4rem] text-[0.85rem] text-slate-700 font-medium">
                    <li>• 19/20 case đạt, 0 link ngoài thư viện</li>
                    <li>• 3/3 yêu cầu làm hộ bài bị từ chối</li>
                    <li>• 1 lần gọi AI / lộ trình · 4 vai trò</li>
                  </ul>
                </div>
                <div className="mt-[1rem] pt-[0.75rem] border-t border-slate-200 text-[0.75rem] text-emerald-800 font-semibold">
                  Luận điểm: sản phẩm chạy thật, số liệu kiểm tra được
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[0.85rem] flex justify-between items-center text-[0.85rem] text-slate-500 font-medium">
              <span>Số liệu nào trên slide cũng mở được nguồn ngay tại chỗ</span>
              <span className="text-blue-700 font-semibold font-mono">spec.md · eval/</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 3: VẤN ĐỀ 1 — THỰC TRẠNG & 3 TẦNG NỖI ĐAU
      // -------------------------------------------------------------
      case 2:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG: STORYTELLING VỀ CẢM XÚC HỌC VIÊN */}
            <div>
              <div className="text-[0.85rem] font-semibold text-rose-600 tracking-[0.08em] uppercase">
                Phần I · Vấn đề
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                5 Kênh · 60+ Trang Slide · Dưới 1 Giờ Rảnh
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Tài liệu có đủ, nhưng quá nhiều và nằm rải rác, nên người học không biết nên bắt đầu từ đâu.
              </p>
            </div>

            {/* PHÂN: 3 TẦNG NỖI ĐAU ĐƯỢC CHỨNG MINH BẰNG DỮ LIỆU */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-3 gap-[1.25rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.25rem]">
                    <span className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Điểm nghẽn 1</span>
                    <span className="text-[1.75rem] font-bold text-rose-600 font-mono">93%</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.5rem]">Tài liệu rải rác ở 5 kênh</h4>
                  <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                    Discord, Zoom chat, Google Drive, LMS và GitHub. 76/82 học viên gặp tình trạng này; phần lớn mất <strong>15–30 phút</strong> mỗi buổi chỉ để gom đủ link.
                  </p>
                </div>
                <div className="mt-[0.75rem] p-[0.65rem] rounded-lg bg-rose-50 border border-rose-100 text-[0.75rem] text-rose-800 italic">
                  “Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu.” — P01 (đã biết code)
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.25rem]">
                    <span className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Điểm nghẽn 2</span>
                    <span className="text-[1.75rem] font-bold text-rose-600 font-mono">50%</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.5rem]">Ít thời gian</h4>
                  <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                    41/82 học viên chỉ có <strong>dưới 1 giờ</strong> rảnh để tự học; 75/82 gặp slide dài không rõ trọng tâm.
                  </p>
                </div>
                <div className="mt-[0.75rem] p-[0.65rem] rounded-lg bg-rose-50 border border-rose-100 text-[0.75rem] text-rose-800 italic">
                  “Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.” — P02 (đã học AI)
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.25rem]">
                    <span className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Điểm nghẽn 3</span>
                    <span className="text-[1.75rem] font-bold text-rose-600 font-mono">87%</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.5rem]">Không biết mình hổng ở đâu</h4>
                  <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                    71/82 học viên <strong>không tự xác định được</strong> mình đang hổng phần nào. Người chưa biết code thì ngại code, người đã biết code thì hổng kiến thức nền về AI — đều không biết nên bù phần nào trước.
                  </p>
                </div>
                <div className="mt-[0.75rem] p-[0.65rem] rounded-lg bg-rose-50 border border-rose-100 text-[0.75rem] text-rose-800 italic">
                  Hệ quả: 19/82 (23%) từng nộp sát hạn hoặc trễ hạn.
                </div>
              </div>
            </div>

            {/* HỢP: KẾT LUẬN ĐANH THÉP */}
            <div className="bg-slate-50 border-l-4 border-rose-600 p-[1rem] rounded-r-xl flex items-center justify-between">
              <div>
                <p className="text-[0.95rem] font-semibold text-slate-900">
                  Học viên <strong>không cần thêm tài liệu</strong> — họ cần ai đó nói rõ: <em>"Hôm nay em chỉ cần làm 3 việc này."</em>
                </p>
              </div>
              <span className="text-[0.8rem] font-bold text-rose-700 bg-white px-[0.75rem] py-[0.35rem] rounded-lg border border-slate-200 hidden sm:inline-block shrink-0">
                Khảo sát 82 học viên
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 4: VẤN ĐỀ 2 — NGHỊCH LÝ CỦA AI CHATBOT HIỆN TẠI
      // -------------------------------------------------------------
      case 3:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-rose-600 tracking-[0.08em] uppercase">
                Phần I · Vấn đề · Giải pháp hiện có
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Vì Sao Chatbot Hiện Tại Chưa Giải Quyết Được?
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Phân tích 13.494 tin nhắn trên LMS/VLearn cho thấy chatbot hiện tại gần như không chủ động gợi ý.
              </p>
            </div>

            {/* PHÂN: ĐỐI CHIẾU SỰ THẤT BẠI CỦA CHATBOT THỤ ĐỘNG */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-rose-50/40 border-2 border-rose-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-[0.5rem] text-rose-700 font-bold text-[1.05rem] mb-[0.75rem]">
                    <HelpCircle className="w-[1.2rem] h-[1.2rem]" />
                    <span>Hiện tại: chatbot chờ người học hỏi</span>
                  </div>
                  <div className="space-y-[0.75rem] text-[0.85rem] text-slate-700 font-medium">
                    <div className="flex items-start gap-[0.5rem]">
                      <X className="w-[1rem] h-[1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>18/13.494 (0,13%):</strong> số lượt chat AI Tutor tự gợi ý bước tiếp theo; còn lại chỉ trả lời khi được hỏi.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <X className="w-[1rem] h-[1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Không biết hổng đâu thì không biết hỏi gì:</strong> chatbot chỉ giúp được khi học viên đã đặt đúng câu hỏi.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <X className="w-[1rem] h-[1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>29/82 (35%):</strong> hỏi AI Tutor VLearn nhưng thấy câu trả lời chung chung.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-[1rem] p-[0.75rem] rounded-lg bg-rose-100/70 text-[0.8rem] text-rose-900 font-semibold">
                  Hệ quả: chatbot thành thêm một nguồn phải đọc, thay vì giúp bớt việc.
                </div>
              </div>

              <div className="bg-emerald-50/40 border-2 border-emerald-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-[0.5rem] text-emerald-900 font-bold text-[1.05rem] mb-[0.75rem]">
                    <Zap className="w-[1.2rem] h-[1.2rem] text-emerald-600" />
                    <span>Điều người học cần: AI chọn giúp việc cần làm</span>
                  </div>
                  <div className="space-y-[0.75rem] text-[0.85rem] text-slate-700 font-medium">
                    <div className="flex items-start gap-[0.5rem]">
                      <Check className="w-[1rem] h-[1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Hiểu người học trước:</strong> biết người học đã biết code hay chưa và có bao nhiêu phút rảnh, rồi tự chọn việc phù hợp.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <Check className="w-[1rem] h-[1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Ngắn gọn:</strong> trả về danh sách tối đa 3 việc, mỗi việc có thời lượng và lý do cần làm.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <Check className="w-[1rem] h-[1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Link chỉ lấy từ thư viện của khoá:</strong> link hiển thị lấy từ danh mục có sẵn, không lấy từ chữ AI viết ra, nên AI không bịa được link.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-[1rem] p-[0.75rem] rounded-lg bg-emerald-100/70 text-[0.8rem] text-emerald-950 font-semibold">
                  Bằng chứng: 74/82 (90%) học viên chọn danh sách 3 việc là tính năng muốn dùng hằng ngày.
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-[0.85rem] text-blue-950 font-semibold">
              <span>Từ dữ liệu: <strong className="text-rose-700">8,8%</strong> lượt chat là xin tóm tắt <FlowArrow className="w-[0.95rem] h-[0.95rem] text-blue-700" /> người học cần được <em>chọn giúp việc cần làm</em>, không cần thêm <em>một câu trả lời dài</em>.</span>
              <span className="font-mono text-blue-700 font-bold">Phân tích 13.494 tin nhắn</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 5: GIẢI PHÁP 1 — ĐỘT PHÁ: ACTION AI THAY VÌ CHATBOT
      // -------------------------------------------------------------
      case 4:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Phần II · Giải pháp · Chọn bài toán
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Chọn Bài Toán Mà AI Thật Sự Phải Ra Quyết Định
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                So sánh 3 hướng dựa trên bằng chứng khảo sát và việc AI có thật sự cần thiết hay không.
              </p>
            </div>

            {/* PHÂN: MA TRẬN 3 Ý TƯỞNG */}
            <div className="my-[1.25rem] overflow-hidden rounded-[1.25rem] border border-slate-300 shadow-xs">
              <table className="w-full text-left text-[0.9rem] border-collapse">
                <thead>
                  <tr className="bg-[#0a192f] text-white">
                    <th className="p-[0.85rem] font-semibold w-[30%]">Hướng tiếp cận sản phẩm</th>
                    <th className="p-[0.85rem] font-semibold w-[35%]">Bằng chứng khảo sát</th>
                    <th className="p-[0.85rem] font-semibold">Đánh giá &amp; Quyết định</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-[0.85rem] font-medium text-slate-800">
                      <strong>1. Gom link tĩnh vào 1 trang</strong>
                      <div className="text-[0.75rem] text-slate-500">Thư mục tổng hợp link Discord, Drive</div>
                    </td>
                    <td className="p-[0.85rem] text-slate-600">76/82 (93%) gặp tài liệu rải rác</td>
                    <td className="p-[0.85rem] text-rose-700 font-bold">
                      ❌ LOẠI — Chỉ là một danh sách link; học viên vẫn không biết 45 phút nên đọc gì trước.
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-[0.85rem] font-medium text-slate-800">
                      <strong>2. Chatbot tóm tắt slide bài giảng</strong>
                      <div className="text-[0.75rem] text-slate-500">Tóm tắt slide thành văn bản ngắn</div>
                    </td>
                    <td className="p-[0.85rem] text-slate-600">75/82 (91%) gặp slide dài; 8.8% xin tóm tắt</td>
                    <td className="p-[0.85rem] text-rose-700 font-bold">
                      ❌ LOẠI — Trùng đề Track A (tóm tắt tài liệu); dán slide vào ChatGPT là làm được, sản phẩm không có gì khác biệt.
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 text-blue-950 font-bold">
                    <td className="p-[0.85rem] text-emerald-800">
                      <div className="flex items-center gap-[0.4rem]">
                        <CheckCircle2 className="w-[1.2rem] h-[1.2rem] text-emerald-600 shrink-0" />
                        <span>3. AI chẩn đoán + chọn tối đa 3 việc</span>
                      </div>
                      <div className="text-[0.75rem] text-emerald-700 font-normal">Vừa với số phút rảnh của người học</div>
                    </td>
                    <td className="p-[0.85rem] text-slate-900 font-semibold">
                      71/82 (87%) không biết nên bù phần nào;<br/>41/82 rảnh &lt; 1 giờ; 74/82 muốn dùng hằng ngày
                    </td>
                    <td className="p-[0.85rem] text-emerald-800 font-extrabold">
                      ✅ CHỌN — AI phải tự quyết định chọn việc gì; giải quyết được cả tài liệu rải rác lẫn slide dài.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* HỢP: VALUE PROPOSITION */}
            <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-[0.75rem]">
                <Target className="w-[1.35rem] h-[1.35rem] text-blue-700 shrink-0" />
                <span className="text-[0.95rem] font-semibold text-slate-900">
                  Giá trị cốt lõi: <strong>AI không làm thay học viên — AI dọn đường để học viên tự hoàn thành bài đúng hạn.</strong>
                </span>
              </div>
              <span className="text-[0.8rem] font-mono font-bold text-emerald-700 bg-emerald-100 px-[0.75rem] py-[0.35rem] rounded-lg border border-emerald-300 hidden md:inline-block">
                90% muốn dùng hằng ngày
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 6: GIẢI PHÁP 2 — KIẾN TRÚC 2 AI TƯƠNG HỖ
      // -------------------------------------------------------------
      case 5:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Phần II · Giải pháp · Kiến trúc
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Hai AI: Một AI Chạy Ngầm, Một AI Trò Chuyện
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Tách riêng AI lên lộ trình (không chat) và AI giải đáp thắc mắc (có chat).
              </p>
            </div>

            {/* PHÂN: BỨC TRANH 2 AI */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-blue-50/70 border-2 border-blue-400 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-blue-700 text-white text-[0.75rem] font-bold uppercase mb-[0.75rem]">
                    <Bot className="w-[1rem] h-[1rem]" />
                    <span>AI MENTOR · CHẠY NGẦM · PHẦN ĐƯỢC CHẤM</span>
                  </div>
                  <h3 className="text-[1.25rem] font-bold text-blue-950 mb-[0.35rem]">Không Chat — Chỉ Lên Lộ Trình</h3>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    Đọc dữ liệu học viên (trình độ + thời gian rảnh) <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> Chẩn đoán lỗ hổng <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> Lọc thư viện tài liệu và trả về danh sách tối đa 3 việc.
                  </p>
                  <div className="space-y-[0.35rem] text-[0.8rem] text-slate-700 font-medium bg-white p-[0.75rem] rounded-lg border border-blue-200">
                    <div>• <strong>Vị trí hoạt động:</strong> Trang Lộ trình cá nhân hoá (<code>/personalized-path</code>)</div>
                    <div>• <strong>Link an toàn:</strong> mọi link lấy từ thư viện tài liệu của khoá.</div>
                    <div>• <strong>Tiết kiệm:</strong> chỉ gọi AI một lần cho mỗi lộ trình <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> chi phí thấp.</div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] font-bold text-blue-800 uppercase tracking-wide">
                  Phần ban giám khảo chấm
                </div>
              </div>

              <div className="bg-indigo-50/40 border-2 border-indigo-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-indigo-700 text-white text-[0.75rem] font-bold uppercase mb-[0.75rem]">
                    <Compass className="w-[1rem] h-[1rem]" />
                    <span>AI HELPDESK · TRÒ CHUYỆN</span>
                  </div>
                  <h3 className="text-[1.25rem] font-bold text-indigo-950 mb-[0.35rem]">Trợ Lý Giải Đáp 24/7</h3>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    AI duy nhất người dùng trò chuyện, ở ô chat góc màn hình. Giải thích khái niệm khó, tra cứu 53 tài liệu FAQ của khoá và ghi rõ nguồn.
                  </p>
                  <div className="space-y-[0.35rem] text-[0.8rem] text-slate-700 font-medium bg-white p-[0.75rem] rounded-lg border border-indigo-200">
                    <div>• <strong>Vị trí hoạt động:</strong> Widget chatbox nổi ở toàn bộ hệ thống</div>
                    <div>• <strong>Công nghệ:</strong> tra cứu FAQ (RAG) + tự chuyển sang model khác khi một model lỗi.</div>
                    <div>• <strong>Giới hạn:</strong> khách dùng thử 10 câu/ngày <FlowArrow className="w-[0.9rem] h-[0.9rem] text-indigo-700" /> học viên không giới hạn.</div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] font-bold text-indigo-800 uppercase tracking-wide">
                  Giúp khách dùng thử trước khi đăng ký học
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[0.85rem] flex justify-between items-center text-[0.85rem] text-slate-600 font-medium">
              <span>Helpdesk trả lời câu hỏi ngay lúc cần; AI Mentor chỉ ra hôm nay nên làm gì.</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §1 &amp; §2</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 7: GIẢI PHÁP 3 — TRẢI NGHIỆM 30S & NGUYÊN TẮC ZERO-RISK
      // -------------------------------------------------------------
      case 6:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Phần II · Giải pháp · Trải nghiệm &amp; rủi ro
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Khai Báo 30 Giây, Học Viên Tự Quyết
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                AI đề xuất — học viên quyết định — AI không làm bài thay học viên.
              </p>
            </div>

            {/* PHÂN: 4 BƯỚC THAO TÁC + LỚP BẢO VỆ */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-4 gap-[1rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">1</div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">Khai báo 30s</h4>
                  <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium">
                    Chọn nền tảng (chưa biết code / đã biết code / đã làm AI), số phút rảnh hôm nay và lab sắp tới. Không cần nhập gì thêm.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-blue-700 font-bold mt-[0.5rem]">3 thông tin</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">2</div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">AI chọn tài liệu</h4>
                  <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium">
                    AI Mentor đọc thư viện tài liệu, bỏ phần chưa cần, chọn tối đa 3 tài liệu vừa với thời gian rảnh.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-blue-700 font-bold mt-[0.5rem]">Gọi AI 1 lần</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">3</div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">Danh sách linh hoạt</h4>
                  <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium">
                    Mỗi việc có thời lượng, lý do và link tài liệu gốc. Học viên tự đánh dấu xong, bỏ qua hoặc đổi thứ tự.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-blue-700 font-bold mt-[0.5rem]">Học viên quyết định</div>
              </div>

              <div className="bg-rose-50/50 border border-rose-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">
                    <ShieldCheck className="w-[1.05rem] h-[1.05rem]" />
                  </div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">Lớp bảo vệ (guardrail)</h4>
                  <p className="text-[0.8rem] text-slate-700 leading-relaxed font-medium">
                    Dưới 30 phút <FlowArrow className="w-[0.8rem] h-[0.8rem] text-rose-600" /> hỏi lại; xin làm hộ <FlowArrow className="w-[0.8rem] h-[0.8rem] text-rose-600" /> từ chối; AI lỗi <FlowArrow className="w-[0.8rem] h-[0.8rem] text-rose-600" /> dùng bộ quy tắc dự phòng.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-rose-700 font-bold mt-[0.5rem]">3 tình huống</div>
              </div>
            </div>

            {/* HỢP: QUẢN TRỊ RỦI RÔ (COST-OF-ERROR = 0) */}
            <div className="p-[1rem] rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[0.75rem] font-bold text-emerald-800 uppercase tracking-wider block">Vì sao học viên luôn là người quyết định</span>
                <p className="text-[0.9rem] text-slate-800 font-medium mt-[0.15rem]">
                  Nếu AI chọn sai trọng tâm sát hạn nộp, học viên có thể học lệch hướng — cái giá này không nhỏ. Vì vậy <strong>AI chỉ đề xuất, luôn ghi rõ lý do, và học viên tự quyết định làm việc nào.</strong>
                </p>
              </div>
              <span className="text-emerald-800 font-bold text-[0.8rem] font-mono bg-white px-[0.75rem] py-[0.35rem] rounded-lg border border-emerald-300 shrink-0 hidden sm:inline-block">
                AI đề xuất, người quyết
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 8: CHỨNG MINH 1 — LIVE DEMO THỰC CHIẾN
      // -------------------------------------------------------------
      case 7:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-emerald-700 tracking-[0.08em] uppercase">
                Phần III · Bằng chứng · Demo
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Demo: Chọn Đúng Việc, Từ Chối Làm Hộ Bài
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Chạy trực tiếp trên hệ thống thật: lộ trình theo thời gian rảnh và lớp bảo vệ chống gian lận.
              </p>
            </div>

            {/* PHÂN: 2 TRƯỜNG HỢP DEMO SẮC BÉN */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-blue-50/70 border-2 border-blue-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.5rem]">
                    <span className="px-[0.65rem] py-[0.2rem] rounded-full bg-blue-900 text-white text-[0.75rem] font-bold">
                      KỊCH BẢN 1 · TRƯỜNG HỢP THƯỜNG GẶP
                    </span>
                    <span className="text-[0.75rem] font-mono font-bold text-emerald-700">CHẠY TRỰC TIẾP</span>
                  </div>
                  <h4 className="text-[1.1rem] font-bold text-blue-950 mb-[0.25rem]">Học viên đã biết code · 60 phút rảnh · Chuẩn bị Lab 03</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    Bấm <strong>"Tạo lộ trình"</strong> <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> AI Mentor trả về 3 việc vừa đủ 60 phút:
                  </p>
                  <div className="bg-white p-[0.75rem] rounded-lg border border-blue-200 text-[0.8rem] text-slate-800 font-medium space-y-[0.3rem]">
                    <div className="flex items-center justify-between">
                      <span>✓ Nhiệm vụ 1: Đọc tài liệu Function Calling</span>
                      <span className="font-mono text-blue-700 font-bold">20 phút</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✓ Nhiệm vụ 2: Chạy script mẫu OpenAI Tools</span>
                      <span className="font-mono text-blue-700 font-bold">25 phút</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✓ Nhiệm vụ 3: Tự kiểm tra đầu ra JSON schema</span>
                      <span className="font-mono text-blue-700 font-bold">15 phút</span>
                    </div>
                    <div className="text-emerald-700 font-bold pt-[0.25rem] border-t border-slate-100 flex justify-between">
                      <span>Tổng thời gian: Đúng 60 phút</span>
                      <span>Link lấy từ thư viện của khoá</span>
                    </div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] text-blue-900 font-semibold">
                  Kết quả: 3 việc, 60 phút, mỗi việc có lý do.
                </div>
              </div>

              <div className="bg-rose-50/70 border-2 border-rose-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.5rem]">
                    <span className="px-[0.65rem] py-[0.2rem] rounded-full bg-rose-700 text-white text-[0.75rem] font-bold">
                      KỊCH BẢN 2 · CHỐNG GIAN LẬN
                    </span>
                    <span className="text-[0.75rem] font-mono font-bold text-rose-700">GIỮ LIÊM CHÍNH HỌC THUẬT</span>
                  </div>
                  <h4 className="text-[1.1rem] font-bold text-rose-950 mb-[0.25rem]">Học viên nhập: “Làm hộ bài lab và gửi đáp án testcase ẩn”</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    Học viên thử nhờ AI làm hộ bài <FlowArrow className="w-[0.9rem] h-[0.9rem] text-rose-700" /> AI Mentor xử lý:
                  </p>
                  <div className="bg-white p-[0.75rem] rounded-lg border border-rose-200 text-[0.8rem] text-slate-800 font-medium space-y-[0.3rem]">
                    <div className="text-rose-700 font-bold flex items-center gap-[0.4rem]">
                      <X className="w-[1rem] h-[1rem]" />
                      <span>Từ chối cung cấp đáp án hoặc code thay học viên.</span>
                    </div>
                    <div className="flex items-center gap-[0.35rem] text-slate-700">
                      <ShieldCheck className="w-[0.95rem] h-[0.95rem] text-emerald-600 shrink-0" />
                      <span>Giải thích nguyên tắc sư phạm và liêm chính học thuật.</span>
                    </div>
                    <div className="flex items-center gap-[0.35rem] text-slate-700">
                      <ShieldCheck className="w-[0.95rem] h-[0.95rem] text-emerald-600 shrink-0" />
                      <span>Gợi ý hỏi Lab Coach nếu đang bí.</span>
                    </div>
                    <div className="text-slate-500 italic pt-[0.25rem] border-t border-slate-100">
                      Giữ giá trị của bài lab và chương trình học.
                    </div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] text-rose-900 font-semibold">
                  Kết quả: 3/3 case gian lận trong bộ kiểm thử đều bị từ chối.
                </div>
              </div>
            </div>

            {/* HỢP & NÚT MỞ DEMO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-[1rem] pt-[0.5rem]">
              <div className="text-[0.85rem] text-slate-600 font-medium">
                Mời Ban giám khảo tự thao tác hoặc đưa tình huống để thử ngay tại chỗ.
              </div>
              <Link
                href="/personalized-path"
                target="_blank"
                className="w-full sm:w-auto px-[1.6rem] py-[0.8rem] rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-[0.85rem] uppercase tracking-wider shadow-lg shadow-blue-500/25 ring-4 ring-blue-300/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-[0.5rem] shrink-0"
              >
                <Monitor className="w-[1.1rem] h-[1.1rem] text-sky-300" />
                <span>MỞ TRANG DEMO (/personalized-path)</span>
                <ExternalLink className="w-[0.9rem] h-[0.9rem]" />
              </Link>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 9: CHỨNG MINH 2 — ĐO LƯỜNG KHOA HỌC & SỰ THẬT CA G02
      // -------------------------------------------------------------
      case 8:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-emerald-700 tracking-[0.08em] uppercase">
                Phần III · Bằng chứng · Đo lường
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Kết Quả Đo: 19/20 Và Các Case Còn Trượt
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Nhóm chốt chuẩn đạt từ sớm, đo bằng số thật và ghi cả những lần trượt.
              </p>
            </div>

            {/* PHÂN: BẢNG SỐ LIỆU THẬT & MỔ XẺ CA BIÊN G02 */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-12 gap-[1.25rem]">
              <div className="md:col-span-6 space-y-[0.75rem]">
                <div className="overflow-hidden rounded-xl border border-slate-300 shadow-xs">
                  <table className="w-full text-left text-[0.85rem] border-collapse">
                    <thead>
                      <tr className="bg-[#0a192f] text-white">
                        <th className="p-[0.65rem] font-semibold">Phiên bản (20 case)</th>
                        <th className="p-[0.65rem] font-semibold">Tỷ lệ đạt</th>
                        <th className="p-[0.65rem] font-semibold">Link ngoài</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-white">
                        <td className="p-[0.65rem] font-medium text-slate-700">Baseline quy tắc tĩnh</td>
                        <td className="p-[0.65rem] font-bold text-slate-800">17/20 (85%)</td>
                        <td className="p-[0.65rem] font-bold text-emerald-700">0</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-[0.65rem] font-medium text-slate-700">AI v1 · Gemini Flash-Lite</td>
                        <td className="p-[0.65rem] font-bold text-slate-800">18/20 (90%)</td>
                        <td className="p-[0.65rem] font-bold text-emerald-700">0</td>
                      </tr>
                      <tr className="bg-emerald-50 font-bold text-blue-950">
                        <td className="p-[0.65rem] text-emerald-800 flex items-center gap-[0.4rem]">
                          <CheckCircle2 className="w-[1rem] h-[1rem] text-emerald-600" />
                          <span>AI v2 · Bản chốt 17/9</span>
                        </td>
                        <td className="p-[0.65rem] text-emerald-800 text-[1rem]">19/20 (95%)</td>
                        <td className="p-[0.65rem] text-emerald-800 text-[1rem]">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-[0.75rem] rounded-xl bg-blue-50 border border-blue-200 text-[0.8rem] text-blue-950 font-medium">
                  <strong>Chuẩn đạt ghi trong spec.md:</strong><br/>
                  • Tỷ lệ đạt ≥ 18/20 (90%) <FlowArrow className="w-[0.85rem] h-[0.85rem] text-emerald-700" /> <strong>Thực tế: 19/20 (95%)</strong>.<br/>
                  • Link ngoài catalog = 0 <FlowArrow className="w-[0.85rem] h-[0.85rem] text-emerald-700" /> <strong>Thực tế: 0 link ngoài</strong>.<br/>
                  • Chống gian lận 3/3 <FlowArrow className="w-[0.85rem] h-[0.85rem] text-emerald-700" /> <strong>Thực tế: 3/3</strong>.
                </div>
              </div>

              <div className="md:col-span-6 space-y-[0.75rem]">
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-[1rem]">
                  <div className="flex items-center gap-[0.4rem] text-rose-700 font-bold text-[0.9rem] mb-[0.25rem]">
                    <AlertTriangle className="w-[1rem] h-[1rem]" />
                    <span>Case trượt ở mốc chốt: G02 (đã sửa 18/9)</span>
                  </div>
                  <p className="text-[0.8rem] text-slate-700 font-medium leading-relaxed">
                    AI chọn đúng tài liệu <code className="bg-white px-[0.3rem] py-[0.05rem] rounded border font-mono text-[0.75rem] font-bold">ptc-function-calling</code> nhưng xếp thứ ba, nên bị loại khi cộng đủ 60 phút. Nhóm giữ nguyên 19/20 ở mốc chốt, không sửa số; sau đó sửa thứ tự ưu tiên và G02 đã đạt.
                  </p>
                </div>

                <div className="p-[0.75rem] rounded-xl bg-slate-50 border border-slate-200 text-[0.8rem] text-slate-700 font-medium leading-relaxed">
                  <strong>Mở rộng lên 50 case (lượt chạy 18/9):</strong><br/>
                  • Bộ quy tắc dự phòng: 50/50. AI: <strong>44/50 (88%)</strong> — chưa đạt chuẩn 90%, đang sửa 6 case.<br/>
                  • Gồm 40 case từ khó khăn của học viên và 10 case bảo vệ hệ thống (lộ đáp án, lách hạn nộp, lạm dụng AI). Cả hai bản đều 0 link ngoài thư viện.
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[0.85rem] flex justify-between items-center text-[0.85rem] text-slate-500 font-medium">
              <span>Mọi số trên slide này đều có trong eval/run_results.md</span>
              <span className="font-mono text-blue-700 font-bold">spec.md §7 · eval/run_results.md</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 10: BUSINESS MODEL — PHỄU 4 VAI TRÒ & CHI PHÍ <4.800Đ
      // -------------------------------------------------------------
      case 9:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Phần III · Bằng chứng · Vận hành &amp; chi phí
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                4 Vai Trò Người Dùng Và Cách Giữ Chi Phí AI Thấp
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Sản phẩm AI chỉ bền khi chi phí gọi AI cho mỗi học viên được kiểm soát.
              </p>
            </div>

            {/* PHÂN: 3 TRỤ CỘT BẢO VỆ DÒNG TIỀN */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-3 gap-[1.25rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold mb-[0.75rem]">
                    <Users className="w-[1.2rem] h-[1.2rem]" />
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.25rem]">Phễu 4 vai trò</h4>
                  <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                    • <strong>Viewer (Khách):</strong> Dùng thử AI Helpdesk 10 câu/ngày <FlowArrow className="w-[0.8rem] h-[0.8rem] text-blue-700" /> trải nghiệm trước khi đăng ký.<br/>
                    • <strong>Student (Học viên):</strong> Dùng Lộ trình cá nhân hoá.<br/>
                    • <strong>Lecturer &amp; Admin:</strong> Quản lý tài liệu và duyệt tài khoản.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-700 mt-[0.5rem]">Mỗi vai trò một giao diện</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold mb-[0.75rem]">
                    <Lock className="w-[1.2rem] h-[1.2rem]" />
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.25rem]">Duyệt tài khoản trước khi dùng AI</h4>
                  <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                    Tài khoản mới phải được Admin duyệt (<code>/admin/approvals</code>) mới được gọi AI, hạn chế tài khoản rác và bot tiêu tốn chi phí AI.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-emerald-700 mt-[0.5rem]">Chặn chi phí phát sinh</div>
              </div>

              <div className="bg-emerald-50/40 border border-emerald-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs hover:border-emerald-400 transition">
                <div>
                  <div className="flex items-center justify-between mb-[0.5rem]">
                    <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                      <DollarSign className="w-[1.2rem] h-[1.2rem]" />
                    </div>
                    <span className="text-[1.5rem] font-bold text-emerald-700 font-mono">1 lần</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.25rem]">Gọi AI Một Lần Mỗi Lộ Trình</h4>
                  <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                    Dùng Gemini Flash-Lite với prompt ngắn, mỗi lộ trình chỉ gọi AI <strong>một lần</strong>. Khi AI lỗi, hệ thống dùng bộ quy tắc dự phòng — không tốn thêm chi phí.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-emerald-700 mt-[0.5rem]">Chi phí dự đoán được</div>
              </div>
            </div>

            {/* HỢP: TÍCH HỢP DISCORD ACTIVITY */}
            <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[0.5rem] text-[0.85rem] text-blue-950 font-semibold">
              <div className="flex items-center gap-[0.5rem]">
                <Sparkles className="w-[1.1rem] h-[1.1rem] text-blue-700 shrink-0" />
                <span>Tích hợp Discord (+5 XP): ghi nhận việc tự học lên kênh #activity của khoá, tạo động lực học đều mỗi ngày.</span>
              </div>
              <span className="font-mono text-blue-700 font-bold bg-white px-[0.5rem] py-[0.2rem] rounded border border-blue-300 shrink-0">
                +5 XP Discord
              </span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 11: KẾ HOẠCH HÀNH ĐỘNG NẾU CÓ THÊM 1 TUẦN
      // -------------------------------------------------------------
      case 10:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Phần III · Bước tiếp theo
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Nếu Có Thêm 1 Tuần, Nhóm Sẽ Làm Gì
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                3 việc ưu tiên, mỗi việc đã có phần nền trong code hoặc database.
              </p>
            </div>

            {/* PHÂN: 3 ĐÒN BẨY HÀNH ĐỘNG CỤ THỂ */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-3 gap-[1.25rem]">
              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.85rem] mb-[0.75rem]">
                    1
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-blue-950 mb-[0.25rem]">Thử Với 5 Học Viên Thật</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    Mời 5 học viên ngoài nhóm dùng trước buổi lab, so thời gian hoàn thành bài với cách tự đọc slide như hiện nay.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-800 mt-[0.5rem]">Đo bằng người dùng thật</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.85rem] mb-[0.75rem]">
                    2
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-blue-950 mb-[0.25rem]">Hoàn Thiện Bài Test Từ CV</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    74/82 học viên muốn có bài test chẩn đoán ngắn. Đã có bản đầu: AI đọc CV, sinh bài test, rồi từ điểm test tạo lộ trình. Cần thêm dữ liệu thật để đo chất lượng.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-800 mt-[0.5rem]">Đã có bản đầu</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.85rem] mb-[0.75rem]">
                    3
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-blue-950 mb-[0.25rem]">Cổng Nạp Tài Liệu Giảng Viên</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    Giảng viên tải lên PDF/slide <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> hệ thống chia đoạn, tạo vector và đưa vào thư viện cho AI Mentor sau khi được duyệt. Phần database đã có.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-800 mt-[0.5rem]">Đã có database</div>
              </div>
            </div>

            {/* HỢP: BÀI HỌC CỐT LÕI */}
            <div className="p-[1.1rem] rounded-xl bg-gradient-to-r from-blue-950 via-blue-900 to-[#1e3a8a] text-white shadow-md">
              <div className="text-[0.75rem] uppercase font-bold text-sky-300 tracking-wider mb-[0.2rem] flex items-center gap-[0.4rem]">
                <Sparkles className="w-[0.95rem] h-[0.95rem]" />
                <span>Bài học kinh nghiệm lớn nhất của nhóm</span>
              </div>
              <p className="text-[0.95rem] sm:text-[1.05rem] font-medium leading-relaxed">
                Viết đặc tả (spec) rõ ràng và chốt chuẩn đạt từ sớm giúp nhóm làm xong đúng hạn, không bị cuốn vào các tính năng không cần thiết.
              </p>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 12: TỔNG KẾT & PHÂN VAI PHẢN BIỆN Q&A
      // -------------------------------------------------------------
      case 11:
        return (
          <div className="flex flex-col justify-between h-full select-text font-['Montserrat',sans-serif] text-slate-800">
            {/* TỔNG */}
            <div>
              <div className="text-[0.85rem] font-semibold text-blue-700 tracking-[0.08em] uppercase">
                Tổng kết · Hỏi đáp
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Tóm Tắt Bằng 4 Con Số
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Nhóm xin mời câu hỏi từ Ban giám khảo.
              </p>
            </div>

            {/* PHÂN: 4 TRỤ CỘT CAM KẾT VỮNG CHẮC */}
            <div className="my-[1rem] grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">87% · 90%</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">87% không biết cần bù phần nào; 90% muốn dùng danh sách 3 việc hằng ngày (khảo sát 82 học viên).</div>
                </div>
              </div>

              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">19/20 · 0 link ngoài</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">19/20 case đạt ở mốc chốt; mở rộng 50 case: AI 44/50, đang sửa tiếp.</div>
                </div>
              </div>

              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">3/3 từ chối làm hộ</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">Mọi case xin làm hộ bài trong bộ kiểm thử đều bị từ chối.</div>
                </div>
              </div>

              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">1 lần gọi AI / lộ trình</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">Khi AI lỗi, dùng bộ quy tắc dự phòng; tài khoản phải được duyệt mới dùng AI.</div>
                </div>
              </div>
            </div>

            {/* HỢP: PHÂN VAI TRẢ LỜI Q&A THEO LUẬT VIBE-CODING */}
            <div className="border-t border-slate-200 pt-[0.75rem]">
              <div className="text-[0.75rem] uppercase font-bold text-slate-500 mb-[0.4rem] tracking-wider">
                Mỗi thành viên trả lời phần mình làm (Ban giám khảo có thể hỏi trực tiếp từng người):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[0.5rem]">
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Khoa (PM · Backend)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Spec, Backend .NET, giao diện Student/Viewer</div>
                </div>
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Thành (AI Mentor)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Lộ trình, bài test từ CV, prompt, golden set</div>
                </div>
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Đức (AI Helpdesk)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Helpdesk, giao diện Admin/Lecturer</div>
                </div>
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Minh (Database)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Schema, migration, dữ liệu mẫu, phân quyền</div>
                </div>
              </div>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // SLIDE 13: CẢM ƠN
      // -------------------------------------------------------------
      case 12:
        return (
          <div className="relative flex flex-col items-center justify-center h-full text-center select-text font-['Montserrat',sans-serif] text-slate-900 overflow-hidden rounded-[1.25rem]">
            <div className="absolute -top-[5rem] -right-[5rem] w-[22rem] h-[22rem] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-[6rem] -left-[6rem] w-[24rem] h-[24rem] bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-[0.85rem] font-bold text-slate-500 uppercase tracking-[0.1em] mb-[0.75rem]">
                Adaptive Learning System · Nhóm Vinonymus
              </div>
              <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-bold text-[#0a192f] leading-[1.1] tracking-[0.01em] uppercase">
                Xin chân thành cảm ơn!
              </h1>
              <p className="text-[clamp(1rem,1.8vw,1.35rem)] font-semibold text-blue-700 mt-[1rem]">
                Cảm ơn Ban giám khảo và các bạn đã lắng nghe.
              </p>

              <div className="mt-[2rem] flex flex-wrap justify-center gap-[0.5rem] text-[0.85rem] text-slate-700 font-medium">
                <span className="bg-white/80 border border-slate-200 px-[0.75rem] py-[0.3rem] rounded-md"><strong>Đỗ Khắc Gia Khoa</strong></span>
                <span className="bg-white/80 border border-slate-200 px-[0.75rem] py-[0.3rem] rounded-md"><strong>Nguyễn Việt Thành</strong></span>
                <span className="bg-white/80 border border-slate-200 px-[0.75rem] py-[0.3rem] rounded-md"><strong>Đinh Ngọc Đức</strong></span>
                <span className="bg-white/80 border border-slate-200 px-[0.75rem] py-[0.3rem] rounded-md"><strong>Trần Nhật Minh</strong></span>
              </div>
              <div className="mt-[1rem] font-mono text-blue-800 font-bold bg-blue-50 border border-blue-200 px-[0.75rem] py-[0.25rem] rounded-md text-[0.8rem]">
                Mini Hackathon AI · Track E · Khoá 4 · Lớp 3A · AI20K
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

        {/* Center: Stopwatch / Pitch Timer (06:00 Budget) */}
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
      {/* 2. MAIN PRESENTATION CANVAS: WHITE CANVAS, NAVY ACCENTS, 16:9 PROPORTIONAL */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col justify-center items-center p-[0.75rem] md:p-[1.25rem] overflow-y-auto bg-slate-900/90">
        {viewMode === 'single' ? (
          <div className="w-full max-w-[84rem] h-[calc(100vh-8.5rem)] min-h-[38rem] max-h-[52rem] bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 p-[2rem] sm:p-[2.5rem] md:p-[3rem] transition-all duration-300 flex flex-col">
            {renderSlideContent(currentSlide)}
          </div>
        ) : (
          /* Continuous vertical scroll mode */
          <div className="w-full max-w-[84rem] space-y-[2rem] pb-[4rem]">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div
                key={idx}
                id={`slide-${idx}`}
                className="w-full min-h-[38rem] bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 p-[2rem] sm:p-[2.5rem] md:p-[3rem]"
              >
                <div className="text-[0.75rem] font-mono font-bold text-slate-400 mb-[1rem] uppercase tracking-wider">
                  Slide {idx + 1} / {totalSlides} · {slideTitles[idx]}
                </div>
                {renderSlideContent(idx)}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM THUMBNAILS & QUICK-JUMP SLIDE SELECTOR BAR                      */}
      {/* ========================================================================= */}
      <footer className="w-full h-[3.25rem] shrink-0 bg-[#070d1e] border-t border-slate-800/80 px-[1.25rem] flex items-center justify-between gap-[0.75rem] text-[0.8rem] text-slate-400">
        
        {/* Left: Keyboard shortcuts tooltip */}
        <div className="hidden lg:flex items-center gap-[0.75rem] text-[0.75rem] text-slate-400">
          <span>Phím tắt:</span>
          <span className="bg-slate-800 px-[0.4rem] py-[0.15rem] rounded border border-slate-700 font-mono text-slate-300">Space / →</span>
          <span className="bg-slate-800 px-[0.4rem] py-[0.15rem] rounded border border-slate-700 font-mono text-slate-300">←</span>
          <span className="bg-slate-800 px-[0.4rem] py-[0.15rem] rounded border border-slate-700 font-mono text-slate-300">F (Full)</span>
          <span className="bg-slate-800 px-[0.4rem] py-[0.15rem] rounded border border-slate-700 font-mono text-slate-300">T (Timer)</span>
        </div>

        {/* Center: Slide Quick-jump Numbers */}
        <div className="flex items-center gap-[0.35rem] overflow-x-auto py-[0.2rem] max-w-full">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className={`h-[1.85rem] px-[0.6rem] rounded-lg text-[0.75rem] font-bold font-mono transition cursor-pointer flex items-center justify-center shrink-0 ${
                currentSlide === i
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={slideTitles[i]}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Right: Pitching Room & Track Tag */}
        <div className="hidden sm:flex items-center gap-[0.5rem] text-[0.75rem] text-slate-400 font-medium">
          <span className="w-[0.5rem] h-[0.5rem] rounded-full bg-emerald-500 animate-pulse" />
          <span>Track E · Cụm C2 · P.E403</span>
        </div>
      </footer>
    </div>
  );
}
