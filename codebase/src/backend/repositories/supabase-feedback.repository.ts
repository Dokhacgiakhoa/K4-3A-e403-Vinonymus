import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { FeedbackRepository } from './feedback.repository';

export function createSupabaseFeedbackRepository(client: SupabaseClient<Database>): FeedbackRepository {
  return {
    async save(feedback) {
      // RPC giữ giới hạn quyền ghi của RLS, không mở quyền upsert trực tiếp.
      const { error } = await client.rpc('submit_feedback', {
        p_query_log_id: feedback.query_log_id,
        p_rating: feedback.rating,
        p_reason: feedback.reason,
        p_note: feedback.note,
        p_client_session_id: feedback.client_session_id,
      });
      if (error) throw new Error('Không thể lưu đánh giá.');
    },
  };
}
