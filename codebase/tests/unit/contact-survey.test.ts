import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../src/app/api/contact/survey/route';

describe('POST /api/contact/survey', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.GOOGLE_SHEET_WEBAPP_URL;
  });

  it('trả về lỗi 400 nếu thiếu họ và tên', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact/survey', {
      method: 'POST',
      body: JSON.stringify({
        fullName: '',
        studentId: '02733',
        email: 'test@example.com',
        background: 'Dân Công nghệ thông tin (Đã biết lập trình)',
        rewardAccount: 'MoMo 0912345678',
        selfAwarenessOfGaps: 'Hoàn toàn không biết',
        primaryPainPoints: ['Slide quá dài'],
        timeWasted: 'Từ 15 đến 30 phút',
        currentWorkarounds: ['Hỏi bạn bè'],
        solutionFeasibility: 'Rất thiết thực',
        wantPersonalizedRoadmap: 'Có, rất muốn',
        wantAiGapFilling: 'Có, rất cần',
        mostWantedFeatures: ['Checklist 3 việc'],
        overallRating: 5,
        usabilityRating: 'Đẹp và rất dễ dùng',
        uiImprovements: ['Bố cục gọn gàng'],
        willingToTest: 'Sẵn sàng!',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.toLowerCase()).toContain('họ và tên');
  });

  it('trả về lỗi 400 nếu thiếu mã học viên', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact/survey', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Nguyễn Văn A',
        studentId: '',
        email: 'test@example.com',
        background: 'Dân Công nghệ thông tin (Đã biết lập trình)',
        rewardAccount: 'MoMo 0912345678',
        selfAwarenessOfGaps: 'Hoàn toàn không biết',
        primaryPainPoints: ['Slide quá dài'],
        timeWasted: 'Từ 15 đến 30 phút',
        currentWorkarounds: ['Hỏi bạn bè'],
        solutionFeasibility: 'Rất thiết thực',
        wantPersonalizedRoadmap: 'Có, rất muốn',
        wantAiGapFilling: 'Có, rất cần',
        mostWantedFeatures: ['Checklist 3 việc'],
        overallRating: 5,
        usabilityRating: 'Đẹp và rất dễ dùng',
        uiImprovements: ['Bố cục gọn gàng'],
        willingToTest: 'Sẵn sàng!',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.toLowerCase()).toContain('mã học viên');
  });

  it('chấp nhận dữ liệu hợp lệ và trả về ticketCode chính là mã học viên (mock mode)', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact/survey', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Đỗ Khắc Gia Khoa',
        studentId: '02733',
        email: 'khoa@example.com',
        background: 'Dân Công nghệ thông tin (Đã biết lập trình)',
        rewardAccount: 'MoMo 0912345678 - DO KHAC GIA KHOA',
        selfAwarenessOfGaps: 'Hoàn toàn không biết — Chỉ khi vào lớp làm bài bị lỗi hoặc fail testcase mới biết mình hổng',
        primaryPainPoints: [
          'Tài liệu bị vứt rải rác nhiều nơi (Discord, VLearn, GitHub, Drive) — mất công đi nhặt từng link',
          'Slide quá dài (50-60 trang) — đọc lan man không biết đâu là trọng tâm buổi lab sẽ chấm',
        ],
        timeWasted: 'Từ 15 đến 30 phút',
        currentWorkarounds: ['Dùng AI bên ngoài (ChatGPT, Claude, Gemini...) paste code hoặc hỏi bài'],
        solutionFeasibility: 'Rất thiết thực — Đúng thứ tôi cần để tiết kiệm thời gian',
        wantPersonalizedRoadmap: 'Có, rất muốn — Đỡ mất công tự lên lịch học',
        wantAiGapFilling: 'Có, rất cần — Học đúng thứ mình thiếu sẽ tự tin làm bài hơn',
        mostWantedFeatures: [
          'Bài test chẩn đoán ngắn (Diagnostic Test) chỉ ra chính xác mình đang yếu phần nào',
          'Checklist 3 việc trọng tâm kèm ước lượng thời gian (ví dụ: việc 1 mất 15p, việc 2 mất 20p)',
        ],
        overallRating: 5,
        usabilityRating: 'Đẹp và rất dễ dùng — Nhìn phát hiểu ngay cần bấm vào đâu',
        uiImprovements: ['Giao diện hiện tại đã ổn, không cần sửa gì nhiều'],
        willingToTest: 'Sẵn sàng! Hãy gửi link cho tôi khi có bản mới',
        contactHandle: 'khoa#1234',
        generalFeedback: '12 câu rất đầy đủ!',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.isMock).toBe(true);
    expect(data.ticketCode).toBe('02733');
  });

  it('gọi fetch tới webhook URL khi biến môi trường GOOGLE_SHEET_WEBAPP_URL được cấu hình', async () => {
    process.env.GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/TEST_SCRIPT/exec';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success', ticketCode: '02483', message: 'Lưu thành công!' }),
    } as unknown as Response);

    const req = new NextRequest('http://localhost:3000/api/contact/survey', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Trần Nhật Minh',
        studentId: '02483',
        email: 'minh@example.com',
        background: 'Dân Công nghệ thông tin (Đã biết lập trình)',
        rewardAccount: 'MB Bank 0123456789 - TRAN NHAT MINH',
        selfAwarenessOfGaps: 'Biết là mình chưa hiểu, nhưng chịu không biết phải đọc phần nào để bù vào',
        primaryPainPoints: ['Slide quá dài (50-60 trang)'],
        timeWasted: 'Từ 30 đến 45 phút',
        currentWorkarounds: ['Hỏi bạn bè / đồng đội trong nhóm'],
        solutionFeasibility: 'Rất thiết thực — Đúng thứ tôi cần để tiết kiệm thời gian',
        wantPersonalizedRoadmap: 'Có, rất muốn — Đỡ mất công tự lên lịch học',
        wantAiGapFilling: 'Có, rất cần — Học đúng thứ mình thiếu sẽ tự tin làm bài hơn',
        mostWantedFeatures: ['Gom sẵn link repo mẫu'],
        overallRating: 5,
        usabilityRating: 'Đẹp và rất dễ dùng — Nhìn phát hiểu ngay cần bấm vào đâu',
        uiImprovements: ['Bố cục cần gọn gàng, thoáng mắt hơn'],
        willingToTest: 'Sẵn sàng! Hãy gửi link cho tôi khi có bản mới',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://script.google.com/macros/s/TEST_SCRIPT/exec',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      })
    );
  });
});
