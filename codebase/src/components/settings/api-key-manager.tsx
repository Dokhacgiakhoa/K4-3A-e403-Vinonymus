'use client';

import React, { useState, useEffect } from 'react';
import { clientStorage, type StoredApiKeys } from '@/lib/client-storage';
import { Key, Check, Trash2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export function ApiKeyManager() {
  const [keys, setKeys] = useState<StoredApiKeys>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeys(clientStorage.getApiKeys());
  }, []);

  const handleChange = (provider: keyof StoredApiKeys, val: string) => {
    setKeys((prev) => ({ ...prev, [provider]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    clientStorage.setApiKeys(keys);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClear = () => {
    clientStorage.setApiKeys({});
    setKeys({});
  };

  const handleOpenExternal = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Cài đặt API Key (BYOK)</h2>
            <p className="text-xs text-slate-400">Nhập API Key cá nhân từ bất kỳ nhà cung cấp phổ biến nào dưới đây</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>API Key chỉ được lưu an toàn trong <strong>localStorage trình duyệt của bạn</strong> và không bao giờ lưu ở server.</span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* 1. Google Gemini */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              1. Google Gemini API Key (Miễn phí - Khuyên dùng)
            </label>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer external"
              onClick={(e) => {
                e.preventDefault();
                handleOpenExternal('https://aistudio.google.com/apikey');
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lấy key miễn phí <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="password"
            value={keys.gemini || ''}
            onChange={(e) => handleChange('gemini', e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* 2. OpenAI */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              2. OpenAI API Key (GPT-4o / GPT-4o-mini)
            </label>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer external"
              onClick={(e) => {
                e.preventDefault();
                handleOpenExternal('https://platform.openai.com/api-keys');
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lấy key OpenAI <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="password"
            value={keys.openai || ''}
            onChange={(e) => handleChange('openai', e.target.value)}
            placeholder="sk-proj-..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* 3. Anthropic Claude */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              3. Anthropic Claude API Key (Claude 3.5 Sonnet)
            </label>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer external"
              onClick={(e) => {
                e.preventDefault();
                handleOpenExternal('https://console.anthropic.com/settings/keys');
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lấy key Claude <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="password"
            value={keys.claude || ''}
            onChange={(e) => handleChange('claude', e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* 4. DeepSeek */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              4. DeepSeek API Key (DeepSeek-V3 / R1)
            </label>
            <a
              href="https://platform.deepseek.com/api_keys"
              target="_blank"
              rel="noopener noreferrer external"
              onClick={(e) => {
                e.preventDefault();
                handleOpenExternal('https://platform.deepseek.com/api_keys');
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lấy key DeepSeek <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="password"
            value={keys.deepseek || ''}
            onChange={(e) => handleChange('deepseek', e.target.value)}
            placeholder="sk-..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* 5. Groq */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              5. Groq API Key (Dự phòng tốc độ cao)
            </label>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer external"
              onClick={(e) => {
                e.preventDefault();
                handleOpenExternal('https://console.groq.com/keys');
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lấy key Groq <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="password"
            value={keys.groq || ''}
            onChange={(e) => handleChange('groq', e.target.value)}
            placeholder="gsk_..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/40">
            <Check className="w-4 h-4" />
            <span>Đã lưu danh sách API Key thành công!</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-rose-400 hover:underline font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả Key</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
