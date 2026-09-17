import { z } from 'zod';

export const submitFeedbackResponseSchema = z.object({ success: z.literal(true) });
export type SubmitFeedbackResponse = z.infer<typeof submitFeedbackResponseSchema>;
