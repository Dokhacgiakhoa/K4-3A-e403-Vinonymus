/**
 * CURRICULUM BACKEND CLIENT
 * Kết nối trực tiếp tới C# .NET 10 Backend Core (WebApi Minimal APIs)
 * Base URL: NEXT_PUBLIC_BACKEND_CORE_URL || 'http://localhost:5000'
 * Tuân thủ chuẩn Anti-Crash: Tự động fallback sang LocalStorage nếu Backend Core chưa khởi động
 */

import { authBackendClient } from './auth-backend-client';

export interface BackendModuleDto {
  id: string;
  moduleNumber: number;
  title: string;
  slug: string;
  description: string;
  targetLevel: string;
  bloomLevel: string;
  estimatedHours: number;
  humanAiRatio: string;
  codeSnippet?: string | null;
  codeLanguage?: string | null;
  isEnrolled: boolean;
  completedTopicsCount: number;
  totalTopicsCount: number;
  progressPercent: number;
  isCompleted: boolean;
}

export interface BackendTopicDto {
  id: string;
  topicNumber: number;
  title: string;
  slug: string;
  description: string;
  readingTimeMinutes: number;
  codeSnippet?: string | null;
  codeLanguage?: string | null;
  isCompleted: boolean;
}

export interface BackendModuleDetailDto extends BackendModuleDto {
  topics: BackendTopicDto[];
}

export interface BackendCertificateDto {
  certificateCode: string;
  recipientName: string;
  courseTitle: string;
  courseLevel: string;
  issueDate: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || 'http://localhost:5000';

// Backend xác định người dùng từ token, không nhận userId từ trình duyệt.
function jsonHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json', ...authBackendClient.getAuthHeaders() };
}

export const curriculumBackendClient = {
  async getModules(): Promise<BackendModuleDto[] | null> {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/curriculum/modules`);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: jsonHeaders(),
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? null;
    } catch {
      return null;
    }
  },

  async getModuleDetail(moduleId: string): Promise<BackendModuleDetailDto | null> {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/curriculum/modules/${encodeURIComponent(moduleId)}`);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: jsonHeaders(),
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? null;
    } catch {
      return null;
    }
  },

  async enrollCourse(moduleId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/curriculum/enroll`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ moduleId }),
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async unenrollCourse(moduleId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/curriculum/unenroll`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ moduleId }),
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async toggleTopicProgress(moduleId: string, topicId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/curriculum/progress/toggle`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ moduleId, topicId }),
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getCertificate(moduleId: string): Promise<BackendCertificateDto | null> {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/curriculum/certificates`);
      url.searchParams.set('moduleId', moduleId);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: jsonHeaders(),
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? null;
    } catch {
      return null;
    }
  },
};
