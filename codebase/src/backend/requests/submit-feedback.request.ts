import { z } from 'zod';
import { FeedbackRating } from '../enums/feedback-rating.enum';
import { FeedbackReason } from '../enums/feedback-reason.enum';

export const submitFeedbackRequestSchema = z.object({
  queryLogId: z.string().uuid('Mã câu trả lời không hợp lệ.'),
  rating: z.nativeEnum(FeedbackRating),
  reason: z.nativeEnum(FeedbackReason).nullish(),
  note: z.string().max(2000).nullish(),
  clientSessionId: z.string().min(1).max(200).nullish(),
});
export type SubmitFeedbackRequest = z.infer<typeof submitFeedbackRequestSchema>;
