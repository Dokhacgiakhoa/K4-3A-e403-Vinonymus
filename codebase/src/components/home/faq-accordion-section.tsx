'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FaqAccordionSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "K.AI Labs là nền tảng gì và mục tiêu của dự án là gì?",
      a: "K.AI Labs là nền tảng giáo trình tự học mở phát triển bởi tác giả Đỗ Khắc Gia Khoa, nhằm chuẩn hóa lộ trình tự học và đánh giá năng lực theo chuẩn quốc tế SFIA Framework (v8 - Phiên bản 8th Edition) và thang đo Bloom's Taxonomy. Nền tảng cung cấp đầy đủ giáo trình các chuyên đề lý thuyết gốc rễ, mã nguồn thực hành và hệ thống đề thi mô phỏng học thuật độc lập."
    },
    {
      q: "Các bài kiểm tra (Mock Tests) trên website có phải là đề thi thật không?",
      a: "Hoàn toàn KHÔNG. 100% các bài thi trên hệ thống là Đề thi Mô phỏng Học thuật Độc lập (Simulation Mock Tests) được biên soạn từ các nguồn mở quốc tế uy tín (Stanford CS224N, DeepLearning.AI, PyTorch, HuggingFace, SFIA Foundation). Nền tảng tuyệt đối tuân thủ cam kết bảo mật (NDA) và không sao chép bất kỳ đề thi nội bộ nào của bất kỳ doanh nghiệp nào."
    },
    {
      q: "Khung năng lực SFIA (v8) gồm những cấp độ nào và nền tảng đào tạo đến cấp độ nào?",
      a: "Khung SFIA (v8) gồm 7 cấp độ trách nhiệm (L1 đến L7). Trong đó, nền tảng tập trung giáo trình lý thuyết và lab thực hành từ Level 0 đến Level 4 (Enable - Multi-Agent & LoRA Fine-tuning). Các cấp độ L5 đến L7 (Ensure, Initiate, Strategy) là khung tham chiếu mở rộng dành cho môi trường dự án quy mô lớn tại doanh nghiệp thực tế, không có giáo trình thực hành trên nền tảng."
    },
    {
      q: "Trợ lý AI trên website hoạt động như thế nào?",
      a: "Trợ lý AI tích hợp cơ chế Hybrid RAG (Dense Vector Qdrant + BM25 Sparse Search + Cross-Encoder Re-ranker), cho phép tra cứu trực tiếp toàn bộ giáo trình 19 chuyên đề từ con số 0 chuẩn SFIA và trả lời trích dẫn nguồn chính xác theo thời gian thực (Server-Sent Events Streaming)."
    },
    {
      q: "Tôi có thể đóng góp mã nguồn hoặc bài tập cho cộng đồng không?",
      a: "Có! Dự án hoàn toàn mở trên GitHub. Bạn có thể tạo Pull Request, đóng góp câu hỏi mô phỏng mới hoặc cập nhật tài liệu lý thuyết theo đúng quy chuẩn AGENTS.md của dự án."
    }
  ];

  return (
    <section className="rounded-3xl bg-[#0f172a]/75 border border-sky-500/30 p-6 sm:p-10 space-y-6 w-full shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
      <div className="text-center space-y-2 border-b border-slate-700/60 pb-4">
        <span className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider">Frequently Asked Questions</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide text-shadow-clean">Câu Hỏi Thường Gặp Về Nền Tảng</h2>
        <p className="text-xs text-slate-300 font-normal">Giải đáp những thắc mắc phổ biến về lộ trình tự học, chuẩn SFIA (v8) và đề thi mô phỏng</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div 
              key={idx}
              className="rounded-2xl bg-[#0b1329]/75 border border-slate-700/60 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-slate-600"
            >
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-medium text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 font-normal animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
