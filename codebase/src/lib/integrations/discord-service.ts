import type {
  DiscordActivityPayload,
  DiscordEmbed,
  DiscordIntegrationResult,
  DiscordWebhookMessage,
} from '@/types/discord';

/**
 * Màu sắc chuẩn cho từng loại sự kiện (theo mã thập phân của Discord Embed).
 */
const EMBED_COLORS = {
  diagnostic: 0x5865f2, // Blurple - Nhận diện Discord
  task: 0x22c55e,       // Xanh lá - Hoàn thành nhiệm vụ
  session: 0xf59e0b,    // Vàng cam - Hoàn thành toàn phiên
} as const;

/**
 * Sinh nội dung tin nhắn và Rich Embed chuẩn theo phong cách bot AI20K.
 * Đảm bảo thông điệp tương đồng với bot "#activity" đang chạy trên server lớp học.
 */
export function buildDiscordMessage(payload: DiscordActivityPayload): DiscordWebhookMessage {
  const { student_name, discord_user_id, event_type, lab_id, task_title, xp } = payload;
  const userMention = discord_user_id ? `<@${discord_user_id}>` : `**${student_name}**`;

  let headline = '⚡ **Hoạt động tự học mới lên sóng!**';
  let eventDesc = 'vừa ghi nhận một hoạt động học tập';
  let embedColor: number = EMBED_COLORS.diagnostic;

  switch (event_type) {
    case 'diagnostic_completed':
      headline = '🎯 **Chẩn đoán tự học mới lên sóng!**';
      eventDesc = 'vừa hoàn thành bài test chẩn đoán và nhận kế hoạch tự học';
      embedColor = EMBED_COLORS.diagnostic;
      break;
    case 'task_completed':
      headline = '⚡ **Hoàn thành mục học tập mới lên sóng!**';
      eventDesc = task_title
        ? `vừa hoàn thành nhiệm vụ "${task_title}"`
        : 'vừa hoàn thành một nhiệm vụ trọng tâm';
      embedColor = EMBED_COLORS.task;
      break;
    case 'session_completed':
      headline = '🏆 **Phiên tự học hoàn tất lên sóng!**';
      eventDesc = 'vừa hoàn tất trọn vẹn toàn bộ phiên chuẩn bị cho bài Lab';
      embedColor = EMBED_COLORS.session;
      break;
  }

  const content = `${headline}\n${userMention} ${eventDesc}! (+${xp} XP)\n*Giữ nhịp học đều tay nào! 📚*`;

  const fields = [
    {
      name: 'Học viên',
      value: discord_user_id ? `${student_name} (<@${discord_user_id}>)` : student_name,
      inline: true,
    },
    {
      name: 'Bài Lab',
      value: `\`${lab_id.toUpperCase()}\``,
      inline: true,
    },
    {
      name: 'Điểm thưởng',
      value: `**+${xp} XP** ⚡`,
      inline: true,
    },
  ];

  if (task_title && event_type === 'task_completed') {
    fields.push({
      name: 'Nhiệm vụ trọng tâm',
      value: task_title,
      inline: false,
    });
  }

  const embed: DiscordEmbed = {
    title: '📚 AI Diagnostic Study Planner · Ghi nhận XP',
    color: embedColor,
    fields,
    footer: {
      text: 'AI20K Build Phase - Cohort 4 · Giữ nhịp học đều tay nào! 📚',
    },
    timestamp: new Date().toISOString(),
  };

  return {
    content,
    embeds: [embed],
  };
}

/**
 * Ghi nhận hoạt động học tập lên Discord với cơ chế Dual-Mode:
 * - Mock Mode: Nếu biến môi trường DISCORD_WEBHOOK_URL chưa được cấu hình,
 *   hệ thống tự động in log và trả về simulated payload mà không gây lỗi server.
 * - Live Mode: Nếu có Webhook URL, thực hiện HTTP POST an toàn với timeout 5 giây.
 */
export async function recordDiscordActivity(
  payload: DiscordActivityPayload,
  overrideWebhookUrl?: string,
): Promise<DiscordIntegrationResult> {
  const webhookUrl = overrideWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
  const message = buildDiscordMessage(payload);

  const resultData = {
    eventType: payload.event_type,
    xp: payload.xp,
    studentName: payload.student_name,
    discordUserId: payload.discord_user_id,
    labId: payload.lab_id,
  };

  // 1. Chế độ Mock Sandbox: Phục vụ chấm điểm và chạy thử cục bộ
  if (!webhookUrl || webhookUrl.trim() === '') {
    if (process.env.NODE_ENV !== 'test') {
      console.info(
        `[DISCORD-MOCK] Đã ghi nhận hoạt động (+${payload.xp} XP) cho ${payload.student_name} (${payload.event_type})`,
      );
    }
    return {
      success: true,
      mocked: true,
      message: 'Chế độ mô phỏng: Đã tạo payload Discord chuẩn và ghi log thành công.',
      data: resultData,
      preview: message,
    };
  }

  // 2. Chế độ Live: Gửi HTTP POST tới webhook Discord chính thức
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Không có thông tin lỗi chi tiết');
      return {
        success: false,
        mocked: false,
        message: `Discord Webhook từ chối yêu cầu (mã ${response.status}): ${errorText}`,
        data: resultData,
      };
    }

    return {
      success: true,
      mocked: false,
      message: `Đã gửi thông báo hoạt động học tập (+${payload.xp} XP) lên Discord thành công.`,
      data: resultData,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return {
      success: false,
      mocked: false,
      message: isTimeout
        ? 'Kết nối tới máy chủ Discord bị quá hạn sau 5 giây'
        : 'Không thể kết nối tới Discord Webhook. Vui lòng kiểm tra lại kết nối mạng hoặc URL.',
      data: resultData,
    };
  }
}
