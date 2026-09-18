import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import type { Json } from '@/types/database';
import type { PlatformDatabase, PlatformRpc, Profile, RpcArgs } from './models';
import { ApiError, databaseError } from './http';

export interface AuthInput { email?: string; password?: string; displayName?: string; refreshToken?: string }
export interface PlatformDependencies {
  identify(token: string): Promise<Profile>;
  auth(action: 'register' | 'login' | 'refresh' | 'logout', input: AuthInput, token?: string): Promise<Json>;
  rpc(name: PlatformRpc, args: RpcArgs): Promise<Json>;
}

// A request-local auth client prevents one login from replacing a shared session.
export function createPlatformDependencies(): PlatformDependencies {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !anonKey || url.includes('placeholder')) throw new ApiError(503, 'NOT_CONFIGURED', 'Chưa cấu hình Supabase cho API 4 role.');
  const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(15_000) }) } };
  const db = createClient<PlatformDatabase>(url, key, options);
  const auth = createClient(url, anonKey, options).auth;
  const hash = (token: string) => createHash('sha256').update(token).digest('hex');

  async function identify(token: string): Promise<Profile> {
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user) throw new ApiError(401, 'UNAUTHENTICATED', 'Token hết hạn hoặc không hợp lệ.');
    const revoked = await db.from('platform_revoked_sessions').select('token_hash').eq('token_hash', hash(token)).maybeSingle();
    if (revoked.error) databaseError(revoked.error.message);
    if (revoked.data) throw new ApiError(401, 'SESSION_REVOKED', 'Phiên đã đăng xuất.');
    const profile = await db.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
    if (profile.error) databaseError(profile.error.message);
    if (!profile.data) throw new ApiError(403, 'PROFILE_MISSING', 'Chưa có profile. Kiểm tra migration khởi tạo profile.');
    if (!profile.data.is_active) throw new ApiError(403, 'ACCOUNT_DISABLED', 'Tài khoản đang bị khóa.');
    if (!['student', 'lecture', 'admin'].includes(profile.data.role)) throw new ApiError(403, 'FORBIDDEN', 'Vai trò tài khoản không hợp lệ.');
    return profile.data;
  }
  return {
    identify,
    async rpc(name, args) {
      const { data, error } = await db.rpc(name, args);
      if (error) databaseError(error.message, error.code);
      return data;
    },
    async auth(action, input, token) {
      if (action === 'logout') {
        if (!token) throw new ApiError(401, 'UNAUTHENTICATED', 'Vui lòng đăng nhập.');
        const claims = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString()) as { exp: number };
        const { error: cleanupError } = await db.from('platform_revoked_sessions').delete().lt('expires_at', new Date().toISOString());
        if (cleanupError) databaseError(cleanupError.message);
        const logout = await db.auth.admin.signOut(token, 'local');
        if (logout.error) throw new ApiError(503, 'AUTH_UNAVAILABLE', 'Chưa thu hồi được phiên. Vui lòng thử lại.');
        const { error } = await db.from('platform_revoked_sessions').upsert({ token_hash: hash(token), expires_at: new Date(claims.exp * 1000).toISOString() });
        if (error) databaseError(error.message);
        return { loggedOut: true };
      }
      const response = action === 'register'
        ? await auth.signUp({ email: input.email!, password: input.password!, options: { data: { display_name: input.displayName } } })
        : action === 'refresh'
          ? await auth.refreshSession({ refresh_token: input.refreshToken! })
          : await auth.signInWithPassword({ email: input.email!, password: input.password! });
      if (response.error) throw new ApiError(action === 'register' ? 400 : 401, 'AUTH_FAILED', 'Không thể xác thực. Kiểm tra thông tin đăng nhập hoặc xác nhận email.');
      const session = response.data.session;
      if (!session) return { requiresEmailConfirmation: true, session: null };
      const profile = await identify(session.access_token);
      return { accessToken: session.access_token, refreshToken: session.refresh_token, expiresAt: session.expires_at ?? null,
        requiresEmailConfirmation: false, user: JSON.parse(JSON.stringify(profile)) as Json };
    },
  };
}
