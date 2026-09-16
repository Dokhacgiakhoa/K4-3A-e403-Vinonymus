'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SFIA_COMMUNITY_DATA, CurriculumModuleItem } from '@/data/sfia-community-data';
import { 
  BookOpen, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Search, 
  Sparkles, 
  Layers, 
  Briefcase, 
  Code, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  Target,
  FileCheck,
  CheckCircle,
  GraduationCap,
  Users,
  Database,
  BarChart3,
  Bot,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Play,
  Eye,
  EyeOff,
  Flame,
  Lock,
  Compass,
  Zap
} from 'lucide-react';
import { AIMentorWizard } from '@/components/learning/ai-mentor-wizard';
import { CertificateModal } from '@/components/learning/certificate-modal';
import { AuthModal } from '@/components/auth/auth-modal';
import { AI_FOR_EVERYONE_MODULES } from '@/data/ai-for-everyone-curriculum';
import { COMPREHENSIVE_EXPANDED_MODULES } from '@/data/comprehensive-curriculum-expanded';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { GamifiedSkillTreeView } from '@/components/learning/gamified-skill-tree-view';

export type LearnerTrackType = 'NONTECH' | 'TECHBASE' | 'AIBASE' | 'UNIVERSAL';
export type SfiaLevelFilter = 'ALL' | 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
type RoleFilter = 'ALL' | 'PM_BA' | 'FRONTEND' | 'BACKEND_DB' | 'DATA_ENG' | 'QA_SECURITY';

// Hàm phân loại chuyên đề theo từng Phân Luồng SFIA
export function isModuleInTrack(mod: CurriculumModuleItem, track: LearnerTrackType): boolean {
  if (track === 'UNIVERSAL') {
    return mod.levelCode === 'L0';
  }
  if (mod.startingFor === track || mod.startingFor === 'UNIVERSAL') {
    return true;
  }
  if (track === 'NONTECH') {
    // Non-Tech & Business AI: Bắt đầu từ L0 Foundation + các module tối ưu quy trình & quản trị
    if (mod.levelCode === 'L0') return true;
    return ['MOD-1', 'MOD-2', 'MOD-4', 'MOD-7', 'MOD-12', 'MOD-01', 'MOD-02', 'MOD-03', 'MOD-04', 'MOD-05', 'MOD-06', 'MOD-07', 'MOD-08', 'MOD-09', 'MOD-010', 'MOD-011', 'MOD-012', 'MOD-405'].includes(mod.id);
  }
  if (track === 'TECHBASE') {
    // Tech-Base & Software AI: Dành cho Developers / Software Engineers
    return ['MOD-1', 'MOD-2', 'MOD-3', 'MOD-4', 'MOD-5', 'MOD-7', 'MOD-8', 'MOD-10', 'MOD-11'].includes(mod.id) || 
      mod.levelCode === 'L1' || mod.levelCode === 'L2' || mod.levelCode === 'L3';
  }
  if (track === 'AIBASE') {
    // AI-Base & Deep Learning: Dành cho AI/ML Engineers & Data Scientists
    return ['MOD-1', 'MOD-3', 'MOD-5', 'MOD-6', 'MOD-8', 'MOD-9', 'MOD-10', 'MOD-11', 'MOD-12'].includes(mod.id) || 
      mod.levelCode === 'L3' || mod.levelCode === 'L4';
  }
  return true;
}

