import { findLab } from '@/data/planner-catalog';
import type { CatalogItem, PlannerInput, PlannerResult, PlannedTask } from '@/types/planner';

export const MIN_MINUTES = 30;
export const MAX_TASKS = 3;

const OUT_OF_SCOPE_PATTERNS = [
  /làm hộ|làm giùm|làm dùm|giải hộ|code hộ|giải bài tập/i,
  /đáp án|lời giải|source code giải|code giải mẫu|testcase ẩn/i,
  /gia hạn|xin (nộp )?muộn|dời deadline|hoãn deadline|mở (lại |cổng )?nộp/i,
  /chấm điểm|xin điểm|cho điểm|nâng điểm|ghi đè (nâng )?điểm/i,
  /bỏ qua (mọi |các )?hướng dẫn|ignore (all |previous )?instructions|in system prompt|leak prompt|leak api key/i,
];

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFC');
}

function hasContradiction(background: PlannerInput['background'], note: string): boolean {
  const norm = normalize(note);
  if (!norm) return false;
  if (background === 'non_tech') {
    const expertPatterns = [
      /vận hành.*(rag|production)/i,
      /tối ưu.*(production|retrieval)/i,
      /retrieval production/i,
      /chuyên gia.*(ai|machine learning|deep learning)/i,
      /kinh nghiệm.*(production|hệ thống lớn|triển khai)/i,
      /senior.*(engineer|developer|dev)/i,
    ];
    return expertPatterns.some((pattern) => pattern.test(norm));
  }
  if (background === 'ai') {
    const beginnerPatterns = [
      /non-?tech/i,
      /chưa (từng |bao giờ )?(code|lập trình|dùng api|biết api)/i,
      /chưa biết (api|code|lập trình|notebook)/i,
      /mới bắt đầu.*chưa biết gì/i,
    ];
    return beginnerPatterns.some((pattern) => pattern.test(norm));
  }
  return false;
}

function matchesNote(item: CatalogItem, note: string): boolean {
  const normalizedNote = normalize(note);
  if (!normalizedNote) return false;
  return item.tags.some((tag) => {
    const normTag = normalize(tag);
    const index = normalizedNote.indexOf(normTag);
    if (index === -1) return false;
    // Bỏ qua nếu từ khoá đi sau các từ phủ định hoặc đã có kiến thức này
    const prefix = normalizedNote.slice(Math.max(0, index - 25), index);
    const isExcluded = /(đã (có|làm|hiểu|biết|dùng|nắm|quen)|bỏ qua|không cần|skip)/.test(prefix);
    return !isExcluded;
  });
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

function isExcludedByNote(item: CatalogItem, note: string): boolean {
  const norm = normalize(note);
  if (!norm) return false;
  if (norm.includes('bỏ qua tổng quan') && item.tags.includes('intro')) return true;
  return item.tags.some((tag) => {
    const normTag = normalize(tag);
    const index = norm.indexOf(normTag);
    if (index === -1) return false;
    const prefix = norm.slice(Math.max(0, index - 25), index);
    return /(bỏ qua|không cần|skip|loại trừ)/.test(prefix);
  });
}

function rank(items: CatalogItem[], input: PlannerInput): CatalogItem[] {
  const score = (item: CatalogItem): number => {
    if (isExcludedByNote(item, input.note)) return -1000;
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
      if (item.tags.includes('setup')) value -= 50;
      if (item.level === 'advanced') value += 30;
      if (item.tags.includes('intro')) value -= 50;
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

  if (hasContradiction(input.background, input.note)) {
    return {
      status: 'clarify',
      question:
        'Thông tin nền tảng và ghi chú của bạn đang chưa khớp. Bạn mô tả ngắn phần mình đã biết hoặc đang vướng nhé?',
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
    if (isExcludedByNote(item, input.note)) continue;
    if (
      input.background === 'ai' &&
      tasks.length >= 1 &&
      (item.tags.includes('setup') || item.tags.includes('intro')) &&
      !matchesNote(item, input.note)
    ) {
      continue;
    }
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
