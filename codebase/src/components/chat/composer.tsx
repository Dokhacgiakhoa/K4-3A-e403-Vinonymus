'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Square } from 'lucide-react';

interface ComposerProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
}

export function Composer({ onSend, onStop, isStreaming }: ComposerProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isStreaming) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Chỉ chấp nhận văn bản thuần (plain text), chặn dán tập tin/ảnh
    const pastedText = e.clipboardData.getData('text/plain');
    if (!pastedText && e.clipboardData.files.length > 0) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    // Chặn hoàn toàn việc kéo thả file/ảnh vào ô nhập liệu
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-3 shadow-xl focus-within:border-cyan-600 transition-colors">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        placeholder="Nhập câu hỏi bằng văn bản (text)..."
        rows={1}
        maxLength={2000}
        disabled={isStreaming}
        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base resize-none focus:outline-none px-2 py-1 max-h-[180px] overflow-y-auto"
      />

      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-colors shrink-0 shadow flex items-center justify-center"
          title="Dừng sinh câu trả lời"
        >
          <Square className="w-4 h-4 fill-white" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white transition-colors shrink-0 shadow flex items-center justify-center"
          title="Gửi câu hỏi (Enter)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
