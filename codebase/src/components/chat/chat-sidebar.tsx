'use client';

import React from 'react';
import type { StoredConversation } from '@/lib/client-storage';
import { Plus, MessageSquare, Trash2, X, Settings } from 'lucide-react';
import Link from 'next/link';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: StoredConversation[];
  activeId: string | null;
  onSelectConversation: (conv: StoredConversation) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatSidebar({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: ChatSidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-4 z-40 flex flex-col justify-between shadow-2xl">
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">Lịch sử hội thoại</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 sm:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cuộc trò chuyện mới</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Chưa có lịch sử hội thoại</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                  activeId === conv.id
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
                onClick={() => onSelectConversation(conv)}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-cyan-400" />
                  <span className="truncate">{conv.title}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                  title="Xóa cuộc trò chuyện này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 shrink-0">
        <Link
          href="/settings"
          className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Cài đặt API Key</span>
        </Link>
      </div>
    </aside>
  );
}
