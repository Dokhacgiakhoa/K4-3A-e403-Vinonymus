'use client';

import React from 'react';
import type { CitationItem } from '@/types/chat';
import { X, BookOpen } from 'lucide-react';

interface CitationPanelProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export function CitationPanel({ citation, onClose }: CitationPanelProps) {
  if (!citation) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 z-50 overflow-y-auto shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Nguồn trích dẫn</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-medium">Tên tài liệu</h4>
            <p className="text-base font-medium text-slate-100 mt-0.5">{citation.documentTitle}</p>
          </div>

          {citation.headingPath && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-medium">Mục</h4>
              <p className="text-sm text-cyan-300 mt-0.5">{citation.headingPath}</p>
            </div>
          )}

          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1.5">Nội dung trích đoạn</h4>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
              {citation.content}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
        Dữ liệu tri thức chương trình AI in Action (AIIA)
      </div>
    </div>
  );
}
