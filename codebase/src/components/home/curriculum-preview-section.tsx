'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export function CurriculumPreviewSection() {
  const modules = [
    { num: 1, title: "Toán Học Transformer & Attention", tag: "Deep Math", desc: "Đại số ma trận, Cosine similarity, Scaled Dot-Product Attention và Vanishing Gradient." },
    { num: 2, title: "Async Backend & FastAPI SSE", tag: "High-Throughput", desc: "Non-blocking I/O, Asyncio concurrent calls, Pydantic v2 và Server-Sent Events." },
    { num: 3, title: "Vector DB & Hybrid Search RRF", tag: "Vector & Search", desc: "Chỉ mục HNSW, Qdrant payload filtering, Sparse BM25 và Reciprocal Rank Fusion." },
    { num: 4, title: "Agentic AI & LangGraph", tag: "Autonomous Agents", desc: "Vòng lặp ReAct, Function/Tool calling và State Management dạng đồ thị có hướng." },
    { num: 5, title: "PEFT / LoRA Fine-Tuning", tag: "GPU Optimization", desc: "Phân rã ma trận hạng thấp, lượng tử hóa QLoRA 4-bit và huấn luyện trên 1 GPU." },
    { num: 6, title: "Hạ Tầng vLLM PagedAttention", tag: "Serving Engines", desc: "Continuous Batching, Tensor Parallelism và quản lý KV Cache không phân mảnh." }
  ];

  return (
    <section className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
      
      {/* HEADER WITH TRANSLUCENT CONTRAST BACKDROP */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-mono font-medium uppercase tracking-wider backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Curriculum Roadmap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 uppercase tracking-wide text-shadow-clean">
            7 Chuyên Đề Tự Học Kỹ Thuật Chuyên Sâu
          </h2>
          <p className="text-xs text-slate-300 font-normal">
            Giáo trình tự học mở từ toán học gốc rễ đến triển khai hạ tầng phục vụ mô hình lớn
          </p>
        </div>
        
        <Link
          href="/learning"
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md hover:shadow-sky-500/25 transition-all flex items-center gap-1.5 self-start md:self-auto group uppercase tracking-wider"
        >
          <span>Xem Toàn Bộ Giáo Trình & Code Mẫu</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* MODULES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((item) => (
          <Link 
            key={item.num}
            href="/learning"
            className="p-5 rounded-2xl bg-[#0b1329]/75 border border-slate-700/60 hover:border-sky-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#070d1e]/80 text-sky-300 font-mono text-xs font-semibold border border-slate-700 group-hover:border-sky-500/50 transition-colors">
                Chuyên Đề 0{item.num}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-medium">{item.tag}</span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors uppercase tracking-wider">
              {item.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

    </section>
  );
}
