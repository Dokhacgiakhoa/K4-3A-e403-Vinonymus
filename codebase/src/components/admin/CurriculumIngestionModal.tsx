'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  BookOpen, 
  Code2, 
  Award, 
  Cpu, 
  ArrowRight, 
  Layers, 
  RefreshCw,
  Check,
  Zap,
  Coffee,
  Info
} from 'lucide-react';
import { 
  validateAndPackageSubject, 
  saveIngestedSubjectToStorage, 
  SAMPLE_JAVA_SUBJECT_PACKAGE,
  type RawCurriculumInput,
  type CertifiedSubjectPackage 
} from '@/lib/CurriculumIngestionEngine';

interface CurriculumIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectPublished?: (subjectId: string) => void;
}

export function CurriculumIngestionModal({ 
  isOpen, 
  onClose, 
  onSubjectPublished 
}: CurriculumIngestionModalProps) {
  const [subjectTitle, setSubjectTitle] = useState<string>('Java Core, JVM Architecture & Concurrency');
  const [subjectCode, setSubjectCode] = useState<string>('SUB-JAVA');
  const [authorName, setAuthorName] = useState<string>('Oracle / OpenJDK & K.AI Labs');
  const [organization, setOrganization] = useState<string>('Java Community Process (JCP)');
  const [levelCode, setLevelCode] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L2');
  const [license, setLicense] = useState<string>('Open Academic / CC-BY-SA 4.0');
  const [citationSources, setCitationSources] = useState<string>('https://docs.oracle.com/en/java/javase/21/');
  const [rawText, setRawText] = useState<string>(
`# GIÁO TRÌNH CHUẨN: JAVA CORE & JVM ARCHITECTURE (JAVA 21)

## Chương 1: Kiến Trúc Máy Ảo JVM & Quản Lý Bộ Nhớ
- Bytecode (.class) được ClassLoader nạp và JIT Compiler tối ưu mã máy.
- Stack Memory lưu biến nguyên thủy và method frames.
- Heap Memory lưu toàn bộ Objects được tạo bằng new.

\`\`\`java
public class MemoryDemo {
    public static void main(String[] args) {
        int x = 10;
        String s = new String("Java 21");
    }
}
\`\`\`

## Chương 2: String Pool & Immutability
- String Constant Pool nằm trong Heap để tái sử dụng chuỗi.
- Sử dụng StringBuilder cho các phép nối chuỗi trong vòng lặp.

## Chương 3: Collections Framework & HashMap Internals
- Bảng băm Buckets, hàm hashCode() và equals().
- Tự động chuyển đổi LinkedList sang Red-Black Tree khi va chạm >= 8.

## Chương 4: Virtual Threads (Java 21 Project Loom)
- Hàng triệu luồng siêu nhẹ (Virtual Threads) tiêu tốn vài trăm bytes RAM.
- Thay thế hoàn toàn mô hình Thread Pool truyền thống cho tác vụ I/O.`
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [packagedResult, setPackagedResult] = useState<CertifiedSubjectPackage | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunAIEngine = () => {
    setIsProcessing(true);
    setIsPublished(false);

    setTimeout(() => {
      const input: RawCurriculumInput = {
        title: subjectTitle,
        subjectCode,
        levelCode,
        authorName,
        organization,
        license,
        citationSources: citationSources.split(',').map(s => s.trim()),
        rawContentMarkdown: rawText
      };

      const result = validateAndPackageSubject(input);
      setPackagedResult(result);
      setIsProcessing(false);
    }, 1000);
  };

  const handlePublishToSystem = () => {
    if (!packagedResult) return;
    saveIngestedSubjectToStorage(packagedResult.subject);
    setIsPublished(true);
    onSubjectPublished?.(packagedResult.subject.id);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#070b18] border border-cyan-500/40 shadow-2xl overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Admin Curriculum Ingestion Hub
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  Cognitive Load Standard
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Đóng Gói Giáo Trình Tự Động Bằng AI (Decomposition & Synthesis)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          
          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tên Môn Học
              </label>
              <input
                type="text"
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Mã Môn Học (Subject Code)
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Cấp Độ SFIA Mục Tiêu
              </label>
              <select
                value={levelCode}
                onChange={(e) => setLevelCode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="L1">SFIA L1 • Follower</option>
                <option value="L2">SFIA L2 • Practitioner</option>
                <option value="L3">SFIA L3 • Senior Specialist</option>
                <option value="L4">SFIA L4 • Lead Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tác Giả / Giảng Viên
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tổ Chức / Đơn Vị Phát Hành
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nguồn Trích Dẫn Học Thuật
              </label>
              <input
                type="text"
                value={citationSources}
                onChange={(e) => setCitationSources(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Raw Text / Markdown Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Nội Dung Giáo Trình Thô (Markdown / PDF Text Ingestion)
              </label>
              <span className="text-[11px] text-slate-400">
                Hỗ trợ tiêu đề `#`, `##`, bảng biểu, code blocks ```
              </span>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* AI Run Action */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
            <div className="text-xs text-cyan-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                AI Engine sẽ tự động chia nhỏ thành các bài học vi mô (15-25 phút), sinh ngân hàng câu hỏi trắc nghiệm và biên dịch cây Gamification tương tác.
              </span>
            </div>

            <button
              onClick={handleRunAIEngine}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Phân Tích & Đóng Gói...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Phân Tích & Đóng Gói Bằng AI</span>
                </>
              )}
            </button>
          </div>

          {/* AI PACKAGED RESULT & QUALITY AUDIT REPORT */}
          {packagedResult && (
            <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-5 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Báo Cáo Thẩm Định Tiêu Chuẩn Môn Học (Quality Gate Audit)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Môn học: <strong className="text-cyan-300">{packagedResult.subject.title}</strong> ({packagedResult.subject.id})
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  packagedResult.auditReport.isCertified
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20 shadow-md'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {packagedResult.auditReport.isCertified ? '✓ CERTIFIED 100% ĐẠT CHUẨN' : '⚠️ CẦN BỔ SUNG'}
                </span>
              </div>

              {/* Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Metadata & Nguồn Tác Giả</span>
                  {packagedResult.auditReport.hasValidMetadata ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Lý Thuyết & Kiến Trúc Tầng Sâu</span>
                  {packagedResult.auditReport.hasCoreTheory ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Mã Nguồn Thực Tế (Code Snippets)</span>
                  {packagedResult.auditReport.hasCodeSnippets ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Số Bài Học Vi Mô Đã Tách</span>
                  <strong className="text-cyan-300 font-mono">
                    {packagedResult.auditReport.totalLessonsDecomposed} bài học
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Ngân Hàng Quiz Đã Sinh</span>
                  <strong className="text-amber-300 font-mono">
                    {packagedResult.auditReport.totalQuizGenerated} câu hỏi
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Mốc Boss Fight Exam</span>
                  {packagedResult.auditReport.hasBossFightMilestone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Decomposed Lessons Breakdown */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Danh Sách Bài Học Vi Mô Đã Đóng Gói
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {packagedResult.subject.lessons.map(lesson => (
                    <div 
                      key={lesson.id} 
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{lesson.title}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>⏱️ {lesson.estimatedMinutes} phút</span>
                          <span>•</span>
                          <span>🧠 Bloom: {lesson.bloomLevel}</span>
                          <span>•</span>
                          <span>🎯 {lesson.quizQuestions.length} câu trắc nghiệm</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 text-[10px]">
                        ✓ Sẵn Sàng
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Sau khi xuất bản, môn học sẽ tự động xuất hiện ngay trên cả <strong>Free Linear View</strong> và <strong>Pro Gamified Map</strong>.
                </p>

                <button
                  onClick={handlePublishToSystem}
                  disabled={!packagedResult.auditReport.isCertified || isPublished}
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                >
                  {isPublished ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Đã Xuất Bản Thành Công!</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Xuất Bản Môn Học Vào Hệ Thống</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}
