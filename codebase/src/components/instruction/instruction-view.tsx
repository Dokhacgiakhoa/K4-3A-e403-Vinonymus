'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SFIA_COMMUNITY_DATA, type OpenSourceRepoItem } from '@/data/sfia-community-data';
import { 
  BookOpen, 
  Award, 
  FileCheck2, 
  Bot, 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  CheckCircle2, 
  Search, 
  UserCheck, 
  Key, 
  Download,
  HelpCircle,
  Play,
  Github,
  Star,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Flame,
  Terminal
} from 'lucide-react';
import { NonTechPrimerModal } from '@/components/learning/non-tech-primer-modal';

type OrgFilter = 'ALL' | 'Hugging Face' | 'Anthropic Claude' | 'Google Gemini' | 'AI Infrastructure' | 'Agentic & RAG' | 'Vector DB & Search';

export function InstructionView() {
  const [activeGuideTab, setActiveGuideTab] = useState<number>(0);
  const [activeOrgFilter, setActiveOrgFilter] = useState<OrgFilter>('ALL');
  const [showNonTechPrimer, setShowNonTechPrimer] = useState<boolean>(false);

  const openSourceRepos = SFIA_COMMUNITY_DATA.openSourceHub || [];

  const filteredRepos = openSourceRepos.filter(repo => {
    if (activeOrgFilter === 'ALL') return true;
    return repo.organization === activeOrgFilter;
  });

  const guideSections = [
    {
      id: "sfia",
      title: "1. Khám Phá Ma Trận SFIA (v8) (About)",
      badge: "Khung Chuẩn Quốc Tế",
      icon: Award,
      desc: "Cách tra cứu và định vị bản thân theo 7 cấp độ chuẩn quốc tế SFIA (v8) và xác định lộ trình học từ L0.",
      steps: [
        "Truy cập menu ABOUT trên thanh điều hướng.",
        "Xem khung tham chiếu 7 cấp độ SFIA (v8) từ L1 đến L7 để hiểu các tiêu chuẩn năng lực quốc tế.",
        "Nắm rõ định vị nền tảng: Cung cấp giáo trình & lab thực hành từ Level 0 đến Level 4; L5-L7 là khung tham chiếu mở rộng cho dự án thực tế tại doanh nghiệp.",
        "Đối chiếu năng lực hiện tại của bạn để chọn chuyên đề học tập phù hợp."
      ],
      ctaText: "Khám Phá Ma Trận SFIA Ngay",
      ctaHref: "/about"
    },
    {
      id: "learning",
      title: "2. Thư Viện Học Tập Mở (Learning)",
      badge: "Từ L0 ➔ L4",
      icon: BookOpen,
      desc: "Học tập từ L0 đến L4 với 19 chuyên đề lý thuyết và 19 đề lab thực hành.",
      steps: [
        "Truy cập menu LEARNING để mở danh mục giáo trình từ Level 0 đến Level 4.",
        "Chọn lộ trình phù hợp: Non-tech (bắt đầu từ Level 0 - AI Cho Mọi Người), Tech-base (Level 1-2), hoặc AI-base (Level 3-4).",
        "Đọc phân tích lý thuyết toán học (Công thức Attention, LoRA, Cosine Similarity) với hiển thị KaTeX sắc nét.",
        "Thực hành với 19 đề lab kèm script kiểm thử tự động trên máy tính của bạn."
      ],
      ctaText: "Vào Xem Giáo Trình Tự Học",
      ctaHref: "/learning"
    },
    {
      id: "test",
      title: "3. Thi Thử & Đánh Giá Năng Lực (Test)",
      badge: "5 Bài Test L0 - L4",
      icon: FileCheck2,
      desc: "Luyện tập các bộ đề trắc nghiệm và tự luận System Design do AI chấm điểm tự động.",
      steps: [
        "Truy cập menu TEST để vào phòng thi mô phỏng trực tuyến.",
        "Chọn chế độ thi: 30 phút (nhanh), 60 phút (tiêu chuẩn), hoặc 90 phút (có tự luận AI chấm điểm).",
        "Chọn 1 trong 5 bài test định vị năng lực từ Level 0 đến Level 4.",
        "Làm bài thi với câu hỏi được AI tráo ngẫu nhiên và nhận báo cáo đánh giá chi tiết."
      ],
      ctaText: "Vào Phòng Thi Thử Mô Phỏng",
      ctaHref: "/test"
    },
    {
      id: "ai-chat",
      title: "4. Trợ Lý AI RAG Tra Cứu 24/7 (Contact)",
      badge: "Hybrid RAG Engine",
      icon: Bot,
      desc: "Hỏi đáp mọi thắc mắc về giáo trình, toán học và code với trợ lý thông minh theo thời gian thực.",
      steps: [
        "Truy cập menu CONTACT để kết nối với Trợ Lý K.AI Assistant.",
        "Nhập câu hỏi kỹ thuật (ví dụ: 'Giải thích cơ chế PagedAttention trong vLLM' hoặc 'So sánh RRF với Cross-Encoder').",
        "Xem câu trả lời streaming thời gian thực kèm trích dẫn nguồn tài liệu tham khảo chính xác.",
        "Có thể gửi phản hồi đóng góp để xây dựng cộng đồng tự học AI."
      ],
      ctaText: "Hỏi Đáp Với Trợ Lý AI Ngay",
      ctaHref: "/contact"
    },
    {
      id: "pwa",
      title: "5. Cài Đặt Ứng Dụng Mobile PWA (App)",
      badge: "Học Offline Tiện Lợi",
      icon: Smartphone,
      desc: "Cài đặt nền tảng dưới dạng App trên điện thoại Android, iOS hoặc Desktop mà không cần tải từ App Store.",
      steps: [
        "Trên trình duyệt Chrome/Edge/Safari, bấm vào biểu tượng [Cài đặt ứng dụng] (hoặc nút [Share] > [Add to Home Screen] trên iPhone).",
        "Mở ứng dụng trực tiếp từ màn hình chính với tốc độ tải trang tức thì (0ms).",
        "Hỗ trợ lưu trữ tài liệu offline và đồng bộ dữ liệu mượt mà."
      ],
      ctaText: "Trải Nghiệm Nền Tảng Trên Web",
      ctaHref: "/"
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. HEADER BANNER                                                          */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Hướng Dẫn Khai Thác Nền Tảng & Kho Tàng Mã Nguồn Mở</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase leading-tight text-shadow-clean">
            Cẩm Nang Tự Học AI & Kho Tàng GitHub <br />
            <span className="text-sky-400 font-bold">Hugging Face • Claude • Gemini • vLLM</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            Hướng dẫn sử dụng toàn diện nền tảng K.AI Labs kèm danh mục tổng hợp các kho mã nguồn mở (GitHub Repositories & Cookbooks) chính thức hàng đầu thế giới từ Hugging Face, Anthropic Claude, Google Gemini, vLLM và LangGraph.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CẨM NANG TOÀN DIỆN CHO NGƯỜI NON-TECH (TỪ L0 ➔ KIẾN TRÚC SƯ AI)       */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1938] via-[#091226] to-[#040817] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Cẩm Nang Độc Quyền Cho Người Mới Bắt Đầu
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Level 0 ➔ Level 4 • 1000 Giờ Tự Học
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
              📘 Cẩm Nang Non-Tech: Từ L0 Đến Kiến Trúc Sư AI
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Sổ tay hướng dẫn thực chiến từng bước cho người ngoại đạo (Non-Tech), học viên chuyển ngành, Product Manager và Designer: thiết lập môi trường lập trình (VS Code, Python, Git), vượt qua rào cản tâm lý sợ code, giải mã tư duy toán học Transformer và lộ trình 4 Sprints đạt chuẩn SFIA (v8).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#060c1d]/80 border border-slate-700/70 text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thiết lập Python & VS Code 0ms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060c1d]/80 border border-slate-700/70 text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bí kíp Prompting & First Script</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060c1d]/80 border border-slate-700/70 text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Phương pháp tích lũy 1000 Giờ</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowNonTechPrimer(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Đọc Cẩm Nang Toàn Diện (Interactive) →</span>
            </button>

            <Link
              href="/learning"
              className="px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold uppercase tracking-wider transition text-center flex items-center justify-center gap-2"
            >
              <span>Vào 7 Chuyên Đề Level 0 (/learning)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HORIZONTAL INTERACTIVE GUIDE TABS                                      */}
      {/* ========================================================================= */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {guideSections.map((item, idx) => {
          const isActive = activeGuideTab === idx;
          const IconComp = item.icon;
          return (
            <button
              key={idx}
              onClick={() => setActiveGuideTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shadow-md ${
                isActive
                  ? 'bg-white text-slate-950 shadow-[0_10px_35px_rgba(255,255,255,0.25)] ring-2 ring-sky-400 -translate-y-0.5'
                  : 'bg-[#0f172a]/90 text-slate-300 hover:text-white hover:bg-white hover:text-slate-950 border border-slate-700/80'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
              <span className="uppercase tracking-wider">{item.title.split('. ')[1]?.split(' (')[0] || item.title}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE GUIDE DETAILS CARD                                              */}
      {/* ========================================================================= */}
      {(() => {
        const currentGuide = guideSections[activeGuideTab] ?? guideSections[0]!;
        const IconComponent = currentGuide.icon;
        return (
          <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl space-y-8 animate-fadeIn">
            
            {/* Top Bar of Guide */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/70 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0b1329] border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-lg">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#0b1329] text-sky-300 border border-slate-700 uppercase tracking-wider">
                    {currentGuide.badge}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wide mt-1 text-shadow-clean">
                    {currentGuide.title}
                  </h2>
                </div>
              </div>

              <Link
                href={currentGuide.ctaHref}
                className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider shrink-0"
              >
                <span>{currentGuide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Guide Description */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {currentGuide.desc}
            </p>

            {/* 4-Step Instructions List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                Các Bước Thao Tác Chi Tiết:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentGuide.steps.map((step, sIdx) => (
                  <div 
                    key={sIdx}
                    className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 space-y-2 shadow-md hover:border-slate-600 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-bold font-mono flex items-center justify-center">
                        {sIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-white">Bước 0{sIdx + 1}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal pl-8">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. KHO TÀNG GITHUB MÃ NGUỒN MỞ QUỐC TẾ HÀNG ĐẦU                            */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0f172a]/90 border border-sky-500/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/70 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider font-mono">
              <Github className="w-3.5 h-3.5 text-sky-400" />
              <span>Official Open Source Cookbooks & Repositories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide text-shadow-clean">
              Kho Tàng Mã Nguồn Mở GitHub Hàng Đầu Thế Giới
            </h2>
            <p className="text-xs text-slate-300">
              Tổng hợp trực tiếp các Repository, Cookbook và Framework chính thức được dùng làm tài liệu tham chiếu:
            </p>
          </div>
        </div>

        {/* Filter Pills for GitHub Repos */}
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'Hugging Face', 'Anthropic Claude', 'Google Gemini', 'AI Infrastructure', 'Agentic & RAG', 'Vector DB & Search'] as OrgFilter[]).map((org) => (
            <button
              key={org}
              onClick={() => setActiveOrgFilter(org)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition uppercase tracking-wide ${
                activeOrgFilter === org
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
                  : 'bg-[#0b1329]/90 text-slate-300 hover:text-white border border-slate-700/80'
              }`}
            >
              {org === 'ALL' ? 'Tất Cả Kho Nguồn' : org}
            </button>
          ))}
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRepos.map((repo: OpenSourceRepoItem) => (
            <div 
              key={repo.id}
              className="p-5 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 hover:border-sky-400 transition-all duration-300 space-y-4 shadow-md hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${repo.badgeColor}`}>
                    {repo.organization}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>{repo.stars}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors font-mono">
                    {repo.repoName}
                  </h3>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {repo.categoryTag}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {repo.description}
                </p>

                <div className="p-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-[11px] text-sky-300 font-normal leading-relaxed">
                  <strong>💡 Điểm nổi bật:</strong> {repo.practicalHighlight}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {repo.coreTopics.slice(0, 2).map((t: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-800 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>

                <a
                  href={repo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-sky-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition text-[11px] font-bold flex items-center gap-1 font-mono uppercase shrink-0"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. QUICK SHORTCUTS & TIPS                                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 space-y-3 shadow-lg backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-[#0b1329] text-emerald-400 border border-slate-700 flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Lộ Trình Học Chuẩn Bậc
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Nên học theo thứ tự từ Level 1 đến Level 7 theo đúng định vị (Non-tech, Tech-base hoặc AI-base) để xây dựng nền móng toán học và kỹ thuật vững chắc.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 space-y-3 shadow-lg backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-[#0b1329] text-sky-400 border border-slate-700 flex items-center justify-center shadow-md">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Tài Khoản & Lưu Tiến Độ
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Đăng nhập qua GitHub hoặc Google để lưu trữ lịch sử làm 5 bài test đánh giá năng lực và đánh dấu các module bài giảng yêu thích.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 space-y-3 shadow-lg backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-[#0b1329] text-amber-400 border border-slate-700 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Bảo Mật & Miễn Trừ NDA
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            100% tài liệu và đề thi được tổng hợp từ nguồn mở quốc tế uy tín, bảo vệ tuyệt đối cam kết bảo mật thông tin và an toàn pháp lý.
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL CẨM NANG NON-TECH CHUYÊN SÂU                                      */}
      {/* ========================================================================= */}
      <NonTechPrimerModal
        isOpen={showNonTechPrimer}
        onClose={() => setShowNonTechPrimer(false)}
      />

    </div>
  );
}
