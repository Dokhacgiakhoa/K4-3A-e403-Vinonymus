'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, CitationItem } from '@/types/chat';
import { MessageBubble } from './message-bubble';
import { Composer } from './composer';
import { CitationPanel } from './citation-panel';
import { NeedKeyPrompt } from './need-key-prompt';
import { Bot, Loader2, Sparkles, Key } from 'lucide-react';
import { authBackendClient } from '@/lib/api/auth-backend-client';

interface ChatContainerProps {
  apiKey?: string;
  onOpenSettings?: () => void;
}

export function ChatContainer({ apiKey, onOpenSettings }: ChatContainerProps) {
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

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, stageStatus, showNeedKey]);

  const handleSend = async (userQuestion: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userQuestion,
      createdAt: new Date().toISOString(),
    };

    const assistantMsgId = `assistant-${Date.now()}`;
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
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['x-gemini-key'] = apiKey;
        headers['x-llm-key'] = apiKey;
      }
      const token = authBackendClient.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;

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
        throw new Error(`HTTP Error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            const jsonStr = trimmed.slice(5).trim();
            try {
              const parsed = JSON.parse(jsonStr) as {
                message?: string;
                stage?: string;
                text?: string;
                citations?: CitationItem[];
                path?: ChatMessage['path'];
                faqId?: string;
                isVerified?: boolean;
                verificationSource?: string;
                suggestions?: string[];
              };

              if (line.startsWith('event: status')) {
                setStageStatus(parsed.message || null);
              } else if (line.startsWith('event: citations')) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, citations: parsed.citations }
                      : m
                  )
                );
              } else if (line.startsWith('event: token')) {
                setStageStatus(null);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: m.content + (parsed.text || '') }
                      : m
                  )
                );
              } else if (line.startsWith('event: need_key')) {
                setStageStatus(null);
                setShowNeedKey(true);
                setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
              } else if (line.startsWith('event: done')) {
                setStageStatus(null);
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
                          isStreaming: false,
                        }
                      : m
                  )
                );
              } else if (line.startsWith('event: error')) {
                setStageStatus(null);
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

  const handleSuggestedQuestion = (q: string) => {
    handleSend(q);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-4">
      {/* App Header */}
      <header className="flex items-center justify-between py-3 px-4 bg-slate-900/80 border border-slate-800 rounded-2xl mb-4 backdrop-blur shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-lg tracking-tight">AIIA Notebook</h1>
            <p className="text-xs text-slate-400">K.AI — Sổ tay AI in Action</p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>{apiKey ? 'API Key (Đã lưu)' : 'Cài đặt Key'}</span>
          </button>
        )}
      </header>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            onRegenerate={m.role === 'assistant' && m.id !== 'welcome' ? handleRegenerate : undefined}
            onSelectCitation={(cit) => setSelectedCitation(cit)}
            onSuggestionClick={handleSuggestedQuestion}
          />
        ))}

        {/* Stage Status Indicator */}
        {stageStatus && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 rounded-xl px-3.5 py-2 w-fit animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{stageStatus}</span>
          </div>
        )}

        {/* Need Key Prompt */}
        {showNeedKey && <NeedKeyPrompt onOpenSettings={onOpenSettings} />}

        {/* Suggested Questions (only show on welcome) */}
        {messages.length === 1 && (
          <div className="my-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gợi ý câu hỏi phổ biến:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSuggestedQuestion('Deadline nộp Assignment 1 là khi nào?')}
                className="text-left text-xs sm:text-sm p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                📌 Deadline nộp Assignment 1 là khi nào?
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedQuestion('Lịch Office Hours của Trợ giảng TA là khi nào?')}
                className="text-left text-xs sm:text-sm p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                🕒 Lịch Office Hours của Trợ giảng TA?
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedQuestion('Thời khóa biểu môn học AI in Action?')}
                className="text-left text-xs sm:text-sm p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                📅 Thời khóa biểu môn học AIIA?
              </button>
              <button
                type="button"
                onClick={() => handleSuggestedQuestion('Thang điểm đánh giá môn học AIIA như thế nào?')}
                className="text-left text-xs sm:text-sm p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                📊 Thang điểm đánh giá môn học?
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="pt-3">
        <Composer onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} />
      </div>

      {/* Citation Detail Panel */}
      <CitationPanel citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
}
