/**
 * AUTH BACKEND CLIENT (.NET 10 WebAPI + PostgreSQL)
 * Kết nối trực tiếp tới C# .NET 10 WebAPI Gateway
 * Quản lý Token JWT Bearer chuẩn RFC 7519 và User Profile
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || 'http://localhost:5000';
const JWT_STORAGE_KEY = 'aiia_jwt_token';

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

      const data: AuthResponse = await res.json();
      if (res.ok && data.success && data.token) {
        this.saveToken(data.token);
      }
      return data;
    } catch (err) {
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ xác thực (.NET 10 Core). Vui lòng kiểm tra dịch vụ.'
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

      const data: AuthResponse = await res.json();
      if (res.ok && data.success && data.token) {
        this.saveToken(data.token);
      }
      return data;
    } catch (err) {
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ xác thực (.NET 10 Core). Vui lòng kiểm tra dịch vụ.'
      };
    }
  },

  async getMe(): Promise<AuthUserDto | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
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
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  }
};
