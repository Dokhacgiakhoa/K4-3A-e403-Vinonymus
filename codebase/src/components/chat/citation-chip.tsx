'use client';

import React from 'react';
import type { CitationItem } from '@/types/chat';

interface CitationChipProps {
  index: number;
  citation: CitationItem;
  onClick: (citation: CitationItem) => void;
}

export function CitationChip({ index, citation, onClick }: CitationChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(citation)}
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 transition-colors"
      title={`${citation.documentTitle} ${citation.headingPath ? `(${citation.headingPath})` : ''}`}
    >
      <span>[{index + 1}]</span>
      <span className="max-w-[120px] truncate">{citation.documentTitle}</span>
    </button>
  );
}
