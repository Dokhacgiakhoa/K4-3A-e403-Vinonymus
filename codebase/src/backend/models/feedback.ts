import type { Database } from '@/types/database';

type FeedbackRow = Database['public']['Tables']['query_feedback']['Row'];
export type Feedback = Pick<FeedbackRow,
  'query_log_id' | 'rating' | 'reason' | 'note' | 'client_session_id'>;
