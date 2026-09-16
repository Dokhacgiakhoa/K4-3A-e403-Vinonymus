'use client';

import React from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface NeedKeyPromptProps {
  onOpenSettings?: () => void;
}

export function NeedKeyPrompt({ onOpenSettings }: NeedKeyPromptProps) {
  return (
    <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-5 my-3 shadow-lg space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40 mt-0.5">
          <Key className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-100 text-base">Cần API Key để sử dụng tính năng tra cứu AI sâu</h4>
          <p className="text-sm text-slate-300">
            Câu hỏi này cần tra cứu sâu trong tài liệu chương trình. Vui lòng nhập API Key miễn phí của bạn để tiếp tục.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
        <p className="font-medium text-cyan-300">🔑 Lấy API Key Gemini miễn phí (chỉ mất ~2 phút):</p>
        <ol className="list-decimal list-inside space-y-1 text-slate-400">
          <li>Truy cập Google AI Studio: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">aistudio.google.com/apikey <ExternalLink className="w-3 h-3" /></a></li>
          <li>Đăng nhập bằng tài khoản Google bất kỳ và bấm <strong>Create API Key</strong>.</li>
          <li>Copy key và dán vào phần <strong>Cài đặt API Key</strong> trong ứng dụng.</li>
        </ol>
      </div>

      {onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow"
        >
          <Key className="w-4 h-4" />
          <span>Nhập API Key ngay</span>
        </button>
      )}
    </div>
  );
}
