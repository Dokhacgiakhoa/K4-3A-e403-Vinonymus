'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Code2, 
  BrainCircuit, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  HelpCircle,
  Copy,
  Check,
  Compass,
  Cpu,
  ShieldAlert
} from 'lucide-react';

interface NonTechPrimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartModule1?: () => void;
  onOpenLevel0?: () => void;
}

export function NonTechPrimerModal({ isOpen, onClose, onStartModule1, onOpenLevel0 }: NonTechPrimerModalProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'python' | 'math' | 'first_script' | 'roadmap'>('tools');
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedMap(prev => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#0a1128] border border-sky-500/40 p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-slate-100 space-y-6 animate-fadeIn">
        
        {/* ========================================================================= */}
        {/* 1. HEADER MODAL                                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-sky-500/25 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono uppercase">
                  Dành Riêng Cho Người Mới Bắt Đầu
                </span>
                <span className="text-xs text-slate-400 font-mono">Xuất Phát Điểm: L0</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-wide uppercase mt-0.5">
                Cẩm Nang Non-Tech: Từ L0 ➔ Kiến Trúc Sư AI
              </h2>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. 5 CHẶNG HỌC TẬP (NAV TABS)                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('tools')}
            className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'tools'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1. Cài Đặt Công Cụ</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'python'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>2. 5 Cú Pháp Python</span>
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'math'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>3. Toán AI Dễ Hiểu</span>
          </button>

          <button
            onClick={() => setActiveTab('first_script')}
            className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer text-center ${
              activeTab === 'first_script'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>4. Script Gọi AI Đầu Tiên</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer text-center col-span-2 sm:col-span-1 ${
              activeTab === 'roadmap'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5. Lộ Trình 4 Cấp Độ</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. NỘI DUNG TỪNG CHẶNG                                                   */}
        {/* ========================================================================= */}
        <div className="min-h-[300px] max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 space-y-4">
          
          {/* CHẶNG 1: CÀI ĐẶT CÔNG CỤ TỪ A-Z */}
          {activeTab === 'tools' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-200">
              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Tư Duy Người Mới: "Lập trình không phải là gõ mã mù quáng"</h4>
                  <p className="text-slate-300 mt-1">
                    Là một người Non-tech, bạn chỉ cần 3 công cụ duy nhất trên máy tính để bắt đầu làm chủ trí tuệ nhân tạo:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="font-bold text-sky-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono">1</span>
                    <span>Python 3.12</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Bộ thông dịch ngôn ngữ. Tải miễn phí tại <code>python.org</code>. Khi cài đặt trên Windows, <strong>bắt buộc tích chọn &quot;Add Python to PATH&quot;</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono">2</span>
                    <span>VS Code hoặc Cursor</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Trình soạn thảo mã nguồn miễn phí của Microsoft. Giúp bạn nhìn thấy màu sắc cú pháp, gợi ý lỗi và mở Terminal tích hợp.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono">3</span>
                    <span>Môi Trường Ảo (venv)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Một chiếc &quot;hộp bảo vệ cách ly&quot;. Giúp bạn cài các thư viện AI (openai, tiktoken) mà không làm ảnh hưởng hay xung đột với máy tính.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-300 font-bold text-[11px]">
                    3 Lệnh Terminal Đầu Tiên Bạn Cần Chạy:
                  </span>
                  <button
                    onClick={() => handleCopy("python -m venv .venv\n.venv\\Scripts\\activate\npip install openai tiktoken python-dotenv", 'cmd1')}
                    className="text-[10px] text-sky-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
                  >
                    {copiedMap['cmd1'] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMap['cmd1'] ? 'Đã chép' : 'Sao chép lệnh'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900/90 font-mono text-xs text-sky-300 overflow-x-auto">
{`# 1. Tạo môi trường ảo riêng biệt
python -m venv .venv

# 2. Kích hoạt môi trường (Windows PowerShell)
.venv\\Scripts\\activate
# (Nếu dùng Mac/Linux: source .venv/bin/activate)

# 3. Cài đặt các thư viện AI cốt lõi
pip install openai tiktoken python-dotenv httpx`}
                </pre>
              </div>
            </div>
          )}

          {/* CHẶNG 2: 5 CÚ PHÁP PYTHON CỐT LÕI */}
          {activeTab === 'python' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-200">
              <p className="text-slate-300">
                Để làm chủ AI, bạn không cần học toán rời rạc hay kiến trúc vi xử lý. Bạn chỉ cần nắm chắc <strong>5 cấu trúc Python cơ bản</strong> sau:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-sky-400">1. Biến & Chuỗi Ký Tự (Variables & Strings):</span>
                  <p className="text-slate-300 text-[11px]">Nơi lưu trữ câu hỏi của người dùng và phản hồi của mô hình AI.</p>
                  <pre className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-sky-200">
{`user_prompt = "Hãy giải thích RAG cho người không biết lập trình"
ai_model = "gpt-4o-mini"`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400">2. Danh Sách & Từ Điển (Lists & Dictionaries) - Cốt lõi của AI Chat:</span>
                  <p className="text-slate-300 text-[11px]">Tất cả các API AI (OpenAI, Claude, Gemini) đều giao tiếp bằng mảng các tin nhắn dạng từ điển:</p>
                  <pre className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-200">
{`messages = [
    {"role": "system", "content": "Bạn là chuyên gia tư vấn kiến trúc AI."},
    {"role": "user", "content": "RAG là gì?"}
]`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400">3. Hàm (Functions `def`) - Tái sử dụng logic:</span>
                  <p className="text-slate-300 text-[11px]">Đóng gói một chuỗi hành động để gọi lại nhiều lần với các câu hỏi khác nhau.</p>
                  <pre className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-amber-200">
{`def ask_ai(question: str) -> str:
    # Gửi câu hỏi đến AI và trả về kết quả
    return f"AI trả lời câu: {question}"`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-teal-400">4. Bắt Lỗi An Toàn (`try...except`) - Không để hệ thống bị sập:</span>
                  <p className="text-slate-300 text-[11px]">Mạng Internet hoặc API có thể gặp sự cố, code bắt buộc phải có khối dự phòng fallback.</p>
                  <pre className="p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-teal-200">
{`try:
    response = call_api()
except Exception as error:
    print("Mạng chập chờn, sử dụng câu trả lời dự phòng từ bộ nhớ cache")`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* CHẶNG 3: TOÁN AI DỄ HIỂU */}
          {activeTab === 'math' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-200">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <h4 className="text-sm font-bold text-amber-300">Xóa Tan Nỗi Sợ Toán Học: 3 Khái Niệm Cốt Lõi Được Giải Thích Bình Dân</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-sky-300 text-sm">1. Token Là Gì?</div>
                  <p className="text-slate-300 text-[11px]">
                    Mô hình AI <strong>không đọc chữ cái như con người</strong>. Nó cắt câu thành các mẩu lego nhỏ gọi là Token.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-sky-300 border border-slate-800">
                    &quot;Xin chào&quot; ➔ [4512, 8912] (2 Tokens)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Càng nhiều token thì chi phí trả cho OpenAI càng cao và cửa sổ bộ nhớ càng nhanh đầy.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-300 text-sm">2. Vector Embedding Là Gì?</div>
                  <p className="text-slate-300 text-[11px]">
                    Là <strong>tọa độ GPS của ý nghĩa ngữ nghĩa</strong>. Mỗi đoạn văn bản được chuyển thành một dãy 1536 con số thực.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-300 border border-slate-800">
                    &quot;Vua&quot; - &quot;Đàn ông&quot; + &quot;Phụ nữ&quot; ≈ &quot;Hoàng hậu&quot;
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Các câu có ý nghĩa giống nhau sẽ nằm gần nhau trong không gian vector.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="font-bold text-teal-300 text-sm">3. Cosine Similarity Là Gì?</div>
                  <p className="text-slate-300 text-[11px]">
                    Là <strong>thước đo góc giữa hai mũi tên vector</strong> để xem 2 câu giống nhau bao nhiêu phần trăm (từ 0.0 đến 1.0).
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] font-mono text-teal-300 border border-slate-800">
                    Điểm = 0.95 ➔ Trùng khớp ý nghĩa!
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Đây chính là bí mật giúp Google và Chatbot tìm đúng tài liệu trong hệ thống RAG!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CHẶNG 4: SCRIPT GỌI AI ĐẦU TIÊN */}
          {activeTab === 'first_script' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Chương Trình AI Python Hoàn Chỉnh Đầu Tiên Của Bạn</h4>
                  <p className="text-slate-400 text-[11px]">Chỉ 15 dòng lệnh, đọc khóa API từ file .env và in câu trả lời của AI</p>
                </div>
                <button
                  onClick={() => handleCopy(`import os
from dotenv import load_dotenv
from openai import OpenAI

# 1. Nạp API key từ file bí mật .env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 2. Gửi yêu cầu đến mô hình AI
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Bạn là chuyên gia cố vấn AI thực chiến."},
        {"role": "user", "content": "Xin chào! Hãy cho tôi biết bước đầu tiên học AI là gì?"}
    ],
    temperature=0.7
)

# 3. In câu trả lời ra màn hình
print(response.choices[0].message.content)`, 'script1')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                >
                  {copiedMap['script1'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMap['script1'] ? 'Đã Chép Code!' : 'Sao Chép File script.py'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
{`import os
from dotenv import load_dotenv
from openai import OpenAI

# 1. Nạp API key từ file bí mật .env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 2. Gửi yêu cầu đến mô hình AI
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Bạn là chuyên gia cố vấn AI thực chiến."},
        {"role": "user", "content": "Xin chào! Hãy cho tôi biết bước đầu tiên học AI là gì?"}
    ],
    temperature=0.7
)

# 3. In câu trả lời ra màn hình
print(response.choices[0].message.content)`}
              </pre>

              <div className="p-3.5 rounded-xl bg-[#060c1d] border border-slate-800 text-[11px] text-slate-300">
                <strong>Cách chạy:</strong> Mở Terminal trong thư mục chứa file, gõ lệnh <code>python script.py</code> và nhấn Enter!
              </div>
            </div>
          )}

          {/* CHẶNG 5: LỘ TRÌNH 4 CẤP ĐỘ SFIA */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-200">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Bản Đồ 4 Giai Đoạn Tiến Hóa Thành Kiến Trúc Sư AI (SFIA v8)
                </h4>
                <p className="text-slate-400 text-[11px]">Đi tuần tự từng bước từ L0 đến làm chủ hệ thống AI doanh nghiệp</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold shrink-0">L1</div>
                  <div>
                    <h5 className="font-bold text-sky-300">Giai đoạn 1: Nền Tảng & Lập Trình Python AI (Modules 1 - 3)</h5>
                    <p className="text-slate-300 text-[11px] mt-0.5">Xóa mù lập trình, cài môi trường, hiểu Tokenizer, xử lý chuỗi, đọc ghi file và gọi API an toàn.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">L2</div>
                  <div>
                    <h5 className="font-bold text-emerald-300">Giai đoạn 2: Prompt Engineering & Tự Động Hóa (Modules 4 - 6)</h5>
                    <p className="text-slate-300 text-[11px] mt-0.5">Xuất dữ liệu chuẩn JSON với Pydantic, xây dựng pipeline tự động hóa n8n và xây dựng REST API với FastAPI.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-mono font-bold shrink-0">L3</div>
                  <div>
                    <h5 className="font-bold text-teal-300">Giai đoạn 3: Kiến Trúc Doanh Nghiệp Hybrid RAG (Modules 7 - 9)</h5>
                    <p className="text-slate-300 text-[11px] mt-0.5">Cài đặt Vector DB Qdrant, thuật toán HNSW, chia nhỏ văn bản (Chunking), tìm kiếm kết hợp BM25 + Vector và Streaming Token SSE.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0">L4</div>
                  <div>
                    <h5 className="font-bold text-amber-300">Giai đoạn 4: Kiến Trúc Sư Multi-Agent & Fine-Tuning LoRA (Modules 10 - 12)</h5>
                    <p className="text-slate-300 text-[11px] mt-0.5">Hệ thống tác nhân tự động LangGraph, tự sửa lỗi code, tinh chỉnh mô hình mã nguồn mở LoRA và bảo mật dữ liệu cấp doanh nghiệp.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 4. NÚT ĐIỀU KHIỂN (TUÂN THỦ 100% AIIA_PROJECT_CONVENTIONS.md)             */}
        {/* ========================================================================= */}
        {/* Quy tắc: Xếp ngang hàng (flex-row), nút đóng đỏ chữ trắng ở ngoài cùng bên phải */}
        <div className="flex flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenLevel0) onOpenLevel0();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Học Giáo Án Level 0 (7 Chuyên Đề) →</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onStartModule1) onStartModule1();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Vào Module 01 (Level 1) →</span>
            </button>
          </div>

          {/* NÚT ĐÓNG BẮT BUỘC Ở BÊN PHẢI CÙNG NỀN ĐỎ CHỮ TRẮNG (Quy chuẩn bắt buộc) */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20 shrink-0 ml-auto"
          >
            <span>Đóng Cửa Sổ Cẩm Nang</span>
          </button>
        </div>

      </div>
    </div>
  );
}
