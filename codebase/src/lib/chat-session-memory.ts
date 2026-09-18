import { createHash, randomUUID } from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { BackendUserIdentity } from '@/lib/auth/helpdesk-access';
import type { CitationItem } from '@/types/chat';
import type { Json } from '@/types/database';

export const CHAT_SESSION_COOKIE = 'aiia_helpdesk_session';
const GUEST_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const MESSAGE_LIMIT = 50;

export interface MemoryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations: CitationItem[];
  createdAt: string;
}

export interface ChatMemorySession {
  sessionId: string | null;
  guestToken?: string;
}

function isUuid(value: string | undefined): value is string {
  return Boolean(
    value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
  );
}

function ownerHash(kind: 'guest' | 'user', key: string): string {
  return createHash('sha256').update(`${kind}:${key}`).digest('hex');
}

export function serializeGuestSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${CHAT_SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${GUEST_MAX_AGE_SECONDS}${secure}`;
}

export async function openChatMemorySession(
  identity: BackendUserIdentity,
  currentGuestToken?: string,
): Promise<ChatMemorySession> {
  const isUser = Boolean(identity.userId);
  const guestToken = isUser
    ? undefined
    : isUuid(currentGuestToken)
      ? currentGuestToken
      : randomUUID();
  const ownerKind = isUser ? 'user' : 'guest';
  const ownerKey = identity.userId ?? guestToken;
  if (!ownerKey) return { sessionId: null };

  const expiresAt = ownerKind === 'guest'
    ? new Date(Date.now() + GUEST_MAX_AGE_SECONDS * 1_000).toISOString()
    : null;

  try {
    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .upsert(
        {
          owner_kind: ownerKind,
          owner_key_hash: ownerHash(ownerKind, ownerKey),
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'owner_kind,owner_key_hash' },
      )
      .select('id')
      .single();

    if (error || !data) {
      console.warn('[chat-memory] Session database chưa sẵn sàng:', error?.message);
      return { sessionId: null, guestToken };
    }
    return { sessionId: data.id, guestToken };
  } catch (error) {
    console.warn('[chat-memory] Không mở được session:', error instanceof Error ? error.name : 'unknown');
    return { sessionId: null, guestToken };
  }
}

function parseCitations(value: Json): CitationItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const chunkId = item.chunkId;
    const documentId = item.documentId;
    const documentTitle = item.documentTitle;
    const content = item.content;
    if (
      typeof chunkId !== 'string' ||
      typeof documentId !== 'string' ||
      typeof documentTitle !== 'string' ||
      typeof content !== 'string'
    ) return [];
    return [{
      chunkId,
      documentId,
      documentTitle,
      headingPath: typeof item.headingPath === 'string' ? item.headingPath : null,
      content,
      score: typeof item.score === 'number' ? item.score : undefined,
    }];
  });
}

export async function loadChatMemory(
  sessionId: string | null,
  limit = 6,
): Promise<MemoryMessage[]> {
  if (!sessionId) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .select('id, role, content, citations, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(Math.min(Math.max(limit, 1), MESSAGE_LIMIT));
    if (error || !data) return [];
    return data.reverse().map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      citations: parseCitations(message.citations),
      createdAt: message.created_at,
    }));
  } catch {
    return [];
  }
}

export async function saveChatTurn(
  sessionId: string | null,
  question: string,
  answer: string,
  citations: CitationItem[] = [],
): Promise<void> {
  if (!sessionId || !answer.trim()) return;
  try {
    const { error } = await supabaseAdmin.from('chat_messages').insert([
      { session_id: sessionId, role: 'user', content: question.slice(0, 2_000), citations: [] },
      {
        session_id: sessionId,
        role: 'assistant',
        content: answer.slice(0, 12_000),
        citations: citations as unknown as Json,
      },
    ]);
    if (error) {
      console.warn('[chat-memory] Không lưu được lượt chat:', error.message);
      return;
    }

    const { data: overflow } = await supabaseAdmin
      .from('chat_messages')
      .select('id')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .range(MESSAGE_LIMIT, MESSAGE_LIMIT + 99);
    const overflowIds = overflow?.map(({ id }) => id) ?? [];
    if (overflowIds.length > 0) {
      await supabaseAdmin.from('chat_messages').delete().in('id', overflowIds);
    }
  } catch (error) {
    console.warn('[chat-memory] Lỗi khi lưu lượt chat:', error instanceof Error ? error.name : 'unknown');
  }
}

export async function clearChatMemory(sessionId: string | null): Promise<void> {
  if (!sessionId) return;
  try {
    await supabaseAdmin.from('chat_messages').delete().eq('session_id', sessionId);
  } catch {
    // Memory là best-effort; lỗi xoá không được làm hỏng Helpdesk.
  }
}
