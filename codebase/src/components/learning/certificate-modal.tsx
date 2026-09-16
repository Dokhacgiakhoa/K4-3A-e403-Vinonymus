'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  FileCheck,
  Edit3
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserName?: string;
  courseTitle?: string;
  courseLevelCode?: string;
}

export function CertificateModal({ 
  isOpen, 
  onClose, 
  defaultUserName,
  courseTitle,
  courseLevelCode
}: CertificateModalProps) {
  const [userName, setUserName] = useState<string>('HỌC VIÊN K.AI LABS');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [certificateId, setCertificateId] = useState<string>('AIIA-SFIA-2026-784912');
  const [issueDate, setIssueDate] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = clientStorage.getUser();
      const name = defaultUserName || user?.name || 'HỌC VIÊN K.AI LABS';
      setUserName(name.toUpperCase());

      // Tạo hoặc lấy Certificate ID duy nhất theo tài khoản hoặc khóa học
      const storageKey = courseTitle 
        ? `aiia_sfia_cert_${courseTitle.replace(/\s+/g, '_').slice(0, 15)}`
        : 'aiia_sfia_certificate_id';

      let certId = localStorage.getItem(storageKey);
      if (!certId) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        const prefix = courseLevelCode ? `AIIA-${courseLevelCode}` : 'AIIA-SFIA';
        certId = `${prefix}-2026-${rand}`;
        localStorage.setItem(storageKey, certId);
      }
      setCertificateId(certId);

      // Ngày cấp
      const now = new Date();
      const dateStr = `Ngày ${now.getDate().toString().padStart(2, '0')} tháng ${(now.getMonth() + 1).toString().padStart(2, '0')} năm ${now.getFullYear()}`;
      setIssueDate(dateStr);
    }
  }, [defaultUserName, courseTitle, courseLevelCode, isOpen]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl my-auto space-y-4 animate-fadeIn">
        
        {/* ========================================================================= */}
        {/* KHUNG CHỨNG CHỈ SỐ IN ĐƯỢC (PRINTABLE CERTIFICATE CONTAINER)              */}
        {/* ========================================================================= */}
        <div 
          id="printable-certificate"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a122c] via-[#070e24] to-[#040817] border-2 border-amber-500/50 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-slate-100 print:border-amber-600 print:shadow-none print:m-0 print:p-8"
        >
          {/* Họa tiết hoa văn viền góc đồng tâm (Concentric Ornamental Corners) */}
          <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400/70 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400/70 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400/70 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400/70 rounded-br-2xl pointer-events-none" />

          {/* Background Hologram Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <div className="w-96 h-96 rounded-full border-8 border-amber-300 flex items-center justify-center font-black text-6xl text-amber-300">
              SFIA v8
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            
            {/* Header Chứng chỉ */}
            <div className="text-center space-y-2 border-b border-amber-500/30 pb-5">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-300/90 font-mono font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>K.AI Labs Academic Council • Global SFIA Assessment Board</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 uppercase tracking-tight font-serif text-shadow-clean">
                Chứng Nhận Hoàn Thành Khóa Học
              </h1>
              
              <div className="text-xs sm:text-sm font-semibold tracking-wider text-sky-300 uppercase font-mono">
                {courseTitle ? `Chuyên Đề: ${courseTitle}` : 'Certificate of Professional Achievement • AI Solution Architect'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Chuẩn Khung Năng Lực Kỹ Thuật Quốc Tế SFIA (v8) {courseLevelCode ? `• Cấp Độ ${courseLevelCode}` : '• Level 1 ➔ Level 4'}
              </div>
            </div>

            {/* Thông tin Học Viên */}
            <div className="text-center space-y-2 py-2">
              <p className="text-xs text-slate-300 uppercase tracking-widest font-mono">
                Chứng nhận này trân trọng trao tặng cho
              </p>

              <div className="flex items-center justify-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value.toUpperCase())}
                    onBlur={() => setIsEditingName(false)}
                    autoFocus
                    className="text-xl sm:text-3xl font-extrabold text-center text-white bg-slate-900/90 border border-amber-400 px-4 py-1 rounded-xl uppercase tracking-wide focus:outline-none"
                  />
                ) : (
                  <div 
                    onClick={() => setIsEditingName(true)}
                    className="inline-flex items-center gap-2 cursor-pointer group px-3 py-1 rounded-xl hover:bg-slate-800/60 transition"
                    title="Bấm để chỉnh sửa tên in trên chứng chỉ"
                  >
                    <span className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wide underline decoration-amber-400/40 underline-offset-8">
                      {userName}
                    </span>
                    <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-amber-400 print:hidden" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed mt-2 font-normal">
                {courseTitle ? (
                  <>
                    Đã hoàn thành xuất sắc toàn diện 100% các bài học lý thuyết và yêu cầu kỹ thuật của chuyên đề <strong>{courseTitle}</strong>, được công nhận năng lực theo chuẩn Khung Năng Lực Quốc Tế SFIA (v8):
                  </>
                ) : (
                  <>
                    Đã hoàn thành xuất sắc toàn diện <strong>12 Chuyên đề Lý thuyết Chuyên sâu</strong> và <strong>12 Bài tập Lab Thực chiến 1:1</strong>, chứng minh năng lực thiết kế, triển khai và tối ưu hóa hệ thống Trí Tuệ Nhân Tạo thực tế:
                  </>
                )}
              </p>
            </div>

            {/* 4 Trụ Cột Năng Lực Đạt Được (4 Pillars SFIA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#060c1d]/85 border border-amber-500/20 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">L1</span>
                <div>
                  <div className="font-bold text-sky-300">Level 1 • Foundation & Python</div>
                  <div className="text-[11px] text-slate-300 leading-snug">Lập trình Python nền tảng từ L0, venv, Tokenizer BPE, xử lý dữ liệu và toán học Vector.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">L2</span>
                <div>
                  <div className="font-bold text-emerald-300">Level 2 • Structured Prompting</div>
                  <div className="text-[11px] text-slate-300 leading-snug">Prompt Engineering, Pydantic Schema, Chain-of-Thought và tự động hóa quy trình.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">L3</span>
                <div>
                  <div className="font-bold text-teal-300">Level 3 • Enterprise Hybrid RAG</div>
                  <div className="text-[11px] text-slate-300 leading-snug">Vector DB Qdrant HNSW, Cosine Distance, BM25 + Dense Search RRF, FastAPI SSE.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">L4</span>
                <div>
                  <div className="font-bold text-amber-300">Level 4 • Multi-Agent & Fine-Tuning</div>
                  <div className="text-[11px] text-slate-300 leading-snug">StateGraph LangGraph có trạng thái, Tool Calling, LoRA / QLoRA và MLOps Cloud.</div>
                </div>
              </div>
            </div>

            {/* Footer Xác Thực: Mã Số, Con Dấu Vàng, QR Code và Chữ Ký */}
            <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              
              {/* Cột trái: Mã chứng chỉ & Ngày cấp */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-300 text-[11px]">
                  <span>MÃ XÁC THỰC:</span>
                  <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {certificateId}
                  </span>
                </div>
                <div className="text-slate-400 text-[10px]">{issueDate}</div>
                <div className="text-[10px] text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Xác minh hợp lệ trên cổng K.AI Labs</span>
                </div>
              </div>

              {/* Cột giữa: Con dấu vàng số (Digital Gold Seal) */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center text-slate-950 font-bold text-center">
                  <div className="w-full h-full rounded-full bg-[#070e24] border-2 border-dashed border-amber-400 flex flex-col items-center justify-center p-1">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-[8px] font-black text-amber-300 tracking-tighter uppercase">VERIFIED</span>
                  </div>
                </div>
                <span className="text-[9px] text-amber-300/80 font-mono mt-1 uppercase">SFIA V8 ACCREDITED</span>
              </div>

              {/* Cột phải: Chữ ký số */}
              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-base text-amber-300 font-bold tracking-wide">
                  K.AI Labs Academic Board
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Hội Đồng Đào Tạo & Khảo Thí
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  ISO/IEC Standard & SFIA Framework
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* NÚT BẤM ĐIỀU KHIỂN (TUÂN THỦ 100% AIIA_PROJECT_CONVENTIONS.md)             */}
        {/* ========================================================================= */}
        {/* Quy tắc: Xếp ngang hàng (flex-row), nút thoát ở bên phải cùng nền đỏ chữ trắng */}
        <div className="flex flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#080f24]/95 border border-slate-800 shadow-xl print:hidden">
          
          <div className="flex items-center gap-2">
            {/* Nút Sao chép ID */}
            <button
              type="button"
              onClick={handleCopyId}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              {copiedId ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Đã Chép Mã!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Sao Chép Mã Xác Thực</span>
                </>
              )}
            </button>

            {/* Nút In / Xuất PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>In / Xuất PDF Chứng Chỉ</span>
            </button>
          </div>

          {/* NÚT ĐÓNG BẮT BUỘC Ở BÊN PHẢI CÙNG NỀN ĐỎ CHỮ TRẮNG (Quy chuẩn bắt buộc) */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20 shrink-0 ml-auto"
          >
            <span>Đóng Cửa Sổ Chứng Chỉ</span>
          </button>
        </div>

      </div>
    </div>
  );
}
