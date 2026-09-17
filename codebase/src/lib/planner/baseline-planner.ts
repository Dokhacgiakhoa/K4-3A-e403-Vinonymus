import { findLab } from '@/data/planner-catalog';
import type { CatalogItem, PlannerInput, PlannerResult, PlannedTask } from '@/types/planner';

export const MIN_MINUTES = 30;
export const MAX_TASKS = 3;

const OUT_OF_SCOPE_PATTERNS = [
  /làm hộ|làm giùm|làm dùm|giải hộ|code hộ/i,
  /đáp án|lời giải/i,
  /gia hạn|xin (nộp )?muộn|dời deadline/i,
  /chấm điểm|xin điểm|cho điểm/i,
  /bỏ qua (mọi |các )?hướng dẫn|ignore (all |previous )?instructions/i,
];

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFC');
}

function matchesNote(item: CatalogItem, note: string): boolean {
  const normalizedNote = normalize(note);
  return normalizedNote.length > 0 && item.tags.some((tag) => normalizedNote.includes(normalize(tag)));
}

function reasonFor(item: CatalogItem, input: PlannerInput): string {
  if (matchesNote(item, input.note)) return `Ghi chú của bạn đang nhắc tới phần này. ${item.why}`;
  if (input.background === 'non_tech' && item.level === 'basic') {
    return `Bạn chưa có nền tảng kỹ thuật nên bắt đầu từ bước cơ bản. ${item.why}`;
  }
  if (input.background === 'tech_base') {
    return `Bạn đã quen công cụ kỹ thuật nhưng còn mới với AI. ${item.why}`;
  }
  if (input.background === 'ai' && item.level === 'advanced') {
    return `Bạn đã có nền tảng AI nên ưu tiên phần thực hành nâng cao. ${item.why}`;
  }
  return item.why;
}

function rank(items: CatalogItem[], input: PlannerInput): CatalogItem[] {
  const score = (item: CatalogItem): number => {
    let value = 0;
    if (matchesNote(item, input.note)) value += 100;
    if (item.tags.includes('core')) value += 25;

    if (input.background === 'non_tech') {
      if (item.tags.includes('setup')) value += 50;
      if (item.level === 'basic') value += 30;
    } else if (input.background === 'tech_base') {
      if (item.tags.includes('setup')) value += 25;
      if (item.level === 'basic') value += 10;
    } else {
      if (item.tags.includes('setup')) value -= 20;
      if (item.level === 'advanced') value += 30;
      if (item.tags.includes('intro')) value -= 30;
    }
    return value;
  };

  return items
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}

/** Baseline dùng để so sánh và fallback khi AI/key gặp lỗi. */
export function planWithRules(input: PlannerInput): PlannerResult {
  const lab = findLab(input.labId);
  if (!lab) {
    return { status: 'clarify', question: 'Mình chưa có tài liệu cho bài lab này. Bạn chọn một bài trong danh sách nhé?' };
  }

  if (OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(input.note))) {
    return {
      status: 'refuse',
      message:
        'Mình chỉ giúp sắp xếp việc cần học; không làm bài hộ, đưa đáp án, chấm điểm hoặc xử lý gia hạn. Bạn hãy liên hệ Lab Coach cho các yêu cầu đó.',
    };
  }

  if (input.availableMinutes < MIN_MINUTES) {
    return {
      status: 'clarify',
      question: `Bạn đang có ${input.availableMinutes} phút, chưa đủ cho một nhiệm vụ trọn vẹn. Bạn có thể dành ít nhất ${MIN_MINUTES} phút không?`,
    };
  }

  const tasks: PlannedTask[] = [];
  let usedMinutes = 0;
  for (const item of rank(lab.items, input)) {
    if (tasks.length >= MAX_TASKS) break;
    if (usedMinutes + item.minutes > input.availableMinutes) continue;
    tasks.push({
      itemId: item.itemId,
      title: item.title,
      url: item.url,
      type: item.type,
      minutes: item.minutes,
      reason: reasonFor(item, input),
    });
    usedMinutes += item.minutes;
  }

  if (tasks.length === 0) {
    return {
      status: 'clarify',
      question: 'Quỹ thời gian hiện tại chưa vừa với tài liệu nào. Bạn có thể dành thêm thời gian không?',
    };
  }

  const summaries = {
    non_tech: 'Bạn chưa có nền tảng kỹ thuật; kế hoạch bắt đầu từ thao tác và khái niệm cơ bản.',
    tech_base: 'Bạn đã quen công cụ kỹ thuật nhưng còn mới với AI; kế hoạch cân bằng nền tảng và thực hành chính.',
    ai: 'Bạn đã có nền tảng AI; kế hoạch bỏ qua phần nhập môn và ưu tiên nội dung nâng cao.',
  } satisfies Record<PlannerInput['background'], string>;

  return {
    status: 'plan',
    source: 'baseline',
    diagnosis: { background: input.background, confidence: 'high', summary: summaries[input.background] },
    tasks,
    message: `Tổng ${usedMinutes}/${input.availableMinutes} phút cho ${lab.title}.`,
  };
}
