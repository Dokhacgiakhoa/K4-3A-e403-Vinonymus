'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  ChevronRight,
  FileClock,
  FileText,
  History,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  XCircle,
} from 'lucide-react';
import { PLANNER_CATALOG } from '@/data/planner-catalog';
import { StaffApiError, staffBackendClient } from '@/lib/api/staff-backend-client';
import type {
  DocumentFileType,
  DocumentInput,
  DocumentReview,
  DocumentStatus,
  DocumentVersion,
  ReviewDecision,
  StaffDocument,
} from '@/types/staff';

type ManagerMode = 'lecture' | 'admin';

interface DocumentManagerProps {
  mode: ManagerMode;
}

interface DocumentDraft {
  title: string;
  summary: string;
  labId: string;
  itemIds: string[];
  sourcePath: string;
  fileName: string;
  fileType: DocumentFileType;
  mimeType: DocumentInput['mimeType'];
  fileSizeBytes: number;
  contentHash: string;
}

const STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'Bản nháp',
  processing: 'Đang xử lý',
  review: 'Chờ duyệt',
  published: 'Đã xuất bản',
  archived: 'Đã lưu trữ',
  failed: 'Xử lý lỗi',
};

const STATUS_STYLES: Record<DocumentStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  processing: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  review: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  archived: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

const EMPTY_DRAFT: DocumentDraft = {
  title: '',
  summary: '',
  labId: PLANNER_CATALOG[0]?.labId ?? '',
  itemIds: [],
  sourcePath: '',
  fileName: '',
  fileType: 'markdown',
  mimeType: 'text/markdown',
  fileSizeBytes: 0,
  contentHash: '',
};

function formatDate(value: string | null): string {
  return value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—';
}

function inputFromDraft(draft: DocumentDraft): DocumentInput {
  return {
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    labId: draft.labId,
    itemIds: draft.itemIds,
    sourcePath: draft.sourcePath.trim(),
    fileName: draft.fileName.trim(),
    fileType: draft.fileType,
    mimeType: draft.mimeType,
    fileSizeBytes: draft.fileSizeBytes,
    contentHash: draft.contentHash,
  };
}

function draftFromDocument(document: StaffDocument): DocumentDraft {
  return {
    title: document.title,
    summary: document.summary,
    labId: document.lab_id ?? PLANNER_CATALOG[0]?.labId ?? '',
    itemIds: document.item_ids,
    sourcePath: document.source_path,
    fileName: document.file_name,
    fileType: document.file_type,
    mimeType: document.mime_type as DocumentInput['mimeType'],
    fileSizeBytes: document.file_size_bytes,
    contentHash: document.content_hash,
  };
}

async function describeFile(file: File): Promise<Pick<DocumentDraft, 'fileName' | 'fileType' | 'mimeType' | 'fileSizeBytes' | 'contentHash' | 'sourcePath'>> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const fileType: DocumentFileType = extension === 'pdf' ? 'pdf' : extension === 'txt' ? 'text' : 'markdown';
  const mimeType: DocumentInput['mimeType'] = fileType === 'pdf' ? 'application/pdf' : fileType === 'text' ? 'text/plain' : 'text/markdown';
  const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  const contentHash = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return {
    fileName: file.name,
    fileType,
    mimeType,
    fileSizeBytes: file.size,
    contentHash,
    sourcePath: `lecture-materials/${file.name}`,
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof StaffApiError && error.status === 409) {
    return `${error.message} Dữ liệu đã được tải lại; hãy kiểm tra revision và trạng thái trước khi thao tác tiếp.`;
  }
  return error instanceof Error ? error.message : 'Có lỗi không xác định. Vui lòng thử lại.';
}

