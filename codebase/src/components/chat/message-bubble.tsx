'use client';

import React from 'react';
import type { ChatMessage, CitationItem } from '@/types/chat';
import { MarkdownRenderer } from './markdown-renderer';
import { CitationChip } from './citation-chip';
import { FeedbackButtons } from './feedback-buttons';
import { Bot, User, Sparkles, BookOpen, AlertCircle, CheckCircle2, MessageSquarePlus, ArrowRight } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: (message: ChatMessage) => void;
  onSelectCitation?: (citation: CitationItem) => void;
  onSuggestionClick?: (question: string) => void;
}

export function MessageBubble({ message, onSelectCitation, onSuggestionClick }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const getSourceBadge = () => {
    if (isUser) return null;
    if (message.path === 'faq') {
      if (message.isVerified === true) {
        return (
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium"
            title={message.verificationSource ? `Nguồn xác thực: ${message.verificationSource}` : 'Thông tin đã được xác thực chính thức'}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Đã xác thực</span>
          </span>
        );
      }
      return (
        <span
          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 font-medium"
          title={message.verificationSource ? `Nguồn: ${message.verificationSource}` : 'Thông tin chưa được xác thực chính thức'}
        >
          <AlertCircle className="w-3 h-3 text-amber-400" />
          <span>Chưa xác thực</span>
        </span>
      );
    }
    if (message.path === 'rag') {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-medium">
          <BookOpen className="w-3 h-3" />
          <span>Từ tài liệu</span>
        </span>
      );
    }
    if (message.path === 'refused') {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>Không tìm thấy</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img
          src="/aiia-logo.png?v=4"
          alt="K.AI Avatar"
          className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shrink-0 mt-1 shadow-md"
        />
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md backdrop-blur-md ${
        isUser
          ? 'bg-cyan-600/80 border border-cyan-500/50 text-white rounded-br-none'
          : 'bg-slate-900/60 border border-slate-800/80 text-slate-100 rounded-bl-none'
      }`}>
        {isUser ? (
          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <div className="space-y-3">
            <MarkdownRenderer content={message.content} />

            {/* Citations chips */}
            {message.citations && message.citations.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trích dẫn nguồn:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {message.citations.map((c, i) => (
                    <CitationChip
                      key={c.chunkId || i}
                      index={i}
                      citation={c}
                      onClick={(cit) => onSelectCitation && onSelectCitation(cit)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cảnh báo khi câu trả lời là fallback do LLM hết quota/lỗi thật */}
            {message.degraded && (
              <div className="flex items-start gap-1.5 text-xs px-2.5 py-2 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/50">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>AI chưa dùng được ở lượt này — đang hiển thị câu trả lời gốc. Kiểm tra Gemini API key trong Cài đặt để nhận câu trả lời diễn đạt theo ngữ cảnh.</span>
              </div>
            )}

            {/* Hàng cuối: nút đánh giá 👍/👎 (trái) + badge nguồn (phải).
                Chỉ hiện đánh giá khi đã stream xong và có queryLogId để gắn phản hồi vào. */}
            {(getSourceBadge() || (!message.isStreaming && message.queryLogId)) && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
                <div>
                  {!message.isStreaming && message.queryLogId && (
                    <FeedbackButtons queryLogId={message.queryLogId} />
                  )}
                </div>
                {getSourceBadge()}
              </div>
            )}

            {/* Câu hỏi gợi ý tiếp nối */}
            {!message.isStreaming && message.suggestions && message.suggestions.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Có thể bạn cũng muốn hỏi:</span>
                </p>
                <div className="flex flex-col gap-2 items-start w-full">
                  {message.suggestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSuggestionClick && onSuggestionClick(q)}
                      className="text-left text-xs px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 hover:border-cyan-500/60 text-cyan-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-[0.98] w-full flex items-center justify-between group"
                    >
                      <span className="leading-snug">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 shadow">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
