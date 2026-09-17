import type { Feedback } from '../models/feedback';

export interface FeedbackRepository {
  save(feedback: Feedback): Promise<void>;
}
