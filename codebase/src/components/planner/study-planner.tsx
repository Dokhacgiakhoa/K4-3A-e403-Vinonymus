'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  HelpCircle,
  Laptop,
  Loader2,
  NotebookPen,
  PlayCircle,
  Presentation,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { PLANNER_CATALOG } from '@/data/planner-catalog';
import { MIN_MINUTES, planWithRules } from '@/lib/planner/baseline-planner';
import type {
  CatalogItemType,
  PlannedTask,
  PlannerBackground,
  PlannerInput,
  PlannerResult,
} from '@/types/planner';

const STORAGE_KEY = 'vinonymus_planner_v1';
const NOTE_MAX = 500;
const STEPS = ['Nền tảng', 'Thời gian & bài lab', 'Ghi chú', 'Kế hoạch'] as const;
const MINUTE_PRESETS = [30, 45, 60, 90, 120];

interface ChecklistTask extends PlannedTask {
  done: boolean;
}

interface SavedPlan {
  input: PlannerInput;
  result: Extract<PlannerResult, { status: 'plan' }>;
  checklist: ChecklistTask[];
}

const TYPE_META: Record<CatalogItemType, { label: string; icon: React.ElementType }> = {
  slide: { label: 'Slide', icon: Presentation },
  video: { label: 'Video', icon: PlayCircle },
  notebook: { label: 'Notebook', icon: NotebookPen },
  doc: { label: 'Tài liệu', icon: FileText },
};

function loadSaved(): SavedPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPlan) : null;
  } catch {
    return null;
  }
}

function persist(plan: SavedPlan | null) {
  try {
    if (plan) localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Trình duyệt chặn storage: kế hoạch vẫn dùng được trong phiên hiện tại
  }
}