export function DocumentManager({ mode }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<StaffDocument[]>([]);
  const [selected, setSelected] = useState<StaffDocument | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [reviews, setReviews] = useState<DocumentReview[]>([]);
  const [status, setStatus] = useState<DocumentStatus | ''>('');
  const [draft, setDraft] = useState<DocumentDraft>(EMPTY_DRAFT);
  const [editing, setEditing] = useState<StaffDocument | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>('approved');
  const [reviewNote, setReviewNote] = useState('Đã đối chiếu nội dung, catalog và nguồn tài liệu.');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const result = mode === 'admin'
        ? await staffBackendClient.listAdminDocuments()
        : await staffBackendClient.listLectureDocuments(status || undefined);
      setDocuments(result.data);
    } catch (error) {
      setNotice({ kind: 'error', text: errorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, [mode, status]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const visibleDocuments = useMemo(
    () => mode === 'admin' && status ? documents.filter((document) => document.status === status) : documents,
    [documents, mode, status],
  );

  const selectDocument = async (document: StaffDocument) => {
    setSelected(document);
    setVersions([]);
    setReviews([]);
    try {
      const [detail, versionRows, reviewRows] = await Promise.all([
        mode === 'admin' ? staffBackendClient.getAdminDocument(document.id) : staffBackendClient.getLectureDocument(document.id),
        staffBackendClient.getDocumentVersions(document.id),
        staffBackendClient.getDocumentReviews(document.id),
      ]);
      setSelected(detail);
      setVersions(versionRows);
      setReviews(reviewRows);
    } catch (error) {
      setNotice({ kind: 'error', text: errorMessage(error) });
    }
  };

  const openCreate = () => {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setShowForm(true);
  };

  const openEdit = (document: StaffDocument) => {
    setEditing(document);
    setDraft(draftFromDocument(document));
    setShowForm(true);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 100_000_000) {
      setNotice({ kind: 'error', text: 'Tệp vượt giới hạn 100 MB của backend.' });
      return;
    }
    setBusy(true);
    try {
      const details = await describeFile(file);
      setDraft((current) => ({ ...current, ...details, title: current.title || file.name.replace(/\.[^.]+$/, '') }));
    } finally {
      setBusy(false);
    }
  };

  const saveDocument = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.itemIds.length || !draft.contentHash) {
      setNotice({ kind: 'error', text: 'Hãy chọn ít nhất một mục catalog và một tệp PDF/TXT/MD.' });
      return;
    }
    setBusy(true);
    try {
      const saved = editing
        ? await staffBackendClient.updateDocument(editing.id, inputFromDraft(draft), editing.revision)
        : await staffBackendClient.createDocument(inputFromDraft(draft));
      setShowForm(false);
      setEditing(null);
      setNotice({
        kind: 'success',
        text: `Đã ${editing ? 'cập nhật' : 'đăng ký'} metadata tài liệu. Backend hiện chưa nhận bytes của tệp.`,
      });
      await loadDocuments();
      await selectDocument(saved);
    } catch (error) {
      setNotice({ kind: 'error', text: errorMessage(error) });
      if (error instanceof StaffApiError && error.status === 409) await loadDocuments();
    } finally {
      setBusy(false);
    }
  };

  const runAction = async (action: () => Promise<StaffDocument>, successText: string) => {
    setBusy(true);
    try {
      const updated = await action();
      setNotice({ kind: 'success', text: successText });
      await loadDocuments();
      await selectDocument(updated);
    } catch (error) {
      setNotice({ kind: 'error', text: errorMessage(error) });
      if (error instanceof StaffApiError && error.status === 409) await loadDocuments();
    } finally {
      setBusy(false);
    }
  };

  const removeSelected = async () => {
    if (!selected || !window.confirm(`Xóa mềm tài liệu “${selected.title}”?`)) return;
    await runAction(
      () => mode === 'admin'
        ? staffBackendClient.deleteAdminDocument(selected.id, selected.revision)
        : staffBackendClient.deleteLectureDocument(selected.id, selected.revision),
      'Đã xóa mềm tài liệu.',
    );
  };

  const selectedLab = PLANNER_CATALOG.find((lab) => lab.labId === draft.labId);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Kho tài liệu học tập</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {mode === 'admin' ? 'Duyệt, xuất bản và quản trị tài liệu toàn hệ thống.' : 'Tạo metadata, gửi duyệt và theo dõi vòng đời tài liệu của bạn.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as DocumentStatus | '')}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Lọc trạng thái tài liệu"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button onClick={() => void loadDocuments()} className="staff-button-secondary" type="button">
            <RefreshCw className="h-4 w-4" /> Làm mới
          </button>
          {mode === 'lecture' && (
            <button onClick={openCreate} className="staff-button-primary" type="button">
              <Plus className="h-4 w-4" /> Thêm tài liệu
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${notice.kind === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200' : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Đóng thông báo"><XCircle className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)]">
        <div className="staff-panel overflow-hidden">
          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Đang tải tài liệu…</div>
          ) : visibleDocuments.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
              <FileText className="mb-3 h-10 w-10 text-slate-400" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">Chưa có tài liệu phù hợp</p>
              <p className="mt-1 text-sm text-slate-500">{mode === 'lecture' ? 'Tạo tài liệu đầu tiên để bắt đầu quy trình duyệt.' : 'Không có tài liệu trong hàng đợi hiện tại.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {visibleDocuments.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => void selectDocument(document)}
                  className={`flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selected?.id === document.id ? 'bg-sky-50 dark:bg-sky-950/30' : ''}`}
                >
                  <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700 dark:bg-sky-950 dark:text-sky-300"><FileText className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-slate-950 dark:text-white">{document.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[document.status]}`}>{STATUS_LABELS[document.status]}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">{document.file_name} · {document.lab_id ?? 'Chưa gắn lab'} · revision {document.revision}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="staff-panel p-5">
          {!selected ? (
            <div className="flex min-h-56 flex-col items-center justify-center text-center text-sm text-slate-500">
              <FileClock className="mb-3 h-9 w-9" /> Chọn một tài liệu để xem chi tiết và thao tác.
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-950 dark:text-white">{selected.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">ID: {selected.id}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${STATUS_STYLES[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selected.summary}</p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div><dt className="text-slate-500">Revision</dt><dd className="mt-1 font-semibold">{selected.revision}</dd></div>
                <div><dt className="text-slate-500">Số chunk</dt><dd className="mt-1 font-semibold">{selected.chunk_count}</dd></div>
                <div><dt className="text-slate-500">Storage</dt><dd className="mt-1 font-semibold">{selected.storage_bucket ?? 'Chưa upload'}</dd></div>
                <div><dt className="text-slate-500">Đã index</dt><dd className="mt-1 font-semibold">{selected.indexed_revision === selected.revision ? 'Có' : 'Chưa'}</dd></div>
                <div className="col-span-2"><dt className="text-slate-500">Cập nhật</dt><dd className="mt-1 font-semibold">{formatDate(selected.updated_at)}</dd></div>
              </dl>

              <div className="flex flex-wrap gap-2">
                {mode === 'lecture' && selected.status !== 'published' && selected.status !== 'review' && (
                  <button type="button" className="staff-button-secondary" onClick={() => openEdit(selected)}><Pencil className="h-4 w-4" /> Sửa</button>
                )}
                {mode === 'lecture' && ['draft', 'failed', 'archived'].includes(selected.status) && (
                  <button type="button" className="staff-button-primary" disabled={busy} onClick={() => void runAction(() => staffBackendClient.submitDocument(selected.id, selected.revision), 'Đã gửi tài liệu sang hàng đợi duyệt.')}><Send className="h-4 w-4" /> Gửi duyệt</button>
                )}
                {selected.status === 'review' && (
                  <button type="button" className="staff-button-primary" disabled={busy || !reviewNote.trim()} onClick={() => void runAction(() => mode === 'admin' ? staffBackendClient.reviewAdminDocument(selected.id, selected.revision, reviewDecision, reviewNote.trim()) : staffBackendClient.reviewLectureDocument(selected.id, selected.revision, reviewDecision, reviewNote.trim()), 'Đã ghi nhận kết quả review.')}><ShieldCheck className="h-4 w-4" /> Lưu review</button>
                )}
                {selected.approved_revision === selected.revision && selected.status !== 'published' && (
                  <button type="button" className="staff-button-primary" disabled={busy} onClick={() => void runAction(() => mode === 'admin' ? staffBackendClient.publishAdminDocument(selected.id, selected.revision) : staffBackendClient.publishLectureDocument(selected.id, selected.revision), 'Đã xuất bản tài liệu.')}><CheckCircle2 className="h-4 w-4" /> Xuất bản</button>
                )}
                {selected.status === 'published' && (
                  <button type="button" className="staff-button-secondary" disabled={busy} onClick={() => void runAction(() => mode === 'admin' ? staffBackendClient.archiveAdminDocument(selected.id, selected.revision) : staffBackendClient.archiveLectureDocument(selected.id, selected.revision), 'Đã lưu trữ tài liệu.')}><Archive className="h-4 w-4" /> Lưu trữ</button>
                )}
                {selected.status !== 'published' && (
                  <button type="button" className="staff-button-danger" disabled={busy} onClick={() => void removeSelected()}><Trash2 className="h-4 w-4" /> Xóa</button>
                )}
              </div>

              {selected.status === 'review' && (
                <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <select value={reviewDecision} onChange={(event) => setReviewDecision(event.target.value as ReviewDecision)} className="staff-input">
                    <option value="approved">Phê duyệt</option>
                    <option value="needs_changes">Yêu cầu chỉnh sửa</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                  <textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} maxLength={2000} rows={3} className="staff-input" placeholder="Ghi chú review bắt buộc" />
                </div>
              )}

              <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <h4 className="flex items-center gap-2 text-sm font-semibold"><History className="h-4 w-4" /> Lịch sử & review</h4>
                <p className="text-xs text-slate-500">{versions.length} phiên bản · {reviews.length} lượt review</p>
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="rounded-lg bg-slate-50 p-2.5 text-xs dark:bg-slate-800/60">
                    <span className="font-semibold">{review.decision}</span> · revision {review.revision ?? '—'}
                    {review.note && <p className="mt-1 text-slate-600 dark:text-slate-300">{review.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={saveDocument} className="staff-panel max-h-[92vh] w-full max-w-3xl overflow-y-auto p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><h3 className="text-lg font-bold text-slate-950 dark:text-white">{editing ? 'Cập nhật tài liệu' : 'Thêm tài liệu học tập'}</h3><p className="mt-1 text-xs text-amber-700 dark:text-amber-300">API hiện chỉ lưu metadata. Tệp được dùng để tính SHA-256 trên trình duyệt, chưa được tải lên Storage.</p></div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Đóng"><XCircle className="h-5 w-5 text-slate-500" /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="staff-label">Chọn tệp PDF, TXT hoặc MD</span><span className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sky-400 bg-sky-50 px-4 py-6 text-sm font-semibold text-sky-700 dark:bg-sky-950/30 dark:text-sky-300"><Upload className="h-5 w-5" /> {busy ? 'Đang tính SHA-256…' : draft.fileName || 'Chọn tệp từ máy'}<input className="sr-only" type="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" onChange={(event) => void handleFile(event.target.files?.[0])} /></span></label>
              <label><span className="staff-label">Tiêu đề</span><input className="staff-input" required maxLength={255} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
              <label><span className="staff-label">Lab</span><select className="staff-input" required value={draft.labId} onChange={(event) => setDraft({ ...draft, labId: event.target.value, itemIds: [] })}>{PLANNER_CATALOG.map((lab) => <option key={lab.labId} value={lab.labId}>{lab.title}</option>)}</select></label>
              <label className="sm:col-span-2"><span className="staff-label">Tóm tắt</span><textarea className="staff-input" required maxLength={2000} rows={3} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></label>
              <fieldset className="sm:col-span-2"><legend className="staff-label">Mục catalog liên quan</legend><div className="mt-1 grid gap-2 sm:grid-cols-2">{selectedLab?.items.map((item) => <label key={item.itemId} className="flex items-start gap-2 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800"><input type="checkbox" className="mt-1" checked={draft.itemIds.includes(item.itemId)} onChange={(event) => setDraft({ ...draft, itemIds: event.target.checked ? [...draft.itemIds, item.itemId] : draft.itemIds.filter((id) => id !== item.itemId) })} /><span><strong className="block text-slate-900 dark:text-slate-100">{item.title}</strong><small className="text-slate-500">{item.itemId}</small></span></label>)}</div></fieldset>
              <label className="sm:col-span-2"><span className="staff-label">Source path</span><input className="staff-input font-mono text-xs" required maxLength={500} value={draft.sourcePath} onChange={(event) => setDraft({ ...draft, sourcePath: event.target.value })} /></label>
              <div className="sm:col-span-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"><strong>SHA-256:</strong> <span className="break-all font-mono">{draft.contentHash || 'Chưa tính'}</span></div>
            </div>

            <div className="mt-6 flex justify-end gap-2"><button type="button" className="staff-button-secondary" onClick={() => setShowForm(false)}>Hủy</button><button type="submit" className="staff-button-primary" disabled={busy || !draft.contentHash}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {editing ? 'Lưu revision mới' : 'Đăng ký metadata'}</button></div>
          </form>
        </div>
      )}
    </section>
  );
}
