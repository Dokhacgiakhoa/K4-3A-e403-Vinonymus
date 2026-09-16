'use client';

import { SFIA_COMMUNITY_DATA } from '@/data/sfia-community-data';
import { Layers, Zap, Database, Cpu, Server, ShieldAlert, GitMerge } from 'lucide-react';

export function TechStackView() {
  const techCategories = SFIA_COMMUNITY_DATA.techStack;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'database': return <Database className="w-5 h-5 text-cyan-400" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'server': return <Server className="w-5 h-5 text-emerald-400" />;
      default: return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#131d3b] to-slate-900 border border-cyan-500/30 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-semibold">
            Enterprise AI Architecture
          </span>
          <span className="px-3 py-1 rounded-full bg-sky-950/80 border border-sky-700/60 text-sky-300 text-xs font-bold">
            Production Scale
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Hệ Sinh Thái Công Nghệ & Bản Thiết Kế Kiến Trúc AI Enterprise
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
          4 nhóm công nghệ trụ cột cấu thành nên một hệ thống Trí tuệ Nhân tạo cấp độ Doanh nghiệp và sơ đồ kiến trúc End-to-End Enterprise Agentic RAG Pipeline.
        </p>
      </div>

      {/* 4 Core Technology Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techCategories.map((cat, idx) => (
          <div key={idx} className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                {getIcon(cat.icon)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{cat.category}</h3>
                <p className="text-xs text-slate-400">{cat.description}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {cat.technologies.map((tech, tIdx) => (
                <div key={tIdx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-cyan-300">{tech.name}</div>
                    <p className="text-xs text-slate-300 mt-0.5">{tech.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                    {tech.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Agentic RAG Architecture Blueprint */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Sơ Đồ Kiến Trúc Hệ Thống: Enterprise Agentic RAG Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Luồng xử lý toàn diện từ Client Request, Guardrails, Multi-Agent Supervisor đến Vector Database và SSE Token Streaming.
          </p>
        </div>

        {/* Visual Workflow Blocks */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-3">
          <div className="min-w-[650px] space-y-3">
            
            <div className="flex items-center gap-4">
              <div className="w-32 py-2 px-3 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800 text-center font-bold">
                [Client App]
              </div>
              <span className="text-slate-500">──( HTTPS / SSE Stream )──►</span>
              <div className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                <strong>FastAPI API Gateway</strong> • Asyncio Non-blocking Event Loop
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 py-2 px-3 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 text-center font-bold">
                [Guardrails]
              </div>
              <span className="text-slate-500">──( Policy Check )────────►</span>
              <div className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                <strong>NeMo Guardrails & RBAC</strong> • Prompt Injection Shield + PII Redaction
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 py-2 px-3 rounded-lg bg-violet-950/80 text-violet-300 border border-violet-800 text-center font-bold">
                [Agent Router]
              </div>
              <span className="text-slate-500">──( State Graph )─────────►</span>
              <div className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                <strong>LangGraph Supervisor</strong> • Function / Tool Calling Dispatcher
              </div>
            </div>

            <div className="flex items-center gap-4 pl-12">
              <span className="text-slate-500">├──►</span>
              <div className="flex-1 py-2 px-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-200">
                <strong>Hybrid RAG Node</strong>: Qdrant Dense (HNSW) + BM25 Sparse + Cohere Re-ranker
              </div>
            </div>

            <div className="flex items-center gap-4 pl-12">
              <span className="text-slate-500">└──►</span>
              <div className="flex-1 py-2 px-3 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-200">
                <strong>SQL DB Agent Node</strong>: Dynamic Text-to-SQL + Schema Filtering
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 py-2 px-3 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-center font-bold">
                [Inference]
              </div>
              <span className="text-slate-500">──( Token Streaming )─────►</span>
              <div className="flex-1 py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                <strong>vLLM Cluster / Claude 3.7</strong> • Continuous Batching & Realtime Stream
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
