import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema xác thực dữ liệu khảo sát 12 câu hỏi (Mã học viên là Mã dự thưởng duy nhất)
const surveySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Vui lòng nhập họ và tên hoặc biệt danh (tối thiểu 2 ký tự)' })
    .max(100, { message: 'Họ và tên không được vượt quá 100 ký tự' }),
  studentId: z
    .string()
    .trim()
    .min(2, { message: 'Vui lòng nhập mã học viên của bạn (dùng làm mã quay thưởng duy nhất)' })
    .max(30, { message: 'Mã học viên không được vượt quá 30 ký tự' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Địa chỉ email không đúng định dạng' })
    .max(150, { message: 'Email không được vượt quá 150 ký tự' }),
  background: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng chọn nền tảng học tập của bạn' }),
  rewardAccount: z
    .string()
    .trim()
    .min(3, { message: 'Vui lòng nhập Số MoMo hoặc STK + Tên ngân hàng để nhận thưởng' })
    .max(150, { message: 'Thông tin nhận thưởng không được vượt quá 150 ký tự' }),
  selfAwarenessOfGaps: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng trả lời câu 1 về nhận diện lỗ hổng kiến thức' }),
  primaryPainPoints: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 khó khăn bạn gặp phải (Câu 2)' }),
  timeWasted: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng chọn thời gian bạn thường mất để gom tài liệu (Câu 3)' }),
  currentWorkarounds: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 cách bạn thường xử lý khi kẹt bài (Câu 4)' }),
  solutionFeasibility: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng đánh giá tính khả thi của giải pháp AI (Câu 5)' }),
  wantPersonalizedRoadmap: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng chọn ý kiến về lộ trình cá nhân hóa (Câu 6)' }),
  wantAiGapFilling: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng chọn ý kiến về AI bù đắp kiến thức khuyết thiếu (Câu 7)' }),
  mostWantedFeatures: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ít nhất 1 tính năng bạn muốn dùng nhất (Câu 8)' }),
  overallRating: z
    .number()
    .min(1, { message: 'Vui lòng đánh giá ý tưởng từ 1 đến 5 sao (Câu 9)' })
    .max(5, { message: 'Đánh giá tối đa là 5 sao' }),
  usabilityRating: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng đánh giá độ trực quan của giao diện (Câu 10)' }),
  uiImprovements: z
    .array(z.string())
    .min(1, { message: 'Vui lòng chọn ý kiến cải thiện giao diện (Câu 11)' }),
  willingToTest: z
    .string()
    .trim()
    .min(1, { message: 'Vui lòng chọn mức độ sẵn sàng tham gia thử nghiệm (Câu 12)' }),
  generalFeedback: z
    .string()
    .trim()
    .max(2000, { message: 'Ý kiến đóng góp không vượt quá 2000 ký tự' })
    .optional()
    .default(''),
  contactHandle: z
    .string()
    .trim()
    .max(100, { message: 'Tài khoản liên hệ không vượt quá 100 ký tự' })
    .optional()
    .default(''),
});

export type SurveyInput = z.infer<typeof surveySchema>;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Xác thực dữ liệu đầu vào bằng Zod schema
    const validationResult = surveySchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message ?? 'Dữ liệu khảo sát không hợp lệ';
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;
    // Mã dự thưởng chính là mã học viên duy nhất
    const ticketCode = validData.studentId.trim();
    const payload = {
      ...validData,
      ticketCode,
    };

    const webhookUrl = process.env.GOOGLE_SHEET_WEBAPP_URL?.trim();

    // Nếu chưa cấu hình biến môi trường GOOGLE_SHEET_WEBAPP_URL, phản hồi mô phỏng thành công
    if (!webhookUrl) {
      return NextResponse.json(
        {
          success: true,
          isMock: true,
          ticketCode,
          message:
            'Đã ghi nhận khảo sát thành công (Chế độ mô phỏng - Chưa cấu hình GOOGLE_SHEET_WEBAPP_URL trong .env.local).',
        },
        { status: 200 }
      );
    }

    // Gửi dữ liệu tới Google Apps Script Web App
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Không thể đọc phản hồi từ Google Script');
      return NextResponse.json(
        {
          success: false,
          error: 'Không thể kết nối đến Google Sheets. Vui lòng thử lại sau.',
          details: errorText,
        },
        { status: 502 }
      );
    }

    const result = (await response.json().catch(() => ({ status: 'success', ticketCode }))) as {
      status?: string;
      ticketCode?: string;
      message?: string;
    };

    return NextResponse.json(
      {
        success: true,
        ticketCode: result?.ticketCode ?? ticketCode,
        message:
          result?.message ??
          `Khảo sát đã được gửi thành công! Mã số dự thưởng của bạn là ${ticketCode}. Email xác nhận đã được gửi!`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Đã có lỗi không xác định xảy ra';
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra trong quá trình xử lý gửi khảo sát. Vui lòng thử lại.',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
