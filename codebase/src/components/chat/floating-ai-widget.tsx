'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Trash2, 
  MessageSquare, 
  CornerDownLeft,
  ChevronDown,
  Cpu
} from 'lucide-react';
import gsap from 'gsap';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('Claude 3.7 Sonnet');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Xin chào! Tôi là **K.AI (Trợ Lý Tri Thức SFIA)**. Bạn có câu hỏi nào về Toán Transformer, Qdrant Vector DB, LangGraph hay bài tập mô phỏng không?',
      timestamp: 'Vừa xong'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // GSAP Smooth Slow-Motion Entrance & Exit
  useEffect(() => {
    if (isOpen && widgetRef.current) {
      gsap.fromTo(
        widgetRef.current,
        { 
          opacity: 0, 
          scale: 0.88, 
          y: 35, 
          transformOrigin: 'bottom right' 
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.65,
          ease: 'power3.out' 
        }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (widgetRef.current) {
      gsap.to(widgetRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Simulate AI Streaming Response
    setTimeout(() => {
      let aiReply = '';
      const lower = text.toLowerCase();
      if (lower.includes('attention') || lower.includes('transformer')) {
        aiReply = 'Cơ chế **Scaled Dot-Product Attention** được tính bằng công thức:\n$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\nTrong đó việc chia cho $\\sqrt{d_k}$ giúp triệt tiêu hiện tượng vanishing gradient khi $d_k$ lớn.';
      } else if (lower.includes('qdrant') || lower.includes('vector')) {
        aiReply = '**Qdrant Vector Database** sử dụng đồ thị **HNSW (Hierarchical Navigable Small World)** kết hợp bộ lọc Payload Filter trực tiếp trong lúc duyệt đồ thị, đem lại tốc độ truy vấn đa chiều sub-millisecond.';
      } else if (lower.includes('lora') || lower.includes('peft')) {
        aiReply = '**LoRA (Low-Rank Adaptation)** tối ưu hóa trọng số mô hình qua việc phân rã ma trận cập nhật $\\Delta W = B \\times A$ với rank $r \\ll d$, giảm hơn 90% dung lượng bộ nhớ VRAM khi fine-tuning.';
      } else {
        aiReply = `Cảm ơn bạn đã hỏi về **"${text}"**! Kiến trúc hệ thống AI in Action được chuẩn hóa theo chuẩn **SFIA 8** từ nền tảng toán học đến hạ tầng vLLM serving quy mô lớn. Bạn có thể xem chi tiết tại mục **LEARNING** nhé!`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  const sampleQuestions = [
    "Giải thích Scaled Dot-Product Attention",
    "So sánh Qdrant HNSW với Cosine thuần",
    "Công thức toán học của LoRA PEFT"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* EXPANDED FLOATING CHATBOX */}
      {isOpen ? (
        <div 
          ref={widgetRef}
          className="w-[90vw] sm:w-[420px] h-[550px] rounded-3xl bg-[#0f172a]/95 backdrop-blur-2xl border border-sky-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.25)] flex flex-col overflow-hidden text-slate-100"
        >
          
          {/* Chat Header */}
          <div className="p-4 bg-[#0b1329]/95 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">K.AI Helpdesk 24/7</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-sky-300 font-mono">
                  <span>Trợ Lý Hỏi Đáp Kỹ Sư AI • SFIA RAG</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const first = messages[0];
                  if (first) setMessages([first]);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Xóa lịch sử trò chuyện"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Thu nhỏ"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Selector Bar */}
          <div className="px-4 py-1.5 bg-[#070d1e] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Mô hình suy luận:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-[#0b1329] border border-slate-700 rounded-md px-2 py-0.5 text-sky-300 text-[10px] focus:outline-none"
            >
              <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet (Advanced CoT)</option>
              <option value="DeepSeek R1">DeepSeek R1 (Deep Reasoning)</option>
              <option value="Gemini 2.0 Flash">Gemini 2.0 Flash (Low Latency)</option>
            </select>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                      isAi 
                        ? 'bg-[#0b1329] border border-slate-800 text-slate-200 shadow-md font-normal' 
                        : 'bg-sky-500 text-slate-950 font-medium shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div className={`text-[9px] mt-1 text-right ${isAi ? 'text-slate-500' : 'text-slate-900/80 font-mono'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] text-slate-400">K.AI đang suy luận...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2 bg-[#0b1329]/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-500 shrink-0 font-mono">Gợi ý:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-[#070d1e] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-sky-300 whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#0b1329] border-t border-slate-800">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Hỏi về toán Transformer, RAG, SFIA..."
                className="flex-1 px-3.5 py-2.5 bg-[#070d1e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-normal"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        
        /* COLLAPSED FLOATING BUTTON WITH SLOW MOTION 3-SECOND PULSE */
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-tr from-sky-500 via-teal-400 to-emerald-400 text-slate-950 font-bold shadow-[0_10px_30px_rgba(56,189,248,0.4)] border border-sky-300/60 hover:scale-105 active:scale-95 transition-all duration-300"
          title="Mở Trợ Lý AI K.AI"
        >
          {/* SLOW MOTION 3-SECOND PULSING AURA (1s active wave, 2s calm resting period) */}
          <span className="absolute -inset-1.5 rounded-full bg-sky-400/40 widget-slow-pulse pointer-events-none"></span>
          
          <div className="w-8 h-8 rounded-full bg-slate-950 text-sky-400 flex items-center justify-center shadow-inner shrink-0 group-hover:rotate-12 transition-transform">
            <Bot className="w-4 h-4" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wide uppercase leading-none">
              AI Helpdesk 24/7
            </span>
            <span className="text-[9px] text-slate-900 font-bold font-mono">
              Hỏi K.AI Trực Tuyến
            </span>
          </div>

          <Sparkles className="w-4 h-4 text-slate-950 hidden sm:block" />
        </button>

      )}

    </div>
  );
}
