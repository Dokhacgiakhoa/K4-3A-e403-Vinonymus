import { planWithRules } from '@/lib/planner/baseline-planner';
import type { PlannerLLMOutput } from '@/lib/prompts/planner';
import type { CatalogItem, CatalogLab, PlannerInput, PlannerResult, PlannedTask } from '@/types/planner';

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFC');
}

function matchesLearnerNeed(item: CatalogItem, note: string): boolean {
  const normalizedNote = normalize(note);
  if (!normalizedNote) return false;

  return [item.title, item.why, ...item.tags].map(normalize).some((value) => normalizedNote.includes(value));
}

function rankSelectedItems(
  output: PlannerLLMOutput & { status: 'plan' },
  input: PlannerInput,
  lab: CatalogLab,
): Array<{ item: CatalogItem; reason: string }> {
  const catalogById = new Map(lab.items.map((item) => [item.itemId, item]));
  const seen = new Set<string>();

  return output.tasks
    .map((selected, index) => {
      const item = catalogById.get(selected.item_id);
      if (!item || seen.has(item.itemId)) return null;
      seen.add(item.itemId);

      const score =
        (matchesLearnerNeed(item, input.note) ? 1000 : 0) +
        (item.tags.includes('core') ? 20 : 0) -
        index;

      return { item, reason: selected.reason, index, score };
    })
    .filter((entry): entry is { item: CatalogItem; reason: string; index: number; score: number } => Boolean(entry))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item, reason }) => ({ item, reason }));
}

/** Ghép output không đáng tin cậy của LLM với dữ liệu catalog đã kiểm chứng. */
export function materializePlannerResult(
  output: PlannerLLMOutput,
  input: PlannerInput,
  lab: CatalogLab,
): PlannerResult {
  if (output.status === 'clarify') return output;
  if (output.status === 'refuse') return output;

  if (output.diagnosis.confidence === 'low') {
    return {
      status: 'clarify',
      question: 'Thông tin nền tảng và ghi chú của bạn đang chưa khớp. Bạn mô tả ngắn phần mình đã biết hoặc đang vướng nhé?',
    };
  }

  const seen = new Set<string>();
  const tasks: PlannedTask[] = [];
  let usedMinutes = 0;

  for (const selected of rankSelectedItems(output, input, lab)) {
    const item = selected.item;
    if (seen.has(item.itemId)) continue;
    if (usedMinutes + item.minutes > input.availableMinutes) continue;
    tasks.push({
      itemId: item.itemId,
      title: item.title,
      url: item.url,
      type: item.type,
      minutes: item.minutes,
      reason: selected.reason.slice(0, 160),
    });
    seen.add(item.itemId);
    usedMinutes += item.minutes;
    if (tasks.length === 3) break;
  }

  if (tasks.length === 0) return planWithRules(input);

  return {
    status: 'plan',
    source: 'ai',
    diagnosis: {
      background: input.background,
      confidence: output.diagnosis.confidence,
      summary: output.diagnosis.summary.slice(0, 240),
    },
    tasks,
    message: `Tổng ${usedMinutes}/${input.availableMinutes} phút cho ${lab.title}.`,
  };
}
