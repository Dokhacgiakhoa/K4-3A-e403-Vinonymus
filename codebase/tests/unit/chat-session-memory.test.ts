import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const single = vi.fn();
  const select = vi.fn(() => ({ single }));
  const upsert = vi.fn(
    (_payload: { owner_key_hash: string }, _options: { onConflict: string }) => ({ select }),
  );
  const from = vi.fn(() => ({ upsert }));
  return { single, select, upsert, from };
});

vi.mock('../../src/lib/supabase/admin', () => ({
  supabaseAdmin: { from: mocks.from },
}));

import {
  CHAT_SESSION_COOKIE,
  openChatMemorySession,
  serializeGuestSessionCookie,
} from '../../src/lib/chat-session-memory';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.single.mockResolvedValue({ data: { id: 'session-1' }, error: null });
});

describe('chat session memory', () => {
  it('dùng backend user id làm owner cho tài khoản đăng nhập', async () => {
    const session = await openChatMemorySession({ role: 'Member', userId: 'user-123' });

    expect(session).toEqual({ sessionId: 'session-1', guestToken: undefined });
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ owner_kind: 'user', expires_at: null }),
      { onConflict: 'owner_kind,owner_key_hash' },
    );
    const firstPayload = mocks.upsert.mock.calls[0]?.[0];
    expect(firstPayload?.owner_key_hash).not.toContain('user-123');
  });

  it('cấp cookie HttpOnly có hạn cho guest', async () => {
    const session = await openChatMemorySession({ role: 'Visitor', userId: null });
    expect(session.guestToken).toMatch(/^[0-9a-f-]{36}$/);

    const cookie = serializeGuestSessionCookie(session.guestToken!);
    expect(cookie).toContain(`${CHAT_SESSION_COOKIE}=`);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Max-Age=604800');
  });
});
