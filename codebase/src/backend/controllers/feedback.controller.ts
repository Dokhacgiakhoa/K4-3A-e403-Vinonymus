import { submitFeedbackRequestSchema } from '../requests/submit-feedback.request';
import type { ErrorResponse } from '../responses/error.response';
import type { SubmitFeedbackResponse } from '../responses/feedback.response';
import type { FeedbackService } from '../services/feedback.service';

function errorResponse(error: string, status: number, field?: string): Response {
  const body: ErrorResponse = { error, ...(field ? { field } : {}) };
  return Response.json(body, { status });
}

export function createFeedbackController(service: FeedbackService) {
  return {
    async submit(request: Request): Promise<Response> {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse('Nội dung yêu cầu phải là JSON hợp lệ.', 400);
      }
      const parsed = submitFeedbackRequestSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse('Dữ liệu đánh giá không hợp lệ. Vui lòng kiểm tra và gửi lại.',
          400, parsed.error.issues[0]?.path.join('.'));
      }
      try {
        await service.submit(parsed.data);
        const response: SubmitFeedbackResponse = { success: true };
        return Response.json(response);
      } catch {
        // Không đưa lỗi DB hoặc dữ liệu request vào response/log.
        return errorResponse('Không thể lưu đánh giá. Vui lòng thử lại sau.', 500);
      }
    },
  };
}
