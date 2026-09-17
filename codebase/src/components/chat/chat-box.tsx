'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, RefreshCw, X, MessageSquare, History, Plus } from 'lucide-react';
import { MessageBubble } from './message-bubble';
import { Composer } from './composer';
import { NeedKeyPrompt } from './need-key-prompt';
import { CitationPanel } from './citation-panel';
import { clientStorage } from '@/lib/client-storage';
import type { ChatMessage, CitationItem } from '@/types/chat';

interface ChatBoxProps {
  initialQuestion?: string;
  onCloseMobile?: () => void;
  isMobileModal?: boolean;
}

export function ChatBox({ initialQuestion, onCloseMobile, isMobileModal }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Chào bạn! Mình là **K.AI** — Sổ tay AI **không chính thức** do học viên chương trình **AI in Action** (AIIA) xây dựng. Bạn có thể hỏi mình bất kỳ thắc mắc nào về chương trình nhé!',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [stageStatus, setStageStatus] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showNeedKey, setShowNeedKey] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<CitationItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSentInitialQuestionRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, stageStatus, showNeedKey]);

  useEffect(() => {
    if (
      initialQuestion &&
      initialQuestion.trim() &&
      initialQuestion !== lastSentInitialQuestionRef.current
    ) {
      lastSentInitialQuestionRef.current = initialQuestion;
      handleSend(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const handleSend = async (userQuestion: string) => {
    if (!userQuestion.trim() || isStreaming) return;

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const userMsg: ChatMessage = {
      id: `user-${uniqueSuffix}`,
      role: 'user',
      content: userQuestion,
      createdAt: new Date().toISOString(),
    };

    const assistantMsgId = `assistant-${uniqueSuffix}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);
    setShowNeedKey(false);
    setStageStatus('Đang tìm trong FAQ…');

    abortControllerRef.current = new AbortController();

    try {
      const storedKeys = clientStorage.getApiKeys();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      // UUID ẩn danh, chỉ để gom các lượt hỏi cùng phiên khi thống kê — không định danh cá nhân
      headers['x-client-session-id'] = clientStorage.getClientSessionId();
      if (storedKeys.gemini) headers['x-gemini-key'] = storedKeys.gemini;
      if (storedKeys.openai) headers['x-openai-key'] = storedKeys.openai;
      if (storedKeys.claude) headers['x-claude-key'] = storedKeys.claude;
      if (storedKeys.deepseek) headers['x-deepseek-key'] = storedKeys.deepseek;
      if (storedKeys.groq) headers['x-groq-key'] = storedKeys.groq;
      if (storedKeys.cerebras) headers['x-cerebras-key'] = storedKeys.cerebras;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          question: userQuestion,
          history: messages
            .filter((m) => m.id !== 'welcome' && !m.isStreaming)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.slice(6).trim();
          } else if (trimmed.startsWith('data:')) {
            const jsonStr = trimmed.slice(5).trim();
            try {
              const parsed = JSON.parse(jsonStr) as {
                message?: string;
                text?: string;
                citations?: CitationItem[];
                path?: ChatMessage['path'];
                faqId?: string;
                isVerified?: boolean;
                verificationSource?: string;
                suggestions?: string[];
                degraded?: boolean;
                queryLogId?: string;
              };

              if (currentEvent === 'status') {
                setStageStatus(parsed.message || null);
              } else if (currentEvent === 'citations') {
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, citations: parsed.citations } : m))
                );
              } else if (currentEvent === 'token') {
                setStageStatus(null);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: m.content + (parsed.text || '') } : m
                  )
                );
              } else if (currentEvent === 'need_key') {
                setStageStatus(null);
                setShowNeedKey(true);
                clientStorage.setApiKeyError(true);
                setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
              } else if (currentEvent === 'done') {
                setStageStatus(null);
                clientStorage.setApiKeyError(Boolean(parsed.degraded));
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          path: parsed.path,
                          faqId: parsed.faqId,
                          isVerified: parsed.isVerified,
                          verificationSource: parsed.verificationSource,
                          suggestions: parsed.suggestions,
                          degraded: parsed.degraded,
                          queryLogId: parsed.queryLogId,
                          isStreaming: false,
                        }
                      : m
                  )
                );
              } else if (currentEvent === 'error') {
                setStageStatus(null);
                const errMsg = (parsed.message || '').toLowerCase();
                if (errMsg.includes('key') || errMsg.includes('401') || errMsg.includes('403') || errMsg.includes('quota') || errMsg.includes('unauthorized')) {
                  clientStorage.setApiKeyError(true);
                }
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: `❌ ${parsed.message || 'Đã xảy ra lỗi sinh câu trả lời.'}`,
                          isStreaming: false,
                        }
                      : m
                  )
                );
              }
            } catch {
              // Ignore incomplete SSE json
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `${m.content} *(Đã dừng)*`, isStreaming: false }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `❌ Lỗi kết nối: ${err instanceof Error ? err.message : 'Unknown'}`, isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      setStageStatus(null);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRegenerate = (msg: ChatMessage) => {
    const msgIndex = messages.findIndex((m) => m.id === msg.id);
    if (msgIndex > 0) {
      const previousUserMsg = messages[msgIndex - 1];
      if (previousUserMsg && previousUserMsg.role === 'user') {
        setMessages((prev) => prev.slice(0, msgIndex - 1));
        handleSend(previousUserMsg.content);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/40 border border-slate-800/60 rounded-2xl shadow-2xl overflow-hidden relative backdrop-blur-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-b border-slate-800/60 text-white shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <img src="/aiia-logo.png?v=4" alt="K.AI Logo" className="w-8 h-8 rounded-xl object-cover shadow-md border border-cyan-500/30" />
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              K.AI
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400">Sổ tay AI in Action</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">

          {isMobileModal && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 ml-1"
              title="Đóng Chat K.AI"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span>Đóng</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-transparent">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRegenerate={msg.role === 'assistant' && msg.id !== 'welcome' ? handleRegenerate : undefined}
            onSelectCitation={(cit) => setSelectedCitation(cit)}
            onSuggestionClick={handleSend}
          />
        ))}

        {stageStatus && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-cyan-400 animate-pulse w-fit backdrop-blur-md">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{stageStatus}</span>
          </div>
        )}

        {showNeedKey && (
          <div className="p-3 bg-slate-900/60 border border-cyan-500/40 rounded-2xl backdrop-blur-md">
            <NeedKeyPrompt />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Bar */}
      <div className="p-3 bg-slate-950/40 border-t border-slate-800/60 shrink-0 backdrop-blur-md">
        <Composer onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} />
      </div>

      {/* Citation Detail Panel */}
      <CitationPanel citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
}
