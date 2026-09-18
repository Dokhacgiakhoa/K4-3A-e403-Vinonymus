import { fetchBackend, getBackendUrl } from '@/lib/server/backend';

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  tier: string;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { user: SessionUser | null; expiresAt: number }>();

export function readBearerToken(authorization: string | null): string | null {
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) return null;
  const token = authorization.slice(7).trim();
  return token.length > 0 && token.length <= 4096 ? token : null;
}

/** Người dùng chỉ được coi là đã đăng nhập khi backend xác nhận token và tài khoản đã được duyệt. */
export async function getSessionUser(authorization: string | null): Promise<SessionUser | null> {
  const token = readBearerToken(authorization);
  if (!token || !getBackendUrl()) return null;

  const cached = cache.get(token);
  if (cached && cached.expiresAt > Date.now()) return cached.user;

  let user: SessionUser | null = null;
  try {
    const res = await fetchBackend('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const body = (await res.json()) as { data?: SessionUser };
      user = body.data ?? null;
    }
  } catch {
    // Backend không phản hồi: coi như chưa đăng nhập, không chặn khách dùng phần miễn phí.
    return null;
  }

  if (cache.size > 1000) cache.clear();
  cache.set(token, { user, expiresAt: Date.now() + CACHE_TTL_MS });
  return user;
}

/** Bắt đăng nhập chỉ khi backend đã được cấu hình; ALLOW_ANON_AI_MENTOR dùng cho bộ chạy eval ở máy. */
export function isLoginEnforced(): boolean {
  return Boolean(getBackendUrl()) && process.env.ALLOW_ANON_AI_MENTOR !== 'true';
}
