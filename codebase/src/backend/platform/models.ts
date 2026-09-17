import type { Json } from '@/types/database';

export type AccountRole = 'student' | 'lecture' | 'admin';
export type LectureDocument = {
  id: string; owner_id: string; source_path: string; title: string; summary: string;
  lab_id: string | null; item_ids: string[]; file_name: string;
  file_type: 'pdf' | 'text' | 'markdown'; mime_type: string; file_size_bytes: number;
  extracted_content: string | null; qdrant_collection: string; content_hash: string; chunk_count: number;
  status: 'draft' | 'processing' | 'review' | 'published' | 'archived' | 'failed';
  review_note: string | null; published_by: string | null; published_at: string | null;
  revision: number; approved_revision: number | null; deleted_at: string | null;
  created_at: string; updated_at: string;
};
export type Profile = {
  id: string;
  display_name: string;
  role: AccountRole;
  tier: 'free' | 'vip';
  is_active: boolean;
  background: 'non_tech' | 'tech_base' | 'ai' | null;
  goal: string;
  weekly_minutes: number;
  created_at: string;
  updated_at: string;
}
export type PlatformRpc = 'platform_profile' | 'platform_documents' | 'platform_learning' | 'platform_quizzes' | 'platform_admin';
export type RpcArgs = { p_actor: string; p_action: string; p_target: string | null; p_data: Json };
type Table<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };
export interface PlatformDatabase {
  public: {
    Tables: {
      profiles: Table<Profile>;
      lecture_documents: Table<LectureDocument>;
      platform_revoked_sessions: Table<{ token_hash: string; expires_at: string }>;
    };
    Views: Record<string, never>;
    Functions: Record<PlatformRpc, { Args: RpcArgs; Returns: Json }>;
  };
}
