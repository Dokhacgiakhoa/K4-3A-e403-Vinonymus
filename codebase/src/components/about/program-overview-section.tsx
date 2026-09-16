'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Target, 
  CheckCircle2, 
  Code2, 
  Users, 
  Layers,
  FileText,
  GraduationCap,
  CalendarCheck,
  Send,
  HelpCircle,
  TrendingUp,
  LineChart,
  Briefcase,
  Clock,
  Check,
  Zap,
  Building2,
  Medal,
  Lock,
  Compass,
  FileCheck,
  Globe2,
  Flame,
  BookmarkCheck
} from 'lucide-react';

export function ProgramOverviewSection() {
  const [activeStageTab, setActiveStageTab] = useState<number>(0);

  // 1. 4 NGUYÊN TẮC CỐT LÕI CỦA NỀN TẢNG TỰ HỌC
  const selfLearningPrinciples = [
    {
      icon: BookOpen,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      title: "GIÁO TRÌNH TỰ HỌC MỞ (OPEN CURRICULUM)",
      desc: "Nền tảng được xây dựng phục vụ cộng đồng tự nghiên cứu, tự rèn luyện kỹ năng từ tư duy sản phẩm, toán học gốc rễ đến kiến trúc hệ thống AI hiện đại mà không phụ thuộc vào bất kỳ khóa học đóng phí nào."
    },
    {
      icon: ShieldCheck,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      title: "TUYỆT ĐỐI KHÔNG VI PHẠM BẢO MẬT (NDA-COMPLIANT)",
      desc: "Vì là tài liệu tự học và nghiên cứu độc lập, 100% kiến thức, code mẫu và đề thi đều được tổng hợp từ nguồn mở quốc tế (Stanford, DeepLearning.AI, HuggingFace), không trích xuất tài liệu nội bộ."
    },
    {
      icon: Globe2,
      color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
      title: "CHUẨN NĂNG LỰC QUỐC TẾ SFIA (v8) & BLOOM",
      desc: "Giáo trình và lab tập trung từ L0 đến L4; kết hợp ma trận SFIA (v8) 7 cấp độ và Bloom's Taxonomy để người học đo lường và định vị năng lực dài hạn."
    },
    {
      icon: Terminal,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      title: "THỰC HÀNH LAB KỸ THUẬT PRODUCTION THẬT",
      desc: "Kết hợp lý thuyết với 13 bài lab thực chiến: Dựng môi trường Cloud, Lakehouse, Qdrant Vector Store, vLLM Model Serving và Security Gateway sẵn sàng chạy trong môi trường doanh nghiệp."
    }
  ];

  // 2. BỐI CẢNH THAM CHIẾU: MÔ HÌNH ĐÀO TẠO THỰC TẾ
  const programStages = [
    {
      stage: "GIAI ĐOẠN 1 (03 TUẦN)",
      name: "NỀN TẢNG TOÀN DIỆN",
      time: "Tuần 01 - Tuần 03",
      location: "Trường Đại học VinUni",
      summary: "Xây dựng nền tảng tư duy và kỹ năng AI toàn diện qua 3 trụ cột kỹ thuật:",
      pillars: [
        { name: "AI Business & Product", desc: "Tư duy sản phẩm AI, bài toán kinh doanh, kiểm chứng giả định và phân tích nhu cầu." },
        { name: "AI Infrastructure & Data", desc: "Hạ tầng tính toán đám mây, data pipeline, lakehouse và lưu trữ vector." },
        { name: "AI Application", desc: "Ứng dụng mô hình ngôn ngữ lớn, prompt engineering và xây dựng MVP." }
      ]
    },
    {
      stage: "GIAI ĐOẠN 2 (03 TUẦN)",
      name: "CHUYÊN SÂU THEO ĐỊNH HƯỚNG",
      time: "Tuần 04 - Tuần 06",
      location: "Trường Đại học VinUni",
      summary: "Đào sâu kỹ thuật chuyên sâu theo 3 nhánh định hướng phát triển nghề nghiệp:",
      pillars: [
        { name: "Định hướng AI Business & Product", desc: "Thiết kế giải pháp AI cấp doanh nghiệp, chiến lược triển khai và tối ưu ROI." },
        { name: "Định hướng AI Infrastructure & Data", desc: "Kiến trúc vLLM Serving, tối ưu hóa GPU, PagedAttention và Distributed Systems." },
        { name: "Định hướng AI Application", desc: "Agentic AI LangGraph, Hybrid RAG Qdrant, LoRA Fine-tuning và Multi-Modal AI." }
      ]
    },
    {
      stage: "GIAI ĐOẠN 3 (06 TUẦN)",
      name: "THỰC CHIẾN TẠI DOANH NGHIỆP",
      time: "Tuần 07 - Tuần 12",
      location: "Doanh nghiệp đối tác & Hệ sinh thái Vingroup",
      summary: "Áp dụng toàn bộ kiến thức vào giải quyết bài toán AI thực tế tại doanh nghiệp:",
      pillars: [
        { name: "Môi trường Production thực tế", desc: "Làm việc theo quy trình, kỷ luật kỹ thuật và hạ tầng thật của doanh nghiệp." },
        { name: "Dự án AI cấp doanh nghiệp", desc: "Trực tiếp giải quyết bài toán thực tế dưới sự kèm cặp của Quản lý dự án AI." },
        { name: "Hoàn thiện năng lực chuyên nghiệp", desc: "Rèn luyện tư duy giải quyết vấn đề, tinh thần trách nhiệm và đạo đức nghề nghiệp AI." }
      ]
    }
  ];

  // 3. 7 CẤP ĐỘ NĂNG LỰC CHUẨN SFIA (v8) & BLOOM'S TAXONOMY
  const sfiaLevels = [
    {
      level: "L1",
      name: "NHẬN BIẾT",
      bloom: "Remember",
      desc: "Sử dụng Prompt Template có sẵn, làm quen với các công cụ Generative AI và vận hành tác vụ cơ bản.",
      action: "Sử dụng Prompt Template có sẵn",
      scope: "Có Giáo Trình & Lab Thực Hành",
      color: "border-sky-500/40 bg-[#0b1329]/75 text-sky-300"
    },
    {
      level: "L2",
      name: "HIỂU",
      bloom: "Understand",
      desc: "Hỗ trợ gán nhãn dữ liệu, hiểu nguyên lý LLM và tạo Chatbot/Prompt pipeline cơ bản.",
      action: "Hỗ trợ gán nhãn và tạo Chatbot cơ bản",
      scope: "Có Giáo Trình & Lab Thực Hành",
      color: "border-teal-500/40 bg-[#0b1329]/75 text-teal-300"
    },
    {
      level: "L3",
      name: "ÁP DỤNG",
      bloom: "Apply",
      desc: "Tự chủ xây dựng MVP, tích hợp Hybrid RAG (Qdrant Vector DB), backend bất đồng bộ FastAPI SSE.",
      action: "Xây dựng MVP & AI pipeline cơ bản",
      scope: "Có Giáo Trình & Lab Thực Hành",
      color: "border-emerald-500/40 bg-[#0b1329]/75 text-emerald-300"
    },
    {
      level: "L4",
      name: "PHÂN TÍCH",
      bloom: "Analyze",
      desc: "Đồng hành xây dựng hệ thống AI Agent phức tạp, tối ưu hóa RAG đa chiều và xây dựng tập dữ liệu huấn luyện.",
      action: "Đồng hành xây dựng AI Agent complex, RAG, dataset",
      scope: "Có Giáo Trình & Lab Thực Hành",
      color: "border-indigo-500/40 bg-[#0b1329]/75 text-indigo-300"
    },
    {
      level: "L5",
      name: "ĐÁNH GIÁ",
      bloom: "Evaluate",
      desc: "Tư vấn thiết kế & triển khai Agentic AI, fine-tuning mô hình với LoRA/QLoRA và triển khai vLLM serving.",
      action: "Tư vấn thiết kế & triển khai Agentic AI",
      scope: "Khung Tham Chiếu Doanh Nghiệp",
      color: "border-purple-500/40 bg-[#0b1329]/75 text-purple-300"
    },
    {
      level: "L6",
      name: "TẠO MỚI",
      bloom: "Create",
      desc: "Nghiên cứu kiến trúc Framework AI mới, tối ưu hóa quy mô và thiết kế hệ thống Enterprise C4.",
      action: "Framework AI & Tối ưu hóa quy mô",
      scope: "Khung Tham Chiếu Doanh Nghiệp",
      color: "border-pink-500/40 bg-[#0b1329]/75 text-pink-300"
    },
    {
      level: "L7",
      name: "CHIẾN LƯỢC",
      bloom: "Set Strategy",
      desc: "Định hướng tầm nhìn công nghệ AI, hoạch định chiến lược và xây dựng tiêu chuẩn AI toàn diện (ISO 42001).",
      action: "Định hướng tầm nhìn & Tiêu chuẩn AI toàn diện",
      scope: "Khung Tham Chiếu Doanh Nghiệp",
      color: "border-amber-500/40 bg-[#0b1329]/75 text-amber-300"
    }
  ];

  // 4. LỘ TRÌNH 5 BƯỚC TỰ HỌC AI CHUẨN QUỐC TẾ
  const selfStudyRoadmap = [
    {
      step: "01",
      title: "ĐỊNH VỊ NĂNG LỰC SFIA (v8)",
      desc: "Đối chiếu năng lực hiện tại của bản thân với khung tham chiếu SFIA (v8) để xác định điểm xuất phát từ L0 và lộ trình thực hành.",
      details: ["Bắt đầu từ nền tảng L0", "Nắm vững kỹ năng thực hành L1 - L4", "Định hướng phát triển dài hạn L5 - L7"]
    },
    {
      step: "02",
      title: "LÀM CHỦ TOÁN GỐC & CƠ CHẾ AI",
      desc: "Học sâu bản chất toán học: Scaled Dot-Product Attention, Cosine Similarity, Cross-Entropy Loss và ma trận phân rã LoRA.",
      details: ["Đọc tài liệu lý thuyết Chuyên đề 01 - 07", "Nắm vững công thức KaTeX toán học", "Thực thi code mẫu Python/PyTorch"]
    },
    {
      step: "03",
      title: "THỰC HÀNH LAB HẠ TẦNG & DỮ LIỆU",
      desc: "Thiết lập môi trường local sạch (Python, Docker, venv), dựng Cloud AI, xây dựng Data Pipeline, Lakehouse và Qdrant Vector DB.",
      details: ["Làm theo Checklist Local & Day 16 Cloud", "Thực hành Async FastAPI Streaming", "Tối ưu hóa HNSW Vector Search"]
    },
    {
      step: "04",
      title: "LUYỆN TẬP ĐỀ THI MÔ PHỎNG (MOCK)",
      desc: "Kiểm tra kiến thức qua các bài thi mô phỏng học thuật độc lập (100% Mock Practice) có chấm điểm tự động và giải thích chi tiết.",
      details: ["Làm bài thi trắc nghiệm L1-L4", "Rà soát lỗ hổng kiến thức", "Tuân thủ 100% quy chuẩn NDA học thuật"]
    },
    {
      step: "05",
      title: "XÂY DỰNG ENTERPRISE PORTFOLIO",
      desc: "Ghép nối toàn bộ kiến thức vào Day 28: Hợp nhất thành một Enterprise AI Platform hoàn chỉnh để phục vụ công việc và portfolio cá nhân.",
      details: ["Xây dựng Multi-Agent LangGraph", "Triển khai vLLM Serving & Observability", "Đóng góp mã nguồn mở cho cộng đồng"]
    }
  ];

  return (
    <div className="space-y-16 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: NỀN TẢNG GIÁO TRÌNH TỰ HỌC MỞ QUỐC TẾ                    */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-sky-500/30">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Giáo Trình Tự Học Mở • 1000 Hours Human Learning with AI</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#0f172a]/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono backdrop-blur-md">
            Chuẩn Quốc Tế SFIA (v8) & Bloom's Taxonomy
          </span>
        </div>

        {/* Banner Title & Slogan */}
        <div className="mt-4 space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-wide uppercase leading-tight text-shadow-clean">
            Giáo Trình Tự Học AI Từ L0 <br />
            <span className="text-sky-400 font-bold">
              Chuẩn Quốc Tế SFIA (v8)
            </span>
          </h1>

          <div className="p-4 rounded-2xl bg-[#0b1329]/80 border border-slate-700/70 backdrop-blur-md shadow-lg">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Nền tảng giáo trình tự học mở phục vụ cộng đồng <strong>tự học, tự nghiên cứu và định vị năng lực AI từ L0 (cho cả 3 nhóm: Non-tech, Tech-base và AI-base)</strong>. Hệ thống tập trung giáo trình thực hành từ Level 0 đến Level 4, kết hợp khung tham chiếu mở rộng SFIA (v8) L5-L7, <strong>hoàn toàn độc lập và tuyệt đối tuân thủ cam kết bảo mật (NDA)</strong>.
            </p>
          </div>
        </div>

        {/* 4 Summary Metrics in Frosted Glass */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-[#0b1329]/75 border border-sky-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-sky-400 font-mono">1000 GIỜ</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Tự Học & Nghiên Cứu Mở</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1329]/75 border border-emerald-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">TỪ L0 ➔ L4</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Giáo Trình & Lab Thực Hành</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1329]/75 border border-teal-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-teal-400 font-mono">3 ĐỐI TƯỢNG</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Non-tech • Tech • AI</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1329]/75 border border-amber-500/30 backdrop-blur-md shadow-md text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">100% MOCK</div>
            <div className="text-xs text-slate-300 mt-0.5 font-medium">Tuân Thủ Tuyệt Đối NDA</div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. 4 NGUYÊN TẮC CỐT LÕI CỦA GIÁO TRÌNH TỰ HỌC                           */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-3 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span>Phương Pháp Luận Tự Học</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-wide text-shadow-clean">
            4 Giá Trị Cốt Lõi Của Nền Tảng Tự Học
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Cam kết mang lại tri thức kỹ thuật chuẩn mực, minh bạch về bản quyền và an toàn tuyệt đối về pháp lý
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selfLearningPrinciples.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-[#0f172a]/75 border border-slate-700/60 hover:border-sky-400 transition-all duration-300 shadow-xl backdrop-blur-2xl space-y-4 group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0b1329] border border-slate-700 group-hover:border-sky-500/60 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <IconComponent className={`w-6 h-6 ${item.color.split(' ')[0]}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-sky-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-sky-400 font-mono font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Chuẩn tri thức mở quốc tế</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BỐI CẢNH THAM CHIẾU: CHƯƠNG TRÌNH ĐÀO TẠO AI IN ACTION                 */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-700/60 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Bối Cảnh Tham Chiếu Thực Tế</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-wide text-shadow-clean">
              Về Chương Trình Đào Tạo AI in Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Chương trình đào tạo nhân tài AI thực chiến (đồng hành bởi Trường Đại học VinUni và Tập đoàn Vingroup) là hình mẫu đào tạo 12 tuần với 3 giai đoạn rõ rệt, truyền cảm hứng cho cấu trúc giáo trình tự học của nền tảng này.
            </p>
          </div>

          {/* 3 Stage Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#070d1e]/80 border border-slate-800 shrink-0 backdrop-blur-md">
            {programStages.map((stg, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setActiveStageTab(sIdx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${
                  activeStageTab === sIdx
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Giai đoạn {sIdx + 1} ({stg.time})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Stage Detail Card */}
        {(() => {
          const currentStage = programStages[activeStageTab] ?? programStages[0]!;
          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1329]/75 border border-slate-700/60 space-y-6 shadow-inner backdrop-blur-md animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                    {currentStage.stage}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mt-2">
                    {currentStage.name}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{currentStage.time} • {currentStage.location}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {currentStage.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {currentStage.pillars.map((pil, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-2xl bg-[#070d1e]/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wide">
                      <Target className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{pil.name}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </div>

      {/* ========================================================================= */}
      {/* 4. 07 MỨC NĂNG LỰC AI THEO CHUẨN QUỐC TẾ SFIA (v8)                       */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-3 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Khung Tham Chiếu Năng Lực Quốc Tế SFIA (v8)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-wide text-shadow-clean">
            Khung Năng Lực AI: Từ Nhận Biết Đến Chiến Lược
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Hệ thống đối chiếu 7 cấp độ trách nhiệm theo chuẩn quốc tế SFIA (v8). Nền tảng cung cấp <strong>giáo trình & lab thực hành từ Level 0 đến Level 4</strong>; các cấp độ L5 - L7 là <strong>khung tham chiếu năng lực mở rộng</strong> cho môi trường dự án thực tế tại doanh nghiệp.
          </p>
        </div>

        {/* 7 Levels Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sfiaLevels.map((item, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-2xl border ${item.color} backdrop-blur-xl space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#070d1e] font-mono text-xs font-bold border border-slate-700">
                    {item.level}
                  </span>
                  <span className="text-[10px] uppercase font-mono font-medium tracking-wider text-slate-400">
                    Bloom: {item.bloom}
                  </span>
                </div>

                <div className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300 inline-block">
                  {item.scope}
                </div>

                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {item.name} ({item.bloom})
                </h3>

                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-medium text-sky-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>{item.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. LỘ TRÌNH 5 BƯỚC TỰ HỌC AI TỪ L0 CHUẨN QUỐC TẾ                         */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Phương Pháp Học Tập Độc Lập</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-wide text-shadow-clean">
            Lộ Trình 5 Bước Tự Học AI Từ L0
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Quy trình tự rèn luyện từ L0 đến L4: làm chủ toán học & code mẫu, thực hành lab hạ tầng và kiểm thử mô phỏng độc lập
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {selfStudyRoadmap.map((step, sIdx) => (
            <div 
              key={sIdx}
              className="p-5 rounded-2xl bg-[#0b1329]/75 border border-slate-700/60 hover:border-sky-400 backdrop-blur-md transition-all duration-300 space-y-3 shadow-md hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-500/40 text-sky-400 font-mono font-bold text-base flex items-center justify-center shadow-md">
                  {step.step}
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <ul className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-300 font-normal">
                {step.details.map((d, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Callout: Tuyên Bố Tự Học & Link Sang Learning */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1329]/80 border border-sky-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/50 text-sky-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-slate-200 leading-relaxed">
              <strong className="text-sky-300 font-semibold">Tự Học Nghiêm Túc & Bền Vững: </strong>
              Khám phá trọn bộ 7 chuyên đề lý thuyết gốc rễ (Toán Attention, Qdrant Vector DB, LangGraph Multi-Agent, LoRA PEFT, vLLM Serving) và 13 bài lab thực chiến hoàn toàn miễn phí.
            </div>
          </div>

          <Link
            href="/learning"
            className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition whitespace-nowrap uppercase tracking-wider shrink-0"
          >
            <span>Khám Phá Giáo Trình Ngay →</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
