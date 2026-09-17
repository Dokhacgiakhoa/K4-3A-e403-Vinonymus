import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/integrations/discord/activity/route';

describe('POST /api/integrations/discord/activity Route Handler', () => {
  it('trả về 200 kèm payload mock preview khi gửi dữ liệu hợp lệ', async () => {
    const req = new NextRequest('http://localhost:3000/api/integrations/discord/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: 'Đỗ Khắc Gia Khoa',
        discord_user_id: '790540531609468928',
        event_type: 'diagnostic_completed',
        lab_id: 'lab-02',
        xp: 5,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.mocked).toBe(true);
    expect(data.preview).toBeDefined();
    expect(data.preview.content).toContain('<@790540531609468928>');
    expect(data.preview.content).toContain('+5 XP');
    expect(data.preview.content).toContain('Giữ nhịp học đều tay nào! 📚');
  });

  it('trả về 400 với thông báo tiếng Việt khi thiếu trường bắt buộc', async () => {
    const req = new NextRequest('http://localhost:3000/api/integrations/discord/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: '',
        event_type: 'diagnostic_completed',
        lab_id: 'lab-02',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('Họ tên học viên không được để trống');
    expect(data.hint).toBeDefined();
  });

  it('trả về 400 khi body không phải là JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/integrations/discord/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json-string',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('không đúng định dạng JSON');
  });
});
