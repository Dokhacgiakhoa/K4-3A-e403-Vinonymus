import { authBackendClient } from '@/lib/api/auth-backend-client';
import { clientStorage } from '@/lib/client-storage';
import type {
  AdminAnalytics,
  AuditEntry,
  DocumentInput,
  DocumentReview,
  DocumentStatus,
  DocumentVersion,
  PageResult,
  PlatformRole,
  Profile,
  ReviewDecision,
  StaffDocument,
} from '@/types/staff';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || '';

interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: unknown };
}

export class StaffApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = authBackendClient.getToken();
  if (!token) throw new StaffApiError('Vui lòng đăng nhập lại để tiếp tục.', 401, 'UNAUTHENTICATED');

  const response = await fetch(`${BACKEND_URL}/api/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const body = (await response.json().catch(() => ({}))) as ApiErrorBody & { data?: T; meta?: PageResult<unknown>['meta'] };
  if (!response.ok) {
    if (response.status === 401) clientStorage.clearUser();
    throw new StaffApiError(
      body.error?.message || 'Không thể hoàn thành yêu cầu. Vui lòng thử lại.',
      response.status,
      body.error?.code || 'UNKNOWN_ERROR',
    );
  }
  if (body.meta && Array.isArray(body.data)) {
    return { data: body.data, meta: body.meta } as T;
  }
  return body.data as T;
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : '';
}

const json = (value: unknown): string => JSON.stringify(value);

export const staffBackendClient = {
  getMe: () => request<Profile>('/me'),

  listLectureDocuments: (status?: DocumentStatus) =>
    request<PageResult<StaffDocument>>(`/lecture/documents${query({ limit: 100, offset: 0, status })}`),
  getLectureDocument: (id: string) => request<StaffDocument>(`/lecture/documents/${id}`),
  createDocument: (input: DocumentInput) =>
    request<StaffDocument>('/lecture/documents', { method: 'POST', body: json(input) }),
  updateDocument: (id: string, input: DocumentInput, revision: number) =>
    request<StaffDocument>(`/lecture/documents/${id}`, { method: 'PUT', body: json({ ...input, revision }) }),
  deleteLectureDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/lecture/documents/${id}`, { method: 'DELETE', body: json({ revision }) }),
  submitDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/lecture/documents/${id}/submit`, { method: 'POST', body: json({ revision }) }),
  reviewLectureDocument: (id: string, revision: number, decision: ReviewDecision, note: string) =>
    request<StaffDocument>(`/lecture/documents/${id}/review`, { method: 'POST', body: json({ revision, decision, note }) }),
  publishLectureDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/lecture/documents/${id}/publish`, { method: 'POST', body: json({ revision }) }),
  archiveLectureDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/lecture/documents/${id}/archive`, { method: 'POST', body: json({ revision }) }),
  getDocumentVersions: (id: string) => request<DocumentVersion[]>(`/lecture/documents/${id}/versions`),
  getDocumentReviews: (id: string) => request<DocumentReview[]>(`/lecture/documents/${id}/reviews`),

  getAnalytics: () => request<AdminAnalytics>('/admin/analytics'),
  listUsers: (role?: PlatformRole) =>
    request<PageResult<Profile>>(`/admin/users${query({ limit: 100, offset: 0, role })}`),
  getUser: (id: string) => request<Profile>(`/admin/users/${id}`),
  updateUserRole: (id: string, role: PlatformRole, tier?: 'free' | 'vip') =>
    request<Profile>(`/admin/users/${id}/role`, { method: 'PATCH', body: json({ role, ...(tier ? { tier } : {}) }) }),
  updateUserStatus: (id: string, isActive: boolean) =>
    request<Profile>(`/admin/users/${id}/status`, { method: 'PATCH', body: json({ isActive }) }),
  listAdminDocuments: () => request<PageResult<StaffDocument>>('/admin/documents?limit=100&offset=0'),
  getAdminDocument: (id: string) => request<StaffDocument>(`/admin/documents/${id}`),
  reviewAdminDocument: (id: string, revision: number, decision: ReviewDecision, note: string) =>
    request<StaffDocument>(`/admin/documents/${id}/review`, { method: 'POST', body: json({ revision, decision, note }) }),
  publishAdminDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/admin/documents/${id}/publish`, { method: 'POST', body: json({ revision }) }),
  archiveAdminDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/admin/documents/${id}/archive`, { method: 'POST', body: json({ revision }) }),
  deleteAdminDocument: (id: string, revision: number) =>
    request<StaffDocument>(`/admin/documents/${id}`, { method: 'DELETE', body: json({ revision }) }),
  listAudit: () => request<PageResult<AuditEntry>>('/admin/audit?limit=100&offset=0'),
};
