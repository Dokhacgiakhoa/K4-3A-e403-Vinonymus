'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';

export function NewsletterCtaSection() {
  const [emailInput, setEmailInput] = useState<string>('');
  const [contactSent, setContactSent] = useState<boolean>(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setEmailInput('');
      setContactSent(false);
    }, 4000);
  };

  return (
    <section className="rounded-3xl bg-[#0f172a]/80 border border-slate-700/80 p-8 sm:p-12 text-center space-y-6 shadow-xl backdrop-blur-xl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#0b1329] text-sky-400 border border-slate-700 flex items-center justify-center mx-auto shadow-md">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
          Tham Gia Cùng Cộng Đồng Kỹ Sư AI Thực Chiến
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          Nhận bản tin kỹ thuật chuyên sâu về các mô hình mới nhất (Claude 3.7, DeepSeek R1), bài tập thực hành và tài liệu nghiên cứu toán học hàng tuần.
        </p>
      </div>

      <form onSubmit={handleContactSubmit} className="max-w-md mx-auto flex items-center gap-2">
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Nhập email của bạn..."
          className="flex-1 px-4 py-3 bg-[#0b1329] border border-slate-700 rounded-full text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 shadow-inner font-normal"
          required
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0 uppercase tracking-wider"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Đăng Ký</span>
        </button>
      </form>

      {contactSent && (
        <div className="p-3 rounded-xl bg-[#0b1329] border border-sky-500 text-sky-300 text-xs font-medium max-w-md mx-auto animate-fadeIn shadow-md">
          ✓ Cảm ơn bạn! Chúng tôi đã ghi nhận và sẽ gửi bản tin kỹ thuật sớm nhất!
        </div>
      )}
    </section>
  );
}
