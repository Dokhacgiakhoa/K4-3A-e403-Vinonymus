'use client';

import { useState } from 'react';
import { 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  Target, 
  Layers, 
  ArrowRight,
  Database,
  Lock,
  FileCode2,
  XCircle,
  Briefcase,
  Code,
  Sparkles,
  Zap,
  HelpCircle,
  Workflow
} from 'lucide-react';

type TabAudience = 'nontech' | 'techbase' | 'aibase';

interface PainSolutionItem {
  num: string;
  problemTitle: string;
  problemDesc: string;
  solutionTitle: string;
  solutionDesc: string;
}

export function MissionPillarSection() {
  const [activeTab, setActiveTab] = useState<TabAudience>('nontech');

  // DATA NỖI ĐAU & GIẢI PHÁP THỰC TẾ CHO 3 NHÓM
  const audienceData: Record<TabAudience, {
    tabTitle: string;
    tabSub: string;
    icon: typeof Briefcase;
    badge: string;
    badgeColor: string;
    themeColor: string;
    targetDescription: string;
    items: PainSolutionItem[];
    consequenceText: string;
    resultText: string;
  }> = {
    nontech: {
      tabTitle: "Non-tech & Business",
      tabSub: "Trái ngành, Marketing, BA, Quản lý, Vận hành",
      icon: Briefcase,
      badge: "Dành Cho Người Dùng Phổ Thông & Khối Nghiệp Vụ",
      badgeColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
      themeColor: "from-amber-500/20 to-sky-500/20",
      targetDescription: "Người chưa từng học lập trình, cần ứng dụng AI để tăng năng suất công việc và tránh bị đào thải.",
      items: [
        {
          num: "01",
          problemTitle: "Ngợp Thuật Ngữ & Nỗi Sợ Toán / Code",
          problemDesc: "Nhìn thấy công thức toán hay code Python là thấy sợ, cứ lầm tưởng học AI là bắt buộc phải giỏi giải tích hay lập trình siêu đẳng.",
          solutionTitle: "Chuẩn Hóa AI Literacy Không Cần Code (SFIA L1 - L2)",
          solutionDesc: "Học tư duy ứng dụng AI trong đời thực, hiểu rõ bản chất AI làm được gì và không làm được gì qua các tình huống phi kỹ thuật."
        },
        {
          num: "02",
          problemTitle: "Dính Bẫy Khóa Học Cấp Tốc & Nỗi Sợ FOMO",
          problemDesc: "Bỏ tiền mua các khóa học 'mì ăn liền' trôi nổi chỉ dạy gõ vài câu prompt đơn giản, không áp dụng được vào quy trình làm việc thực tế.",
          solutionTitle: "Giáo Trình Tự Học Mở Chuẩn SFIA (v8)",
          solutionDesc: "Nội dung chuẩn mực quốc tế theo SFIA Foundation và Bloom's Taxonomy, học đúng bản chất thay vì chạy theo chiêu trò quảng cáo."
        },
        {
          num: "03",
          problemTitle: "Sợ Bị AI Thay Thế Nhưng Mất Phương Hướng",
          problemDesc: "Ý thức được AI là xu thế bắt buộc nhưng không biết bắt đầu từ đâu, không có thước đo xem năng lực của mình đang ở mức nào.",
          solutionTitle: "Khung Tự Đo Lường Năng Lực Chuẩn SFIA (v8)",
          solutionDesc: "Biết rõ bản thân đang ở L1 (Nhận biết & Tuân thủ) hay L2 (Hiểu sâu & Áp dụng nghiệp vụ) để có lộ trình nâng cấp tự tin."
        },
        {
          num: "04",
          problemTitle: "Bất Lực Khi AI Trả Lời Sai (Ảo Giác - Hallucination)",
          problemDesc: "Không biết cách kiểm chứng tính xác thực của câu trả lời, không biết cách ra đề bài (Context Prompting) để AI làm việc chính xác.",
          solutionTitle: "Kỹ Năng Ra Đề Bài Chuẩn & Kiểm Chứng Dữ Liệu",
          solutionDesc: "Làm chủ phương pháp cung cấp ngữ cảnh (Context-Window), Few-Shot Prompting và quy trình thẩm định dữ liệu an toàn."
        }
      ],
      consequenceText: "Hệ quả: Dễ lãng phí tiền bạc vào các khóa học bề nổi, loay hoay dùng thử mà không tối ưu được công việc.",
      resultText: "Kết quả: Tự tin làm chủ AI như một trợ thủ đắc lực trong mọi nghiệp vụ kinh doanh, quản lý và vận hành."
    },
    techbase: {
      tabTitle: "Tech-base (IT / Developers)",
      tabSub: "Lập trình viên Web, Mobile, Backend, Data Analysts",
      icon: Code,
      badge: "Dành Cho Dân Kỹ Thuật Chuyển Tiếp Sang AI",
      badgeColor: "text-sky-300 border-sky-500/40 bg-sky-500/10",
      themeColor: "from-sky-500/20 to-teal-500/20",
      targetDescription: "Đã có nền tảng lập trình phần mềm truyền thống, cần tích hợp tính năng AI vào hệ thống thực tế của công ty.",
      items: [
        {
          num: "01",
          problemTitle: "Bí Bách Khi Công Ty Yêu Cầu 'Nhúng AI Vào App'",
          problemDesc: "Quen làm CRUD/REST API thông thường, khi được giao dự án AI thì lúng túng không biết kết nối mô hình hay xử lý Streaming SSE ra sao.",
          solutionTitle: "Cầu Nối Kiến Trúc Async FastAPI SSE Thực Chiến",
          solutionDesc: "Cung cấp mẫu kiến trúc Backend bất đồng bộ (Asyncio), streaming phản hồi token-by-token chuẩn xác và chịu tải cao."
        },
        {
          num: "02",
          problemTitle: "Nỗi Sợ Chi Phí API Quá Đắt & Rò Rỉ Dữ Liệu",
          problemDesc: "Gọi API OpenAI/Gemini liên tục làm chi phí đội trần, đồng thời đối mặt rủi ro vi phạm bảo mật dữ liệu khách hàng của doanh nghiệp.",
          solutionTitle: "Giải Pháp Hybrid RAG & Vector Database Tối Ưu",
          solutionDesc: "Dựng Qdrant Vector DB + Sparse BM25 chạy local/cloud riêng tư, tối ưu chi phí và bảo toàn bí mật thông tin nội bộ."
        },
        {
          num: "03",
          problemTitle: "Lạc Giữa 'Rừng' Thư Viện & Framework Thay Đổi Liên Tục",
          problemDesc: "LangChain, LlamaIndex, ChromaDB... cập nhật phiên bản liên tục gây breaking changes, khiến dev bị 'bội thực' công cụ.",
          solutionTitle: "Nắm Vững Bản Chất Kiến Trúc Thay Vì Phụ Thuộc Tool",
          solutionDesc: "Học sâu nguyên lý Vector Similarity, Reciprocal Rank Fusion (RRF) và StateGraph Multi-Agent (LangGraph) độc lập nền tảng."
        },
        {
          num: "04",
          problemTitle: "Chưa Có Môi Trường Thực Hành Bài Toán Enterprise",
          problemDesc: "Thiếu các bài toán thực tế về Data Pipeline xử lý tài liệu lớn, phân tách chunking thông minh và xây dựng Agent tự hành.",
          solutionTitle: "13 Bài Lab Thực Hành Tuần Tự (Day 16 — Day 28)",
          solutionDesc: "Lộ trình thực chiến từ dựng Cloud AI, Data Lakehouse đến ghép nối thành Enterprise AI Platform hoàn chỉnh."
        }
      ],
      consequenceText: "Hệ quả: Kẹt ở tư duy lập trình CRUD cũ, mất thời gian tự mày mò các thư viện rời rạc mà không ra được sản phẩm.",
      resultText: "Kết quả: Nâng cấp thành kỹ sư làm chủ giải pháp AI trong sản phẩm phần mềm, nâng cao giá trị nghề nghiệp vượt trội."
    },
    aibase: {
      tabTitle: "AI-base (Tự Học Sâu / Chuyển Ngành)",
      tabSub: "Người tự nghiên cứu, AI Practitioner, Chuyển ngành",
      icon: Cpu,
      badge: "Dành Cho Người Tự Học Chuyên Sâu & Định Vị Quốc Tế",
      badgeColor: "text-purple-300 border-purple-500/40 bg-purple-500/10",
      themeColor: "from-purple-500/20 to-indigo-500/20",
      targetDescription: "Không theo học đại học AI chính quy, tự nghiên cứu mô hình sâu và cần thước đo năng lực đạt chuẩn quốc tế.",
      items: [
        {
          num: "01",
          problemTitle: "Thiếu Hạ Tầng GPU Production Để Thực Hành",
          problemDesc: "Chỉ chạy được các bài tập nhỏ trên Google Colab miễn phí, chưa từng có cơ hội triển khai cụm vLLM Serving hay Continuous Batching.",
          solutionTitle: "Giáo Trình Hạ Tầng Enterprise & Tối Ưu GPU VRAM",
          solutionDesc: "Hướng dẫn chi tiết kiến trúc vLLM PagedAttention, Tensor Parallelism và kỹ thuật tinh chỉnh PEFT / LoRA 4-bit trên 1 GPU."
        },
        {
          num: "02",
          problemTitle: "Tự Ti Vì Không Có Bằng Đại Học Chuyên Ngành AI",
          problemDesc: "Tự học rất nhiều nhưng không có bằng cấp chính quy, không biết trình độ thực tế của mình đang ở đâu so với tiêu chuẩn toàn cầu.",
          solutionTitle: "Định Vị Năng Lực Chuẩn Quốc Tế SFIA (v8)",
          solutionDesc: "Lộ trình cá nhân hóa từ con số 0 gắn liền đề lab; kết hợp khung tham chiếu SFIA (v8) đối chiếu năng lực dài hạn tại doanh nghiệp."
        },
        {
          num: "03",
          problemTitle: "Thiếu Phương Pháp Đo Lường & An Toàn AI (Guardrails)",
          problemDesc: "Xây dựng mô hình xong không biết đo lường độ chính xác (Faithfulness, Relevance) hay thiết lập hàng rào phòng vệ AI.",
          solutionTitle: "Bộ Công Thức RAG Triad (Ragas) & Chuẩn ISO 42001",
          solutionDesc: "Cung cấp công thức toán học và quy trình audit chất lượng AI, chống Prompt Injection và quản trị rủi ro AI chuyên nghiệp."
        },
        {
          num: "04",
          problemTitle: "Rủi Ro Vi Phạm Bản Quyền & Cam Kết Bảo Mật (NDA)",
          problemDesc: "Khó tìm kiếm ngân hàng đề thi mô phỏng chất lượng mà không dính rủi ro sao chép đề thi nội bộ của các tổ chức đào tạo.",
          solutionTitle: "100% Mock Practice Học Thuật Độc Lập Từ Nguồn Mở",
          solutionDesc: "Toàn bộ bài tập và câu hỏi trắc nghiệm là mô phỏng học thuật độc lập từ Stanford CS224N, DeepLearning.AI, an toàn tuyệt đối."
        }
      ],
      consequenceText: "Hệ quả: Mông lung về trình độ thực tế, thiếu kinh nghiệm hạ tầng triển khai mô hình lớn ngoài môi trường thử nghiệm.",
      resultText: "Kết quả: Nắm vững kiến thức nền tảng và kỹ năng thực hành đạt chuẩn Level 4, tự tin tiếp cận các dự án thực tế trong doanh nghiệp."
    }
  };

  const currentData = audienceData[activeTab];

  return (
    <section className="space-y-8 font-sans">
      
      {/* SECTION HEADER IN FROSTED GLASS CARD */}
      <div className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-3 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-semibold shadow-sm uppercase tracking-wider backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Tự Học Đúng Nhu Cầu & Đúng Nỗi Đau Thực Tế</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide uppercase text-shadow-clean">
          Bạn Thuộc Nhóm Người Tự Học AI Nào?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
          Nền tảng được thiết kế chuyên biệt cho <strong>người không học chuyên ngành AI chính quy</strong>, giải quyết trúng đích từng nỗi đau thực tế theo Khung năng lực quốc tế SFIA (v8).
        </p>
      </div>

      {/* 3-TAB INTERACTIVE SHEET SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
        {(['nontech', 'techbase', 'aibase'] as TabAudience[]).map((tabKey) => {
          const tab = audienceData[tabKey];
          const TabIcon = tab.icon;
          const isActive = activeTab === tabKey;

          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 text-left backdrop-blur-xl shadow-lg relative overflow-hidden group ${
                isActive
                  ? 'bg-[#131e3a]/90 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50 -translate-y-1'
                  : 'bg-[#0f172a]/60 border-slate-700/60 hover:border-slate-500 hover:bg-[#0f172a]/80 text-slate-400'
              }`}
            >
              {/* Left Color Accent Bar */}
              <div className={`w-1.5 absolute left-0 top-0 bottom-0 transition-colors ${
                isActive ? 'bg-sky-400' : 'bg-transparent group-hover:bg-slate-600'
              }`} />

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                isActive 
                  ? 'bg-[#0b1329] border-sky-400 text-sky-300 shadow-md' 
                  : 'bg-[#070d1e] border-slate-700 text-slate-400'
              }`}>
                <TabIcon className="w-5 h-5" />
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wider truncate ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}>
                    {tab.tabTitle}
                  </h4>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0"></span>
                  )}
                </div>
                <p className={`text-[11px] truncate font-normal ${
                  isActive ? 'text-sky-300/90' : 'text-slate-400'
                }`}>
                  {tab.tabSub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* FIXED-HEIGHT TAB CONTENT CONTAINER (PREVENTS JUMP / LAYOUT SHIFT) */}
      <div className="relative min-h-[620px] rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-6 flex flex-col justify-between">
        
        {/* Active Tab Header Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${currentData.badgeColor}`}>
                {currentData.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal pt-0.5">
              {currentData.targetDescription}
            </p>
          </div>
          <div className="text-[11px] font-mono text-sky-400 shrink-0 self-start sm:self-auto bg-[#0b1329]/80 px-3 py-1.5 rounded-xl border border-slate-800">
            Khung Tham Chiếu: SFIA (v8) & Bloom
          </div>
        </div>

        {/* 2-COLUMN SIDE-BY-SIDE: NỖI ĐAU VS GIẢI PHÁP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* CỘT TRÁI: 4 NỖI ĐAU THỰC TẾ */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1c0e18]/80 via-[#160c18]/70 to-[#0b1329]/80 border border-rose-500/30 p-5 sm:p-6 space-y-4 shadow-lg backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold uppercase backdrop-blur-md">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Nỗi Đau Thực Tế Của Nhóm Này</span>
                </div>
                <span className="text-[11px] font-mono text-rose-400/80 hidden sm:inline-block">The Bottlenecks</span>
              </div>

              <div className="space-y-3">
                {currentData.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#0b1329]/75 border border-rose-500/25 hover:border-rose-400/60 backdrop-blur-md transition-all space-y-1.5 shadow-sm group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {item.num}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight group-hover:text-rose-300 transition-colors">
                          {item.problemTitle}
                        </h5>
                      </div>
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal pl-7">
                      {item.problemDesc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-[11px] text-rose-200 font-medium flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0"></span>
              <span>{currentData.consequenceText}</span>
            </div>
          </div>

          {/* CỘT PHẢI: 4 GIẢI PHÁP TRÚNG ĐÍCH TỪ K.AI LABS */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c1e28]/80 via-[#091a26]/70 to-[#0b1329]/80 border border-emerald-500/30 p-5 sm:p-6 space-y-4 shadow-lg backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Giải Pháp Trúng Đích Từ K.AI Labs</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/80 hidden sm:inline-block">The Solution</span>
              </div>

              <div className="space-y-3">
                {currentData.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#0b1329]/75 border border-emerald-500/25 hover:border-emerald-400/60 backdrop-blur-md transition-all space-y-1.5 shadow-sm group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.num}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight group-hover:text-emerald-300 transition-colors">
                          {item.solutionTitle}
                        </h5>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal pl-7">
                      {item.solutionDesc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200 font-medium flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span>{currentData.resultText}</span>
            </div>
          </div>

        </div>

        {/* BOTTOM CALLOUT */}
        <div className="pt-2 text-center text-[11px] font-mono text-sky-300/80 flex items-center justify-center gap-2">
          <span>— TỰ HỌC ĐÚNG NHU CẦU • ĐỊNH VỊ CHUẨN SFIA (v8) • AN TOÀN TUYỆT ĐỐI NDA —</span>
        </div>

      </div>

    </section>
  );
}
