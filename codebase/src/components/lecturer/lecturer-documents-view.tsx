'use client';

import { useEffect, useState } from 'react';
import { FileText, RotateCcw, Send, Upload } from 'lucide-react';
import { DemoBanner } from '@/components/demo/demo-banner';
import {
  DEMO_DOCUMENT_STATUS_LABELS,
  loadDemoDocuments,
  resetDemoDocuments,
  saveDemoDocuments,
  type DemoDocument,
  type DemoDocumentStatus,
} from '@/lib/demo/demo-accounts';

const STATUS_STYLES: Record<DemoDocumentStatus, string> = {
  draft: 'bg-slate-800 text-slate-300 border-slate-700',
  review: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  published: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  needs_changes: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

const LAB_OPTIONS = [
  'Lab 04 · Prompt Engineering & Tool Calling',
  'Lab 05 · RAG Foundations',
  'Lab 06 · AI Product Spec',
];

export function StatusBadge({ status }: { status: DemoDocumentStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${STATUS_STYLES[status]}`}>
      {DEMO_DOCUMENT_STATUS_LABELS[status]}
    </span>
  );
}

export function LecturerDocumentsView() {
  const [docs, setDocs] = useState<DemoDocument[]>([]);
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [labTitle, setLabTitle] = useState(LAB_OPTIONS[0] ?? '');

  useEffect(() => {
    setDocs(loadDemoDocuments());
  }, []);

  const update = (next: DemoDocument[]) => {
    setDocs(next);
    saveDemoDocuments(next);
  };

  const addDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;
    update([
      {
        id: `demo-doc-${Date.now()}`,
        title: title.trim(),
        fileName: fileName.trim(),
        labTitle,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      },
      ...docs,
    ]);
    setTitle('');
    setFileName('');
  };

  const submitForReview = (id: string) => {
    update(
      docs.map((d) =>
        d.id === id ? { ...d, status: 'review', reviewNote: undefined, updatedAt: new Date().toISOString() } : d,
      ),
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-sky-300" />
          <h1 className="text-2xl font-bold text-white">Tài liệu của tôi</h1>
        </div>
        <button
          type="button"
          onClick={() => setDocs(resetDemoDocuments())}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Về dữ liệu mẫu
        </button>
      </div>

      <DemoBanner>Bản thật: file tải lên được chia đoạn, tạo vector và chỉ vào thư viện của AI Mentor sau khi Admin duyệt.</DemoBanner>

      <form
        onSubmit={addDraft}
        className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <label className="space-y-1 text-xs text-slate-300">
          <span>Tiêu đề</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Bài tập function calling"
            className="w-full rounded-lg border border-slate-700 bg-[#0b1329] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="space-y-1 text-xs text-slate-300">
          <span>Tên file (PDF, TXT, MD)</span>
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="lab04-bai-tap.pdf"
            className="w-full rounded-lg border border-slate-700 bg-[#0b1329] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!title.trim() || !fileName.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 disabled:opacity-40 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" /> Tạo nháp
        </button>
        <label className="space-y-1 text-xs text-slate-300 sm:col-span-3">
          <span>Bài lab</span>
          <select
            value={labTitle}
            onChange={(e) => setLabTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#0b1329] px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
          >
            {LAB_OPTIONS.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </label>
      </form>

      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{doc.title}</div>
                <div className="text-xs text-slate-400 truncate">
                  {doc.fileName} · {doc.labTitle}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                {(doc.status === 'draft' || doc.status === 'needs_changes') && (
                  <button
                    type="button"
                    onClick={() => submitForReview(doc.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi duyệt
                  </button>
                )}
              </div>
            </div>
            {doc.reviewNote && (
              <p className="text-xs text-rose-200 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                Admin nhận xét: {doc.reviewNote}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
