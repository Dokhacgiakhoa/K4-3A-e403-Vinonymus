'use client';

import Link from 'next/link';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  currentTitle: string;
  parentHref?: string;
  parentTitle?: string;
}

export function BackButton({ 
  currentTitle, 
  parentHref = '/', 
  parentTitle = 'Trang Chủ' 
}: BackButtonProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 px-4 rounded-2xl bg-[#0f172a]/80 border border-slate-700/60 backdrop-blur-xl mb-6 shadow-md">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link 
          href="/" 
          className="flex items-center gap-1 hover:text-sky-300 transition text-slate-300"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{parentTitle}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-sky-400 font-semibold">{currentTitle}</span>
      </div>

      {/* Back Button Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="px-3 py-1.5 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
          <span>Quay Lại</span>
        </button>
        <Link
          href="/"
          className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <span>Về Trang Chủ</span>
        </Link>
      </div>

    </div>
  );
}