export function CurriculumView() {
  const [displayMode, setDisplayMode] = useState<'SKILL_TREE' | 'CATALOG'>('CATALOG');
  const [activeTrack, setActiveTrack] = useState<LearnerTrackType>('NONTECH');
  const [selectedLevel, setSelectedLevel] = useState<SfiaLevelFilter>('ALL');
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMentorWizard, setShowMentorWizard] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [selectedCertModule, setSelectedCertModule] = useState<CurriculumModuleItem | null>(null);
  const [progressVersion, setProgressVersion] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = clientStorage.getUser();
      setCurrentUser(u);
      setEnrolledCourses(clientStorage.getEnrolledCourses());
      // Nếu đã đăng nhập (Free/Pro/Admin) -> Mặc định Cây Kỹ Năng. Nếu là khách (Guest) -> Bắt buộc Danh Mục Thư Viện
      if (u) {
        setDisplayMode('SKILL_TREE');
      } else {
        setDisplayMode('CATALOG');
      }
      setProgressVersion(v => v + 1);
    }
    const handleAuthChange = () => {
      const u = clientStorage.getUser();
      setCurrentUser(u);
      setEnrolledCourses(clientStorage.getEnrolledCourses());
      if (u) {
        setDisplayMode('SKILL_TREE');
      } else {
        setDisplayMode('CATALOG');
      }
      setProgressVersion(v => v + 1);
    };
    const handleEnrollChange = () => {
      setEnrolledCourses(clientStorage.getEnrolledCourses());
      setProgressVersion(v => v + 1);
    };
    const handleProgressChange = () => {
      setProgressVersion(v => v + 1);
    };
    window.addEventListener('aiia_auth_changed', handleAuthChange);
    window.addEventListener('aiia_enrollment_changed', handleEnrollChange);
    window.addEventListener('aiia_progress_changed', handleProgressChange);
    return () => {
      window.removeEventListener('aiia_auth_changed', handleAuthChange);
      window.removeEventListener('aiia_enrollment_changed', handleEnrollChange);
      window.removeEventListener('aiia_progress_changed', handleProgressChange);
    };
  }, []);

  // GỘP MODULES NHẬP MÔN LEVEL 0 (AI FOR EVERYONE), 12 MODULES KỸ THUẬT VÀ 49 MODULES MỞ RỘNG (TỔNG 67 MODULES)
  const allModules: CurriculumModuleItem[] = [
    ...AI_FOR_EVERYONE_MODULES,
    ...SFIA_COMMUNITY_DATA.curriculumModules,
    ...COMPREHENSIVE_EXPANDED_MODULES
  ] as unknown as CurriculumModuleItem[];

  // LỌC MODULES THEO PHÂN LUỒNG (TRACK), CẤP ĐỘ SFIA (LEVEL) & VAI TRÒ DỰ ÁN
  const filteredModules = allModules.filter(mod => {
    const matchesTrack = isModuleInTrack(mod, activeTrack);
    const matchesLevel = selectedLevel === 'ALL' || mod.levelCode === selectedLevel;

    const matchesRole = selectedRole === 'ALL' || 
      mod.crossFunctionalRoles?.some(r => r.role === selectedRole || r.role === 'UNIVERSAL');

    const matchesSearch = !searchQuery || 
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.topics.some(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      mod.crossFunctionalRoles?.some(r => 
        r.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.projectDeliverable.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesTrack && matchesLevel && matchesRole && matchesSearch;
  });

  const handleSelectTrackAndScroll = (track: LearnerTrackType, level: SfiaLevelFilter = 'ALL') => {
    setActiveTrack(track);
    setSelectedLevel(level);
    setDisplayMode('CATALOG');
    const el = document.getElementById('curriculum-topics-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 animate-fadeIn font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* MODAL AI MENTOR WIZARD 1-ON-1 */}
      {showMentorWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <AIMentorWizard 
              onRoadmapGenerated={() => setShowMentorWizard(false)}
              onCancel={() => setShowMentorWizard(false)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: GIÁO TRÌNH TỰ HỌC THEO 4 CẤP ĐỘ SFIA (L1 - L4)           */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b1329]/90 border border-sky-500/40 text-sky-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>K.AI Labs Open Curriculum • 1000 Hours</span>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[#0f172a]/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono backdrop-blur-md">
              Chuẩn Quốc Tế SFIA (v8) • Level 1 ➔ Level 4
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kho Tri Thức Tự Do Tra Cứu</span>
          </div>
        </div>

        {/* Main 2-Column Hero Body: Cột Trái (Tiêu đề + Mô tả + CTA), Cột Phải (Card Bản Đồ Phân Luồng SFIA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mt-4">
          
          {/* CỘT TRÁI: Bố cục học thuật, tổng thể, trang nhã - Chuẩn 2 dòng không bị rớt chữ */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[1.65rem] xl:text-[1.9rem] font-extrabold text-white tracking-tight uppercase leading-[1.38] sm:leading-[1.42] text-shadow-clean">
                <span className="block whitespace-nowrap">Thư Viện Học Tập Mở</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 pt-1 whitespace-nowrap">
                  Giáo Trình Chuyên Đề & Lab Thực Hành
                </span>
              </h1>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 backdrop-blur-md shadow-lg space-y-2">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  Hệ thống tài liệu học tập và phòng thực nghiệm mở theo <strong>Khung Năng Lực Quốc Tế SFIA (v8)</strong>, bao quát từ <strong>Level 0 (Phổ Cập AI Cho Mọi Người)</strong> đến <strong>Level 4 (Multi-Agent & Tối Ưu Mô Hình)</strong>.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Học viên chủ động lựa chọn chuyên đề theo nhu cầu cá nhân, nghiên cứu lý thuyết kiến trúc, chạy mã nguồn mẫu và hoàn thành các bài tập thực nghiệm độc lập theo tiến độ tự học.
                </p>
              </div>

              {/* 3 TRỤ CỘT PHƯƠNG PHÁP TỰ HỌC HỌC THUẬT (SELF-PACED LEARNING METHODOLOGY) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#080f24]/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>1. Khảo Cứu Lý Thuyết</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Nghiên cứu nguyên lý, thuật toán và sơ đồ kiến trúc chuẩn hóa theo thang đo Bloom.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080f24]/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Terminal className="w-3.5 h-3.5 shrink-0" />
                    <span>2. Thực Nghiệm Mã Nguồn</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Thực thi code mẫu trực tiếp trên Google Colab / Notebook và kiểm chứng thuật toán.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080f24]/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>3. Đề Lab & Tự Đánh Giá</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Hoàn thiện assignment kèm kịch bản kiểm thử tự động, tích lũy năng lực độc lập.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4-5 Cột): THẺ BẢN ĐỒ PHÂN LUỒNG 5 LEVEL SFIA (Lấp đầy và đồng bộ chiều cao) */}
          <div className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-[#080f24]/90 border border-sky-500/40 p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      3 Trụ Cột SFIA (v8)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Chuẩn VinUni AI Thực Chiến</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  Matrix SFIA
                </span>
              </div>

              {/* 4 Tracks Quick Selector Bars */}
              <div className="space-y-1.5">
                {/* 1. AI Business & Product */}
                <div 
                  onClick={() => handleSelectTrackAndScroll('NONTECH')}
                  className={`p-2 rounded-xl transition cursor-pointer border ${
                    activeTrack === 'NONTECH'
                      ? 'bg-amber-500/20 border-amber-400/60 shadow-sm shadow-amber-500/25'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                  title="Chọn Trụ cột AI Business & Product và xem danh sách chuyên đề"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      AI Business & Product
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-mono font-bold">
                      {allModules.filter(m => isModuleInTrack(m, 'NONTECH')).length} Chuyên Đề
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-full rounded-full" />
                  </div>
                </div>

                {/* 2. AI Application */}
                <div 
                  onClick={() => handleSelectTrackAndScroll('TECHBASE')}
                  className={`p-2 rounded-xl transition cursor-pointer border ${
                    activeTrack === 'TECHBASE'
                      ? 'bg-sky-500/20 border-sky-400/60 shadow-sm shadow-sky-500/25'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                  title="Chọn Trụ cột AI Application và xem danh sách chuyên đề"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-sky-300 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-sky-400" />
                      AI Application
                    </span>
                    <span className="text-[10px] text-sky-400/90 font-mono font-bold">
                      {allModules.filter(m => isModuleInTrack(m, 'TECHBASE')).length} Chuyên Đề
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 w-full rounded-full" />
                  </div>
                </div>

                {/* 3. AI Infrastructure & Data */}
                <div 
                  onClick={() => handleSelectTrackAndScroll('AIBASE')}
                  className={`p-2 rounded-xl transition cursor-pointer border ${
                    activeTrack === 'AIBASE'
                      ? 'bg-teal-500/20 border-teal-400/60 shadow-sm shadow-teal-500/25'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                  title="Chọn Trụ cột AI Infrastructure & Data và xem danh sách chuyên đề"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-teal-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-teal-400" />
                      AI Infrastructure & Data
                    </span>
                    <span className="text-[10px] text-teal-400/90 font-mono font-bold">
                      {allModules.filter(m => isModuleInTrack(m, 'AIBASE')).length} Chuyên Đề
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 w-full rounded-full" />
                  </div>
                </div>

                {/* 4. AI Foundations (Khối Nền Tảng Chung) */}
                <div 
                  onClick={() => handleSelectTrackAndScroll('UNIVERSAL')}
                  className={`p-2 rounded-xl transition cursor-pointer border ${
                    activeTrack === 'UNIVERSAL'
                      ? 'bg-emerald-500/20 border-emerald-400/60 shadow-sm shadow-emerald-500/25'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                  title="Chọn Khối Nền Tảng AI Foundations và xem danh sách chuyên đề"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      AI Foundations (Khối Nền Tảng)
                    </span>
                    <span className="text-[10px] text-emerald-400/90 font-mono font-bold">
                      {allModules.filter(m => isModuleInTrack(m, 'UNIVERSAL')).length} Chuyên Đề
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Bấm từng cấp để lọc nhanh</span>
              <span className="text-sky-300 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3 text-sky-400" /> Tự Học Thực Hành
              </span>
            </div>
          </div>

        </div>

        {/* 4 Summary Metrics (Dữ liệu động, thể hiện cấu trúc học tập tổng thể) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-sky-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-sky-400 font-mono">{allModules.length} CHUYÊN ĐỀ</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Lý Thuyết & Kiến Trúc SFIA</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-emerald-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">{allModules.length} ĐỀ LAB</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Mã Nguồn Mẫu & Bài Tập</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-teal-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-teal-400 font-mono">5 CẤP ĐỘ</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Từ Nhập Môn Đến Chuyên Sâu</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-amber-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">100% TỰ HỌC</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Tự Do Tra Cứu & Nghiên Cứu</div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CHẾ ĐỘ TRẢI NGHIỆM: GUEST CHỈ XEM CATALOG; THÀNH VIÊN ĐĂNG NHẬP CÓ TREE */}
      {/* ========================================================================= */}
      {!currentUser ? (
        /* GIAO DIỆN KHÁCH VÃNG LAI (GUEST): CALLOUT ĐĂNG KÝ (0đ) ĐỂ MỞ KHÓA ROADMAP */
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b1329]/90 border border-sky-500/30 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Danh Mục Khóa Học & Đề Lab Toàn Diện ({allModules.length} Chuyên Đề)</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono border border-sky-500/30">
                  Chế độ Khách (Catalog View)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Bạn đang xem danh mục thư viện mở. <strong>Đăng ký tài khoản miễn phí (0đ)</strong> để mở khóa <strong>Roadmap Cây Kỹ Năng Gamification</strong>, lưu chuỗi Streak và tích lũy 1000h!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Mở Khóa Cây Kỹ Năng (0đ) →</span>
          </button>
        </div>
      ) : (
        /* GIAO DIỆN ĐÃ ĐĂNG NHẬP (FREE / PRO): THANH CHUYỂN ĐỔI CÂY KỸ NĂNG VS DANH MỤC */
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-[#0b1329]/90 border border-sky-500/30 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Chế Độ Trải Nghiệm Giáo Trình</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Interactive Learning
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chọn Cây Kỹ Năng tương tác độc bản hoặc Tra cứu Danh Mục Thư Viện
              </p>
            </div>
          </div>

          {/* 2 Tabs Switcher Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-[#080f24] p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setDisplayMode('SKILL_TREE')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                displayMode === 'SKILL_TREE'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-md shadow-sky-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Cây Kỹ Năng Gamification</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                displayMode === 'SKILL_TREE' ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-sky-500/20 text-sky-300'
              }`}>
                USP Khuyên Dùng
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode('CATALOG')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                displayMode === 'CATALOG'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-md shadow-sky-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Danh Mục Thư Viện</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                displayMode === 'CATALOG' ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                Tra Cứu Nhanh
              </span>
            </button>
          </div>
        </div>
      )}

      {/* HIỂN THỊ CÂY KỸ NĂNG GAMIFICATION HOẶC DANH MỤC THƯ VIỆN */}
      {currentUser && displayMode === 'SKILL_TREE' ? (
        <GamifiedSkillTreeView 
          currentUser={currentUser}
          enrolledCourses={enrolledCourses}
          allModules={allModules}
        />
      ) : (
        <>
          {/* ========================================================================= */}
          {/* 3. LEARNER TRACKS SELECTOR: 3 TRỤ CỘT ĐÀO TẠO SFIA (V8) + FOUNDATION     */}
          {/* ========================================================================= */}
          <div id="curriculum-topics-section" className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/70 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Target className="w-3.5 h-3.5 text-sky-400" />
                  <span>3 Trụ Cột Đào Tạo Chuẩn Quốc Tế SFIA (v8) • VinUni AI Handbook</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                  Chọn Trụ Cột Chuyên Sâu Hoặc Nền Tảng Phù Hợp Với Bạn
                </h2>
                <p className="text-xs text-slate-300">
                  3 Trụ cột độc lập bao quát từ Quản trị chiến lược, Phát triển ứng dụng đến Tối ưu hóa hạ tầng mô hình:
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo kỹ năng, thuật toán..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0b1329]/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition shadow-inner font-normal"
                />
              </div>
            </div>

            {/* 4 Interactive Track Cards: 3 Trụ Cột SFIA + 1 Foundation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. AI BUSINESS & PRODUCT */}
              <div
                onClick={() => { setActiveTrack('NONTECH'); setSelectedLevel('ALL'); }}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                  activeTrack === 'NONTECH'
                    ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-amber-400 -translate-y-0.5'
                    : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      activeTrack === 'NONTECH' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950'
                    }`}>
                      AI Business & Product
                    </span>
                    <Briefcase className={`w-4 h-4 ${activeTrack === 'NONTECH' ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-600'}`} />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold uppercase tracking-wide ${activeTrack === 'NONTECH' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                    AI Business & Product
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${activeTrack === 'NONTECH' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    Dành cho <strong>Quản lý, Marketers, Khởi nghiệp & Dân văn phòng</strong>: Bản chất AI, Prompting chuyên sâu, Tự động hóa quy trình No-code n8n/Make, Quản trị AI và Đạo đức ISO 42001.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/20 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${activeTrack === 'NONTECH' ? 'text-amber-700' : 'text-amber-400/80 group-hover:text-amber-700'}`}>
                    {allModules.filter(m => isModuleInTrack(m, 'NONTECH')).length} Chuyên Đề
                  </span>
                  <span className={`text-[10px] font-mono ${activeTrack === 'NONTECH' ? 'text-slate-700 font-semibold' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    SFIA L0 ➔ L4
                  </span>
                </div>
              </div>

              {/* 2. AI APPLICATION */}
              <div
                onClick={() => { setActiveTrack('TECHBASE'); setSelectedLevel('ALL'); }}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                  activeTrack === 'TECHBASE'
                    ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-sky-400 -translate-y-0.5'
                    : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      activeTrack === 'TECHBASE' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-300 group-hover:bg-sky-500 group-hover:text-slate-950'
                    }`}>
                      AI Application
                    </span>
                    <Code className={`w-4 h-4 ${activeTrack === 'TECHBASE' ? 'text-sky-600' : 'text-slate-400 group-hover:text-sky-600'}`} />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold uppercase tracking-wide ${activeTrack === 'TECHBASE' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                    AI Application
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${activeTrack === 'TECHBASE' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    Dành cho <strong>Kỹ sư Phần mềm, Web, Backend & DevOps</strong>: Tích hợp LLM APIs an toàn với C# .NET / Python, Structured Outputs Pydantic, Hybrid RAG Qdrant và Hệ thống Multi-Agent LangGraph.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/20 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${activeTrack === 'TECHBASE' ? 'text-sky-700' : 'text-sky-400/80 group-hover:text-sky-700'}`}>
                    {allModules.filter(m => isModuleInTrack(m, 'TECHBASE')).length} Chuyên Đề
                  </span>
                  <span className={`text-[10px] font-mono ${activeTrack === 'TECHBASE' ? 'text-slate-700 font-semibold' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    SFIA L1 ➔ L4
                  </span>
                </div>
              </div>

              {/* 3. AI INFRASTRUCTURE & DATA */}
              <div
                onClick={() => { setActiveTrack('AIBASE'); setSelectedLevel('ALL'); }}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                  activeTrack === 'AIBASE'
                    ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-teal-400 -translate-y-0.5'
                    : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      activeTrack === 'AIBASE' ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950'
                    }`}>
                      AI Infrastructure & Data
                    </span>
                    <Cpu className={`w-4 h-4 ${activeTrack === 'AIBASE' ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'}`} />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold uppercase tracking-wide ${activeTrack === 'AIBASE' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                    AI Infrastructure & Data
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${activeTrack === 'AIBASE' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    Dành cho <strong>AI Engineers, Data Scientists & MLOps</strong>: Toán Attention Transformer, Tokenizer BPE, HNSW Indexing, Fine-Tuning LoRA/QLoRA, Distributed Inference vLLM và Ragas Triad.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/20 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${activeTrack === 'AIBASE' ? 'text-teal-700' : 'text-teal-400/80 group-hover:text-teal-700'}`}>
                    {allModules.filter(m => isModuleInTrack(m, 'AIBASE')).length} Chuyên Đề
                  </span>
                  <span className={`text-[10px] font-mono ${activeTrack === 'AIBASE' ? 'text-slate-700 font-semibold' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    SFIA L1 ➔ L4
                  </span>
                </div>
              </div>

              {/* 4. AI FOUNDATIONS (UNIVERSAL) */}
              <div
                onClick={() => { setActiveTrack('UNIVERSAL'); setSelectedLevel('ALL'); }}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-md flex flex-col justify-between ${
                  activeTrack === 'UNIVERSAL'
                    ? 'bg-white text-slate-950 border-white shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-emerald-400 -translate-y-0.5'
                    : 'bg-[#0b1329]/90 border-slate-700/80 text-white hover:bg-white hover:text-slate-950 hover:border-white hover:shadow-xl hover:-translate-y-0.5 group'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      activeTrack === 'UNIVERSAL' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 group-hover:bg-emerald-400 group-hover:text-slate-950'
                    }`}>
                      AI Foundations
                    </span>
                    <GraduationCap className={`w-4 h-4 ${activeTrack === 'UNIVERSAL' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold uppercase tracking-wide ${activeTrack === 'UNIVERSAL' ? 'text-slate-950' : 'text-white group-hover:text-slate-950'}`}>
                    AI Foundations (Phổ Cập AI)
                  </h3>
                  <p className={`text-[11px] leading-relaxed ${activeTrack === 'UNIVERSAL' ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    Giáo án <strong>AI for Everyone & Đạo Đức 5.0</strong>: Bản chất Trí tuệ Nhân tạo, Giải mã nỗi sợ, Ứng dụng y tế giáo dục, Chu trình dữ liệu, Nhận diện Deepfake & Trách nhiệm công dân số.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/20 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${activeTrack === 'UNIVERSAL' ? 'text-emerald-700' : 'text-emerald-400/80 group-hover:text-emerald-700'}`}>
                    {allModules.filter(m => isModuleInTrack(m, 'UNIVERSAL')).length} Chuyên Đề
                  </span>
                  <span className={`text-[10px] font-mono ${activeTrack === 'UNIVERSAL' ? 'text-slate-700 font-semibold' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    Level 0 Foundation
                  </span>
                </div>
              </div>

            </div>

        {/* SUB-SELECTOR: BỘ LỌC CẤP ĐỘ NĂNG LỰC SFIA TRONG PHÂN LUỒNG ĐANG CHỌN */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Nấc Thang SFIA trong {activeTrack === 'NONTECH' ? 'AI Business & Product' : activeTrack === 'TECHBASE' ? 'AI Application' : activeTrack === 'AIBASE' ? 'AI Infrastructure & Data' : 'AI Foundations'}:</span>
            </span>
            <span className="text-[11px] text-slate-400">Bấm để lọc theo cấp độ năng lực</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tất cả */}
            <button
              onClick={() => setSelectedLevel('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                selectedLevel === 'ALL'
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-[#0b1329] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              Tất Cả ({allModules.filter(m => isModuleInTrack(m, activeTrack)).length})
            </button>

            {/* Level 0 nếu có trong luồng */}
            {(activeTrack === 'NONTECH' || activeTrack === 'UNIVERSAL') && (
              <button
                onClick={() => setSelectedLevel('L0')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  selectedLevel === 'L0'
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-[#0b1329] text-emerald-400 border-slate-700 hover:border-emerald-500'
                }`}
              >
                Level 0 • Foundation ({allModules.filter(m => isModuleInTrack(m, activeTrack) && m.levelCode === 'L0').length})
              </button>
            )}

            {/* Level 1: Follow */}
            {activeTrack !== 'UNIVERSAL' && (
              <button
                onClick={() => setSelectedLevel('L1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  selectedLevel === 'L1'
                    ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-md shadow-sky-500/20'
                    : 'bg-[#0b1329] text-sky-300 border-slate-700 hover:border-sky-500'
                }`}
              >
                Level 1 • Follow ({allModules.filter(m => isModuleInTrack(m, activeTrack) && m.levelCode === 'L1').length})
              </button>
            )}

            {/* Level 2: Assist */}
            {activeTrack !== 'UNIVERSAL' && (
              <button
                onClick={() => setSelectedLevel('L2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  selectedLevel === 'L2'
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-[#0b1329] text-emerald-300 border-slate-700 hover:border-emerald-500'
                }`}
              >
                Level 2 • Assist ({allModules.filter(m => isModuleInTrack(m, activeTrack) && m.levelCode === 'L2').length})
              </button>
            )}

            {/* Level 3: Apply */}
            {activeTrack !== 'UNIVERSAL' && (
              <button
                onClick={() => setSelectedLevel('L3')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  selectedLevel === 'L3'
                    ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-md shadow-teal-500/20'
                    : 'bg-[#0b1329] text-teal-300 border-slate-700 hover:border-teal-500'
                }`}
              >
                Level 3 • Apply ({allModules.filter(m => isModuleInTrack(m, activeTrack) && m.levelCode === 'L3').length})
              </button>
            )}

            {/* Level 4: Enable */}
            {activeTrack !== 'UNIVERSAL' && (
              <button
                onClick={() => setSelectedLevel('L4')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  selectedLevel === 'L4'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                    : 'bg-[#0b1329] text-amber-300 border-slate-700 hover:border-amber-500'
                }`}
              >
                Level 4 • Enable ({allModules.filter(m => isModuleInTrack(m, activeTrack) && m.levelCode === 'L4').length})
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. DANH SÁCH KHÓA HỌC (COURSE CATALOG GRID) - GỌN GÀNG, KHÔNG CHOÁNG NGỢP */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="text-xs text-slate-300 font-medium">
            Tìm thấy <strong className="text-sky-400 font-bold">{filteredModules.length} Chuyên Đề</strong> thuộc trụ cột <span className="text-amber-300 font-bold">{activeTrack === 'NONTECH' ? 'AI Business & Product' : activeTrack === 'TECHBASE' ? 'AI Application' : activeTrack === 'AIBASE' ? 'AI Infrastructure & Data' : 'AI Foundations'}</span> {selectedLevel !== 'ALL' ? <span className="text-emerald-400 font-mono font-semibold">({selectedLevel})</span> : ''}:
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            💡 Khách xem Review & Mục lục • Ghi danh (0đ) để vào phòng học & nhận chứng chỉ tốt nghiệp SFIA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod, idx) => {
            const isEnrolled = currentUser ? enrolledCourses.some(id => id.trim().toLowerCase() === mod.id.trim().toLowerCase()) : false;
            const { completedCount, isCompleted, progressPercent } = clientStorage.getCourseProgress(mod.id, mod.topics?.length || 0);

            return (
              <div 
                key={`${mod.id}-${idx}`} 
                className={`rounded-2xl bg-[#0f172a]/90 border p-5 space-y-4 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col justify-between group ${
                  isCompleted 
                    ? 'border-amber-500/40 hover:border-amber-400/70 hover:shadow-[0_15px_35px_rgba(245,158,11,0.15)]'
                    : isEnrolled 
                      ? 'border-cyan-500/40 hover:border-cyan-400/70 hover:shadow-[0_15px_35px_rgba(6,182,212,0.15)]'
                      : 'border-sky-500/30 hover:border-sky-400/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
                }`}
              >
                <div className="space-y-3">
                  {/* Tags & Trạng thái ghi danh Coursera-style */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-[11px] font-bold">
                      {mod.levelTag}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#0b1329] text-sky-300 border border-slate-700 text-[11px] font-semibold">
                      {mod.tag}
                    </span>
                    
                    {/* Badge trạng thái 4 nấc */}
                    {!currentUser ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Cần đăng ký (0đ)</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>Đã có chứng chỉ 🏆</span>
                      </span>
                    ) : isEnrolled ? (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>Đang học ({completedCount}/{mod.topics.length})</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Chưa ghi danh (0đ)</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide leading-snug group-hover:text-sky-300 transition line-clamp-2">
                    {mod.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-3">
                    {mod.description}
                  </p>

                  {/* Thanh tiến độ nếu đã ghi danh */}
                  {currentUser && isEnrolled && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className={isCompleted ? 'text-amber-400 font-semibold' : 'text-cyan-300 font-medium'}>
                          {isCompleted ? 'Hoàn thành chuyên đề 100%' : `Tiến độ: ${completedCount}/${mod.topics.length} bài`}
                        </span>
                        <span className={`font-bold ${isCompleted ? 'text-amber-400' : 'text-cyan-300'}`}>
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-sky-500 to-cyan-400'
                          }`}
                          style={{ width: `${progressPercent}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Mini Syllabus Preview */}
                  <div className={`pt-2 border-t border-slate-800/80 space-y-1.5 ${currentUser && isEnrolled ? 'mt-1' : ''}`}>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Nội dung khóa học:</span>
                      <span className="text-sky-400 font-bold">{mod.topics.length} Bài + 1 Lab</span>
                    </div>
                    <div className="space-y-1">
                      {mod.topics.slice(0, 2).map((top, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-1.5 text-[11px] text-slate-400 line-clamp-1">
                          {!currentUser || !isEnrolled ? (
                            <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                          ) : (
                            <span className="text-sky-400">▪</span>
                          )}
                          <span className="truncate">{top.title}</span>
                        </div>
                      ))}
                      {mod.topics.length > 2 && (
                        <div className="text-[10px] text-slate-400 pl-3">
                          + {mod.topics.length - 2} bài học khác...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (4 States Coursera Standard) */}
                <div className="pt-3 border-t border-slate-800/80">
                  {!currentUser ? (
                    // State 1: Chưa đăng nhập -> Xem review và đăng ký
                    <Link
                      href={`/learning/${mod.id}`}
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 shadow-slate-950/50 hover:border-sky-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span>Xem Khóa Học & Đăng Ký (0đ) →</span>
                    </Link>
                  ) : isCompleted ? (
                    // State 4: Đã hoàn thành 100% -> Xem chứng chỉ + Ôn tập
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCertModule(mod)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold shadow-amber-500/20"
                      >
                        <Award className="w-4 h-4 text-slate-950" />
                        <span>Xem Chứng Chỉ 🎓</span>
                      </button>
                      <Link
                        href={`/learning/${mod.id}`}
                        className="px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 transition cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shrink-0"
                        title="Vào ôn lại toàn bộ bài học"
                      >
                        <BookOpen className="w-4 h-4 text-sky-400" />
                        <span>Ôn Tập</span>
                      </Link>
                    </div>
                  ) : isEnrolled ? (
                    // State 3: Đã đăng ký, đang học dở
                    <Link
                      href={`/learning/${mod.id}`}
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-cyan-950/50 hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Vào Học Tiếp ({progressPercent}%) →</span>
                    </Link>
                  ) : (
                    // State 2: Đã đăng nhập, chưa đăng ký
                    <Link
                      href={`/learning/${mod.id}`}
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 shadow-sky-500/20 font-extrabold"
                    >
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                      <span>Đăng Ký Khóa Học Này (0đ) →</span>
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM ACTION: PLACEMENT TEST CALLOUT                                   */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase font-mono">
            Chưa Biết Mình Đang Thuộc Level Nào?
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wide mt-1">
            Làm Bài Test Tổng Quát Định Vị Cấp Độ (Placement Test)
          </h3>
          <p className="text-xs text-slate-300 font-normal">
            Hệ thống AI sẽ tự động phân tích và chỉ ra chính xác bạn nên bắt đầu từ Level 1, Level 2, Level 3 hay Level 4.
          </p>
        </div>

        <Link
          href="/test"
          className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 uppercase tracking-wider shrink-0"
        >
          <span>Làm Bài Placement Test Ngay →</span>
        </Link>
      </div>

      {/* MODAL XEM CHỨNG CHỈ SỐ KHI ĐÃ HOÀN THÀNH */}
      {selectedCertModule && (
        <CertificateModal
          isOpen={!!selectedCertModule}
          onClose={() => setSelectedCertModule(null)}
          defaultUserName={currentUser?.name}
          courseTitle={selectedCertModule.title}
          courseLevelCode={selectedCertModule.levelCode}
        />
      )}

      {/* MODAL ĐĂNG KÝ / ĐĂNG NHẬP MỞ KHÓA CÂY KỸ NĂNG CHO KHÁCH */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user as StoredUser);
          setDisplayMode('SKILL_TREE');
          setShowAuthModal(false);
        }}
      />

    </div>
  );
}
