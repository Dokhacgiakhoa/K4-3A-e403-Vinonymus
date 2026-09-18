/**
 * AUTH BACKEND CLIENT (.NET 10 WebAPI + PostgreSQL)
 * Káº¿t ná»‘i trá»±c tiáº¿p tá»›i C# .NET 10 WebAPI Gateway
 * Quáº£n lÃ½ Token JWT Bearer chuáº©n RFC 7519 vÃ  User Profile
 */

export interface AuthUserDto {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  tier: string;
  role: string;
  currentLevel: string;
  totalStudyHours: number;
  aiTokenQuota: number;
  aiTokenUsed: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string | null;
  user?: AuthUserDto | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || '';
const JWT_STORAGE_KEY = 'aiia_jwt_token';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function normalizeUser(value: unknown, fallbackEmail?: string): AuthUserDto | null {
  const user = asRecord(value);
  const id = user.id;
  const email = typeof user.email === 'string' ? user.email : fallbackEmail;
  if (typeof id !== 'string' || typeof email !== 'string') return null;
  return {
    id,
    email,
    displayName: String(user.displayName ?? user.display_name ?? email.split('@')[0] ?? 'Ká»¹ sÆ° AI'),
    avatarUrl: typeof user.avatarUrl === 'string' ? user.avatarUrl : null,
    tier: String(user.tier ?? 'free'),
    role: String(user.role ?? 'student'),
    currentLevel: String(user.currentLevel ?? 'L1'),
    totalStudyHours: typeof user.totalStudyHours === 'number' ? user.totalStudyHours : 0,
    aiTokenQuota: typeof user.aiTokenQuota === 'number' ? user.aiTokenQuota : 0,
    aiTokenUsed: typeof user.aiTokenUsed === 'number' ? user.aiTokenUsed : 0,
  };
}

function emailFromJwt(token: string): string | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { email?: unknown };
    return typeof payload.email === 'string' ? payload.email : undefined;
  } catch {
    return undefined;
  }
}

function normalizeAuthResponse(value: unknown, fallbackEmail?: string): AuthResponse {
  const raw = asRecord(value);
  if (typeof raw.success === 'boolean') {
    return {
      success: raw.success,
      message: String(raw.message ?? ''),
      token: typeof raw.token === 'string' ? raw.token : null,
      user: normalizeUser(raw.user, fallbackEmail),
    };
  }
  const data = asRecord(raw.data);
  const token = data.accessToken ?? data.token;
  const user = normalizeUser(data.user, fallbackEmail);
  const success = typeof token === 'string' && !!user;
  const error = asRecord(raw.error);
  return {
    success,
    message: typeof error.message === 'string'
      ? error.message
      : success
        ? 'OK'
        : data.requiresEmailConfirmation === true
          ? 'Tài khoản chưa xác nhận email nên chưa có phiên đăng nhập.'
          : 'Đăng nhập chưa trả về phiên hợp lệ. Kiểm tra tài khoản, mật khẩu hoặc dữ liệu role trong Supabase.',
    token: typeof token === 'string' ? token : null,
    user,
  };
}

export const authBackendClient = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(JWT_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  saveToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(JWT_STORAGE_KEY, token);
    } catch {
      // Storage full or disabled
    }
  },

  clearToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(JWT_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  async register(email: string, password: string, displayName: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, displayName })
      });

      const data = normalizeAuthResponse(await res.json(), email.trim());
      if (res.ok && data.success && data.token) {
        this.saveToken(data.token);
      }
      return data;
    } catch (err) {
      return {
        success: false,
        message: 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n mÃ¡y chá»§ xÃ¡c thá»±c (.NET 10 Core). Vui lÃ²ng kiá»ƒm tra dá»‹ch vá»¥.'
      };
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = normalizeAuthResponse(await res.json(), email.trim());
      if (res.ok && data.success && data.token) {
        this.saveToken(data.token);
      }
      return data;
    } catch (err) {
      return {
        success: false,
        message: 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n mÃ¡y chá»§ xÃ¡c thá»±c (.NET 10 Core). Vui lÃ²ng kiá»ƒm tra dá»‹ch vá»¥.'
      };
    }
  },

  async getMe(): Promise<AuthUserDto | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          this.clearToken();
        }
        return null;
      }

      const json = await res.json();
      return normalizeUser(asRecord(json).data, emailFromJwt(token));
    } catch {
      return null;
    }
  }
};
