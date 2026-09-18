'use client';

import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ChatBox } from './chat-box';

export function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  if (isOpen) {
    return (
      <div className={'fixed bottom-6 right-6 z-50 h-[600px] max-h-[calc(100dvh-3rem)] w-[calc(100vw-2rem)] font-sans sm:w-[430px]'}>
        <ChatBox isMobileModal onCloseMobile={() => setIsOpen(false)} />
      </div>
    );
  }
  return (
    <div className={'fixed bottom-6 right-6 z-50 font-sans'}>
      <button
        type={'button'}
        onClick={() => setIsOpen(true)}
        aria-label={'Mở K.AI Helpdesk 24/7'}
        className={'group flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-slate-950/95 px-4 py-3 text-white shadow-2xl backdrop-blur-xl transition hover:border-cyan-300 hover:bg-slate-900'}
      >
        <span className={'relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-slate-950'}>
          <Bot className={'h-6 w-6'} />
          <Sparkles className={'absolute -right-1 -top-1 h-4 w-4 text-amber-300'} />
        </span>
        <span className={'text-left'}>
          <span className={'block text-sm font-bold'}>K.AI Helpdesk 24/7</span>
          <span className={'block text-xs text-cyan-300'}>Gemini 3.5 Flash-Lite - RAG Agent</span>
        </span>
      </button>
    </div>
  );
}
