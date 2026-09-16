'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Crown, 
  Check, 
  ArrowRight, 
  Bot, 
  Zap, 
  BookOpen, 
  Terminal, 
  Clock, 
  Flame, 
  FileCheck2, 
  Layers,
  Lock
} from 'lucide-react';
import { StatsBar } from './stats-bar';
import { FaqAccordionSection } from './faq-accordion-section';
import { AuthModal } from '@/components/auth/auth-modal';
import { clientStorage } from '@/lib/client-storage';

export function HomeLandingView() {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const currentUser = clientStorage.getUser();

  const handleScrollToPricing = () => {
    const el = document.getElementById('pricing-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProCta = () => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      clientStorage.upgradeToPro();
      window.dispatchEvent(new Event('aiia_auth_changed'));
    }
  };

  return (
    <div className="space-y-20 py-2 animate-fadeIn font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. HERO CONVERSION BANNER (TẬP TRUNG, ÍT NÚT, ĐỊNH VỊ RÕ RÀNG)            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        
        {/* Top Badge & Headline */}
        <div className="relative z-10 text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold tracking-wider uppercase shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Nền Tảng Học AI Chuẩn SFIA (V8) • 1000h Kỹ Sư AI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide uppercase leading-[1.35] sm:leading-[1.4] text-shadow-clean">
            <span className="block whitespace-nowrap">Nền Tảng Học AI Cá Nhân Hóa</span>
            <span className="block text-sky-400 font-bold pt-1.5 sm:pt-2 whitespace-nowrap">
              Chuẩn Quốc Tế SFIA (V8)
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal text-balance">
            Nền tảng học AI cá nhân hóa <span className="whitespace-nowrap">từ con số 0</span>, tích hợp <strong className="whitespace-nowrap">AI Mentor 1-on-1</strong> may đo <span className="whitespace-nowrap">lộ trình độc bản</span> và <strong className="whitespace-nowrap">AI Helpdesk 24/7</strong> đồng hành giải đáp <span className="whitespace-nowrap">kỹ thuật chuyên sâu</span>.
          </p>

          {/* DUY NHẤT 2 NÚT CTA CHIẾN LƯỢC - KHÔNG LẶP MENU */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Bắt Đầu Học Ngay (Miễn Phí)</span>
            </button>

            <button
              type="button"
              onClick={handleScrollToPricing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0b1329]/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-amber-400/60 text-xs sm:text-sm font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Xem Quyền Lợi Gói Pro VIP</span>
            </button>
          </div>
        </div>

        {/* 3D DEVICE SHOWCASE STAGE (MINH HỌA CÔNG NGHỆ, KHÔNG CHỨA NÚT NHẢY TRANG THỪA) */}
        <div className="relative z-10 mt-10 max-w-4xl mx-auto perspective-stage">
          <div className="relative mx-auto rounded-2xl p-3 sm:p-4 bg-[#0f172a]/80 border border-sky-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transform-3d-card backdrop-blur-xl">
            
            <div className="rounded-xl overflow-hidden glass-device-screen p-4 sm:p-6 space-y-4">
              
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                    AI
                  </div>
                  <span className="text-xs font-semibold text-white tracking-wider uppercase">Kiến Trúc Tự Học Phân Tầng Chuẩn SFIA (v8)</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-sky-300 font-mono font-medium">
                  <span>Standard: SFIA (v8)</span>
                  <span>•</span>
                  <span>100% Mock & NDA-Compliant</span>
                </div>
              </div>

              {/* Screen Content: 3 Trụ Cột Nền Tảng & Tiến Độ */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Left: 3 Trụ Cột Học Thuật */}
                <div className="md:col-span-7 space-y-2.5">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-[10px] text-sky-300 font-mono font-medium uppercase tracking-wider">
                    Khung Phương Pháp Luận
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight uppercase tracking-wide">
                    Học Sâu Bản Chất Toán Gốc <br />
                    <span className="text-sky-400 font-bold">Thực Hành Lab Hạ Tầng Enterprise</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-[#0b1329]/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>19 Chuyên đề lý thuyết:</strong> Toán Attention, LoRA PEFT, Qdrant HNSW, vLLM PagedAttention.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0b1329]/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>19 Đề Lab thực nghiệm:</strong> Môi trường Docker/Cloud, chấm điểm tự động bằng script.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0b1329]/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <Bot className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>Cặp đôi AI trợ lực:</strong> AI Mentor may đo 4 Sprints & AI Helpdesk giải đáp 24/7.</span>
                    </div>
                  </div>
                </div>

                {/* Right: Thước Đo Cấp Độ SFIA */}
                <div className="md:col-span-5 p-4 rounded-xl bg-[#0b1329]/85 border border-slate-700/80 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Tiến Độ Theo Cấp Độ SFIA</span>
                    <span className="text-xs font-mono font-semibold text-sky-300 bg-[#070d1e] px-2 py-0.5 rounded border border-slate-700">
                      L0 ➔ Level 7
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                      <span>L0-L2: Nền Tảng & Prompting</span>
                      <span className="text-emerald-400 font-semibold">100% Mở</span>
                    </div>
                    <div className="w-full bg-[#070d1e] h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-emerald-400 h-2 w-full"></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-300 font-medium pt-1">
                      <span>L3-L4: Enterprise RAG & Multi-Agent</span>
                      <span className="text-sky-400 font-semibold">100% Thực Hành</span>
                    </div>
                    <div className="w-full bg-[#070d1e] h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-sky-400 h-2 w-full"></div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-200 font-medium pt-1">
                      <span>L5-L7: Khung Tham Chiếu Doanh Nghiệp</span>
                      <span className="text-indigo-400 font-mono text-[9px]">Tra Cứu SFIA</span>
                    </div>
                    <div className="w-full bg-[#070d1e] h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-indigo-500/40 h-2 w-full border border-dashed border-indigo-400/60"></div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300 text-center pt-1 border-t border-slate-800 font-mono font-medium">
                    Giáo trình thực hành Level 0 ➔ Level 4 • L5–L7 Tham chiếu mở rộng
                  </div>
                </div>

              </div>

              {/* Tech Logos Bar */}
              <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-300 font-mono font-medium">
                <span>Hạ tầng công nghệ thực chiến:</span>
                <div className="flex items-center gap-3">
                  <span className="text-white">⚡ FastAPI</span>
                  <span>•</span>
                  <span className="text-white">🔍 Qdrant</span>
                  <span>•</span>
                  <span className="text-white">🤖 LangGraph</span>
                  <span>•</span>
                  <span className="text-white">🚀 vLLM</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* STATS BAR (SỐ LIỆU TỰ HỌC ĐỘNG) */}
        <StatsBar />

      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. SECTION: NỀN TẢNG TỰ HỌC AI CÁ NHÂN HÓA TỪ CON SỐ 0                     */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="section-header-panel text-center space-y-3 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070d1e]/90 border border-sky-500/50 text-sky-300 text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Lộ Trình Cá Nhân Hóa Toàn Diện</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide neon-glow-cyan leading-tight">
            <span className="block whitespace-nowrap">Nền Tảng Học AI Cá Nhân Hóa</span>
            <span className="text-sky-400 block whitespace-nowrap">Từ Con Số 0 Với AI Mentor</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto text-balance">
            Học <span className="whitespace-nowrap">từ con số 0</span> với lộ trình được <strong className="whitespace-nowrap text-white">AI Mentor</strong> chẩn đoán và cá nhân hóa theo năng lực thực tế. Toàn bộ lý thuyết và đề lab là tri thức mở hoàn toàn miễn phí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card L0 */}
          <div className="futuristic-glass-card p-6 rounded-3xl space-y-4 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/40 shadow-sm">
                  Level 0
                </span>
                <span className="text-[11px] text-slate-300 font-mono">7 Chuyên Đề & 7 Labs</span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Cho Mọi Người & Đạo Đức 5.0
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Bắt đầu từ L0: Khám phá bản chất AI, giải mã các thuật ngữ cốt lõi, vòng đời dữ liệu, công dân số và làm quen môi trường Python Google Colab.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-mono flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dành cho người mới bắt đầu</span>
            </div>
          </div>

          {/* Card L1-L2 */}
          <div className="futuristic-glass-card p-6 rounded-3xl space-y-4 hover:border-sky-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/40 shadow-sm">
                  Level 1 — 2
                </span>
                <span className="text-[11px] text-slate-300 font-mono">Module 01 - 06</span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Python Foundation & Prompting
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Python 3.12 venv, cấu trúc dữ liệu, Tokenizer BPE, kỹ thuật Prompt Engineering nâng cao (Few-shot, Chain-of-Thought, Pydantic Structured Output).
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-sky-300 font-mono flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-sky-400" />
              <span>Củng cố nền tảng lập trình</span>
            </div>
          </div>

          {/* Card L3 */}
          <div className="futuristic-glass-card p-6 rounded-3xl space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/40 shadow-sm">
                  Level 3
                </span>
                <span className="text-[11px] text-slate-300 font-mono">Module 07 - 09</span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Hybrid RAG & Vector Database
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Dựng Qdrant HNSW Index, kết hợp Dense Embeddings + BM25 Sparse Search, thuật toán Reciprocal Rank Fusion (RRF) và Cross-Encoder Re-ranking.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-indigo-300 font-mono flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-400" />
              <span>Xây dựng RAG cấp doanh nghiệp</span>
            </div>
          </div>

          {/* Card L4 */}
          <div className="futuristic-glass-card p-6 rounded-3xl space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs border border-purple-500/40 shadow-sm">
                  Level 4
                </span>
                <span className="text-[11px] text-slate-300 font-mono">Module 10 - 12</span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Multi-Agent & LoRA Fine-Tuning
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Thiết kế AI Agent tự chủ với LangGraph, kỹ thuật tinh chỉnh PEFT / LoRA 4-bit, vLLM Serving PagedAttention và đánh giá an toàn AI Ragas.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-purple-300 font-mono flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-purple-400" />
              <span>Kiến trúc sư hệ thống AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION: CẶP ĐÔI AI TRỢ LỰC ĐỘC QUYỀN (MENTOR VS HELPDESK)               */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="section-header-panel text-center space-y-3 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070d1e]/90 border border-cyan-500/50 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-md">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Công Nghệ AI Song Hành Độc Bản</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide neon-glow-cyan">
            Trợ Lực Kép: <span className="text-cyan-400">AI Mentor 1-on-1</span> & <span className="text-emerald-400">AI Helpdesk 24/7</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto">
            Phân định rõ ràng vai trò: AI Mentor định hướng chiến lược lộ trình, trong khi AI Helpdesk túc trực giải đáp khúc mắc kỹ thuật tức thì.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: AI Mentor 1-on-1 */}
          <div className="futuristic-glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 border-t-white/40 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold px-2 py-0.5 rounded bg-[#070d1e] border border-cyan-500/40 shadow-sm">
                      Đặc Quyền Pro VIP
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mt-1">
                      AI Mentor 1-on-1 (Cá Nhân Hóa)
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-300/80 bg-[#070d1e] px-2 py-1 rounded border border-slate-800">
                  4 Sprints • 7 Ngày/Sprint
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Trí tuệ nhân tạo chẩn đoán chính xác trình độ khởi điểm, mục tiêu nghề nghiệp và quỹ thời gian rảnh của bạn để <strong>loại bỏ các bài học thừa, may đo riêng lộ trình 4 Sprints độc bản</strong>.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Chẩn đoán năng lực khởi điểm (Non-Tech, Tech-base hoặc AI-base).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Tự động sắp xếp thứ tự học tập tối ưu theo thời gian bạn cam kết mỗi tuần.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Thử thách nhiệm vụ Boss Fight thực tế sau mỗi chặng để cọ xát năng lực.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleProCta}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-indigo-500/30 hover:from-cyan-500/40 hover:to-indigo-500/40 text-cyan-200 hover:text-white border border-cyan-400/50 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Khám Phá Lộ Trình AI Mentor Cùng Gói Pro</span>
              </button>
            </div>
          </div>

          {/* Card 2: AI Helpdesk 24/7 */}
          <div className="futuristic-glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/40 border-t-white/40 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold px-2 py-0.5 rounded bg-[#070d1e] border border-emerald-500/40 shadow-sm">
                      Hỏi Đáp & Giải Nghĩa Lý Thuyết
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mt-1">
                      AI Helpdesk 24/7 (K.AI Assistant)
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-300/80 bg-[#070d1e] px-2 py-1 rounded border border-slate-800">
                  Hybrid RAG Streaming
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Widget trực tuyến ghim nổi 24/7 ở góc phải màn hình, tích hợp cơ chế tìm kiếm lai (Dense Vector Qdrant + BM25 Sparse Search) để giải đáp mọi thắc mắc học thuật tức thì.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Giải mã bản chất công thức toán học ma trận và Transformer Attention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Giải nghĩa tường tận thuật toán học máy, tối ưu đạo hàm và cơ chế Attention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Trích dẫn nguồn chính xác 100% từ giáo trình 19 chuyên đề gốc rễ.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <Link
                href="/contact"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-sky-500/30 hover:from-emerald-500/40 hover:to-sky-500/40 text-emerald-200 hover:text-white border border-emerald-400/50 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 text-center"
              >
                <span>Hỏi Đáp Kỹ Thuật Với AI Helpdesk Ngay →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION: BỘ CÔNG CỤ RÈN LUYỆN KỶ LUẬT HỌC TẬP (GAMIFICATION)           */}
      {/* ========================================================================= */}
      <section className="futuristic-glass-panel rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070d1e]/90 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Kỷ Luật & Đo Lường Tiến Độ</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white uppercase tracking-wide neon-glow-cyan">
            Cơ Chế Rèn Luyện Bền Bỉ Đến Đích
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-normal">
            Không học vội vã, nền tảng trang bị các công cụ giúp bạn duy trì kỷ luật và đo lường sự tiến bộ từng ngày
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="futuristic-glass-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold shadow-md shadow-sky-500/10">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Đồng Hồ 1000 Giờ Tự Học</h4>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Ghi nhận từng phút học tập thực chất qua đồng hồ bấm giờ Focus Mode (F11), hướng tới mốc 1000 giờ để làm chủ tri thức AI.
            </p>
          </div>

          <div className="futuristic-glass-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shadow-md shadow-amber-500/10">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chuỗi Streak Kỷ Luật</h4>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Theo dõi và nuôi dưỡng chuỗi ngày học tập liên tục, nhắc nhở bạn duy trì thói quen viết code và nghiên cứu mỗi ngày.
            </p>
          </div>

          <div className="futuristic-glass-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shadow-md shadow-emerald-500/10">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Phòng Thi Mô Phỏng SFIA</h4>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              5 Bài test định vị năng lực từ L0 đến L4 với ngân hàng câu hỏi trắc nghiệm lý thuyết đa tầng theo chuẩn SFIA (v8).
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION: BẢNG GIÁ & QUYỀN LỢI THÀNH VIÊN (#pricing-section)            */}
      {/* ========================================================================= */}
      <section id="pricing-section" className="space-y-8 scroll-mt-24">
        <div className="section-header-panel text-center space-y-3 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070d1e]/90 border border-amber-500/50 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-md backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Minh Bạch Về Quyền Lợi & Chi Phí</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide neon-glow-amber">
            Lựa Chọn Gói Học Tập <span className="text-amber-400">Phù Hợp Với Bạn</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto">
            Khởi đầu hoàn toàn miễn phí với trọn bộ giáo trình lý thuyết tĩnh, hoặc nâng cấp Pro VIP để mở khóa 2 AI trợ lực học tập và lộ trình cá nhân hóa riêng biệt.
          </p>

          {/* CHUYỂN ĐỔI CHU KỲ THANH TOÁN THÁNG / NĂM */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#0b1329]/90 border border-slate-700/80 w-fit mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Theo Tháng (99k/tháng)</span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Theo Năm (999k/năm)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-700 text-white font-black">
                Tiết kiệm 16%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full items-stretch">
          
          {/* THẺ FREE: THÀNH VIÊN TỰ HỌC (CHỈ THƯ VIỆN TÀI LIỆU LÝ THUYẾT TĨNH) */}
          <div className="futuristic-glass-card p-6 sm:p-10 rounded-3xl border border-slate-700/70 border-t-white/30 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700">
                    Thành Viên Tự Học (FREE)
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">Thư Viện Tài Liệu Mở</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-black text-white font-mono tracking-wider">FREE</span>
                  <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">0đ • Miễn phí trọn vẹn</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Gói đọc & tự tra cứu tài liệu tĩnh. Bạn tự nghiên cứu các chuyên đề lý thuyết toán học và tài liệu tham khảo theo chuẩn SFIA (v8).
              </p>

              {/* TÍNH NĂNG ĐƯỢC MỞ */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tài nguyên khả dụng:</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Kho giáo trình lý thuyết:</strong> Đọc toàn bộ 19 chuyên đề toán học và kiến thức AI chuẩn SFIA.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tài liệu tham khảo mở:</strong> Tra cứu các tài liệu học tập và bài đọc cộng đồng.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Đồng hồ tích lũy 1000h:</strong> Theo dõi thời gian tự học và duy trì Chuỗi Streak.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Bài test trắc nghiệm:</strong> Làm các bài kiểm tra trắc nghiệm lý thuyết cơ bản.</span>
                  </li>
                </ul>
              </div>

              {/* TÍNH NĂNG BỊ KHÓA (LOCKED) */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="text-xs font-bold text-rose-400/90 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tính năng bị giới hạn / khóa:</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2.5 opacity-75">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Không có AI hỗ trợ:</strong> Khóa hoàn toàn AI Mentor 1-on-1 và AI Helpdesk 24/7.</span>
                  </li>
                  <li className="flex items-start gap-2.5 opacity-75">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Không có lộ trình cá nhân hóa:</strong> Tự học tự chọn bài đọc, không có Sprint tối ưu riêng.</span>
                  </li>
                  <li className="flex items-start gap-2.5 opacity-75">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Khóa phân tích & giải thích sâu:</strong> Không có AI phân tích chuyên sâu các công thức khó.</span>
                  </li>
                  <li className="flex items-start gap-2.5 opacity-75">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Khóa chứng chỉ hoàn thành SFIA:</strong> Không cấp chứng nhận xác thực sau khi hoàn thành 1000h.</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="w-full py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md border border-slate-700 hover:border-sky-500/40 cursor-pointer"
            >
              Đăng Ký Tài Khoản Miễn Phí
            </button>
          </div>

          {/* THẺ PRO VIP: HỌC VIÊN PRO VIP (MỞ KHÓA TOÀN BỘ + 2 AI + LỘ TRÌNH CÁ NHÂN HÓA) */}
          <div className="futuristic-glass-panel p-6 sm:p-10 rounded-3xl border-2 border-sky-400/80 border-t-white/50 space-y-8 shadow-[0_20px_60px_rgba(56,189,248,0.25)] flex flex-col justify-between relative overflow-hidden">

            <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-sky-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
              <span>Đề Xuất Cho Học Viên Thực Thụ</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-500/40 flex items-center gap-1.5 w-fit shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Học Viên Pro VIP</span>
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">Đồng Hành & 2 AI Trợ Lực</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-black text-sky-400 font-mono neon-glow-cyan flex items-baseline justify-end gap-1">
                    <span>{billingCycle === 'monthly' ? '99.000đ' : '999.000đ'}</span>
                    <span className="text-xs text-sky-300 font-normal">{billingCycle === 'monthly' ? '/tháng' : '/năm'}</span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono mt-1 font-semibold whitespace-nowrap">
                    {billingCycle === 'monthly' ? 'hoặc 999.000đ/năm (tiết kiệm 16%)' : 'tiết kiệm 189.000đ so với gói tháng'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Mở khóa toàn diện mọi tính năng cao cấp: có <strong>2 AI hỗ trợ giải đáp & định hướng</strong>, sở hữu <strong>lộ trình cá nhân hóa riêng biệt</strong> giúp nắm vững giáo trình SFIA.
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-700/60">
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Mở khóa toàn bộ quyền lợi FREE & đặc quyền Pro:</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-emerald-300 font-medium">Bao gồm toàn bộ kho giáo trình lý thuyết và tài liệu mở của gói FREE.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong className="text-sky-300">AI Mentor 1-on-1:</strong> Chẩn đoán nền tảng toán học, may đo <strong>Lộ trình 4 Sprints độc bản</strong> cá nhân hóa theo năng lực riêng của bạn.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong className="text-sky-300">AI Helpdesk 24/7 trực tuyến:</strong> Trợ lý kèm học 24/7, giải đáp chi tiết mọi thắc mắc lý thuyết và công thức toán học ngay lập tức.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Phân tích chuyên sâu từng chuyên đề:</strong> AI hỗ trợ tóm tắt cốt lõi, giải thích trực quan các mô hình toán học phức tạp.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Chứng chỉ SFIA Verified:</strong> Cấp chứng chỉ số có mã xác thực định danh sau khi hoàn thành 1000h tự học và các bài test.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Giao diện Cybernetic Dark Pro:</strong> Không gian học tập hiện đại, tối giản, <strong>0% quảng cáo</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProCta}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-sky-500/30 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Nâng Cấp Pro VIP Ngay</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION: FAQ GIẢI ĐÁP CÂU HỎI THƯỜNG GẶP                                */}
      {/* ========================================================================= */}
      <FaqAccordionSection />

      {/* AUTH POPUP MODAL TỰ ĐỘNG */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          setShowAuthModal(false);
          window.dispatchEvent(new Event('aiia_auth_changed'));
        }}
      />

    </div>
  );
}
