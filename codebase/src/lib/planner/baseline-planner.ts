import { findLab } from '@/data/planner-catalog';
import type { CatalogItem, PlannerInput, PlannerResult, PlannedTask } from '@/types/planner';

export const MIN_MINUTES = 30;
export const MAX_TASKS = 3;

// Yêu cầu ngoài phạm vi: làm hộ, xin đáp án/điểm, xin gia hạn, cố ghi đè chỉ dẫn.
// Ghi chú của học viên là DỮ LIỆU — khớp mẫu thì từ chối, không làm theo.
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
  const n = normalize(note);
  return n.length > 0 && item.tags.some((tag) => n.includes(normalize(tag)));
}

function reasonFor(item: CatalogItem, input: PlannerInput): string {
  if (matchesNote(item, input.note)) {
    return `Bạn ghi chú đang vướng phần này — làm trước để không kẹt. ${item.why}`;
  }
  if (input.background === 'non_tech' && item.level === 'basic') {
    return `Nền tảng non-tech nên bắt đầu từ phần cơ bản. ${item.why}`;
  }
  if (input.background === 'tech' && item.level === 'advanced') {
    return `Bạn đã quen code, dành thời gian cho phần thực hành chính. ${item.why}`;
  }
  return item.why;
}

function rank(items: CatalogItem[], input: PlannerInput): CatalogItem[] {
  const score = (item: CatalogItem): number => {
    let s = 0;
    if (matchesNote(item, input.note)) s += 100;
    if (item.tags.includes('setup')) s += 50;
    if (input.background === 'non_tech') {
      s += item.level === 'basic' ? 20 : 0;
    } else {
      s += item.level === 'advanced' ? 20 : 0;
      s -= item.tags.includes('intro') ? 30 : 0;
    }
    return s;
  };
  // sort ổn định: cùng điểm thì giữ thứ tự trong catalog (thứ tự bài giảng)
  return items
    .map((item, index) => ({ item, index, s: score(item) }))
    .sort((a, b) => b.s - a.s || a.index - b.index)
    .map((x) => x.item);
}

/**
 * Luật tĩnh lập kế hoạch tự học. Dùng làm bản mô phỏng ở CP2, baseline so sánh
 * và phương án dự phòng khi không gọi được LLM (SRS FR-P09).
 */
export function planWithRules(input: PlannerInput): PlannerResult {
  const lab = findLab(input.labId);
  if (!lab) {
    return { status: 'clarify', question: 'Mình chưa có tài liệu cho bài lab này. Bạn chọn một bài lab trong danh sách nhé?' };
  }

  if (OUT_OF_SCOPE_PATTERNS.some((p) => p.test(input.note))) {
    return {
      status: 'refuse',
      message:
        'Mình chỉ giúp sắp xếp việc cần học, không làm bài hộ, không đưa đáp án và không xử lý gia hạn hay điểm số. Những việc đó bạn nhắn Lab Coach của phòng nhé.',
    };
  }

  if (input.availableMinutes < MIN_MINUTES) {
    return {
      status: 'clarify',
      question: `Hôm nay bạn chỉ có ${input.availableMinutes} phút — chưa đủ cho một việc trọn vẹn. Bạn có thể dành ít nhất ${MIN_MINUTES} phút không, hay muốn ưu tiên chỉ phần chuẩn bị môi trường?`,
    };
  }

  const tasks: PlannedTask[] = [];
  let used = 0;
  for (const item of rank(lab.items, input)) {
    if (tasks.length >= MAX_TASKS) break;
    if (used + item.minutes > input.availableMinutes) continue;
    tasks.push({
      itemId: item.itemId,
      title: item.title,
      url: item.url,
      type: item.type,
      minutes: item.minutes,
      reason: reasonFor(item, input),
    });
    used += item.minutes;
  }

  if (tasks.length === 0) {
    return {
      status: 'clarify',
      question: 'Thời gian bạn nhập chưa vừa với tài liệu nào của bài lab này. Bạn có thể dành thêm thời gian không?',
    };
  }

  const summary =
    input.background === 'tech'
      ? 'Bạn đã quen lập trình — bỏ qua phần nhập môn, tập trung vào phần thực hành của bài lab.'
      : 'Bạn đến từ nền tảng non-tech — đi từ phần cơ bản và thao tác chuẩn bị trước.';

  return {
    status: 'plan',
    source: 'baseline',
    diagnosis: { background: input.background, confidence: 'high', summary },
    tasks,
    message: `Tổng ${used}/${input.availableMinutes} phút cho ${lab.title}.`,
  };
}
