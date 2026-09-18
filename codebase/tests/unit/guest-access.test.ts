import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  consumeGuestQuota,
  consumeInMemory,
  getClientIp,
  GUEST_DAILY_LIMIT,
  resetInMemoryQuotaForTests,
  sha256Hex,
} from '@/lib/server/guest-quota';
import { getSessionUser, isLoginEnforced, readBearerToken } from '@/lib/server/session';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  resetInMemoryQuotaForTests();
  delete process.env.BACKEND_CORE_URL;
  delete process.env.NEXT_PUBLIC_BACKEND_CORE_URL;
  delete process.env.ALLOW_ANON_AI_MENTOR;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
});

describe('hạn mức AI Helpdesk cho khách', () => {
  it(`cho hỏi đúng ${GUEST_DAILY_LIMIT} câu mỗi ngày rồi chặn`, () => {
    const results = Array.from({ length: GUEST_DAILY_LIMIT + 1 }, () => consumeInMemory('session-a', 'ip-a'));
    expect(results.slice(0, GUEST_DAILY_LIMIT).every((r) => r.allowed)).toBe(true);
    expect(results[GUEST_DAILY_LIMIT - 1]?.remaining).toBe(0);
    expect(results[GUEST_DAILY_LIMIT]).toEqual({ allowed: false, limit: GUEST_DAILY_LIMIT, remaining: 0 });
  });

  it('đếm lại từ đầu sang ngày mới (giờ Việt Nam)', () => {
    const day1 = new Date('2026-09-17T10:00:00Z');
    for (let i = 0; i < GUEST_DAILY_LIMIT; i++) consumeInMemory('s', 'ip', day1);
    expect(consumeInMemory('s', 'ip', day1).allowed).toBe(false);
    expect(consumeInMemory('s', 'ip', new Date('2026-09-17T17:30:00Z')).allowed).toBe(true);
  });

  it('không đổi được mã phiên để lách hạn mức theo IP', () => {
    let allowed = 0;
    for (let i = 0; i < 300; i++) {
      if (consumeInMemory(`session-${i}`, 'same-ip').allowed) allowed++;
    }
    expect(allowed).toBe(200);
  });

  it('không có backend thì dùng bộ đếm trong bộ nhớ và không gọi mạng', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const result = await consumeGuestQuota('abc', '1.2.3.4');
    expect(result).toEqual({ allowed: true, limit: GUEST_DAILY_LIMIT, remaining: GUEST_DAILY_LIMIT - 1 });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('chỉ gửi mã băm lên backend, không gửi IP hay mã phiên gốc', async () => {
    process.env.BACKEND_CORE_URL = 'https://backend.test';
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { allowed: true, limit: 10, remaining: 7 } })),
    );
    vi.stubGlobal('fetch', fetchSpy);

    const result = await consumeGuestQuota('secret-session', '9.9.9.9');
    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(String(init.body)).not.toContain('secret-session');
    expect(String(init.body)).not.toContain('9.9.9.9');
    expect(JSON.parse(String(init.body))).toEqual({
      sessionHash: sha256Hex('session:secret-session'),
      ipHash: sha256Hex('ip:9.9.9.9'),
    });
    expect(result.remaining).toBe(7);
  });

  it('backend lỗi thì rơi về bộ đếm trong bộ nhớ', async () => {
    process.env.BACKEND_CORE_URL = 'https://backend.test';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    expect((await consumeGuestQuota('s', 'ip')).allowed).toBe(true);
  });

  it('lấy IP đầu tiên trong x-forwarded-for', () => {
    expect(getClientIp(new Headers({ 'x-forwarded-for': '1.1.1.1, 10.0.0.1' }))).toBe('1.1.1.1');
    expect(getClientIp(new Headers())).toBe('unknown');
  });
});

describe('xác thực người dùng ở server', () => {
  it('chỉ nhận header Bearer hợp lệ', () => {
    expect(readBearerToken('Bearer abc')).toBe('abc');
    expect(readBearerToken('Basic abc')).toBeNull();
    expect(readBearerToken('Bearer ')).toBeNull();
    expect(readBearerToken(null)).toBeNull();
  });

  it('chưa cấu hình backend thì không bắt đăng nhập', () => {
    expect(isLoginEnforced()).toBe(false);
    process.env.BACKEND_CORE_URL = 'https://backend.test';
    expect(isLoginEnforced()).toBe(true);
    process.env.ALLOW_ANON_AI_MENTOR = 'true';
    expect(isLoginEnforced()).toBe(false);
  });

  it('coi là đã đăng nhập chỉ khi backend xác nhận token', async () => {
    process.env.BACKEND_CORE_URL = 'https://backend.test';
    const user = { id: 'u1', email: 'a@b.c', displayName: 'A', role: 'Visitor', tier: 'Free' };
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: user })))
      .mockResolvedValueOnce(new Response(null, { status: 401 }));
    vi.stubGlobal('fetch', fetchSpy);

    expect(await getSessionUser('Bearer approved-token')).toEqual(user);
    expect(await getSessionUser('Bearer pending-token')).toBeNull();
    // Lần gọi lại cùng token lấy từ bộ nhớ đệm, không gọi backend thêm.
    expect(await getSessionUser('Bearer approved-token')).toEqual(user);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('backend không phản hồi thì coi như chưa đăng nhập', async () => {
    process.env.BACKEND_CORE_URL = 'https://backend.test';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
    expect(await getSessionUser('Bearer x')).toBeNull();
  });
});
