'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, Heart } from 'lucide-react';
import { DisclaimerModal } from '@/components/legal/disclaimer-modal';

export function MainFooter() {
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);

  return (
    <>
      <footer className="border-t border-slate-800/80 bg-[#070d1e] py-12 text-slate-300 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md border border-sky-500/30">
                  <img src="/aiia-logo.png?v=4" alt="AI in Action" className="w-full h-full object-cover" />
                </div>
                <span className="font-extrabold text-white text-base">AI in Action</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                Nền tảng tri thức mở, chuẩn hóa khung năng lực và giáo trình kỹ thuật chuyên sâu dành cho cộng đồng kỹ sư AI thực chiến.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-sky-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>Open Source Community Edition</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Khung Năng Lực SFIA 8</h3>
              <ul className="space-y-1.5 text-slate-300 font-normal">
                <li><Link href="/about" className="hover:text-sky-300 transition">Level 1 - Follow (Nhận biết)</Link></li>
                <li><Link href="/about" className="hover:text-sky-300 transition">Level 2 - Assist (Hiểu sâu)</Link></li>
                <li><Link href="/about" className="hover:text-sky-300 transition">Level 3 - Apply (Áp dụng RAG)</Link></li>
                <li><Link href="/about" className="hover:text-sky-300 transition">Level 4 - Enable (Multi-Agent)</Link></li>
                <li><Link href="/about" className="hover:text-sky-300 transition">Level 5 - Ensure (vLLM Serving)</Link></li>
                <li><Link href="/instruction" className="hover:text-sky-300 transition font-semibold text-sky-400">Hướng Dẫn Khai Thác (Instruction)</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Giáo Trình Kỹ Thuật</h3>
              <ul className="space-y-1.5 text-slate-300 font-normal">
                <li><Link href="/learning" className="hover:text-sky-300 transition">Chuyên đề 1: Toán Transformer</Link></li>
                <li><Link href="/learning" className="hover:text-sky-300 transition">Chuyên đề 2: Async Backend FastAPI</Link></li>
                <li><Link href="/learning" className="hover:text-sky-300 transition">Chuyên đề 3: Qdrant Vector & RRF</Link></li>
                <li><Link href="/learning" className="hover:text-sky-300 transition">Chuyên đề 4: LangGraph Stateful Agents</Link></li>
                <li><Link href="/learning" className="hover:text-sky-300 transition">Chuyên đề 5: LoRA Fine-Tuning</Link></li>
                <li><Link href="/learning" className="hover:text-sky-300 transition">Chuyên đề 6 & 7: vLLM & ISO 42001</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tiêu Chuẩn & Pháp Lý</h3>
              <ul className="space-y-1.5 text-slate-300 font-normal">
                <li><span className="text-white font-medium">SFIA 8 Standard</span> (SFIA Foundation)</li>
                <li><span className="text-white font-medium">Bloom's Taxonomy Scale</span></li>
                <li><Link href="/instruction" className="text-sky-400 hover:underline">Hướng Dẫn Sử Dụng Nền Tảng</Link></li>
                <li>
                  <button 
                    onClick={() => setShowDisclaimerModal(true)}
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2 font-medium"
                  >
                    Tuyên Bố Miễn Trừ Pháp Lý
                  </button>
                </li>
                <li>
                  <a 
                    href="https://github.com/Dokhacgiakhoa/AI-thuc-chien" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-sky-300 transition inline-flex items-center gap-1 text-slate-200"
                  >
                    <span>Mã nguồn trên GitHub</span>
                    <ExternalLink className="w-3 h-3 text-sky-400" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300 text-[11px]">
            <div>
              © 2026 AI in Action. Bản quyền mã nguồn mở phục vụ cộng đồng Kỹ sư AI.
            </div>
            <div className="flex items-center gap-1 text-sky-300">
              <span>Được chuẩn hóa bảng màu Midnight Slate Navy dịu mắt chuẩn khoa học thị giác</span>
              <Heart className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
            </div>
          </div>

        </div>
      </footer>

      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
    </>
  );
}
