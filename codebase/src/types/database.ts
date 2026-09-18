import type { PlatformDatabase } from '@/backend/platform/models';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DocStatus = 'draft' | 'published' | 'archived';
/** Khớp enum `answer_path` trên DB (xem supabase/migrations/0002_enums.sql + 0012).
 *  `'cache'` hiện chưa bao giờ xuất hiện — tầng cache chưa nối vào pipeline. */
export type AnswerPath = 'faq' | 'cache' | 'rag' | 'refused' | 'error' | 'meta' | 'need_key';
export type UnansweredState = 'pending' | 'resolved' | 'ignored';

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          source_path: string
          title: string
          content: string
          summary: string | null
          category_id: string | null
          status: DocStatus
          audience: 'public' | 'learning'
          content_hash: string
          synced_at: string
          content_tsv: unknown
        }
        Insert: {
          id?: string
          source_path: string
          title: string
          content: string
          summary?: string | null
          category_id?: string | null
          status?: DocStatus
          audience?: 'public' | 'learning'
          content_hash: string
          synced_at?: string
        }
        Update: {
          id?: string
          source_path?: string
          title?: string
          content?: string
          summary?: string | null
          category_id?: string | null
          status?: DocStatus
          audience?: 'public' | 'learning'
          content_hash?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      lecture_documents: PlatformDatabase['public']['Tables']['lecture_documents'];
      document_tags: {
        Row: {
          document_id: string
          tag_id: string
        }
        Insert: {
          document_id: string
          tag_id: string
        }
        Update: {
          document_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      chunks: {
        Row: {
          id: string
          document_id: string
          ordinal: number
          content: string
          heading_path: string | null
          token_count: number | null
          embedding: number[] | null
          created_at: string
          content_tsv: unknown
        }
        Insert: {
          id?: string
          document_id: string
          ordinal: number
          content: string
          heading_path?: string | null
          token_count?: number | null
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          ordinal?: number
          content?: string
          heading_path?: string | null
          token_count?: number | null
          embedding?: number[] | null
          created_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          id: string
          source_path: string
          question: string
          answer: string
          category_id: string | null
          priority: number
          is_active: boolean
          view_count: number
          embedding: number[] | null
          content_hash: string
          synced_at: string
          question_norm: string
          question_tsv: unknown
        }
        Insert: {
          id?: string
          source_path: string
          question: string
          answer: string
          category_id?: string | null
          priority?: number
          is_active?: boolean
          view_count?: number
          embedding?: number[] | null
          content_hash: string
          synced_at?: string
        }
        Update: {
          id?: string
          source_path?: string
          question?: string
          answer?: string
          category_id?: string | null
          priority?: number
          is_active?: boolean
          view_count?: number
          embedding?: number[] | null
          content_hash?: string
          synced_at?: string
        }
        Relationships: []
      }
      faq_variants: {
        Row: {
          id: string
          faq_id: string
          question: string
          embedding: number[] | null
          question_norm: string
          question_tsv: unknown
        }
        Insert: {
          id?: string
          faq_id: string
          question: string
          embedding?: number[] | null
        }
        Update: {
          id?: string
          faq_id?: string
          question?: string
          embedding?: number[] | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          id: string
          owner_kind: 'guest' | 'user'
          owner_key_hash: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_kind: 'guest' | 'user'
          owner_key_hash: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_kind?: 'guest' | 'user'
          owner_key_hash?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          citations: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          citations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          citations?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'chat_messages_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'chat_sessions'
            referencedColumns: ['id']
          }
        ]
      }
      query_logs: {
        Row: {
          id: string
          question: string
          question_norm: string
          answer_excerpt: string | null
          path: AnswerPath
          citations: Json
          faq_id: string | null
          provider: string | null
          model: string | null
          latency_ms: number | null
          client_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          answer_excerpt?: string | null
          path: AnswerPath
          citations?: Json
          faq_id?: string | null
          provider?: string | null
          model?: string | null
          latency_ms?: number | null
          client_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer_excerpt?: string | null
          path?: AnswerPath
          citations?: Json
          faq_id?: string | null
          provider?: string | null
          model?: string | null
          latency_ms?: number | null
          client_session_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      query_feedback: {
        Row: {
          id: string
          query_log_id: string
          rating: number
          reason: string | null
          note: string | null
          client_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          query_log_id: string
          rating: number
          reason?: string | null
          note?: string | null
          client_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          query_log_id?: string
          rating?: number
          reason?: string | null
          note?: string | null
          client_session_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      unanswered_questions: {
        Row: {
          id: string
          question: string
          question_norm: string
          embedding: number[] | null
          asked_count: number
          last_asked_at: string
          state: UnansweredState
          resolved_faq_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          embedding?: number[] | null
          asked_count?: number
          last_asked_at?: string
          state?: UnansweredState
          resolved_faq_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          embedding?: number[] | null
          asked_count?: number
          last_asked_at?: string
          state?: UnansweredState
          resolved_faq_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      semantic_cache: {
        Row: {
          id: string
          question_hash: string
          question: string
          answer: string
          citations: Json
          hit_count: number
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          question_hash: string
          question: string
          answer: string
          citations?: Json
          hit_count?: number
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          question_hash?: string
          question?: string
          answer?: string
          citations?: Json
          hit_count?: number
          created_at?: string
          expires_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      // Đồng bộ thủ công theo migration 0014_submit_feedback_rpc.sql.
      submit_feedback: {
        Args: {
          p_query_log_id: string
          p_rating: number
          p_reason?: string | null
          p_note?: string | null
          p_client_session_id?: string | null
        }
        Returns: string
      }
      match_faq: {
        Args: {
          p_question: string
          p_embedding?: number[]
          p_trgm_threshold?: number
        }
        Returns: Array<{
          faq_id: string
          question: string
          answer: string
          match_type: 'exact' | 'trigram' | 'vector'
          score: number
          priority: number
        }>
      }
      increment_faq_view: {
        Args: {
          p_faq_id: string
        }
        Returns: void
      }
      search_chunks_hybrid: {
        Args: {
          query_text: string
          query_embedding: number[]
          match_count?: number
          rrf_k?: number
        }
        Returns: Array<{
          chunk_id: string
          document_id: string
          content: string
          heading_path: string | null
          document_title: string
          rrf_score: number
          vector_rank: number
          fts_rank: number
        }>
      }
      search_chunks_fts: {
        Args: {
          query_text: string
          match_count?: number
        }
        Returns: Array<{
          chunk_id: string
          document_id: string
          content: string
          heading_path: string | null
          document_title: string
          rank: number
        }>
      }
      search_chunks_vector: {
        Args: {
          query_embedding: number[]
          match_count?: number
          min_similarity?: number
        }
        Returns: Array<{
          chunk_id: string
          document_id: string
          content: string
          heading_path: string | null
          document_title: string
          similarity: number
        }>
      }
      record_unanswered: {
        Args: {
          p_question: string
          p_embedding?: number[]
          p_sim_threshold?: number
        }
        Returns: string
      }
    }
    Enums: {
      doc_status: DocStatus
      answer_path: AnswerPath
      unanswered_state: UnansweredState
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export * from './roadmap';
