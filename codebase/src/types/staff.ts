export type PlatformRole = 'student' | 'lecture' | 'admin';
export type AccountTier = 'free' | 'vip';
export type DocumentStatus = 'draft' | 'processing' | 'review' | 'published' | 'archived' | 'failed';
export type DocumentFileType = 'pdf' | 'text' | 'markdown';
export type ReviewDecision = 'approved' | 'rejected' | 'needs_changes';

export interface Profile {
  id: string;
  display_name: string;
  role: PlatformRole;
  tier: AccountTier;
  is_active: boolean;
  background: 'non_tech' | 'tech_base' | 'ai' | null;
  goal: string;
  weekly_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface StaffDocument {
  id: string;
  title: string;
  summary: string;
  lab_id: string | null;
  item_ids: string[];
  file_type: DocumentFileType;
  status: DocumentStatus;
  revision: number;
  published_at: string | null;
  owner_id: string;
  source_path: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  storage_bucket: string | null;
  embedding_model: string | null;
  indexed_revision: number | null;
  indexed_at: string | null;
  content_hash: string;
  chunk_count: number;
  review_note: string | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
  approved_revision: number | null;
  deleted_at: string | null;
}

export interface DocumentInput {
  title: string;
  summary: string;
  labId: string;
  itemIds: string[];
  sourcePath: string;
  fileName: string;
  fileType: DocumentFileType;
  mimeType: 'application/pdf' | 'text/plain' | 'text/markdown';
  fileSizeBytes?: number;
  contentHash: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  revision: number;
  snapshot: StaffDocument;
  created_at: string;
}

export interface DocumentReview {
  id: string;
  document_id: string;
  reviewer_id: string;
  decision: ReviewDecision;
  note: string | null;
  revision: number | null;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  actor_id: string | null;
  action: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface AdminAnalytics {
  users: number;
  activeUsers: number;
  publishedDocuments: number;
  pendingReviews: number;
  roadmaps: number;
}

export interface PageResult<T> {
  data: T[];
  meta: { limit: number; offset: number; count: number };
}
