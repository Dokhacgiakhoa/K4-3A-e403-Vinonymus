import { z } from 'zod';

/**
 * Định nghĩa các loại sự kiện học tập có thể gửi lên Discord.
 * Mỗi sự kiện tương ứng với một mốc hoàn thành thực tế trên ứng dụng.
 */
export const DiscordEventTypeSchema = z.enum([
  'diagnostic_completed',
  'task_completed',
  'session_completed',
]);

export type DiscordEventType = z.infer<typeof DiscordEventTypeSchema>;

/**
 * Schema xác thực dữ liệu đầu vào cho yêu cầu ghi nhận hoạt động Discord.
 * Áp dụng chuẩn +5 XP cho mỗi hoạt động theo quy định của chương trình.
 */
export const discordActivityPayloadSchema = z.object({
  student_name: z
    .string({ required_error: 'Vui lòng cung cấp họ tên học viên' })
    .trim()
    .min(1, 'Họ tên học viên không được để trống')
    .max(100, 'Họ tên học viên không được vượt quá 100 ký tự'),
  discord_user_id: z
    .string()
    .trim()
    .regex(/^[0-9]{17,20}$/, 'Discord User ID phải là dãy số gồm 17–20 chữ số (Snowflake ID)')
    .optional()
    .or(z.literal('')),
  event_type: DiscordEventTypeSchema,
  lab_id: z
    .string({ required_error: 'Vui lòng cung cấp mã bài lab' })
    .trim()
    .min(1, 'Mã bài lab không được để trống'),
  task_title: z.string().trim().max(200, 'Tiêu đề nhiệm vụ không được vượt quá 200 ký tự').optional(),
  xp: z
    .number()
    .int('Điểm XP phải là số nguyên')
    .min(1, 'Điểm XP tối thiểu là 1')
    .max(50, 'Điểm XP tối đa cho một hoạt động là 50')
    .default(5),
  metadata: z.record(z.unknown()).optional(),
});

export type DiscordActivityPayload = z.infer<typeof discordActivityPayloadSchema>;

/**
 * Cấu trúc Embed chuẩn của Discord Webhook.
 */
export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: DiscordEmbedField[];
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export interface DiscordWebhookMessage {
  content?: string;
  embeds?: DiscordEmbed[];
}

/**
 * Kết quả trả về sau khi xử lý tích hợp Discord.
 */
export interface DiscordIntegrationResult {
  success: boolean;
  mocked: boolean;
  message: string;
  data?: {
    eventType: DiscordEventType;
    xp: number;
    studentName: string;
    discordUserId?: string;
    labId: string;
  };
  preview?: DiscordWebhookMessage;
}