export function StudyPlanner() {
  const [step, setStep] = useState(0);
  const [background, setBackground] = useState<PlannerBackground | null>(null);
  const [minutes, setMinutes] = useState<number>(60);
  const [labId, setLabId] = useState<string>(PLANNER_CATALOG[0]?.labId ?? '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [checklist, setChecklist] = useState<ChecklistTask[]>([]);

  useEffect(() => {
    const saved = loadSaved();
    if (!saved) return;
    setBackground(saved.input.background);
    setMinutes(saved.input.availableMinutes);
    setLabId(saved.input.labId);
    setNote(saved.input.note);
    setResult(saved.result);
    setChecklist(saved.checklist);
    setStep(3);
  }, []);

  const input: PlannerInput | null = background
    ? { background, availableMinutes: minutes, labId, note: note.trim() }
    : null;

  const updateChecklist = (next: ChecklistTask[]) => {
    setChecklist(next);
    if (input && result?.status === 'plan') persist({ input, result, checklist: next });
  };

  const generate = () => {
    if (!input) return;
    setLoading(true);
    // CP2 chỉ mô phỏng: kết quả lấy từ luật tĩnh, chưa gọi LLM (sẽ nối /api/roadmap ở CP3)
    window.setTimeout(() => {
      const res = planWithRules(input);
      setResult(res);
      if (res.status === 'plan') {
        const list = res.tasks.map((t) => ({ ...t, done: false }));
        setChecklist(list);
        persist({ input, result: res, checklist: list });
      } else {
        setChecklist([]);
        persist(null);
      }
      setLoading(false);
      setStep(3);
    }, 700);
  };

  const restart = () => {
    persist(null);
    setResult(null);
    setChecklist([]);
    setStep(0);
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    const a = checklist[index];
    const b = checklist[target];
    if (!a || !b) return;
    const next = [...checklist];
    next[index] = b;
    next[target] = a;
    updateChecklist(next);
  };

  const canNext =
    (step === 0 && background !== null) ||
    (step === 1 && Number.isFinite(minutes) && minutes >= 0 && minutes <= 600 && labId !== '') ||
    step === 2;

  const doneCount = checklist.filter((t) => t.done).length;
  const totalMinutes = checklist.reduce((sum, t) => sum + t.minutes, 0);
  const selectedLab = PLANNER_CATALOG.find((l) => l.labId === labId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          Bản mô phỏng CP2 · kết quả từ luật tĩnh, chưa gọi AI
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Diagnostic Study Planner</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Cho biết nền tảng và thời gian rảnh hôm nay — nhận đúng <strong>3 việc trọng tâm</strong> kèm link tài liệu
          cho bài lab tiếp theo. Bạn luôn sửa được danh sách trước khi bắt đầu.
        </p>
      </div>

      {/* Stepper */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Các bước">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-xl px-2 py-2 text-center text-[11px] sm:text-xs font-semibold border transition ${
              i === step
                ? 'bg-sky-500/20 border-sky-400/60 text-sky-200'
                : i < step
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="block text-[10px] opacity-70">Bước {i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <section className="rounded-3xl bg-slate-950/70 border border-slate-800 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
        {/* Bước 1 */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Bạn đến từ nền tảng nào?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  { id: 'tech', title: 'Tech', desc: 'Đã viết code, quen dòng lệnh / notebook.', icon: Laptop },
                  { id: 'non_tech', title: 'Non-tech', desc: 'Kinh doanh, vận hành, thiết kế… ít hoặc chưa code.', icon: Users },
                ] as const
              ).map((opt) => {
                const Icon = opt.icon;
                const active = background === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBackground(opt.id)}
                    aria-pressed={active}
                    className={`text-left rounded-2xl p-4 border transition cursor-pointer ${
                      active
                        ? 'bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/40'
                        : 'bg-slate-900/70 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-sky-300 mb-2" />
                    <div className="font-bold text-white">{opt.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bước 2 */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="planner-minutes" className="text-lg font-bold text-white block">
                Hôm nay bạn rảnh bao nhiêu phút?
              </label>
              <div className="flex flex-wrap gap-2">
                {MINUTE_PRESETS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutes(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      minutes === m ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {m} phút
                  </button>
                ))}
              </div>
              <input
                id="planner-minutes"
                type="number"
                min={0}
                max={600}
                value={Number.isFinite(minutes) ? minutes : ''}
                onChange={(e) => setMinutes(e.target.value === '' ? Number.NaN : Number(e.target.value))}
                className="w-40 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {Number.isFinite(minutes) && minutes < MIN_MINUTES && (
                <p className="text-xs text-amber-300">Dưới {MIN_MINUTES} phút — hệ thống sẽ hỏi lại thay vì đoán.</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="planner-lab" className="text-lg font-bold text-white block">
                Bài lab tiếp theo của bạn
              </label>
              <select
                id="planner-lab"
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {PLANNER_CATALOG.map((lab) => (
                  <option key={lab.labId} value={lab.labId}>
                    {lab.title}
                  </option>
                ))}
              </select>
              {selectedLab && <p className="text-xs text-slate-400">{selectedLab.description}</p>}
            </div>
          </div>
        )}

        {/* Bước 3 */}
        {step === 2 && (
          <div className="space-y-3">
            <label htmlFor="planner-note" className="text-lg font-bold text-white block">
              Bạn đang vướng gì? <span className="text-sm font-normal text-slate-400">(tuỳ chọn)</span>
            </label>
            <textarea
              id="planner-note"
              rows={4}
              maxLength={NOTE_MAX}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: mình chưa quen Colab, hay bị lỗi khi cài API key…"
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <div className="text-right text-[11px] text-slate-500">
              {note.length}/{NOTE_MAX}
            </div>
            <p className="text-xs text-slate-400">Không cần ghi họ tên hay mã học viên.</p>
          </div>
        )}

        {/* Bước 4 */}
        {step === 3 && result && (
          <div className="space-y-5">
            {result.status === 'plan' && (
              <>
                <div className="rounded-2xl bg-sky-500/10 border border-sky-500/30 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-sky-200 font-semibold text-sm">
                    <Sparkles className="w-4 h-4" /> Chẩn đoán
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {result.source === 'ai' ? 'AI' : 'Gợi ý mặc định · chưa cá nhân hoá bằng AI'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{result.diagnosis.summary}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Hoàn thành {doneCount}/{checklist.length} việc
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {totalMinutes}/{minutes} phút
                  </span>
                </div>

                <ul className="space-y-3">
                  {checklist.map((task, i) => {
                    const meta = TYPE_META[task.type];
                    const TypeIcon = meta.icon;
                    return (
                      <li
                        key={task.itemId}
                        className={`rounded-2xl border p-4 transition ${
                          task.done ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/70 border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateChecklist(checklist.map((t, j) => (j === i ? { ...t, done: !t.done } : t)))
                            }
                            aria-label={task.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                            className="mt-0.5 cursor-pointer"
                          >
                            {task.done ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-500">#{i + 1}</span>
                              <span className={`font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-white'}`}>
                                {task.title}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                                <TypeIcon className="w-3 h-3" /> {meta.label}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.minutes} phút
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">
                              <span className="text-slate-500">Vì sao: </span>
                              {task.reason}
                            </p>
                            <a
                              href={task.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-200"
                            >
                              <BookOpen className="w-3.5 h-3.5" /> Mở tài liệu <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => move(i, -1)}
                              disabled={i === 0}
                              aria-label="Đưa lên"
                              className="p-1 rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => move(i, 1)}
                              disabled={i === checklist.length - 1}
                              aria-label="Đưa xuống"
                              className="p-1 rounded-md text-slate-400 hover:bg-slate-800 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChecklist(checklist.filter((_, j) => j !== i))}
                              aria-label="Bỏ việc này"
                              className="p-1 rounded-md text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {checklist.length === 0 && (
                  <p className="text-sm text-slate-400">Bạn đã bỏ hết việc. Bấm "Khôi phục đề xuất" để lấy lại.</p>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateChecklist(result.tasks.map((t) => ({ ...t, done: false })))}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Khôi phục đề xuất
                  </button>
                </div>
              </>
            )}

            {result.status === 'clarify' && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/40 p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-amber-200">
                  <HelpCircle className="w-5 h-5" /> Mình cần hỏi lại một chút
                </div>
                <p className="text-sm text-slate-200">{result.question}</p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Sửa thời gian / bài lab
                </button>
              </div>
            )}

            {result.status === 'refuse' && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/40 p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-rose-200">
                  <AlertTriangle className="w-5 h-5" /> Việc này nằm ngoài phạm vi
                </div>
                <p className="text-sm text-slate-200">{result.message}</p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-rose-400 text-slate-950 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Sửa ghi chú
                </button>
              </div>
            )}
          </div>
        )}

        {/* Điều hướng */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800">
          {step > 0 && step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          ) : (
            <span />
          )}

          {step < 2 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={generate}
              disabled={loading || !input}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Đang lập kế hoạch…' : 'Lập kế hoạch'}
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Lập kế hoạch mới
            </button>
          )}
        </div>
      </section>

      <p className="text-[11px] text-slate-500 text-center">
        Kế hoạch lưu trên trình duyệt của bạn, không gửi lên máy chủ. Nhóm Vinonymus · Mini Hackathon AI · Track E.
      </p>
    </div>
  );
}
