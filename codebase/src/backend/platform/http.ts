import { z } from 'zod';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export function databaseError(message: string, code?: string): never {
  if (message.includes('NOT_FOUND')) throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy dữ liệu hoặc bạn không có quyền truy cập.');
  if (message.includes('UNAUTHENTICATED')) throw new ApiError(401, 'UNAUTHENTICATED', 'Vui lòng đăng nhập lại.');
  if (message.includes('FORBIDDEN')) throw new ApiError(403, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này.');
  if (message.includes('INVALID_ANSWERS')) throw new ApiError(400, 'INVALID_ANSWERS', 'Cần trả lời đúng danh sách câu hỏi của đề.');
  const conflict = ['REVISION_CONFLICT', 'IDEMPOTENCY_CONFLICT', 'REVIEW_REQUIRED', 'INVALID_TRANSITION', 'ARCHIVE_BEFORE_EDIT', 'ARCHIVE_BEFORE_DELETE', 'LAST_ADMIN', 'SELF_REVIEW'];
  const found = conflict.find((item) => message.includes(item));
  if (found) throw new ApiError(409, found, 'Trạng thái đã thay đổi hoặc chưa đủ điều kiện. Tải lại dữ liệu và kiểm tra bước duyệt.');
  if (code === '23505') throw new ApiError(409, 'DUPLICATE', 'Dữ liệu đã tồn tại.');
  throw new ApiError(503, 'DATABASE_UNAVAILABLE', 'Chưa truy cập được dữ liệu. Kiểm tra cấu hình và migration.');
}

export function errorResponse(error: unknown): Response {
  if (error instanceof z.ZodError) return Response.json({ error: {
    code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ.', details: error.flatten(),
  } }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const e = error instanceof ApiError ? error : new ApiError(500, 'INTERNAL_ERROR', 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
  return Response.json({ error: { code: e.code, message: e.message } }, { status: e.status, headers: { 'Cache-Control': 'no-store' } });
}

export async function jsonBody(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ApiError(415, 'JSON_REQUIRED', 'Gửi Content-Type: application/json.');
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'INVALID_JSON', 'Thiếu JSON body.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 128_000) { await reader.cancel(); throw new ApiError(413, 'BODY_TOO_LARGE', 'Body tối đa 128 KB.'); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new ApiError(400, 'INVALID_JSON', 'JSON body không hợp lệ.'); }
}
