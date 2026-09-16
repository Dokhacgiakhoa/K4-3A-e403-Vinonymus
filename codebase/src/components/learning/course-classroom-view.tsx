'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CurriculumModuleItem 
} from '@/data/sfia-community-data';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Clock, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sparkles, 
  Layers, 
  Users, 
  Award, 
  HelpCircle, 
  FileCheck, 
  Lock, 
  LogIn, 
  Eye,
  GraduationCap
} from 'lucide-react';
import { FocusModeButton } from '@/components/learning/focus-mode-controller';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { AuthModal } from '@/components/auth/auth-modal';
import { CertificateModal } from '@/components/learning/certificate-modal';

interface CourseClassroomViewProps {
  module: CurriculumModuleItem;
  allModules: CurriculumModuleItem[];
}

export function CourseClassroomView({ module, allModules }: CourseClassroomViewProps) {
  const router = useRouter();

  // State: bài học đang chọn (number) hoặc 'assignment' hoặc 'roles'
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | 'assignment' | 'roles'>(0);
  
  // State: thu gọn / mở rộng sidebar mục lục kiểu Coursera
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // State: copy code
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  // State: danh sách bài đã đánh dấu hoàn thành
  const [completedTopics, setCompletedTopics] = useState<Record<number, boolean>>({});

  // State: kiểm tra đăng nhập & ghi danh khóa học (Coursera model)
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Khởi tạo tiến độ và kiểm tra người dùng & trạng thái đăng ký khóa học
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = clientStorage.getUser();
        setCurrentUser(u);
        setIsAuthLoaded(true);

        const enrolled = clientStorage.isCourseEnrolled(module.id);
        setIsEnrolled(enrolled);

        const saved = localStorage.getItem(`aiia_progress_${module.id}`);
        if (saved) {
          setCompletedTopics(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Lỗi khi tải tiến độ học tập:', err);
        setIsAuthLoaded(true);
      }
    }

    const handleAuthChange = () => {
      setCurrentUser(clientStorage.getUser());
      setIsEnrolled(clientStorage.isCourseEnrolled(module.id));
    };
    const handleEnrollmentChange = () => {
      setIsEnrolled(clientStorage.isCourseEnrolled(module.id));
    };

    window.addEventListener('aiia_auth_changed', handleAuthChange);
    window.addEventListener('aiia_enrollment_changed', handleEnrollmentChange);
    return () => {
      window.removeEventListener('aiia_auth_changed', handleAuthChange);
      window.removeEventListener('aiia_enrollment_changed', handleEnrollmentChange);
    };
  }, [module.id]);

  const handleEnrollCourse = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    clientStorage.enrollCourse(module.id);
    setIsEnrolled(true);
  };

  const handleUnenrollCourse = () => {
    if (typeof window !== 'undefined' && window.confirm('Bạn có chắc chắn muốn hủy đăng ký khóa học này? Tiến độ đã học vẫn được lưu.')) {
      clientStorage.unenrollCourse(module.id);
      setIsEnrolled(false);
    }
  };

  const toggleTopicCompletion = (idx: number) => {
    setCompletedTopics(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      clientStorage.saveCourseProgress(module.id, next);
      return next;
    });
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedMap(prev => ({ ...prev, [id]: false })), 2000);
  };

  // Tính phần trăm tiến độ của chuyên đề
  const totalTopics = module.topics.length;
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalTopics || 1)) * 100));

  // Điều hướng khóa học trước / sau
  const currentIndex = allModules.findIndex(m => m.id === module.id);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  // 1. Chờ kiểm tra trạng thái xác thực từ local storage (tránh mismatch SSR)
  if (!isAuthLoaded) {
    return (
      <div className="flex flex-col min-h-screen -mx-4 -mt-6 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 bg-[#040814] text-slate-100 font-sans items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-slate-400">Đang đồng bộ quyền truy cập phòng học...</span>
        </div>
      </div>
    );
  }

  // 2. CHƯA ĐĂNG NHẬP HOẶC CHƯA GHI DANH: CHỈ XEM COURSE OVERVIEW & SYLLABUS (COURSERA STANDARD)
  if (!currentUser || !isEnrolled) {
    return (
      <div className="flex flex-col min-h-screen -mx-4 -mt-6 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 bg-[#040814] text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
        
        {/* TOP BAR REVIEW CHO KHÁCH & HỌC VIÊN CHƯA GHI DANH */}
        <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#060c1e]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/learning"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
              title="Quay lại Thư Viện Học Tập"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Quay Lại Thư Viện</span>
              <span className="sm:hidden">Thư Viện</span>
            </Link>

            <div className="h-5 w-[1px] bg-slate-800 shrink-0 hidden sm:block" />

            <div className="min-w-0 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase shrink-0">
                {module.levelCode} • TỔNG QUAN
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate">
                {module.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!currentUser ? (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-sky-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Miễn Phí (0đ)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnrollCourse}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Đăng Ký Khóa Học (0đ)</span>
              </button>
            )}
          </div>
        </header>

        {/* NỘI DUNG TỔNG QUAN & GHI DANH KHÓA HỌC KIỂU COURSERA */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 lg:p-10 space-y-8 animate-fadeIn">
          
          {/* Banner Giới Thiệu Chuyên Đề */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#0b1329]/90 border border-sky-500/30 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold uppercase">
                {module.levelTag}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                {module.tag}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Cấp Chứng Chỉ SFIA (v8)</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide uppercase leading-tight">
                {module.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {module.description}
              </p>
            </div>

            {/* 4 Chỉ số Coursera Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-[#060c1d] border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-bold text-sky-400 font-mono">{module.topics.length} BÀI HỌC</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Lý Thuyết & Thuật Toán</div>
              </div>
              <div className="p-3 rounded-xl bg-[#060c1d] border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">{module.assignment ? '1 ĐỀ LAB' : 'ĐỀ LAB PHÂN TÍCH'}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Thực Nghiệm Chuyên Sâu</div>
              </div>
              <div className="p-3 rounded-xl bg-[#060c1d] border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-bold text-teal-400 font-mono">SFIA (v8)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Cấp Độ {module.levelCode}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#060c1d] border border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono">CHỨNG CHỈ</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Sau Khi Đạt 100%</div>
              </div>
            </div>
          </div>

          {/* THẺ HÀNH ĐỘNG GHI DANH KHÓA HỌC (ENROLLMENT ACTION BOX) */}
          <div className="relative rounded-3xl overflow-hidden border border-sky-500/40 bg-[#0b1329]/95 shadow-2xl p-6 sm:p-10 text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
                {!currentUser ? <Lock className="w-8 h-8 text-amber-400" /> : <GraduationCap className="w-8 h-8 text-emerald-400" />}
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider border border-sky-500/30">
                  {!currentUser ? 'Yêu Cầu Tài Khoản Học Viên' : `Học Viên: ${currentUser.name} • Sẵn Sàng Ghi Danh`}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                  {!currentUser ? 'Đăng Ký Khóa Học Này (Enroll for Free)' : `Ghi Danh Vào Khóa Học: ${module.title}`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {!currentUser 
                    ? `Theo quy chuẩn Coursera, bạn cần đăng nhập tài khoản miễn phí để đăng ký học khóa này, mở khóa toàn văn các bài giảng lý thuyết, xem mã nguồn mẫu và nhận chứng chỉ hoàn thành sau khóa học.`
                    : `Khóa học này hoàn toàn miễn phí (0đ). Nhấn nút "Đăng Ký Khóa Học" bên dưới để ghi danh, mở phòng học và lưu tiến độ tích lũy vào quỹ 1000h.`
                  }
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {!currentUser ? (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Đăng Nhập Để Đăng Ký Học (0đ)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnrollCourse}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Bắt Đầu Đăng Ký Học Khóa Này (0đ) →</span>
                  </button>
                )}

                <Link
                  href="/learning"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay Lại Thư Viện</span>
                </Link>
              </div>
            </div>
          </div>

          {/* MỤC LỤC CHI TIẾT GIÁO TRÌNH (SYLLABUS PREVIEW) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#0b1329]/90 border border-slate-800/90 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span>Mục Lục Khóa Học ({module.topics.length} Bài)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Danh sách các bài học lý thuyết & giải thuật. Nhấp vào bài học bất kỳ để đăng ký khóa học và bắt đầu:
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 shrink-0">
                <Lock className="w-3.5 h-3.5" />
                <span>Cần đăng ký khóa học</span>
              </span>
            </div>

            <div className="space-y-3">
              {module.topics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => (!currentUser ? setShowAuthModal(true) : handleEnrollCourse())}
                  className="p-4 rounded-2xl bg-[#060c1d] border border-slate-800 hover:border-sky-500/50 hover:bg-[#08122d] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-400 font-mono">Bài 0{idx + 1}:</span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition truncate">
                          {topic.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>📖 Lý thuyết & kiến trúc</span>
                        {topic.codeSnippet && (
                          <span className="text-cyan-400 font-mono">• 📄 Mã nguồn {topic.codeSnippet.language}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-semibold">
                      Đăng ký để học
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ĐỀ LAB THỰC HÀNH & PHÂN VAI (NẾU CÓ) */}
          {module.assignment && (
            <div 
              onClick={() => (!currentUser ? setShowAuthModal(true) : handleEnrollCourse())}
              className="rounded-3xl p-6 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/60 transition cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  <span>🧪 Assignment Thực Hành 1:1</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px]">
                    ⏱ {module.assignment.durationMinutes} Phút
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Cần đăng ký khóa</span>
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {module.assignment.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2">
                {module.assignment.summary}
              </p>
            </div>
          )}

        </main>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => {
            setShowAuthModal(false);
            const u = clientStorage.getUser();
            setCurrentUser(u);
            clientStorage.enrollCourse(module.id);
            setIsEnrolled(true);
          }}
        />
      </div>
    );
  }

  // 3. THÀNH VIÊN ĐÃ ĐĂNG NHẬP: MỞ TOÀN BỘ PHÒNG HỌC VÀ TIẾN ĐỘ
  return (
    <div className="flex flex-col min-h-screen -mx-4 -mt-6 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 bg-[#040814] text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. COURSERA-STYLE TOP CONTROL BAR                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#060c1e]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Cột trái: Nút Quay Lại Thư Viện & Thông Tin Khóa Học */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/learning"
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
            title="Quay lại Thư Viện Học Tập"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Quay Lại Thư Viện</span>
            <span className="sm:hidden">Thư Viện</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-800 shrink-0 hidden sm:block" />

          {/* Badge & Tên khóa học */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono font-bold uppercase shrink-0">
                {module.levelCode}
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate">
                {module.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Cột phải: Tiến Độ, Focus Mode & Toggle Sidebar */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Thanh tiến độ phần trăm */}
          <div className="hidden md:flex items-center gap-2.5 bg-[#0b1329] px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-20 sm:w-28 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-300 font-semibold">
              {completedCount}/{totalTopics} bài ({progressPercent}%)
            </span>
          </div>

          {/* Nút Xem Chứng Chỉ (nếu đã hoàn thành 100%) */}
          {completedCount === totalTopics && (
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/30 shrink-0 animate-pulse"
              title="Xem và tải chứng chỉ số SFIA (v8)"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Chứng Chỉ 🎓</span>
            </button>
          )}

          {/* Bộ Đếm Giờ / Focus Mode Controller */}
          <FocusModeButton />

          {/* Nút Hủy Đăng Ký Khóa Học */}
          <button
            type="button"
            onClick={handleUnenrollCourse}
            className="text-[10px] text-slate-500 hover:text-red-400 transition underline underline-offset-2 hidden xl:inline"
            title="Hủy đăng ký khóa học này"
          >
            Hủy ghi danh
          </button>

          {/* Nút Thu Gọn / Mở Rộng Mục Lục Sidebar */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer hidden lg:flex items-center justify-center"
            title={isSidebarCollapsed ? "Mở rộng thanh mục lục" : "Thu gọn thanh mục lục"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. COURSERA-STYLE 2-COLUMN MAIN WORKSPACE                                 */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ======================================================================= */}
        {/* CỘT TRÁI: SYLLABUS DRAWER / MỤC LỤC KHÓA HỌC (Collapsible)              */}
        {/* ======================================================================= */}
        <aside 
          className={`shrink-0 border-r border-slate-800/80 bg-[#070e24]/90 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 overflow-y-auto custom-scrollbar ${
            isSidebarCollapsed ? 'w-0 lg:w-0 p-0 border-r-0 overflow-hidden' : 'w-full sm:w-80 lg:w-96 p-4'
          }`}
        >
          <div className="space-y-4">
            
            {/* Header Mục Lục */}
            <div className="border-b border-slate-800/80 pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Mục Lục Khóa Học
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {totalTopics} Bài • 1 Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal line-clamp-1">
                {module.tag} • Chuẩn SFIA
              </p>
            </div>

            {/* Danh Sách Các Bài Giảng Lý Thuyết (Topics) */}
            <div className="space-y-1.5">
              {module.topics.map((topic, idx) => {
                const isActive = activeTopicIndex === idx;
                const isCompleted = !!completedTopics[idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTopicIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 cursor-pointer border ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400/60 shadow-sm shadow-sky-500/25 text-white'
                        : 'bg-[#0b1329]/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    {/* Icon Hoàn Thành Hoặc Số Thứ Tự */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopicCompletion(idx);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 transition cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                          : isActive
                            ? 'bg-sky-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                      title={isCompleted ? "Bấm để bỏ đánh dấu hoàn thành" : "Bấm để đánh dấu đã học"}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Tiêu đề bài học */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs leading-snug font-semibold line-clamp-2 ${
                          isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                          {topic.title}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>{topic.codeSnippet ? '📄 Bài học + Code' : '📖 Khái niệm & Phân tích'}</span>
                        {isCompleted && (
                          <span className="text-emerald-400 font-semibold">• Đã hoàn thành</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Đề Lab Thực Hành 1:1 (Assignment) */}
            {module.assignment && (
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveTopicIndex('assignment')}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 cursor-pointer border ${
                    activeTopicIndex === 'assignment'
                      ? 'bg-emerald-500/20 border-emerald-400/60 shadow-sm shadow-emerald-500/25 text-emerald-200'
                      : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                    activeTopicIndex === 'assignment' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-900 text-emerald-300'
                  }`}>
                    🧪
                  </span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs font-bold leading-snug">
                      {module.assignment.title}
                    </p>
                    <span className="text-[10px] text-emerald-400/80 block font-mono">
                      ⏱ {module.assignment.durationMinutes} Phút Thực Hành 1:1
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Ma Trận Phân Vai Dự Án (Roles Matrix) */}
            {module.crossFunctionalRoles && module.crossFunctionalRoles.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTopicIndex('roles')}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 cursor-pointer border ${
                    activeTopicIndex === 'roles'
                      ? 'bg-teal-500/20 border-teal-400/60 shadow-sm shadow-teal-500/25 text-teal-200'
                      : 'bg-[#0b1329]/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                    activeTopicIndex === 'roles' ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Users className="w-3.5 h-3.5" />
                  </span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs font-bold leading-snug">
                      Phân Vai Dự Án (Roles Matrix)
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Sản phẩm bàn giao PM, Dev, QA
                    </span>
                  </div>
                </button>
              </div>
            )}

          </div>

          {/* Điều Hướng Khóa Học Trước / Sau */}
          <div className="pt-4 mt-6 border-t border-slate-800/80 space-y-2">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Khóa học liên quan:
            </div>
            <div className="flex items-center justify-between gap-2">
              {prevModule ? (
                <button
                  type="button"
                  onClick={() => router.push(`/learning/${prevModule.id}`)}
                  className="flex-1 p-2 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-medium transition text-left truncate"
                  title={prevModule.title}
                >
                  ← {prevModule.title.split('•')[0] || prevModule.id}
                </button>
              ) : <div className="flex-1" />}

              {nextModule ? (
                <button
                  type="button"
                  onClick={() => router.push(`/learning/${nextModule.id}`)}
                  className="flex-1 p-2 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-sky-300 border border-slate-800 text-[11px] font-medium transition text-right truncate"
                  title={nextModule.title}
                >
                  {nextModule.title.split('•')[0] || nextModule.id} →
                </button>
              ) : <div className="flex-1" />}
            </div>
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* CỘT PHẢI: LECTURE CANVAS (NỘI DUNG BÀI HỌC TẬP TRUNG CAO ĐỘ)           */}
        {/* ======================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-8 custom-scrollbar">
          
          {/* BANNER MẠ VÀNG KHI HOÀN THÀNH 100% KHÓA HỌC (CẤP CHỨNG CHỈ SỐ SFIA) */}
          {completedCount === totalTopics && (
            <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#0b1329] to-amber-900/70 border-2 border-amber-400/80 shadow-[0_15px_40px_rgba(245,158,11,0.25)] flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                  <Award className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Đã Hoàn Thành 100% Khóa Học</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold text-white">
                    Chứng Chỉ Tốt Nghiệp SFIA (v8) Đã Sẵn Sàng!
                  </h3>
                  <p className="text-xs text-slate-300 font-normal max-w-xl">
                    Bạn đã hoàn thành xuất sắc toàn bộ {totalTopics} bài học của chuyên đề <strong>{module.title}</strong>. Bấm nút bên dưới để nhận chứng nhận số chính thức.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Xem & Nhận Chứng Chỉ 🎓</span>
              </button>
            </div>
          )}

          {/* TRƯỜNG HỢP A: ĐANG HỌC BÀI LÝ THUYẾT / KỸ THUẬT */}
          {typeof activeTopicIndex === 'number' && module.topics[activeTopicIndex] && (() => {
            const currentTopic = module.topics[activeTopicIndex];
            const isCompleted = !!completedTopics[activeTopicIndex];

            return (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                
                {/* Topic Header Bar */}
                <div className="space-y-3 border-b border-slate-800 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold uppercase">
                        Bài Học 0{activeTopicIndex + 1} / 0{totalTopics}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {module.levelTag}
                      </span>
                    </div>

                    {/* Nút Đánh Dấu Đã Học */}
                    <button
                      type="button"
                      onClick={() => toggleTopicCompletion(activeTopicIndex)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{isCompleted ? 'Đã Hoàn Thành Bài Này' : 'Đánh Dấu Đã Học'}</span>
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide uppercase leading-tight text-shadow-clean">
                    {currentTopic.title}
                  </h2>
                </div>

                {/* Main Theory & Intuition */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1329]/90 border border-slate-800/90 shadow-xl space-y-4">
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Nội Dung Kiến Thức & Trực Quan Hóa:</span>
                  </div>

                  <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {currentTopic.description}
                  </div>
                </div>

                {/* Code Snippet Box (Nếu bài học có code mẫu) */}
                {currentTopic.codeSnippet && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#070d1e] shadow-2xl space-y-0">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="text-slate-200 font-medium truncate">
                          {currentTopic.codeSnippet.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#0b1329] text-[10px] text-sky-300 uppercase border border-slate-800">
                          {currentTopic.codeSnippet.language}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentTopic.codeSnippet?.code ?? '', `topic-${activeTopicIndex}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-sky-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer shadow-sm"
                      >
                        {copiedMap[`topic-${activeTopicIndex}`] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Đã chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-sky-200 overflow-x-auto leading-relaxed selection:bg-sky-500 selection:text-slate-950">
                      <code>{currentTopic.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Bottom Navigation: Next / Prev Lesson */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={activeTopicIndex === 0}
                    onClick={() => {
                      setActiveTopicIndex(activeTopicIndex - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Bài Trước Đó</span>
                  </button>

                  <div className="text-xs text-slate-400 font-mono">
                    Bài {activeTopicIndex + 1} / {totalTopics}
                  </div>

                  {activeTopicIndex < totalTopics - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        toggleTopicCompletion(activeTopicIndex);
                        setActiveTopicIndex(activeTopicIndex + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-sky-500/20"
                    >
                      <span>Bài Tiếp Theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : module.assignment ? (
                    <button
                      type="button"
                      onClick={() => {
                        toggleTopicCompletion(activeTopicIndex);
                        setActiveTopicIndex('assignment');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <span>Sang Bài Lab Thực Hành (1:1)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href="/test"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <span>Làm Bài Khảo Thí /test</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

              </div>
            );
          })()}

          {/* TRƯỜNG HỢP B: ĐANG LÀM ĐỀ LAB THỰC HÀNH 1:1 (ASSIGNMENT) */}
          {activeTopicIndex === 'assignment' && module.assignment && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              
              {/* Header Lab */}
              <div className="space-y-3 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase">
                    Assignment Thực Hành 1:1
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⏱ Thời gian dự kiến: {module.assignment.durationMinutes} Phút
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide uppercase leading-tight">
                  {module.assignment.title}
                </h2>
              </div>

              {/* Tình Huống / Mục Tiêu */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1329]/90 border border-emerald-500/30 shadow-xl space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Kịch Bản Thử Thách & Mục Tiêu Nghiệp Vụ:</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {module.assignment.summary}
                </p>
              </div>

              {/* Lệnh Terminal / Kịch Bản Script */}
              {module.assignment.commandSnippet && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#070d1e] shadow-2xl space-y-0">
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-2 min-w-0">
                      <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300 font-semibold truncate">
                        {module.assignment.commandSnippet.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(module.assignment?.commandSnippet?.code ?? '', 'asm-snippet')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                      {copiedMap['asm-snippet'] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Đã chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Lệnh</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed selection:bg-emerald-500 selection:text-slate-950">
                    <code>{module.assignment.commandSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Sản Phẩm Bàn Giao Checklist */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1329]/90 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-sky-400" />
                  <span>Tiêu Chuẩn Sản Phẩm Bàn Giao (Deliverables):</span>
                </span>

                <div className="space-y-2.5">
                  {module.assignment.deliverables.map((deliv, dIdx) => (
                    <div 
                      key={dIdx} 
                      className="p-3.5 rounded-xl bg-[#060c1d] border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Điều hướng */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTopicIndex(totalTopics - 1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay Lại Bài Học Lý Thuyết Cuối</span>
                </button>

                <Link
                  href="/test"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-500/20"
                >
                  <span>Làm Bài Khảo Thí Đánh Giá /test</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          )}

          {/* TRƯỜNG HỢP C: ĐANG XEM MA TRẬN VAI TRÒ (ROLES MATRIX) */}
          {activeTopicIndex === 'roles' && module.crossFunctionalRoles && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              
              <div className="space-y-3 border-b border-slate-800 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold uppercase">
                  Cross-Functional Project Matrix
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide uppercase leading-tight">
                  Phân Vai Nhiệm Vụ Trong Dự Án Thực Chiến
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Đối chiếu vai trò nghề nghiệp của bạn trong nhóm dự án để biết rõ kỹ năng cần nạp và sản phẩm cụ thể bạn phải bàn giao.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {module.crossFunctionalRoles.map((cfr, rIdx) => (
                  <div key={rIdx} className="p-5 rounded-2xl bg-[#0b1329]/90 border border-slate-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">{cfr.roleName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Bàn giao bắt buộc</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {cfr.projectDeliverable}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cfr.skillsRequired.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTopicIndex(0)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay Lại Bài Học Đầu Tiên</span>
                </button>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* AUTH MODAL BẬT LÊN KHI KHÁCH BẤM VÀO NỘI DUNG BỊ KHÓA */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          setShowAuthModal(false);
          setCurrentUser(clientStorage.getUser());
        }}
      />

      {/* CERTIFICATE MODAL CHO KHÓA HỌC */}
      <CertificateModal 
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        courseTitle={module.title}
        courseLevelCode={module.levelCode}
      />

    </div>
  );
}
