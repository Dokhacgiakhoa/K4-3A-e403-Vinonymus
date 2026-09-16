'use client';

import { useEffect, useRef } from 'react';
import { Scale, X, Check, ShieldCheck, FileCheck, Lock, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // GSAP Spring Float Animation on open
    gsap.fromTo(
      modalRef.current,
      { 
        opacity: 0, 
        scale: 0.85, 
        y: 40,
        rotationX: 8,
      },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        rotationX: 0,
        duration: 0.5, 
        ease: 'back.out(1.6)' 
      }
    );

    // Gentle ambient floating animation
    const floatAnim = gsap.to(modalRef.current, {
      y: '-=6',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });

    return () => {
      floatAnim.kill();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans perspective-stage"
      onClick={onClose}
    >
      {/* MODAL CARD: 50% WIDER (MAX-W-4XL), FROSTED GLASS TRANSLUCENT, FLOATING WITH HIGH-TECH SHADOW */}
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#0f172a]/95 backdrop-blur-2xl border border-sky-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.25)] space-y-6 text-left transform-gpu"
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0b1329] text-sky-400 border border-sky-500/40 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                  Tuyên Bố Pháp Lý & Miễn Trừ Trách Nhiệm
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-sky-300">
                  Open Science
                </span>
              </div>
              <p className="text-xs text-sky-300/90 font-medium mt-0.5">
                Unofficial Open Educational Resource • Tuân thủ chuẩn đạo đức học thuật
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0b1329] border border-slate-700 text-slate-400 hover:text-white hover:border-sky-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 50% Wider Layout with Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>1. Tri Thức Học Thuật Mở</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              Dự án nghiên cứu độc lập nhằm hệ thống hóa kiến thức Kỹ sư AI từ L0 theo chuẩn quốc tế <strong>SFIA (v8)</strong> và thang đo <strong>Bloom's Taxonomy</strong>, tập trung giáo trình thực hành Level 0 đến Level 4.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>2. Không Đại Diện Chính Thức</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              Website <strong>hoàn toàn không phải trang web chính thức</strong> và không có bất kỳ liên kết pháp lý hay phát ngôn đại diện cho bất kỳ tổ chức hay doanh nghiệp nào.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-[#0b1329]/90 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3. 100% Mock Practice (NDA)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              100% bài kiểm tra và bài tập là <strong>tài liệu mô phỏng học thuật</strong> tổng hợp từ nguồn mở quốc tế. Tuyệt đối <strong>không trích xuất hay sao chép</strong> bất kỳ đề thi nội bộ nào.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-normal">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cam kết tuân thủ 100% tiêu chuẩn bảo mật và đạo đức nghề nghiệp</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Check className="w-4 h-4" />
            <span>Tôi Đã Hiểu & Đồng Ý</span>
          </button>
        </div>

      </div>
    </div>
  );
}
