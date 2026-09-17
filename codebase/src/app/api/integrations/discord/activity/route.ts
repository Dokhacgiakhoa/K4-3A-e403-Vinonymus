import { NextRequest, NextResponse } from 'next/server';
import { recordDiscordActivity } from '@/lib/integrations/discord-service';
import { discordActivityPayloadSchema } from '@/types/discord';

export const runtime = 'nodejs';

/**
 * Trả về thông tin trạng thái endpoint và hướng dẫn gọi API.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/integrations/discord/activity',
    description: 'API ghi nhận hoạt động tự học và tích lũy +5 XP lên kênh #activity Discord.',
    method: 'POST',
    mode: process.env.DISCORD_WEBHOOK_URL ? 'live' : 'mock_sandbox',
    docs: '/docs/feature-discord-api.md',
  });
}

/**
 * Xử lý yêu cầu ghi nhận hoạt động tự học và tính điểm (+5 XP) lên Discord.
 * Hỗ trợ chế độ Mock tự động khi chưa cấu hình Webhook chính thức của BTC.
 */
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Dữ liệu gửi lên không đúng định dạng JSON. Vui lòng kiểm tra lại cấu trúc body.',
        },
        { status: 400 },
      );
    }

    const parsed = discordActivityPayloadSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const fieldName = issue?.path.join('.') || 'không xác định';
      return NextResponse.json(
        {
          error: `Dữ liệu không hợp lệ tại trường "${fieldName}": ${issue?.message}`,
          field: fieldName,
          hint: 'Vui lòng kiểm tra các trường bắt buộc (student_name, event_type, lab_id).',
        },
        { status: 400 },
      );
    }

    const result = await recordDiscordActivity(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
          hint: 'Kiểm tra lại cấu hình DISCORD_WEBHOOK_URL hoặc để trống để chạy chế độ mô phỏng.',
          data: result.data,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    // Trả về thông báo lỗi thân thiện, bảo mật không lộ stack trace ra ngoài
    return NextResponse.json(
      {
        error: 'Đã xảy ra lỗi nội bộ khi xử lý tích hợp Discord.',
        hint: 'Vui lòng thử lại sau giây lát hoặc liên hệ quản trị viên.',
      },
      { status: 500 },
    );
  }
}
