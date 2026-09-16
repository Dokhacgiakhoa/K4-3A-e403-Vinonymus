'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone } from 'lucide-react';

interface PwaShortcutButtonProps {
  variant?: 'header' | 'guidebook' | 'compact';
}

export function PwaShortcutButton({ variant = 'header' }: PwaShortcutButtonProps) {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/?tab=shortcut');
  };

  return (
    <button
      onClick={handleButtonClick}
      title="Tạo phím tắt Sổ tay ra màn hình chính"
      className={`transition-all ${
        variant === 'compact'
          ? 'flex flex-col items-center justify-center gap-1 w-full py-1 rounded-xl transition-all duration-200 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          : variant === 'guidebook'
          ? 'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 rounded-xl font-medium shadow-sm'
          : 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 hover:text-white font-semibold rounded-xl shadow-sm'
      }`}
    >
      <Smartphone className={variant === 'compact' ? 'w-4.5 h-4.5 shrink-0' : 'w-3.5 h-3.5 text-cyan-400 shrink-0'} />
      <span className={variant === 'compact' ? 'text-[10px] tracking-tight' : ''}>Phím tắt</span>
    </button>
  );
}
