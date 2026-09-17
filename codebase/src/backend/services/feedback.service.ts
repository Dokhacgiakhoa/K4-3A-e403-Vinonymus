import type { FeedbackRepository } from '../repositories/feedback.repository';
import type { SubmitFeedbackRequest } from '../requests/submit-feedback.request';

export function createFeedbackService(repository: FeedbackRepository) {
  return {
    async submit(input: SubmitFeedbackRequest): Promise<void> {
      await repository.save({
        query_log_id: input.queryLogId,
        rating: input.rating,
        reason: input.reason ?? null,
        note: input.note ?? null,
        client_session_id: input.clientSessionId ?? null,
      });
    },
  };
}
export type FeedbackService = ReturnType<typeof createFeedbackService>;
