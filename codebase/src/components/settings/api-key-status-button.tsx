'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientStorage, type ApiKeyHealthStatus } from '@/lib/client-storage';
import { Key, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ApiKeyStatusButtonProps {
  onOpenSettings?: () => void;
}

export function ApiKeyStatusButton({ onOpenSettings }: ApiKeyStatusButtonProps) {
  const [status, setStatus] = useState<ApiKeyHealthStatus>('missing');

  const updateStatus = () => {
    setStatus(clientStorage.getApiKeyHealthStatus());
  };

  useEffect(() => {
    updateStatus();

    const handleCustomEvent = () => updateStatus();
    window.addEventListener('aiia_key_status_changed', handleCustomEvent);
    window.addEventListener('storage', handleCustomEvent);

    return () => {
      window.removeEventListener('aiia_key_status_changed', handleCustomEvent);
      window.removeEventListener('storage', handleCustomEvent);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (onOpenSettings) {
      e.preventDefault();
      onOpenSettings();
    }
  };

  if (status === 'missing') {
    return (
      <Link
        href="/settings"
        onClick={handleClick}
        title="Chưa cài đặt API Key nào — Nhấp để cài đặt"
        className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/40 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
        <Key className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Cài đặt Key</span>
      </Link>
    );
  }

  if (status === 'error') {
    return (
      <Link
        href="/settings"
        onClick={handleClick}
        title="API Key bị lỗi hoặc không hợp lệ — Nhấp để kiểm tra lại"
        className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/50 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
        <span className="hidden sm:inline">Cài đặt Key (Lỗi)</span>
      </Link>
    );
  }

  // status === 'ok'
  return (
    <Link
      href="/settings"
      onClick={handleClick}
      title="API Key đang hoạt động tốt"
      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span className="hidden sm:inline">Cài đặt Key</span>
    </Link>
  );
}
