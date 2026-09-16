'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  BrainCircuit, 
  Sparkles, 
  Target, 
  Terminal, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Award,
  Zap,
  RotateCcw,
  Bot,
  Flame,
  Clock,
  Compass,
  Code
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { AIMentorWizard } from '@/components/learning/ai-mentor-wizard';
import { SFIA_COMMUNITY_DATA } from '@/data/sfia-community-data';

export function ProCockpitDashboardView() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [showMentorWizard, setShowMentorWizard] = useState<boolean>(false);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(clientStorage.getUser());
    };
    syncUser();
    window.addEventListener('aiia_auth_changed', syncUser);
    return () => window.removeEventListener('aiia_auth_changed', syncUser);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* AI MENTOR MODAL */}
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

      {/* 1. EXECUTIVE COCKPIT HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#0b1329] to-indigo-500/20 border border-amber-500/50 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-0.5 shadow-xl shadow-amber-500/20 shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0b1329] flex items-center justify-center text-amber-400 text-2xl sm:text-3xl font-bold font-mono">
                👑
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentUser?.name || 'Học Viên Pro VIP'}
                </h1>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40 shadow-sm flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>EXECUTIVE PRO COCKPIT</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200">
                Không gian học tập chuyên sâu dành riêng cho Học viên Kỹ Sư AI Thực Chiến • Quyền lợi Pro Vĩnh Viễn.
              </p>
            </div>
          </div>

          {/* AI MENTOR TRIGGER */}
          <button
            onClick={() => setShowMentorWizard(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>Kích Hoạt AI Mentor 1-on-1 →</span>
          </button>

        </div>

        {/* 4 PRO STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-[#070d1e]/90 border border-amber-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">PRO VIP</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Gói Pro Đang Kích Hoạt</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#070d1e]/90 border border-emerald-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>5 Ngày</span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Chuỗi Streak Cao Thủ</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#070d1e]/90 border border-teal-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-teal-400 font-mono">12/12 LABs</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Toàn Quyền Thực Hành</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#070d1e]/90 border border-sky-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-sky-400 font-mono">1-on-1</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Cố Vấn AI Tùy Biến</div>
          </div>
        </div>
      </div>

      {/* 2. PRO AI MENTOR COMMAND CENTER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-sky-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                Lộ Trình 4 Sprints Độc Bản Của Bạn
              </h2>
              <p className="text-xs text-slate-300">
                Được AI Mentor cá nhân hóa dựa trên thẩm định năng lực thực tế
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMentorWizard(true)}
            className="px-4 py-2 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 text-sky-300 text-xs font-semibold transition"
          >
            Tái Thiết Lập Lộ Trình ↺
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { sprint: 'Sprint 1', title: 'Python Foundation & Strict Grounding', tag: 'Level 1', desc: 'Làm chủ BPE Tokenizer, Context Window và XML System Prompting' },
            { sprint: 'Sprint 2', title: 'Pydantic Pipelines & FastAPI SSE', tag: 'Level 2', desc: 'Xây dựng Backend AI Streaming và Structured Outputs không lỗi' },
            { sprint: 'Sprint 3', title: 'Hybrid RAG & Qdrant Dense+Sparse', tag: 'Level 3', desc: 'Tích hợp Semantic Chunking, pgvector và Fusion RRF tối ưu' },
            { sprint: 'Sprint 4', title: 'Multi-Agent LangGraph & LoRA PEFT', tag: 'Level 4', desc: 'Điều phối đa tác nhân, State Checkpoint và Tinh chỉnh mô hình' },
          ].map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                  {s.sprint}
                </span>
                <span className="text-[11px] text-sky-400 font-mono font-semibold">{s.tag}</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              <div className="pt-2">
                <Link
                  href="/learning"
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                >
                  <span>Mở Bài Thực Hành →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PRO HANDS-ON LABS & CODE REPOSITORIES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <span>Ngân Hàng 12 Đề Lab Thực Chiến & Codebase Chuyên Sâu</span>
            </h2>
            <p className="text-xs text-slate-300">
              Toàn quyền truy cập mã nguồn Python, Docker Compose và Script chấm điểm tự động
            </p>
          </div>
          <Link
            href="/learning"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition"
          >
            Xem Tất Cả 12 LABs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">LAB-01 ➔ LAB-03</div>
            <div className="text-sm font-bold text-white">Foundation & Prompt Architecture</div>
            <p className="text-xs text-slate-400">Token budget calculator, XML boundary sanitizer, CoT pipeline.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-sky-400 font-bold">LAB-04 ➔ LAB-06</div>
            <div className="text-sm font-bold text-white">FastAPI SSE & Qdrant HNSW</div>
            <p className="text-xs text-slate-400">Streaming client-side, NumPy cosine math, Vector index tuning.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-purple-400 font-bold">LAB-07 ➔ LAB-12</div>
            <div className="text-sm font-bold text-white">LangGraph & vLLM High-Throughput</div>
            <p className="text-xs text-slate-400">Multi-agent orchestrator, RRF hybrid ranking, LoRA adapter.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
