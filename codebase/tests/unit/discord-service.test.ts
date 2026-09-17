import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildDiscordMessage, recordDiscordActivity } from '@/lib/integrations/discord-service';
import { discordActivityPayloadSchema } from '@/types/discord';
import type { DiscordActivityPayload } from '@/types/discord';

describe('Discord Activity Service & XP Integration', () => {
  const samplePayload: DiscordActivityPayload = {
    student_name: 'Đỗ Khắc Gia Khoa',
    discord_user_id: '790540531609468928',
    event_type: 'diagnostic_completed',
    lab_id: 'lab-02',
    xp: 5,
  };

  describe('buildDiscordMessage', () => {
    it('định dạng tin nhắn và mention <@id> khi có Discord User ID', () => {
      const msg = buildDiscordMessage(samplePayload);
      expect(msg.content).toContain('<@790540531609468928>');
      expect(msg.content).toContain('+5 XP');
      expect(msg.content).toContain('Giữ nhịp học đều tay nào! 📚');
      expect(msg.embeds).toBeDefined();
      const firstEmbed = msg.embeds?.[0];
      expect(firstEmbed).toBeDefined();
      expect(firstEmbed?.fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Học viên', value: expect.stringContaining('790540531609468928') }),
          expect.objectContaining({ name: 'Điểm thưởng', value: '**+5 XP** ⚡' }),
        ]),
      );
    });

    it('hiển thị tên in đậm khi không có Discord User ID', () => {
      const payloadWithoutId: DiscordActivityPayload = {
        student_name: 'Nguyễn Văn A',
        event_type: 'task_completed',
        lab_id: 'lab-03',
        task_title: 'Đọc tài liệu RAG',
        xp: 5,
      };
      const msg = buildDiscordMessage(payloadWithoutId);
      expect(msg.content).toContain('**Nguyễn Văn A**');
      expect(msg.content).not.toContain('<@');
      const firstEmbed = msg.embeds?.[0];
      expect(firstEmbed).toBeDefined();
      expect(firstEmbed?.fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Nhiệm vụ trọng tâm', value: 'Đọc tài liệu RAG' }),
        ]),
      );
    });

    it('sử dụng đúng màu sắc và tiêu đề cho từng loại sự kiện', () => {
      const diagnosticMsg = buildDiscordMessage({ ...samplePayload, event_type: 'diagnostic_completed' });
      expect(diagnosticMsg.embeds?.[0]?.color).toBe(0x5865f2);

      const taskMsg = buildDiscordMessage({ ...samplePayload, event_type: 'task_completed' });
      expect(taskMsg.embeds?.[0]?.color).toBe(0x22c55e);

      const sessionMsg = buildDiscordMessage({ ...samplePayload, event_type: 'session_completed' });
      expect(sessionMsg.embeds?.[0]?.color).toBe(0xf59e0b);
    });
  });

  describe('recordDiscordActivity - Chế độ Mock Sandbox', () => {
    const originalEnv = process.env.DISCORD_WEBHOOK_URL;

    beforeEach(() => {
      delete process.env.DISCORD_WEBHOOK_URL;
    });

    afterEach(() => {
      process.env.DISCORD_WEBHOOK_URL = originalEnv;
    });

    it('tự động chuyển sang Mock Mode khi không có webhook URL, không gây lỗi', async () => {
      const result = await recordDiscordActivity(samplePayload);
      expect(result.success).toBe(true);
      expect(result.mocked).toBe(true);
      expect(result.preview).toBeDefined();
      expect(result.data?.xp).toBe(5);
      expect(result.message).toContain('Chế độ mô phỏng');
    });
  });

  describe('recordDiscordActivity - Chế độ Live', () => {
    it('gửi đúng HTTP POST request khi có Webhook URL', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await recordDiscordActivity(samplePayload, 'https://discord.com/api/webhooks/123/abc');
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const firstCall = mockFetch.mock.calls[0];
      expect(firstCall).toBeDefined();
      if (!firstCall) throw new Error('Chưa gọi fetch');
      const [calledUrl, calledOptions] = firstCall;
      expect(calledUrl).toBe('https://discord.com/api/webhooks/123/abc');
      expect(calledOptions.method).toBe('POST');
      expect(result.success).toBe(true);
      expect(result.mocked).toBe(false);

      vi.unstubAllGlobals();
    });

    it('xử lý lỗi an toàn khi webhook từ chối (4xx/5xx)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue('Unknown Webhook'),
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await recordDiscordActivity(samplePayload, 'https://discord.com/api/webhooks/invalid');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Discord Webhook từ chối');

      vi.unstubAllGlobals();
    });
  });

  describe('discordActivityPayloadSchema Validation', () => {
    it('chấp nhận payload hợp lệ với giá trị mặc định 5 XP', () => {
      const parsed = discordActivityPayloadSchema.safeParse({
        student_name: 'Trần Văn B',
        event_type: 'diagnostic_completed',
        lab_id: 'lab-01',
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.xp).toBe(5);
      }
    });

    it('từ chối khi thiếu student_name hoặc student_name rỗng', () => {
      const parsed = discordActivityPayloadSchema.safeParse({
        student_name: '   ',
        event_type: 'diagnostic_completed',
        lab_id: 'lab-01',
      });
      expect(parsed.success).toBe(false);
    });

    it('từ chối Discord User ID sai định dạng Snowflake', () => {
      const parsed = discordActivityPayloadSchema.safeParse({
        student_name: 'Trần Văn B',
        discord_user_id: 'invalid-id-not-digits',
        event_type: 'diagnostic_completed',
        lab_id: 'lab-01',
      });
      expect(parsed.success).toBe(false);
    });

    it('từ chối điểm XP âm hoặc quá giới hạn 50', () => {
      const parsedNegative = discordActivityPayloadSchema.safeParse({
        ...samplePayload,
        xp: -5,
      });
      expect(parsedNegative.success).toBe(false);

      const parsedOver = discordActivityPayloadSchema.safeParse({
        ...samplePayload,
        xp: 100,
      });
      expect(parsedOver.success).toBe(false);
    });
  });
});
