import type { AnswerPath } from '@/types/database';

export interface CitationItem {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  headingPath: string | null;
  content: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  path?: AnswerPath;
  citations?: CitationItem[];
  faqId?: string;
  isVerified?: boolean;
  verificationSource?: string;
  suggestions?: string[];
  createdAt: string;
  isStreaming?: boolean;
  /** true khi câu trả lời này là fallback do LLM lỗi/hết quota — hiển thị badge cảnh báo cho người dùng. */
  degraded?: boolean;
  /** id bản ghi `query_logs` của lượt này — cần để gắn đánh giá 👍/👎 vào đúng câu trả lời. */
  queryLogId?: string;
}

export interface ChatApiHeaderKeys {
  gemini?: string;
  openai?: string;
  claude?: string;
  deepseek?: string;
  groq?: string;
  cerebras?: string;
  fpt?: string;
}

export interface ChatApiRequestBody {
  question: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export type SseEventType = 'status' | 'token' | 'citations' | 'done' | 'need_key' | 'error';

export interface SseEventData {
  event: SseEventType;
  data: Record<string, unknown>;
}
