/**
 * CURRICULUM BACKEND CLIENT
 * Kết nối trực tiếp tới C# .NET 10 Backend Core (WebApi Minimal APIs)
 * Base URL: NEXT_PUBLIC_BACKEND_CORE_URL || 'http://localhost:5000'
 * Tuân thủ chuẩn Anti-Crash: Tự động fallback sang LocalStorage nếu Backend Core chưa khởi động
 */

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

export const curriculumBackendClient = {
  async getModules(userId?: string): Promise<BackendModuleDto[] | null> {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/curriculum/modules`);
      if (userId) url.searchParams.set('userId', userId);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? null;
    } catch {
      return null;
    }
  },

  async getModuleDetail(moduleId: string, userId?: string): Promise<BackendModuleDetailDto | null> {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/curriculum/modules/${moduleId}`);
      if (userId) url.searchParams.set('userId', userId);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? null;
    } catch {
      return null;
    }
  },

  async enrollCourse(userId: string, moduleId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/curriculum/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId }),
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async unenrollCourse(userId: string, moduleId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/curriculum/unenroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId }),
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async toggleTopicProgress(userId: string, moduleId: string, topicId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/curriculum/progress/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId, topicId }),
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getCertificate(userId: string, moduleId: string): Promise<BackendCertificateDto | null> {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/curriculum/certificates`);
      url.searchParams.set('userId', userId);
      url.searchParams.set('moduleId', moduleId);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
