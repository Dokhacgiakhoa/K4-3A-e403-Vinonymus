'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, FileCheck, MessageSquareWarning, Undo2 } from 'lucide-react';
import { DemoBanner } from '@/components/demo/demo-banner';
import { StatusBadge } from '@/components/lecturer/lecturer-documents-view';
import { loadDemoDocuments, saveDemoDocuments, type DemoDocument } from '@/lib/demo/demo-accounts';

export function DocumentReviewView() {
  const [docs, setDocs] = useState<DemoDocument[]>([]);

  useEffect(() => {
    setDocs(loadDemoDocuments());
  }, []);

  const update = (id: string, patch: Partial<DemoDocument>) => {
    const next = docs.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d));
    setDocs(next);
    saveDemoDocuments(next);
  };

  const pending = docs.filter((d) => d.status === 'review');
  const others = docs.filter((d) => d.status !== 'review');

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <FileCheck className="w-6 h-6 text-sky-300" />
        <h1 className="text-2xl font-bold text-white">Duyệt tài liệu</h1>
      </div>

      <DemoBanner>Chỉ tài liệu đã xuất bản mới vào thư viện để AI Mentor dùng khi lên lộ trình.</DemoBanner>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">Chờ duyệt ({pending.length})</h2>
        {pending.length === 0 && <p className="text-sm text-slate-400">Không có tài liệu nào đang chờ duyệt.</p>}
        <ul className="space-y-2">
          {pending.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-slate-950/70 p-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{doc.title}</div>
                <div className="text-xs text-slate-400 truncate">
                  {doc.fileName} · {doc.labTitle}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update(doc.id, { status: 'published', reviewNote: undefined })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt &amp; xuất bản
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update(doc.id, { status: 'needs_changes', reviewNote: 'Bổ sung ví dụ chạy được và nguồn tham khảo.' })
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-rose-300 border border-rose-500/40 cursor-pointer"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5" /> Yêu cầu sửa
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Tài liệu khác</h2>
        <ul className="space-y-2">
          {others.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{doc.title}</div>
                <div className="text-xs text-slate-400 truncate">
                  {doc.fileName} · {doc.labTitle}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                {doc.status === 'published' && (
                  <button
                    type="button"
                    onClick={() => update(doc.id, { status: 'draft' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" /> Thu hồi
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
