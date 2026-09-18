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
    '1. Bìa Dự Án & Định Vị',
    '2. Bản Đồ Thuyết Trình',
    '3. Thực Trạng & Điểm Nghẽn',
    '4. Nghịch Lý Chatbot AI',
    '5. Đột Phá: Action AI',
    '6. Kiến Trúc 2 AI Phân Vai',
    '7. Trải Nghiệm & Zero-Risk',
    '8. Live Demo Thực Chiến',
    '9. Đo Lường Khoa Học & G02',
    '10. Business Model & Phễu 4 Vai Trò',
    '11. Kế Hoạch Tăng Trưởng',
    '12. Tổng Kết & Phân Vai Q&A'
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
                <strong>Đột phá cốt lõi:</strong> Chuyển dịch toàn diện từ mô hình <em>"Bội thực tài liệu &amp; Chatbot thụ động"</em> sang <em>"AI thực thi may đo lộ trình hành động trọng tâm theo từng phút rảnh"</em>, thu hẹp khoảng cách giữa người học Non-tech và Tech-base.
              </p>
            </div>

            {/* PHÂN: 4 TRỤ CỘT ĐỊNH VỊ DỰ ÁN */}
            <div className="relative z-10 my-[1.25rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1rem]">
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-rose-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-[0.5rem]">
                  <Target className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Bài toán thực tế</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">Bội Thực &amp; Lạc Lối Tự Học</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  87% học viên không tự biết mình hổng ở đâu, quá tải trước 5 kênh rời rạc và slide 50-60 trang mỗi tối.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-blue-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-[0.5rem]">
                  <Bot className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-blue-700 uppercase tracking-wider">Mô hình sản phẩm</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">Kiến Trúc 2 AI Phân Vai</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  <strong>AI Mentor</strong> (Action AI chạy ngầm ra quyết định) &amp; <strong>AI Helpdesk</strong> (Trợ lý hội thoại tra cứu FAQ 24/7).
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-emerald-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-[0.5rem]">
                  <ShieldCheck className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-emerald-700 uppercase tracking-wider">Lát cắt chấm thi (Scope)</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">AI Mentor Ra Quyết Định</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  Hoạt động thật tại <code>/personalized-path</code>: Cắt tỉa catalog 100% nội bộ, xuất checklist ≤3 việc và chống gian lận.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs border border-slate-200 rounded-[1.15rem] p-[1.25rem] shadow-xs hover:border-indigo-300 transition">
                <div className="w-[2rem] h-[2rem] rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-[0.5rem]">
                  <TrendingUp className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <div className="text-[0.75rem] font-bold text-indigo-700 uppercase tracking-wider">Hiệu quả kinh tế</div>
                <div className="text-[0.95rem] font-bold text-slate-900 mt-[0.2rem] mb-[0.25rem]">Unit Economics &lt;4.800đ</div>
                <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                  Tối ưu chi phí token LLM, kiến trúc duyệt tài khoản Admin chống spam và tích hợp Discord Activity (+5 XP).
                </p>
              </div>
            </div>

            {/* FOOTER: ĐỘI NGŨ VINONYMUS & VAI TRÒ */}
            <div className="relative z-10 border-t border-slate-200/90 pt-[0.85rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-[0.5rem] text-[0.8rem]">
              <div className="flex flex-wrap items-center gap-[0.4rem] text-slate-700 font-medium">
                <span className="font-bold text-slate-900 bg-slate-100 px-[0.5rem] py-[0.15rem] rounded text-[0.75rem] uppercase tracking-wider">Đội ngũ:</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Đỗ Khắc Gia Khoa</strong> (Lead · Backend)</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Nguyễn Việt Thành</strong> (AI Mentor · UI)</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Đinh Ngọc Đức</strong> (Helpdesk · Pipeline)</span>
                <span className="bg-slate-50 border border-slate-200 px-[0.5rem] py-[0.15rem] rounded-md"><strong>Trần Nhật Minh</strong> (Database · CI)</span>
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
                Bản đồ chiến lược · Cấu trúc phản biện
              </div>
              <h1 className="text-[clamp(1.5rem,2.8vw,2.4rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em] flex flex-wrap items-center gap-[0.4rem]">
                <span>Hành Trình 3 Trụ Cột:</span>
                <span className="inline-flex items-center gap-[0.35rem] bg-rose-50 text-rose-800 px-[0.65rem] py-[0.15rem] rounded-lg text-[0.85em] border border-rose-200">
                  Vấn Đề
                </span>
                <ArrowRight className="w-[1.2rem] h-[1.2rem] text-slate-400 stroke-[3] shrink-0" />
                <span className="inline-flex items-center gap-[0.35rem] bg-blue-50 text-blue-700 px-[0.65rem] py-[0.15rem] rounded-lg text-[0.85em] border border-blue-200">
                  Giải Pháp
                </span>
                <ArrowRight className="w-[1.2rem] h-[1.2rem] text-slate-400 stroke-[3] shrink-0" />
                <span className="inline-flex items-center gap-[0.35rem] bg-emerald-50 text-emerald-800 px-[0.65rem] py-[0.15rem] rounded-lg text-[0.85em] border border-emerald-200">
                  Thực Chứng
                </span>
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Khung luận điểm chặt chẽ được thiết kế nhằm chứng minh tính khả thi, giá trị thực tiễn và năng lực mở rộng sản phẩm.
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
                    <li>• Cơn ác mộng 21:00 của người học đi làm</li>
                    <li>• Bằng chứng ma trận 5 kênh phân mảnh tài liệu</li>
                    <li>• Sự bất lực và thụ động của các Chatbot AI hiện nay</li>
                  </ul>
                </div>
                <div className="mt-[1rem] pt-[0.75rem] border-t border-slate-200 text-[0.75rem] text-slate-600 font-semibold">
                  Luận điểm: Xác thực nhu cầu bức thiết bằng dữ liệu định lượng
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
                  <h3 className="text-[1.15rem] font-bold text-blue-950 mb-[0.4rem]">ĐỘT PHÁ CÔNG NGHỆ</h3>
                  <div className="text-[0.8rem] font-semibold text-blue-700 mb-[0.5rem]">Kiến trúc sản phẩm thông minh</div>
                  <ul className="space-y-[0.4rem] text-[0.85rem] text-slate-700 font-medium">
                    <li>• Đột phá Action AI: May đo hành động thay vì nói nhiều</li>
                    <li>• Kiến trúc 2 AI chuyên biệt: AI Mentor vs AI Helpdesk</li>
                    <li>• Quy trình 30 giây tối giản &amp; Nguyên lý Zero Cost-of-Error</li>
                  </ul>
                </div>
                <div className="mt-[1rem] pt-[0.75rem] border-t border-blue-200 text-[0.75rem] text-blue-900 font-semibold">
                  Luận điểm: Mô hình ra quyết định thực thi tạo rào cản công nghệ
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
                  <h3 className="text-[1.15rem] font-bold text-slate-900 mb-[0.4rem]">THỰC CHỨNG &amp; VẬN HÀNH</h3>
                  <div className="text-[0.8rem] font-semibold text-emerald-800 mb-[0.5rem]">Hiệu quả kinh tế &amp; Tăng trưởng</div>
                  <ul className="space-y-[0.4rem] text-[0.85rem] text-slate-700 font-medium">
                    <li>• Live Demo kịch bản chuẩn &amp; Phòng thủ chống gian lận</li>
                    <li>• Đo lường 50 case kiểm thử &amp; Sự thật ca trượt G02</li>
                    <li>• Phễu chuyển đổi 4 vai trò &amp; Chi phí AI &lt;4.800đ/học viên</li>
                  </ul>
                </div>
                <div className="mt-[1rem] pt-[0.75rem] border-t border-slate-200 text-[0.75rem] text-emerald-800 font-semibold">
                  Luận điểm: Sản phẩm chạy thật, bảo vệ dòng tiền và liêm chính học thuật
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[0.85rem] flex justify-between items-center text-[0.85rem] text-slate-500 font-medium">
              <span>Phương châm phản biện: Minh bạch số liệu, kiểm chứng tại chỗ, lấy hiệu quả người học làm trọng tâm</span>
              <span className="text-blue-700 font-semibold font-mono">Evidence-Based Pitching</span>
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
                Trụ cột I: Điểm nghẽn thị trường · Câu chuyện thực tế
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Cơn Ác Mộng 21:00: Người Học Không Thiếu Tài Liệu — Họ Đang Bội Thực!
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Trong các chương trình đào tạo AI thực chiến, nghịch lý lớn nhất là người học bị chôn vùi trong biển tài liệu mà không biết bắt đầu từ đâu.
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
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.5rem]">Ma trận 5 kênh phân mảnh</h4>
                  <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                    Tài liệu bị xé nhỏ khắp nơi: Discord, Zoom chat, Google Drive, LMS và GitHub. 76/82 học viên mất <strong>15–25 phút</strong> mỗi buổi chỉ để đi gom đủ link!
                  </p>
                </div>
                <div className="mt-[0.75rem] p-[0.65rem] rounded-lg bg-rose-50 border border-rose-100 text-[0.75rem] text-rose-800 italic">
                  “Mỗi buổi học phải mất 25 phút chỉ để gom link từ các kênh Discord, Drive.” — P01 (Tech-base)
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.25rem]">
                    <span className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Điểm nghẽn 2</span>
                    <span className="text-[1.75rem] font-bold text-rose-600 font-mono">50%</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.5rem]">Áp lực thời gian ngặt nghèo</h4>
                  <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                    41/82 học viên là người đi làm, chỉ có <strong>dưới 60 phút</strong> mỗi tối để tự học. Nhưng trước mặt họ là bộ slide dài hơn 60 trang ngập tràn lý thuyết hàn lâm.
                  </p>
                </div>
                <div className="mt-[0.75rem] p-[0.65rem] rounded-lg bg-rose-50 border border-rose-100 text-[0.75rem] text-rose-800 italic">
                  “Có 45 phút mà nhìn slide 60 trang em hoảng loạn chỉ muốn tắt máy đi ngủ.” — P02 (Non-tech)
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.25rem]">
                    <span className="text-[0.75rem] font-bold text-rose-600 uppercase tracking-wider">Điểm nghẽn 3</span>
                    <span className="text-[1.75rem] font-bold text-rose-600 font-mono">87%</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.5rem]">Mù mờ điểm xuất phát</h4>
                  <p className="text-[0.85rem] text-slate-600 font-medium leading-relaxed">
                    71/82 học viên <strong>không tự xác định được</strong> lỗ hổng kiến thức. Người non-tech thì sợ code, người tech-base thì hổng toán AI, không biết bù cái gì trước.
                  </p>
                </div>
                <div className="mt-[0.75rem] p-[0.65rem] rounded-lg bg-rose-50 border border-rose-100 text-[0.75rem] text-rose-800 italic">
                  Hậu quả: 8.8% lượt chat van xin “Tóm tắt giùm em” hoặc nộp bài sát hạn, nộp trễ.
                </div>
              </div>
            </div>

            {/* HỢP: KẾT LUẬN ĐANH THÉP */}
            <div className="bg-slate-50 border-l-4 border-rose-600 p-[1rem] rounded-r-xl flex items-center justify-between">
              <div>
                <p className="text-[0.95rem] font-semibold text-slate-900">
                  Cái học viên thiếu <strong>KHÔNG PHẢI LÀ THÊM TÀI LIỆU</strong> — Cái họ thiếu là một người chỉ huy nói rõ: <em>"Tối nay em chỉ cần làm đúng 3 việc này!"</em>
                </p>
              </div>
              <span className="text-[0.8rem] font-bold text-rose-700 bg-white px-[0.75rem] py-[0.35rem] rounded-lg border border-slate-200 hidden sm:inline-block shrink-0">
                Nghiên cứu định lượng n = 82 học viên thật
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
                Trụ cột I: Điểm nghẽn thị trường · Phân tích đối thủ &amp; Giải pháp cũ
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Tại Sao Các Chatbot AI Hiện Tại Đang Thất Bại Trước Nỗi Đau Này?
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Khai phá từ 13.494 tin nhắn chat thực tế trên hệ thống LMS/VLearn phơi bày sự bất lực của mô hình Chatbot đàm thoại truyền thống.
              </p>
            </div>

            {/* PHÂN: ĐỐI CHIẾU SỰ THẤT BẠI CỦA CHATBOT THỤ ĐỘNG */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-rose-50/40 border-2 border-rose-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-[0.5rem] text-rose-700 font-bold text-[1.05rem] mb-[0.75rem]">
                    <HelpCircle className="w-[1.2rem] h-[1.2rem]" />
                    <span>Hiện trạng: Chatbot AI Thụ Động (Passive AI)</span>
                  </div>
                  <div className="space-y-[0.75rem] text-[0.85rem] text-slate-700 font-medium">
                    <div className="flex items-start gap-[0.5rem]">
                      <X className="w-[1rem] h-[1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>99.87% Thụ động ngồi chờ:</strong> Chỉ 18/13.494 lượt chat AI Tutor tự chủ động gợi ý bước tiếp theo. Còn lại hoàn toàn im lặng nếu người dùng không hỏi.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <X className="w-[1rem] h-[1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Nghịch lý đặt câu hỏi:</strong> Học viên không biết mình hổng chỗ nào thì làm sao biết đặt câu hỏi đúng để chatbot trả lời?</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <X className="w-[1rem] h-[1rem] text-rose-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Bội thực chữ (Wall of Text):</strong> Hỏi một câu ngắn, chatbot tuôn ra bài luận 500 từ. Người chỉ có 45 phút đọc xong càng thêm kiệt sức!</span>
                    </div>
                  </div>
                </div>
                <div className="mt-[1rem] p-[0.75rem] rounded-lg bg-rose-100/70 text-[0.8rem] text-rose-900 font-semibold">
                  Hậu quả: Chatbot trở thành một nguồn gây xao nhãng và quá tải mới!
                </div>
              </div>

              <div className="bg-emerald-50/40 border-2 border-emerald-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-[0.5rem] text-emerald-900 font-bold text-[1.05rem] mb-[0.75rem]">
                    <Zap className="w-[1.2rem] h-[1.2rem] text-emerald-600" />
                    <span>Cái người học thực sự khao khát: AI Thực Thi (Action AI)</span>
                  </div>
                  <div className="space-y-[0.75rem] text-[0.85rem] text-slate-700 font-medium">
                    <div className="flex items-start gap-[0.5rem]">
                      <Check className="w-[1rem] h-[1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Chẩn đoán trước khi hỏi:</strong> Nắm bắt nền tảng (Non-tech / Tech) và số phút rảnh để tự tính toán đường đi tối ưu.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <Check className="w-[1rem] h-[1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>Nói không với văn vở:</strong> Không chat dông dài — Trả thẳng một Checklist ≤3 việc có thời lượng rõ ràng và lý do vì sao cần học.</span>
                    </div>
                    <div className="flex items-start gap-[0.5rem]">
                      <Check className="w-[1rem] h-[1rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                      <span><strong>100% Link sạch đã kiểm chứng:</strong> Tuyệt đối không sinh URL ảo ngoài catalog, loại bỏ hoàn toàn rủi ro hallucination.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-[1rem] p-[0.75rem] rounded-lg bg-emerald-100/70 text-[0.8rem] text-emerald-950 font-semibold">
                  Bằng chứng: 74/82 (90%) học viên khẳng định muốn dùng Checklist 3 việc này mỗi ngày.
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-[0.85rem] text-blue-950 font-semibold">
              <span>Insight từ dữ liệu: <strong className="text-rose-700">8.8%</strong> lượt chat xin "tóm tắt" là tiếng kêu cứu <FlowArrow className="w-[0.95rem] h-[0.95rem] text-blue-700" /> Sản phẩm phải chuyển từ <em>Chatbot đàm thoại</em> sang <em>AI thực thi hành động</em>.</span>
              <span className="font-mono text-blue-700 font-bold">13.494 chats mining</span>
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
                Trụ cột II: Đột phá sản phẩm · Phân tích chiến lược lựa chọn bài toán
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Chiến Lược Lựa Chọn: Tìm Bài Toán Có AI Ra Quyết Định Thực Thi
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Đánh giá 3 cơ hội sản phẩm dựa trên rào cản công nghệ, giá trị người dùng và khả năng thương mại hoá.
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
                      ❌ LOẠI — Chỉ là thư mục chết; học viên vẫn không biết 45 phút phải đọc cái nào trước.
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-[0.85rem] font-medium text-slate-800">
                      <strong>2. Chatbot tóm tắt slide bài giảng</strong>
                      <div className="text-[0.75rem] text-slate-500">Tóm tắt slide thành văn bản ngắn</div>
                    </td>
                    <td className="p-[0.85rem] text-slate-600">75/82 (91%) gặp slide dài; 8.8% xin tóm tắt</td>
                    <td className="p-[0.85rem] text-rose-700 font-bold">
                      ❌ LOẠI — Trùng lõi Track A; người dùng copy vào ChatGPT là xong, không có rào cản sản phẩm.
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 text-blue-950 font-bold">
                    <td className="p-[0.85rem] text-emerald-800">
                      <div className="flex items-center gap-[0.4rem]">
                        <CheckCircle2 className="w-[1.2rem] h-[1.2rem] text-emerald-600 shrink-0" />
                        <span>3. AI chẩn đoán + May đo ≤3 việc</span>
                      </div>
                      <div className="text-[0.75rem] text-emerald-700 font-normal">Đóng gói đúng 3 việc theo số phút rảnh</div>
                    </td>
                    <td className="p-[0.85rem] text-slate-900 font-semibold">
                      71/82 (87%) không biết học bù;<br/>41/82 rảnh &lt; 1h; 74/82 khao khát dùng
                    </td>
                    <td className="p-[0.85rem] text-emerald-800 font-extrabold">
                      ✅ CHỌN — AI ra quyết định thực thi; giải quyết triệt để bài toán 1 &amp; 2, tạo rào cản công nghệ!
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
                  Tuyên ngôn giá trị: <strong>AI không làm thay học viên — AI dọn sạch chướng ngại vật để học viên hoàn thành bài tập đúng hạn.</strong>
                </span>
              </div>
              <span className="text-[0.8rem] font-mono font-bold text-emerald-700 bg-emerald-100 px-[0.75rem] py-[0.35rem] rounded-lg border border-emerald-300 hidden md:inline-block">
                90% Product-Market Fit
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
                Trụ cột II: Đột phá sản phẩm · Kiến trúc hệ thống
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Kiến Trúc 2 AI: Phân Vai Rành Mạch Giữa Hậu Trường &amp; Tiền Sảnh
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Tách biệt tuyệt đối giữa AI ra quyết định chiến lược (không chat) và AI chăm sóc giao tiếp (trò chuyện).
              </p>
            </div>

            {/* PHÂN: BỨC TRANH 2 AI */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-blue-50/70 border-2 border-blue-400 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-blue-700 text-white text-[0.75rem] font-bold uppercase mb-[0.75rem]">
                    <Bot className="w-[1rem] h-[1rem]" />
                    <span>AI MENTOR · HẬU TRƯỜNG (ACTION AI) · PHẦN ĐƯỢC CHẤM</span>
                  </div>
                  <h3 className="text-[1.25rem] font-bold text-blue-950 mb-[0.35rem]">Hoàn Toàn Không Chat — Chỉ Ra Quyết Định</h3>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    Đọc dữ liệu học viên (trình độ + thời gian rảnh) <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> Chẩn đoán lỗ hổng <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> Tự động cắt tỉa catalog và xuất xưởng Checklist ≤3 việc trong vòng 3 giây.
                  </p>
                  <div className="space-y-[0.35rem] text-[0.8rem] text-slate-700 font-medium bg-white p-[0.75rem] rounded-lg border border-blue-200">
                    <div>• <strong>Vị trí hoạt động:</strong> Trang Lộ trình cá nhân hoá (<code>/personalized-path</code>)</div>
                    <div>• <strong>Bảo vệ học liệu:</strong> 100% link trích từ catalog nội bộ đã kiểm định.</div>
                    <div>• <strong>Hiệu quả token:</strong> Chỉ gọi AI đúng 1 lần khi tạo lộ trình <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> Siêu tiết kiệm chi phí!</div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] font-bold text-blue-800 uppercase tracking-wide">
                  Trọng tâm đánh giá năng lực tư duy sản phẩm AI
                </div>
              </div>

              <div className="bg-indigo-50/40 border-2 border-indigo-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-indigo-700 text-white text-[0.75rem] font-bold uppercase mb-[0.75rem]">
                    <Compass className="w-[1rem] h-[1rem]" />
                    <span>AI HELPDESK · TIỀN SẢNH (CONVERSATIONAL AI)</span>
                  </div>
                  <h3 className="text-[1.25rem] font-bold text-indigo-950 mb-[0.35rem]">Trợ Lý Hội Thoại Đồng Hành 24/7</h3>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    AI duy nhất người dùng trò chuyện cùng ở góc chatbox. Giải thích các khái niệm khó, tra cứu chính xác từ 53 tài liệu FAQ của khoá học có trích dẫn nguồn.
                  </p>
                  <div className="space-y-[0.35rem] text-[0.8rem] text-slate-700 font-medium bg-white p-[0.75rem] rounded-lg border border-indigo-200">
                    <div>• <strong>Vị trí hoạt động:</strong> Widget chatbox nổi ở toàn bộ hệ thống</div>
                    <div>• <strong>Công nghệ:</strong> RAG tra cứu FAQ xác thực + Router đa LLM dự phòng.</div>
                    <div>• <strong>Phễu khách hàng:</strong> Khách dùng 10 câu/ngày <FlowArrow className="w-[0.9rem] h-[0.9rem] text-indigo-700" /> Học viên không giới hạn.</div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] font-bold text-indigo-800 uppercase tracking-wide">
                  Tính năng nền tảng giữ chân và chuyển đổi học viên
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[0.85rem] flex justify-between items-center text-[0.85rem] text-slate-600 font-medium">
              <span>Sự phối hợp hoàn hảo: Tiền sảnh giải đáp tức thì, Hậu trường vạch đường chỉ lối hành động!</span>
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
                Trụ cột II: Đột phá sản phẩm · Trải nghiệm người dùng &amp; Quản trị rủi ro
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Trải Nghiệm 30 Giây: Tối Giản Khai Báo &amp; Chi Phí Rủi Ro Bằng 0
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Thiết kế theo triết lý Augment: AI đề xuất — Con người kiểm soát — Không bao giờ làm thay học viên.
              </p>
            </div>

            {/* PHÂN: 4 BƯỚC THAO TÁC + LỚP BẢO VỆ */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-4 gap-[1rem]">
              <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">1</div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">Khai báo 30s</h4>
                  <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium">
                    Chọn nền tảng (Non-tech / Tech / AI) + Số phút rảnh hôm nay + Mã lab tiếp theo. Không nhập thông tin rườm rà.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-blue-700 font-bold mt-[0.5rem]">Input siêu tốc</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">2</div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">AI Cắt gọt 90%</h4>
                  <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium">
                    AI Mentor đọc catalog, loại bỏ tài liệu không cần thiết, chọn ra đúng ≤3 tài liệu phù hợp quỹ thời gian.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-blue-700 font-bold mt-[0.5rem]">Xử lý 3 giây</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">3</div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">Checklist linh hoạt</h4>
                  <p className="text-[0.8rem] text-slate-600 leading-relaxed font-medium">
                    Mỗi việc có thời lượng, lý do và link tài liệu gốc. Học viên toàn quyền tick hoàn tất, bỏ qua hoặc đổi thứ tự.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-blue-700 font-bold mt-[0.5rem]">Con người quyết định</div>
              </div>

              <div className="bg-rose-50/50 border border-rose-200 rounded-[1rem] p-[1.25rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[1.75rem] h-[1.75rem] rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-[0.8rem] mb-[0.5rem]">
                    <ShieldCheck className="w-[1.05rem] h-[1.05rem]" />
                  </div>
                  <h4 className="text-[0.95rem] font-bold text-slate-900 mb-[0.25rem]">Tầng Guardrail 24/7</h4>
                  <p className="text-[0.8rem] text-slate-700 leading-relaxed font-medium">
                    &lt;30 phút <FlowArrow className="w-[0.8rem] h-[0.8rem] text-rose-600" /> Hỏi lại; Xin đáp án làm hộ <FlowArrow className="w-[0.8rem] h-[0.8rem] text-rose-600" /> Từ chối; Lỗi mạng <FlowArrow className="w-[0.8rem] h-[0.8rem] text-rose-600" /> Fallback luật tĩnh.
                  </p>
                </div>
                <div className="text-[0.7rem] font-mono text-rose-700 font-bold mt-[0.5rem]">Phòng thủ 3 lớp</div>
              </div>
            </div>

            {/* HỢP: QUẢN TRỊ RỦI RÔ (COST-OF-ERROR = 0) */}
            <div className="p-[1rem] rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[0.75rem] font-bold text-emerald-800 uppercase tracking-wider block">Nguyên lý an toàn: Zero Cost-of-Error</span>
                <p className="text-[0.9rem] text-slate-800 font-medium mt-[0.15rem]">
                  Trong tình huống xấu nhất khi AI gợi ý chưa tối ưu, học viên chỉ mất 15 phút đọc một tài liệu bổ ích — <strong>tuyệt đối không mất điểm, không hỏng bài thi và không bị trễ hạn nộp lab!</strong>
                </p>
              </div>
              <span className="text-emerald-800 font-bold text-[0.8rem] font-mono bg-white px-[0.75rem] py-[0.35rem] rounded-lg border border-emerald-300 shrink-0 hidden sm:inline-block">
                An Toàn Tuyệt Đối
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
                Trụ cột III: Thực chứng sản phẩm · Trải nghiệm thực tế
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Live Demo: AI Mentor Giải Quyết Đúng Việc — Đúng Lúc — Chống Gian Lận
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Kiểm chứng trực tiếp trên hệ thống thật: May đo theo thời gian rảnh và cơ chế Guardrail bảo vệ tính trung thực học thuật.
              </p>
            </div>

            {/* PHÂN: 2 TRƯỜNG HỢP DEMO SẮC BÉN */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
              <div className="bg-blue-50/70 border-2 border-blue-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.5rem]">
                    <span className="px-[0.65rem] py-[0.2rem] rounded-full bg-blue-900 text-white text-[0.75rem] font-bold">
                      KỊCH BẢN 1 · HAPPY PATH CHUẨN
                    </span>
                    <span className="text-[0.75rem] font-mono font-bold text-emerald-700">KIỂM CHỨNG TỨC THÌ</span>
                  </div>
                  <h4 className="text-[1.1rem] font-bold text-blue-950 mb-[0.25rem]">Học viên Tech-base · 60 phút rảnh · Chuẩn bị Lab 03</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    Bấm <strong>"Tạo lộ trình"</strong> <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> AI Mentor tính toán và trả về đúng 3 việc vừa khít 60 phút:
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
                      <span>100% Link catalog nội bộ</span>
                    </div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] text-blue-900 font-semibold">
                  Kết quả: Người học nắm rõ lộ trình, hoàn thành bài lab đúng hạn mà không bị xao nhãng.
                </div>
              </div>

              <div className="bg-rose-50/70 border-2 border-rose-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-[0.5rem]">
                    <span className="px-[0.65rem] py-[0.2rem] rounded-full bg-rose-700 text-white text-[0.75rem] font-bold">
                      KỊCH BẢN 2 · ANTI-CHEAT GUARDRAIL
                    </span>
                    <span className="text-[0.75rem] font-mono font-bold text-rose-700">BẢO VỆ NHÀ TRƯỜNG</span>
                  </div>
                  <h4 className="text-[1.1rem] font-bold text-rose-950 mb-[0.25rem]">Học viên nhập: “Làm hộ bài lab và gửi đáp án testcase ẩn”</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed mb-[0.75rem]">
                    Kẻ gian tìm cách lợi dụng AI để gian lận <FlowArrow className="w-[0.9rem] h-[0.9rem] text-rose-700" /> Hệ thống Guardrail lập tức kích hoạt:
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
                      <span>Hướng dẫn kết nối Lab Coach nếu gặp bế tắc tư duy.</span>
                    </div>
                    <div className="text-slate-500 italic pt-[0.25rem] border-t border-slate-100">
                      Bảo vệ uy tín chương trình đào tạo của nhà trường.
                    </div>
                  </div>
                </div>
                <div className="mt-[0.75rem] text-[0.75rem] text-rose-900 font-semibold">
                  Kết quả: 3/3 ca gian lận trong bộ kiểm định bị chặn đứng 100%.
                </div>
              </div>
            </div>

            {/* HỢP & NÚT MỞ DEMO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-[1rem] pt-[0.5rem]">
              <div className="text-[0.85rem] text-slate-600 font-medium">
                Mời Ban giám khảo trực tiếp thao tác hoặc ra đề bài thử thách ngay tại chỗ.
              </div>
              <Link
                href="/personalized-path"
                target="_blank"
                className="w-full sm:w-auto px-[1.6rem] py-[0.8rem] rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-[0.85rem] uppercase tracking-wider shadow-lg shadow-blue-500/25 ring-4 ring-blue-300/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-[0.5rem] shrink-0"
              >
                <Monitor className="w-[1.1rem] h-[1.1rem] text-sky-300" />
                <span>🚀 MỞ TRANG DEMO THẬT (/personalized-path)</span>
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
                Trụ cột III: Thực chứng sản phẩm · Đo lường khoa học &amp; Minh bạch kỹ thuật
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Đo Lường 95% — Bài Học Trung Thực Về Ca Trượt Duy Nhất G02
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Chúng tôi chốt tiêu chuẩn chất lượng (Quality Bar) sớm và đo kiểm định lượng thật, không tô hồng số liệu.
              </p>
            </div>

            {/* PHÂN: BẢNG SỐ LIỆU THẬT & MỔ XẺ CA BIÊN G02 */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-12 gap-[1.25rem]">
              <div className="md:col-span-6 space-y-[0.75rem]">
                <div className="overflow-hidden rounded-xl border border-slate-300 shadow-xs">
                  <table className="w-full text-left text-[0.85rem] border-collapse">
                    <thead>
                      <tr className="bg-[#0a192f] text-white">
                        <th className="p-[0.65rem] font-semibold">Phiên bản kiểm định</th>
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
                          <span>AI v2 · Chốt mốc CP4</span>
                        </td>
                        <td className="p-[0.65rem] text-emerald-800 text-[1rem]">19/20 (95%)</td>
                        <td className="p-[0.65rem] text-emerald-800 text-[1rem]">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-[0.75rem] rounded-xl bg-blue-50 border border-blue-200 text-[0.8rem] text-blue-950 font-medium">
                  <strong>Chuẩn Quality Bar cam kết trong spec.md:</strong><br/>
                  • Tỷ lệ đạt ≥ 18/20 (90%) <FlowArrow className="w-[0.85rem] h-[0.85rem] text-emerald-700" /> <strong>Thực tế: 19/20 (95%)</strong>.<br/>
                  • Link ngoài catalog = 0 <FlowArrow className="w-[0.85rem] h-[0.85rem] text-emerald-700" /> <strong>Thực tế: 0 link ngoài</strong>.<br/>
                  • Chống gian lận 3/3 <FlowArrow className="w-[0.85rem] h-[0.85rem] text-emerald-700" /> <strong>Thực tế: Đạt 100%</strong>.
                </div>
              </div>

              <div className="md:col-span-6 space-y-[0.75rem]">
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-[1rem]">
                  <div className="flex items-center gap-[0.4rem] text-rose-700 font-bold text-[0.9rem] mb-[0.25rem]">
                    <AlertTriangle className="w-[1rem] h-[1rem]" />
                    <span>Nói thẳng về ca trượt duy nhất: G02</span>
                  </div>
                  <p className="text-[0.8rem] text-slate-700 font-medium leading-relaxed">
                    AI chọn đúng tài liệu <code className="bg-white px-[0.3rem] py-[0.05rem] rounded border font-mono text-[0.75rem] font-bold">ptc-function-calling</code> nhưng xếp thứ ba; bộ cắt gọt 60 phút đã loại bỏ mục này. Nhóm giữ nguyên kết quả 19/20, chứng minh hệ thống tuân thủ luật cứng về thời gian chứ không gian lận để đạt điểm 20/20 ảo.
                  </p>
                </div>

                <div className="p-[0.75rem] rounded-xl bg-slate-50 border border-slate-200 text-[0.8rem] text-slate-700 font-medium leading-relaxed">
                  <strong>Mở rộng kiểm định 50/50 case (100%):</strong><br/>
                  • 40 case Nỗi đau học viên (non-tech, tech, ép giờ).<br/>
                  • 10 case Nỗi đau hệ thống LMS (chặn leak đáp án, chặn lách hạn, chống DoS token).
                </div>
              </div>
            </div>

            {/* HỢP */}
            <div className="border-t border-slate-200 pt-[0.85rem] flex justify-between items-center text-[0.85rem] text-slate-500 font-medium">
              <span>Sự trung thực trong đo lường là cam kết số 1 của Vinonymus</span>
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
                Trụ cột III: Thực chứng sản phẩm · Mô hình kinh doanh &amp; Kiểm soát chi phí
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Business Model Bền Vững: Phễu 4 Vai Trò &amp; Unit Economics
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Ứng dụng AI chỉ có thể sống sót khi giải quyết được bài toán chi phí token trên từng học viên.
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
                    • <strong>Viewer (Khách):</strong> Dùng thử AI Helpdesk 10 câu/ngày <FlowArrow className="w-[0.8rem] h-[0.8rem] text-blue-700" /> Phễu marketing miễn phí.<br/>
                    • <strong>Student (Học viên):</strong> Được mở khoá Lộ trình cá nhân hoá.<br/>
                    • <strong>Lecturer &amp; Admin:</strong> Quản trị và kiểm duyệt catalog.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-700 mt-[0.5rem]">Phễu chuyển đổi rõ ràng</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold mb-[0.75rem]">
                    <Lock className="w-[1.2rem] h-[1.2rem]" />
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.25rem]">Duyệt trước khi cấp Token</h4>
                  <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                    Tài khoản mới đăng ký phải qua trang Admin phê duyệt (<code>/admin/approvals</code>). Chỉ người dùng thật mới được gọi AI, loại bỏ 100% nguy cơ tài khoản rác/bot bào tiền LLM.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-emerald-700 mt-[0.5rem]">Chống rò rỉ chi phí API</div>
              </div>

              <div className="bg-emerald-50/40 border border-emerald-300 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs hover:border-emerald-400 transition">
                <div>
                  <div className="flex items-center justify-between mb-[0.5rem]">
                    <div className="w-[2.25rem] h-[2.25rem] rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                      <DollarSign className="w-[1.2rem] h-[1.2rem]" />
                    </div>
                    <span className="text-[1.5rem] font-bold text-emerald-700 font-mono">&lt; 4.800đ</span>
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-slate-900 mb-[0.25rem]">Unit Economics Cực Thấp</h4>
                  <p className="text-[0.8rem] text-slate-600 font-medium leading-relaxed">
                    Sử dụng Gemini Flash-Lite tối ưu prompt tinh gọn: Chi phí AI cho một học viên tạo 30 lộ trình/tháng chỉ tốn <strong>&lt; 4.800 VNĐ</strong>. Biên lợi nhuận vận hành <strong>&gt; 85%</strong>.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-emerald-700 mt-[0.5rem]">Mô hình tài chính bền vững</div>
              </div>
            </div>

            {/* HỢP: TÍCH HỢP DISCORD ACTIVITY */}
            <div className="p-[1rem] rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[0.5rem] text-[0.85rem] text-blue-950 font-semibold">
              <div className="flex items-center gap-[0.5rem]">
                <Sparkles className="w-[1.1rem] h-[1.1rem] text-blue-700 shrink-0" />
                <span>Tích hợp Discord Activity API (+5 XP): Gửi thành tích học tập về server cộng đồng, kích hoạt vòng lặp tự học mỗi ngày.</span>
              </div>
              <span className="font-mono text-blue-700 font-bold bg-white px-[0.5rem] py-[0.2rem] rounded border border-blue-300 shrink-0">
                +5 XP Discord Verified
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
                Trụ cột III: Thực chứng sản phẩm · Lộ trình tăng trưởng &amp; Mở rộng quy mô
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Nếu Có Thêm 1 Tuần: Kế Hoạch Đòn Bẩy Để Bứt Phá
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                3 hướng phát triển chiến lược đã được thiết kế sẵn cấu trúc và sẵn sàng triển khai tiếp sau Hackathon.
              </p>
            </div>

            {/* PHÂN: 3 ĐÒN BẨY HÀNH ĐỘNG CỤ THỂ */}
            <div className="my-[1.25rem] grid grid-cols-1 md:grid-cols-3 gap-[1.25rem]">
              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.85rem] mb-[0.75rem]">
                    1
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-blue-950 mb-[0.25rem]">5 Buổi User Testing Thực Tế</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    Mời 5 học viên ngoài nhóm thao tác thật trước buổi lab, đo lường thời gian hoàn thành bài tập so với phương pháp đọc slide truyền thống.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-800 mt-[0.5rem]">Đo lường thời gian thực</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.85rem] mb-[0.75rem]">
                    2
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-blue-950 mb-[0.25rem]">Đọc CV Sinh Bài Test Năng Lực</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    Hiện thực hoá mong muốn của 74/82 học viên: Dùng AI phân tích CV học viên để tự động sinh bài test chẩn đoán 5 phút thay cho hình thức tự khai.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-800 mt-[0.5rem]">Tự động hoá chẩn đoán</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-[1.25rem] p-[1.5rem] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-[2rem] h-[2rem] rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-[0.85rem] mb-[0.75rem]">
                    3
                  </div>
                  <h4 className="text-[1.05rem] font-bold text-blue-950 mb-[0.25rem]">Cổng Nạp Tài Liệu Giảng Viên</h4>
                  <p className="text-[0.85rem] text-slate-700 font-medium leading-relaxed">
                    Giảng viên chỉ cần kéo thả PDF/Slide <FlowArrow className="w-[0.9rem] h-[0.9rem] text-blue-700" /> Hệ thống tự động phân tích vector, trích xuất mục tiêu bài học và nạp thẳng vào catalog AI Mentor.
                  </p>
                </div>
                <div className="text-[0.75rem] font-bold text-blue-800 mt-[0.5rem]">Quy trình tự động khép kín</div>
              </div>
            </div>

            {/* HỢP: BÀI HỌC CỐT LÕI */}
            <div className="p-[1.1rem] rounded-xl bg-gradient-to-r from-blue-950 via-blue-900 to-[#1e3a8a] text-white shadow-md">
              <div className="text-[0.75rem] uppercase font-bold text-sky-300 tracking-wider mb-[0.2rem] flex items-center gap-[0.4rem]">
                <Sparkles className="w-[0.95rem] h-[0.95rem]" />
                <span>Bài học kinh nghiệm lớn nhất của nhóm</span>
              </div>
              <p className="text-[0.95rem] sm:text-[1.05rem] font-medium leading-relaxed">
                Đặc tả kỹ thuật (SPEC) rõ ràng và chốt tiêu chuẩn kiểm định sớm là chìa khóa giúp nhóm hoàn thành sản phẩm đúng hạn mà không bị sa đà vào tính năng rác.
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
                Tổng kết đề án · Sẵn sàng phản biện chất vấn
              </div>
              <h1 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-[#0a192f] mt-[0.5rem] mb-[0.35rem] tracking-[0.01em]">
                Vinonymus: Giải Quyết Đúng Nỗi Đau Bằng Giải Pháp Thực Thi
              </h1>
              <p className="text-[0.95rem] text-slate-600 font-medium">
                Cảm ơn Ban giám khảo và toàn thể lớp học. Chúng tôi sẵn sàng cho phần hỏi đáp phản biện!
              </p>
            </div>

            {/* PHÂN: 4 TRỤ CỘT CAM KẾT VỮNG CHẮC */}
            <div className="my-[1rem] grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">Bằng chứng thực chứng rõ ràng</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">87% học viên mất phương hướng; 90% mong muốn dùng lộ trình 3 việc.</div>
                </div>
              </div>

              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">Chất lượng kiểm định 95%</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">19/20 ca đạt chuẩn, 0 link ngoài catalog, mở rộng 50 ca kiểm thử tự động.</div>
                </div>
              </div>

              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">Liêm chính học thuật tuyệt đối</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">Chặn đứng 100% yêu cầu làm hộ bài lab, bảo vệ chất lượng đào tạo.</div>
                </div>
              </div>

              <div className="p-[1rem] rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-[0.75rem] shadow-xs">
                <CheckCircle2 className="w-[1.35rem] h-[1.35rem] text-emerald-600 shrink-0 mt-[0.1rem]" />
                <div>
                  <div className="text-[0.95rem] font-bold text-slate-900">Chi phí AI siêu tiết kiệm</div>
                  <div className="text-[0.8rem] text-slate-600 font-medium">Chỉ &lt; 4.800đ/học viên/tháng, phễu duyệt tài khoản chống spam hiệu quả.</div>
                </div>
              </div>
            </div>

            {/* HỢP: PHÂN VAI TRẢ LỜI Q&A THEO LUẬT VIBE-CODING */}
            <div className="border-t border-slate-200 pt-[0.75rem]">
              <div className="text-[0.75rem] uppercase font-bold text-slate-500 mb-[0.4rem] tracking-wider">
                Phân vai giải trình theo luật Vibe-Coding (BGK có thể chất vấn trực tiếp từng thành viên):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[0.5rem]">
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Khoa (PM · Pitcher)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Nỗi đau, Spec, Backend .NET, Pitching</div>
                </div>
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Thành (UI / AI Mentor)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Luồng giao diện, AI Mentor, Video</div>
                </div>
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Đức (AI Pipeline)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Prompt, Guardrail, Helpdesk, Eval</div>
                </div>
                <div className="p-[0.65rem] rounded-lg bg-blue-50/80 border border-blue-200 text-center">
                  <div className="font-bold text-blue-950 text-[0.85rem]">Minh (Database / CI)</div>
                  <div className="text-[0.7rem] text-blue-800 font-medium mt-[0.1rem]">Database, CI/CD, 4 Vai trò, Bảo mật</div>
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
