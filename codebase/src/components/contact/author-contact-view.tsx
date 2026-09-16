'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Send, 
  Sparkles, 
  Award, 
  Code2, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Globe, 
  ExternalLink,
  MessageSquare,
  Flame,
  FileText
} from 'lucide-react';

export function AuthorContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 800);
  };

  return (
    <div className="space-y-10 animate-fadeIn font-sans">
      
      {/* AUTHOR HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl banner-3d-hero p-6 sm:p-10 shadow-2xl border border-sky-500/30">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar / Profile Image */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-sky-400/60 shadow-2xl bg-[#0f172a] p-1 shadow-sky-500/20">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-950 flex items-center justify-center text-sky-400 font-bold text-3xl">
                <img 
                  src="/aiia-logo.png?v=4" 
                  alt="Đỗ Khắc Gia Khoa" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase font-mono shadow-md border border-emerald-300">
              Active Author
            </div>
          </div>

          {/* Author Bio & Info */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1329]/80 border border-sky-500/40 text-sky-300 text-xs font-medium uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Founder & Lead AI Architect</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase leading-tight text-shadow-clean">
              Đỗ Khắc Gia Khoa
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl">
              Kỹ sư Trí tuệ Nhân tạo & Kiến trúc sư Phần mềm. Sáng lập dự án <strong>AI in Action</strong> và chuỗi nghiên cứu <strong>1000 Hours Human Learning with AI</strong> nhằm chuẩn hóa khung năng lực quốc tế SFIA 8 cho cộng đồng AI Việt Nam.
            </p>

            {/* Quick Links / Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://github.com/Dokhacgiakhoa"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b1329]/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition shadow-sm"
              >
                <Github className="w-4 h-4 text-sky-400" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://github.com/Dokhacgiakhoa/AI-thuc-chien"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b1329]/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition shadow-sm"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Mã Nguồn Dự Án</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* TWO COLUMNS: EXPERTISE & DIRECT CONTACT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Vision, Principles & Tech Stack (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Vision Card */}
          <div className="p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Sứ Mệnh Cốt Lõi</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Định hình một nền tảng tri thức học thuật mở, bài bản, nghiêm ngặt về toán học gốc rễ và chuẩn hóa thực chiến cho thế hệ kỹ sư AI tiếp theo tại Việt Nam.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>Chuẩn hóa SFIA 8 (Level 1 $\to$ Level 7)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Tuân thủ 100% bảo mật thông tin & quy chuẩn NDA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Nền tảng tự học chuẩn hóa vì cộng đồng</span>
              </div>
            </div>
          </div>

          {/* Core Competencies */}
          <div className="p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Lĩnh Vực Chuyên Môn</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "LLM Architecture", 
                "Transformer Attention", 
                "Hybrid RAG & Qdrant", 
                "Agentic AI (LangGraph)", 
                "PEFT & LoRA Fine-tuning", 
                "vLLM Serving Engine", 
                "FastAPI Async Backend",
                "Next.js 15 App Router",
                "System Design Enterprise C4"
              ].map((skill, sIdx) => (
                <span 
                  key={sIdx}
                  className="px-3 py-1 rounded-xl bg-[#0b1329] border border-slate-800 text-xs font-mono text-sky-300 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Direct Contact Message Form (7/12) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 shadow-xl backdrop-blur-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <span>Gửi Tin Nhắn / Đề Xuất Hợp Tác</span>
            </h3>
            <p className="text-xs text-slate-300 font-normal">
              Bạn có câu hỏi, đề xuất đóng góp bài giảng hoặc muốn trao đổi về kiến trúc AI? Hãy gửi tin nhắn trực tiếp qua biểu mẫu bên dưới.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Họ và Tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full px-4 py-2.5 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Email Liên Hệ</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="engineer@ai-thuc-chien.vn"
                  required
                  className="w-full px-4 py-2.5 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Chủ Đề Trao Đổi</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Góp ý giáo trình / Hợp tác nghiên cứu AI / Hỏi đáp kỹ thuật"
                required
                className="w-full px-4 py-2.5 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Nội Dung Tin Nhắn</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Nhập chi tiết nội dung bạn muốn gửi tới tác giả..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-[#0b1329] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang gửi tin nhắn...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi Tin Nhắn Ngay</span>
                </>
              )}
            </button>
          </form>

          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Cảm ơn bạn! Tin nhắn đã được gửi thành công đến tác giả Đỗ Khắc Gia Khoa.</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
