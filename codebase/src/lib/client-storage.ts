import type { ChatMessage } from '@/types/chat';
import { curriculumBackendClient } from './api/curriculum-backend-client';

export interface StoredConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type SkillVerificationStatus = 'undetermined' | 'pending_verification' | 'verified';

export interface StoredUser {
  id?: string;
  name: string;
  email: string;
  tier?: 'Free' | 'Pro' | 'Admin';
  role?: 'student' | 'community' | 'admin';
  plan?: 'free' | 'pro' | 'admin';
  avatar?: string;
  // AI Mentor Ground Truth & Profiling Fields
  backgroundType?: 'non_tech' | 'software_dev' | 'data_analyst' | 'student' | 'other' | 'undetermined';
  currentLevel?: string;
  currentSfiaLevel?: 'L1' | 'L2' | 'L3' | 'L4' | 'undetermined';
  targetSfiaLevel?: 'L1' | 'L2' | 'L3' | 'L4' | 'undetermined';
  weeklyHoursBudget?: number;
  totalStudyHours?: number;
  primaryGoal?: string;
  learningStyle?: 'hands_on' | 'theory_first' | 'gamified' | 'undetermined';
  
  // 3-Stage Verification Fields
  verificationStatus?: SkillVerificationStatus;
  rawInputType?: 'pdf' | 'image' | 'text' | 'none';
  rawInputContent?: string;
  uploadedCvName?: string;
  uploadedCvExtractedSummary?: string;
  claimedSkills?: string[];
  verifiedSkills?: string[];
  identifiedGaps?: string[];
  diagnosticScore?: number;
  diagnosticTestDate?: string;
}

export interface StoredApiKeys {
  gemini?: string;
  openai?: string;
  claude?: string;
  deepseek?: string;
  groq?: string;
  cerebras?: string;
  fpt?: string;
}

const CONVERSATIONS_KEY = 'aiia_conversations';
const API_KEYS_KEY = 'aiia_api_keys';
const API_KEY_ERROR_KEY = 'aiia_api_key_error';
const SESSION_ID_KEY = 'aiia_client_session_id';

export type ApiKeyHealthStatus = 'missing' | 'ok' | 'error';

export const clientStorage = {
  getClientSessionId(): string {
    if (typeof window === 'undefined') return 'server-session-id';
    try {
      let sessionId = localStorage.getItem(SESSION_ID_KEY);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
      }
      return sessionId;
    } catch {
      return 'fallback-session-id';
    }
  },

  getApiKeys(): StoredApiKeys {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(API_KEYS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) as StoredApiKeys;
    } catch {
      return {};
    }
  },

  hasAnyApiKey(): boolean {
    const keys = this.getApiKeys();
    return Object.values(keys).some((val) => typeof val === 'string' && val.trim().length > 0);
  },

  hasApiKeyError(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(API_KEY_ERROR_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setApiKeyError(hasError: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      if (hasError) {
        localStorage.setItem(API_KEY_ERROR_KEY, 'true');
      } else {
        localStorage.removeItem(API_KEY_ERROR_KEY);
      }
      window.dispatchEvent(new Event('aiia_key_status_changed'));
    } catch {
      // ignore
    }
  },

  getApiKeyHealthStatus(): ApiKeyHealthStatus {
    if (!this.hasAnyApiKey()) {
      return 'missing';
    }
    if (this.hasApiKeyError()) {
      return 'error';
    }
    return 'ok';
  },

  setApiKeys(keys: StoredApiKeys): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
      this.setApiKeyError(false);
      window.dispatchEvent(new Event('aiia_key_status_changed'));
    } catch {
      // Storage quota error handling
    }
  },

  getConversations(): StoredConversation[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CONVERSATIONS_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw) as StoredConversation[];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  saveConversation(conv: StoredConversation): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getConversations();
      const index = list.findIndex((c) => c.id === conv.id);
      if (index >= 0) {
        list[index] = conv;
      } else {
        list.unshift(conv);
      }
      // Giới hạn 20 hội thoại gần nhất
      const trimmed = list.slice(0, 20);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(trimmed));
    } catch {
      // Handle storage quota
    }
  },

  deleteConversation(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getConversations().filter((c) => c.id !== id);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
    } catch {
      // Handle error
    }
  },

  getUser(): StoredUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('aiia_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveUser(user: StoredUser): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('aiia_user', JSON.stringify(user));
      window.dispatchEvent(new Event('aiia_auth_changed'));
    } catch {
      // Handle error
    }
  },

  setUser(user: StoredUser): void {
    this.saveUser(user);
  },

  upgradeToPro(): void {
    const user = this.getUser();
    if (user) {
      this.saveUser({ ...user, tier: 'Pro', plan: 'pro' });
    }
  },

  clearUser(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('aiia_user');
      localStorage.removeItem('aiia_jwt_token');
      window.dispatchEvent(new Event('aiia_auth_changed'));
    } catch {
      // Handle error
    }
  },

  getEnrolledCourses(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('aiia_enrolled_courses');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  enrollCourse(moduleId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getEnrolledCourses();
      const norm = moduleId.trim().toLowerCase();
      if (!list.some(id => id.trim().toLowerCase() === norm)) {
        list.push(moduleId);
        localStorage.setItem('aiia_enrolled_courses', JSON.stringify(list));
        window.dispatchEvent(new Event('aiia_enrollment_changed'));

        // Background Sync với C# .NET 10 Backend Core
        const user = this.getUser();
        if (user?.id) {
          curriculumBackendClient.enrollCourse(moduleId).catch(() => {});
        }
      }
    } catch {
      // Handle error
    }
  },

  isCourseEnrolled(moduleId: string): boolean {
    if (typeof window === 'undefined') return false;
    const list = this.getEnrolledCourses();
    const norm = moduleId.trim().toLowerCase();
    return list.some(id => id.trim().toLowerCase() === norm);
  },

  unenrollCourse(moduleId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getEnrolledCourses();
      const norm = moduleId.trim().toLowerCase();
      const updated = list.filter(id => id.trim().toLowerCase() !== norm);
      localStorage.setItem('aiia_enrolled_courses', JSON.stringify(updated));
      window.dispatchEvent(new Event('aiia_enrollment_changed'));

      // Background Sync với C# .NET 10 Backend Core
      const user = this.getUser();
      if (user?.id) {
        curriculumBackendClient.unenrollCourse(moduleId).catch(() => {});
      }
    } catch {
      // Handle error
    }
  },

  getCourseProgress(moduleId: string, totalTopics: number = 0): { completedCount: number; isCompleted: boolean; progressPercent: number } {
    if (typeof window === 'undefined') return { completedCount: 0, isCompleted: false, progressPercent: 0 };
    try {
      const raw = localStorage.getItem(`aiia_progress_${moduleId}`);
      if (!raw) return { completedCount: 0, isCompleted: false, progressPercent: 0 };
      const parsed = JSON.parse(raw);
      const completedCount = Object.values(parsed).filter(Boolean).length;
      const progressPercent = totalTopics > 0 ? Math.min(100, Math.round((completedCount / totalTopics) * 100)) : 0;
      const isCompleted = totalTopics > 0 && completedCount >= totalTopics;
      return { completedCount, isCompleted, progressPercent };
    } catch {
      return { completedCount: 0, isCompleted: false, progressPercent: 0 };
    }
  },

  saveCourseProgress(moduleId: string, topics: Record<number, boolean>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`aiia_progress_${moduleId}`, JSON.stringify(topics));
      window.dispatchEvent(new Event('aiia_progress_changed'));
    } catch {
      // Handle error
    }
  },
};

