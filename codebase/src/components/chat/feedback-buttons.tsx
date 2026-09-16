'use client';

import React, { useState } from 'react';
import { clientStorage } from '@/lib/client-storage';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface FeedbackButtonsProps {
  queryLogId?: string;
}

export function FeedbackButtons({ queryLogId }: FeedbackButtonsProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [reason, setReason] = useState<'wrong' | 'incomplete' | 'irrelevant' | 'other'>('wrong');
  const [submitted, setSubmitted] = useState(false);

  const sendFeedback = async (selectedRating: number, selectedReason?: string) => {
    if (!queryLogId) return;
    try {
      const clientSessionId = clientStorage.getClientSessionId();
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryLogId,
          rating: selectedRating,
          reason: selectedReason,
          clientSessionId,
        }),
      });
      setRating(selectedRating);
      setSubmitted(true);
      setShowPopover(false);
    } catch {
      // Handle error silently
    }
  };

  const handleUp = () => {
    sendFeedback(1);
  };

  const handleDownClick = () => {
    setShowPopover(true);
  };

  const handleSubmitDown = (e: React.FormEvent) => {
    e.preventDefault();
    sendFeedback(-1, reason);
  };

  if (submitted) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>Cảm ơn bạn đã phản hồi!</span>
      </span>
    );
  }

  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleUp}
        className={`p-1 rounded hover:bg-slate-800 transition-colors ${rating === 1 ? 'text-emerald-400' : 'text-slate-400'}`}
        title="Hài lòng với câu trả lời"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={handleDownClick}
        className={`p-1 rounded hover:bg-slate-800 transition-colors ${rating === -1 ? 'text-rose-400' : 'text-slate-400'}`}
        title="Không hài lòng"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>

      {showPopover && (
        <form
          onSubmit={handleSubmitDown}
          className="absolute bottom-full left-0 mb-2 w-56 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl z-30 space-y-2 text-xs"
        >
          <p className="font-semibold text-slate-200">Lý do chưa hài lòng?</p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-100 focus:outline-none"
          >
            <option value="wrong">Chưa chính xác</option>
            <option value="incomplete">Thiếu thông tin</option>
            <option value="irrelevant">Không liên quan</option>
            <option value="other">Lý do khác</option>
          </select>

          <div className="flex items-center justify-end gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowPopover(false)}
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-cyan-600 text-white font-medium hover:bg-cyan-500"
            >
              Gửi
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
