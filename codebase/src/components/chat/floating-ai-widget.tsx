'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ChatBox } from '@/components/chat/chat-box';

export function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && widgetRef.current) {
      gsap.fromTo(
        widgetRef.current,
        { opacity: 0, scale: 0.88, y: 35, transformOrigin: 'bottom right' },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power3.out' },
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (widgetRef.current) {
      gsap.to(widgetRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        // Giữ ChatBox luôn mount khi mở để lịch sử và luồng trả lời không mất giữa chừng.
        <div
          ref={widgetRef}
          className="w-[90vw] sm:w-[420px] h-[70vh] sm:h-[600px] rounded-3xl bg-[#0f172a]/95 backdrop-blur-2xl border border-sky-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.25)] overflow-hidden text-slate-100"
        >
          <ChatBox isMobileModal onCloseMobile={handleClose} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-tr from-sky-500 via-teal-400 to-emerald-400 text-slate-950 font-bold shadow-[0_10px_30px_rgba(56,189,248,0.4)] border border-sky-300/60 hover:scale-105 active:scale-95 transition-all duration-300"
          title="Mở AI Helpdesk"
        >
          <span className="absolute -inset-1.5 rounded-full bg-sky-400/40 widget-slow-pulse pointer-events-none"></span>

          <div className="w-8 h-8 rounded-full bg-slate-950 text-sky-400 flex items-center justify-center shadow-inner shrink-0 group-hover:rotate-12 transition-transform">
            <Bot className="w-4 h-4" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wide uppercase leading-none">AI Helpdesk</span>
            <span className="text-[9px] text-slate-900 font-bold font-mono">Hỏi về tài liệu & lộ trình</span>
          </div>

          <Sparkles className="w-4 h-4 text-slate-950 hidden sm:block" />
        </button>
      )}
    </div>
  );
}
