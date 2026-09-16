'use client';

import { useState } from 'react';
import { Bot, Send, Sparkles, Loader2, BookOpen } from 'lucide-react';

export function CommunityChatView() {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    citations?: Array<{ title: string; source: string }>;
  }>>([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là **Trợ lý AI Tri thức Cộng đồng SFIA**. Bạn có thể hỏi tôi về bất kỳ công thức toán học Transformer, cấu hình Vector DB, kỹ thuật LoRA PEFT hay kiến trúc Multi-Agent nào!',
      citations: [{ title: 'Khung Năng Lực SFIA 8 Quốc Tế', source: 'Standard L1-L7' }]
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('claude-3.7-sonnet');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let reply = '';
      let citations: Array<{ title: string; source: string }> = [];

      if (text.toLowerCase().includes('attention') || text.toLowerCase().includes('score')) {
        reply = `**Cơ chế Scaled Dot-Product Attention:**\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n- $Q, K, V$: Ma trận Query, Key, Value.\n- $\\sqrt{d_k}$: Hệ số tỉ lệ chuẩn hóa (Scaling Factor) giúp phương sai của tích vô hướng $QK^T$ không bị bùng nổ khi $d_k$ lớn, chống hiện tượng **Vanishing Gradient** khi qua hàm Softmax.\n\nCode mẫu thực thi có sẵn trong **Chuyên đề 1 (Giáo trình)**.`;
        citations = [{ title: 'Toán học Transformer & Attention', source: 'Chuyên đề 1' }];
      } else if (text.toLowerCase().includes('qdrant') || text.toLowerCase().includes('hnsw') || text.toLowerCase().includes('vector')) {
        reply = `**Chỉ mục HNSW trong Vector Database (Qdrant/Milvus):**\n\nHNSW (Hierarchical Navigable Small World) xây dựng đồ thị lân cận phân tầng dạng Skip List, cho phép tìm kiếm láng giềng gần nhất (ANN) với độ phức tạp $O(\\log N)$ thay vì quét toàn bộ $O(N)$.\n\nKết hợp với **Payload Filtering** trong Qdrant giúp lọc dữ liệu phòng ban theo thời gian thực mà không làm suy giảm hiệu năng.`;
        citations = [{ title: 'Vector Database & HNSW Indexing', source: 'Chuyên đề 3' }];
      } else if (text.toLowerCase().includes('lora') || text.toLowerCase().includes('peft')) {
        reply = `**Kỹ thuật Low-Rank Adaptation (LoRA):**\n\nThay vì cập nhật toàn bộ ma trận trọng số gốc $W_0 \\in \\mathbb{R}^{d \\times k}$, LoRA đóng băng $W_0$ và huấn luyện 2 ma trận phân rã hạng thấp:\n$$W = W_0 + \\Delta W = W_0 + \\frac{\\alpha}{r}(B \\times A)$$\nvới $B \\in \\mathbb{R}^{d \\times r}, A \\in \\mathbb{R}^{r \\times k}$ ($r \\ll \\min(d, k)$). Giảm hơn **99% tham số cần gradient update**, tiết kiệm tối đa VRAM GPU.`;
        citations = [{ title: 'LoRA Parameter-Efficient Fine-Tuning', source: 'Chuyên đề 5' }];
      } else {
        reply = `**Phản hồi từ Trợ lý AI Cộng đồng SFIA (Mô hình ${selectedModel}):**\n\nTôi đã tra cứu cơ sở tri thức **Khung Năng Lực SFIA 8 & Giáo trình Kỹ thuật Mở**. Câu hỏi của bạn về: *"${text}"* thuộc nhóm kiến thức kỹ thuật nâng cao. Bạn có thể xem chi tiết lý thuyết và code mẫu trong mục **Giáo Trình** và thử sức làm bài kiểm tra trong mục **Luyện Thi Mô Phỏng** nhé!`;
        citations = [{ title: 'Khung Năng Lực SFIA 8 & Bloom\'s Taxonomy', source: 'Master Knowledge Base' }];
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply, citations }]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#101b33] to-slate-900 border border-cyan-500/30 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">Trợ Lý AI Tri Thức Cộng Đồng SFIA</h2>
            <p className="text-xs text-slate-400">Hỏi đáp kỹ thuật, giải thích công thức toán và kiến trúc Enterprise AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono focus:outline-none"
          >
            <option value="claude-3.7-sonnet">Claude 3.7 Sonnet (Advanced CoT)</option>
            <option value="gpt-4o">GPT-4o (Omni Realtime)</option>
            <option value="deepseek-r1">DeepSeek R1 (Open Weights Reasoning)</option>
          </select>
        </div>
      </div>

      {/* Messages Window */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 md:p-6 min-h-[420px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg, i) => {
          const isAi = msg.role === 'assistant';
          return (
            <div key={i} className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                isAi 
                  ? 'bg-slate-950 border border-slate-800 text-slate-200' 
                  : 'bg-gradient-to-r from-cyan-600 to-sky-600 text-slate-950 font-medium'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.citations.map((c, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 text-[10px] text-cyan-300 border border-slate-800">
                        <BookOpen className="w-3 h-3" />
                        <span>{c.title} ({c.source})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang truy xuất cơ sở tri thức SFIA và suy luận câu trả lời...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Gợi ý câu hỏi:</span>
        {[
          'Giải thích cơ chế Scaled Dot-Product Attention',
          'So sánh Qdrant HNSW với Cosine truyền thống',
          'Công thức toán học của LoRA Fine-Tuning'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Hỏi trợ lý AI về bất kỳ kỹ năng SFIA, công thức toán hay kiến trúc hệ thống..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          disabled={!input.trim() || isLoading}
          onClick={() => handleSendMessage()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Gửi</span>
        </button>
      </div>

    </div>
  );
}
