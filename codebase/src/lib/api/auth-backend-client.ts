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
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string | null;
  user?: AuthUserDto | null;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected' | null;
}

export type ApprovalDecision = 'Approved' | 'Rejected';

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

  /** Header gửi kèm lời gọi API của app để server biết người dùng đã đăng nhập. */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
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

  async listUsers(status?: 'Pending' | 'Approved' | 'Rejected'): Promise<{ ok: boolean; users: AuthUserDto[]; message?: string }> {
    try {
      const query = status ? `?status=${status}` : '';
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/users${query}`, { headers: this.getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        return { ok: false, users: [], message: 'Chỉ quản trị viên mới xem được danh sách này.' };
      }
      const json = await res.json();
      return { ok: Boolean(json.success), users: json.data ?? [] };
    } catch {
      return { ok: false, users: [], message: 'Không kết nối được máy chủ tài khoản. Vui lòng thử lại sau.' };
    }
  },

  async setApproval(userId: string, status: ApprovalDecision): Promise<{ ok: boolean; message?: string }> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/users/${encodeURIComponent(userId)}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401 || res.status === 403) {
        return { ok: false, message: 'Bạn không có quyền duyệt tài khoản.' };
      }
      const json = await res.json();
      return { ok: Boolean(json.success), message: json.message };
    } catch {
      return { ok: false, message: 'Không kết nối được máy chủ tài khoản. Vui lòng thử lại sau.' };
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
