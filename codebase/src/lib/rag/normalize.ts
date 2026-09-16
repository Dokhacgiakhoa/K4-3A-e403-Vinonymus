const ACRONYMS: Record<string, string> = {
  'aiia': 'ai in action',
  'a1': 'assignment 1',
  'a2': 'assignment 2',
  'a3': 'assignment 3',
  'ta': 'trợ giảng',
  'ddl': 'deadline',
  'dl': 'deadline',
  'hk1': 'học kỳ 1',
  'hk2': 'học kỳ 2',
  'gv': 'giảng viên',
  'sv': 'sinh viên',
  'lms': 'hệ thống học tập',
  'oh': 'office hours',
  'gk': 'giữa kỳ',
  'ck': 'cuối kỳ',
};

export function normalizeText(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFD')                                      // tách dấu ra khỏi ký tự gốc
    .replace(/[\u0300-\u036f]/g, '')                       // bỏ dấu thanh
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')                 // đ → d (NFD không xử lý được chữ này)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Chỉ dùng cho nhánh embedding và full-text — KHÔNG dùng cho tầng khớp chuỗi FAQ,
 *  vì bảng FAQ lưu question_norm bằng normalizeText() thuần. */
export function expandQuery(input: string): string {
  const base = normalizeText(input);
  if (!base) return '';
  const expanded = base.replace(/\b[a-z0-9]+\b/g, (w) => ACRONYMS[w] ?? w);
  return expanded === base ? base : `${base} ${expanded}`;
}
