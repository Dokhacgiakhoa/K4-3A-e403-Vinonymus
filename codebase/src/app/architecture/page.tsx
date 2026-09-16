'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Server, 
  Database, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Code2, 
  Zap, 
  CheckCircle2, 
  Boxes, 
  Network,
  Share2,
  FileCode,
  Workflow
} from 'lucide-react';

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CORE' | 'AI_SERVICE' | 'DATABASE'>('OVERVIEW');

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500/15 via-[#0b1329] to-indigo-500/15 border border-sky-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase font-mono border border-sky-500/30">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Enterprise Systems Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kiến Trúc Kỹ Thuật Hệ Sinh Thái AI in Action
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Mô hình phân tầng chuẩn mực: <strong>.NET 10 Clean Architecture</strong> làm Core hạt nhân, 
              kết hợp <strong>Python FastAPI Microservice</strong> cho tác vụ AI suy luận chuyên sâu, 
              <strong>Next.js 15 PWA</strong> tối ưu trải nghiệm người dùng và <strong>PostgreSQL + Qdrant</strong> lưu trữ đa chiều.
            </p>
          </div>

          <div className="px-5 py-4 rounded-2xl bg-[#070d1e]/90 border border-slate-800 text-center shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Chuẩn Kiến Trúc</div>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">CLEAN ARCH</div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5">Scale 20,000 Users</div>
          </div>
        </div>
      </div>

      {/* 2. ARCHITECTURE NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tổng Quan 4 Phân Tầng</span>
        </button>

        <button
          onClick={() => setActiveTab('CORE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
            activeTab === 'CORE'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>.NET 10 Core (Hạt Nhân)</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_SERVICE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
            activeTab === 'AI_SERVICE'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Python AI Microservice</span>
        </button>

        <button
          onClick={() => setActiveTab('DATABASE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
            activeTab === 'DATABASE'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & Vector Engine</span>
        </button>
      </div>

      {/* 3. TAB 1: OVERVIEW 4 TIERS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* TIER 1: FRONTEND */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-sky-500/30 space-y-4 hover:border-sky-500/60 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold">
                FE
              </div>
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">Phân Tầng 1</span>
                <h3 className="text-lg font-bold text-white">Frontend Client (PWA)</h3>
                <p className="text-xs text-slate-400 mt-1">Next.js 15, React 19, Tailwind CSS, GSAP</p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 Khung giao diện tách biệt</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Interactive Gamification Quiz</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Focus Mode toàn màn hình</span>
                </li>
              </ul>
            </div>

            {/* TIER 2: BACKEND CORE */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-emerald-500/30 space-y-4 hover:border-emerald-500/60 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                CORE
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Phân Tầng 2 (Gốc)</span>
                <h3 className="text-lg font-bold text-white">Backend Core (.NET 10)</h3>
                <p className="text-xs text-slate-400 mt-1">Clean Architecture, CQRS, MediatR</p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AIIANotebook.Domain (Entities)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AIIANotebook.Application (CQRS)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AIIANotebook.Infrastructure (EF Core)</span>
                </li>
              </ul>
            </div>

            {/* TIER 3: AI MICROSERVICE */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-purple-500/30 space-y-4 hover:border-purple-500/60 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                AI
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Phân Tầng 3</span>
                <h3 className="text-lg font-bold text-white">AI Microservice (Python)</h3>
                <p className="text-xs text-slate-400 mt-1">FastAPI, LangGraph, vLLM, Qdrant</p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Hybrid RAG (Dense + Sparse RRF)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-Agent LangGraph Workflow</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Thẩm định CV & Test xác thực</span>
                </li>
              </ul>
            </div>

            {/* TIER 4: DATABASE */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-amber-500/30 space-y-4 hover:border-amber-500/60 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                DB
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Phân Tầng 4</span>
                <h3 className="text-lg font-bold text-white">Database & Vector Storage</h3>
                <p className="text-xs text-slate-400 mt-1">PostgreSQL 16, pgvector, Redis Cache</p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3NF Relational Schema</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>HNSW Vector Indexing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Audit Logs & VietQR Transactions</span>
                </li>
              </ul>
            </div>

          </div>

          {/* DATA FLOW SUMMARY */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Workflow className="w-5 h-5 text-sky-400" />
              <span>Luồng Điều Phối Dữ Liệu Thực Tế (Execution Flow)</span>
            </h3>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <div>[Client PWA] ──(HTTP/REST)──► [.NET 10 WebAPI Core] ──► [PostgreSQL (Users/Transactions)]</div>
              <div className="pl-32">│</div>
              <div className="pl-32">└──(gRPC/Internal SSE)──► [Python AI Microservice] ──► [Qdrant HNSW Vector DB]</div>
              <div className="pl-96">│</div>
              <div className="pl-96">└──► [vLLM / Multi-Agent Router]</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: .NET 10 CORE */}
      {activeTab === 'CORE' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Kiến Trúc Backend Core .NET 10 (Clean Architecture)
            </h3>
            <p className="text-xs text-slate-400">
              Định vị làm gốc (Anchor) cho toàn bộ hệ thống enterprise, bảo đảm tính độc lập, khả năng test và scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">1. AIIANotebook.Domain</div>
              <div className="text-slate-300">Tầng cốt lõi không phụ thuộc bất kỳ thư viện ngoài nào. Chứa Entities (AppUser, CurriculumSubject, ExamSubmission), Enums (UserTier, SFIACompetencyLevel), ValueObjects.</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-sky-400 font-bold">2. AIIANotebook.Application</div>
              <div className="text-slate-300">Triển khai mẫu CQRS với MediatR. Xử lý Commands (RegisterUser, SubmitExam) và Queries (GetCurriculumByLevel), Data Transfer Objects (DTOs), Interfaces.</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-amber-400 font-bold">3. AIIANotebook.Infrastructure</div>
              <div className="text-slate-300">Entity Framework Core 10 với Npgsql kết nối PostgreSQL. Triển khai Repositories, JWT Token Provider, AES-256 Key Encryption, Email & VietQR Webhook.</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold">4. AIIANotebook.WebAPI</div>
              <div className="text-slate-300">Cổng REST API chính. Định cấu hình Middleware xác thực JWT, Rate Limiting, CORS, Swagger OpenAPI 3.1, Health Checks và gRPC Bridge.</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: PYTHON AI MICROSERVICE */}
      {activeTab === 'AI_SERVICE' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Python AI Microservice (FastAPI & Agentic Engine)
            </h3>
            <p className="text-xs text-slate-400">
              Chuyên trách toàn bộ các tác vụ xử lý ngôn ngữ tự nhiên, nhúng vector và điều phối đa tác nhân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-sky-400 font-bold font-mono">Hybrid RAG Engine</div>
              <p className="text-slate-300 leading-relaxed">Kết hợp Sparse BM25 và Dense Embedding (BGE-M3 1024-dim), áp dụng Reciprocal Rank Fusion (RRF) để đạt độ chính xác truy xuất cao nhất.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold font-mono">LangGraph Multi-Agent</div>
              <p className="text-slate-300 leading-relaxed">Đồ thị trạng thái gồm 3 chuyên gia: Router Agent, Diagnostic Tester Agent và Pedagogical Mentor Agent xây lộ trình 4 Sprints.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold font-mono">CV Ingestion & OCR</div>
              <p className="text-slate-300 leading-relaxed">Phân tích hồ sơ CV dạng PDF hoặc ảnh, trích xuất thực thể kỹ năng, đưa vào trạng thái 'Chờ kiểm chứng' để kích hoạt bài test chẩn đoán.</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: DATABASE & VECTOR STORAGE */}
      {activeTab === 'DATABASE' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Database & Vector Indexing
            </h3>
            <p className="text-xs text-slate-400">
              Đảm bảo toàn vẹn dữ liệu quan hệ kết hợp tốc độ truy vấn vector triệu chiều dưới 10ms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-amber-400 font-bold font-mono">PostgreSQL 16 (Relational DB)</div>
              <ul className="text-slate-300 space-y-1">
                <li>• Bảng <code>users</code>, <code>roles</code>, <code>tiers</code> chuẩn 3NF.</li>
                <li>• Bảng <code>vietqr_transactions</code> lưu vết hóa đơn nâng cấp Pro VIP.</li>
                <li>• Row-Level Security (RLS) bảo vệ dữ liệu người dùng tuyệt đối.</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold font-mono">Qdrant / pgvector (Vector Engine)</div>
              <ul className="text-slate-300 space-y-1">
                <li>• HNSW Index với m=16, ef_construct=100.</li>
                <li>• Cosine distance đo độ tương đồng ngữ nghĩa giáo trình SFIA.</li>
                <li>• Payload filters theo Cấp độ SFIA (L1 - L4) và Chủ đề kỹ thuật.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
