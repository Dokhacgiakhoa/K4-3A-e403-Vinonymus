import { describe, expect, it, vi } from 'vitest';
import { createFeedbackController } from '@/backend/controllers/feedback.controller';
import { createFeedbackService } from '@/backend/services/feedback.service';
import type { FeedbackRepository } from '@/backend/repositories/feedback.repository';

const queryLogId = 'c3c7a65a-8c85-4c42-a8d1-ff130e7cf6c0';

function setup() {
  const save = vi.fn<FeedbackRepository['save']>().mockResolvedValue(undefined);
  const controller = createFeedbackController(createFeedbackService({ save }));
  return { save, controller };
}

function request(body: unknown) {
  return new Request('http://localhost/api/chat/feedback', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('Backend feedback HTTP contract', () => {
  it('lưu đánh giá và giữ response hiện tại', async () => {
    const { save, controller } = setup();
    const response = await controller.submit(request({ queryLogId, rating: -1, reason: 'wrong' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(save).toHaveBeenCalledWith({
      query_log_id: queryLogId, rating: -1, reason: 'wrong', note: null, client_session_id: null,
    });
  });

  it.each([
    null,
    { queryLogId: 'invalid', rating: 1 },
    { queryLogId, rating: 0 },
    { queryLogId, rating: 1, reason: 'unknown' },
    { queryLogId, rating: 1, note: 'x'.repeat(2001) },
  ])('từ chối dữ liệu sai trước khi gọi DB: %#', async (body) => {
    const { save, controller } = setup();
    const response = await controller.submit(request(body));
    expect(response.status).toBe(400);
    expect(save).not.toHaveBeenCalled();
  });

  it('trả 400 cho JSON hỏng', async () => {
    const { save, controller } = setup();
    const response = await controller.submit(new Request('http://localhost/api/chat/feedback', {
      method: 'POST', body: '{',
    }));
    expect(response.status).toBe(400);
    expect(save).not.toHaveBeenCalled();
  });

  it('không lộ lỗi DB', async () => {
    const { save, controller } = setup();
    save.mockRejectedValue(new Error('private database details'));
    const response = await controller.submit(request({ queryLogId, rating: 1 }));
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('private database details');
  });
});
