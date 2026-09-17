import { planWithRules } from '@/lib/planner/baseline-planner';
import type { PlannerLLMOutput } from '@/lib/prompts/planner';
import type { CatalogLab, PlannerInput, PlannerResult, PlannedTask } from '@/types/planner';

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

  const catalogById = new Map(lab.items.map((item) => [item.itemId, item]));
  const seen = new Set<string>();
  const tasks: PlannedTask[] = [];
  let usedMinutes = 0;

  for (const selected of output.tasks) {
    const item = catalogById.get(selected.item_id);
    if (!item || seen.has(item.itemId)) continue;
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
