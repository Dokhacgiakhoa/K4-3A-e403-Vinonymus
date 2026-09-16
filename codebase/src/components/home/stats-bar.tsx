'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';

export function StatsBar() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    gsap.fromTo(
      statsRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: 'power3.out' }
    );
  }, []);

  return (
    <div 
      ref={statsRef}
      className="relative z-10 mt-8 p-4 sm:p-5 rounded-2xl bg-[#0b1329]/75 backdrop-blur-xl border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center md:text-left">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono">TỪ L0 ➔ L4</div>
          <div className="text-[10px] sm:text-xs text-slate-300 font-normal">Giáo Trình & Lab Thực Hành</div>
        </div>
        <div className="border-l border-slate-700 pl-6 sm:pl-10">
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">99.2%</div>
          <div className="text-[10px] sm:text-xs text-slate-300 font-normal">Độ Chuẩn Lý Thuyết</div>
        </div>
        <div className="border-l border-slate-700 pl-6 sm:pl-10">
          <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">24/7</div>
          <div className="text-[10px] sm:text-xs text-slate-300 font-normal">Trợ Lý AI RAG</div>
        </div>
      </div>

      <Link
        href="/learning"
        className="w-full md:w-auto px-7 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
      >
        <span>Khám Phá Giáo Trình Ngay</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
