import type { AuthUserDto } from '@/lib/api/auth-backend-client';
import { clientStorage, type StoredUser } from '@/lib/client-storage';

// Backend .NET chưa deploy (B-03 → B-05), nên tài khoản dùng thử chỉ sống trên trình duyệt
// để giám khảo xem được giao diện của từng vai trò. Không có mật khẩu, không có JWT.

export type DemoRole = 'student' | 'lecturer' | 'admin';

interface DemoAccount {
  role: DemoRole;
  label: string;
  description: string;
  user: StoredUser;
}

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    role: 'student',
    label: 'Học viên',
    description: 'Lộ trình cá nhân hoá, thư viện, AI Helpdesk',
    user: {
      id: 'demo-student',
      name: 'Học viên Demo',
      email: 'student.demo@vinonymus.local',
      tier: 'Free',
      plan: 'free',
      role: 'student',
      isDemo: true,
    },
  },
  {
    role: 'lecturer',
    label: 'Giảng viên',
    description: 'Tải tài liệu, gửi duyệt',
    user: {
      id: 'demo-lecturer',
      name: 'Giảng viên Demo',
      email: 'lecturer.demo@vinonymus.local',
      tier: 'Free',
      plan: 'free',
      role: 'lecturer',
      isDemo: true,
    },
  },
  {
    role: 'admin',
    label: 'Quản trị',
    description: 'Duyệt tài khoản, duyệt tài liệu',
    user: {
      id: 'demo-admin',
      name: 'Admin Demo',
      email: 'admin.demo@vinonymus.local',
      tier: 'Admin',
      plan: 'admin',
      role: 'admin',
      isDemo: true,
    },
  },
];

// Trang đầu tiên của mỗi vai trò, để đổi vai trò là thấy ngay tính năng tương ứng.
export const DEMO_HOME: Record<DemoRole, string> = {
  student: '/learning-path',
  lecturer: '/lecturer/documents',
  admin: '/admin/documents',
};

export function startDemoSession(role: DemoRole): StoredUser | null {
  const account = DEMO_ACCOUNTS.find((a) => a.role === role);
  if (!account) return null;
  // Xoá JWT cũ để API không nhận nhầm phiên thật của người khác trên cùng máy.
  clientStorage.clearUser();
  clientStorage.saveUser(account.user);
  return account.user;
}

export function isDemoUser(user: StoredUser | null | undefined): boolean {
  return Boolean(user?.isDemo);
}

export function getUserRole(user: StoredUser | null | undefined): DemoRole | 'guest' {
  if (!user) return 'guest';
  if (user.role === 'admin' || user.tier === 'Admin') return 'admin';
  if (user.role === 'lecturer') return 'lecturer';
  return 'student';
}

export const ROLE_LABELS: Record<DemoRole | 'guest', string> = {
  guest: 'Khách',
  student: 'Học viên',
  lecturer: 'Giảng viên',
  admin: 'Quản trị',
};

// ---- Dữ liệu mẫu cho màn hình duyệt tài khoản ----

export const DEMO_ACCOUNT_REQUESTS: AuthUserDto[] = [
  {
    id: 'demo-req-1',
    email: 'nguyen.an@example.com',
    displayName: 'Nguyễn An',
    tier: 'Free',
    role: 'Member',
    currentLevel: 'L1',
    totalStudyHours: 0,
    aiTokenQuota: 0,
    aiTokenUsed: 0,
    approvalStatus: 'Pending',
  },
  {
    id: 'demo-req-2',
    email: 'tran.binh@example.com',
    displayName: 'Trần Bình',
    tier: 'Free',
    role: 'Member',
    currentLevel: 'L1',
    totalStudyHours: 0,
    aiTokenQuota: 0,
    aiTokenUsed: 0,
    approvalStatus: 'Pending',
  },
  {
    id: 'demo-req-3',
    email: 'le.chi@example.com',
    displayName: 'Lê Chi',
    tier: 'Free',
    role: 'Lecture',
    currentLevel: 'L1',
    totalStudyHours: 0,
    aiTokenQuota: 0,
    aiTokenUsed: 0,
    approvalStatus: 'Approved',
  },
];

// ---- Dữ liệu mẫu cho tài liệu giảng viên (dùng chung giữa màn Lecturer và Admin) ----

export type DemoDocumentStatus = 'draft' | 'review' | 'published' | 'needs_changes';

export interface DemoDocument {
  id: string;
  title: string;
  fileName: string;
  labTitle: string;
  status: DemoDocumentStatus;
  updatedAt: string;
  reviewNote?: string;
}

export const DEMO_DOCUMENT_STATUS_LABELS: Record<DemoDocumentStatus, string> = {
  draft: 'Nháp',
  review: 'Chờ duyệt',
  published: 'Đã xuất bản',
  needs_changes: 'Cần sửa',
};

const DEMO_DOCUMENTS_KEY = 'aiia_demo_documents';

const SEED_DOCUMENTS: DemoDocument[] = [
  {
    id: 'demo-doc-1',
    title: 'Function calling: ví dụ gọi công cụ thời tiết',
    fileName: 'lab04-function-calling.pdf',
    labTitle: 'Lab 04 · Prompt Engineering & Tool Calling',
    status: 'published',
    updatedAt: '2026-09-17T09:30:00.000Z',
  },
  {
    id: 'demo-doc-2',
    title: 'Checklist chấm structured output',
    fileName: 'lab04-structured-output.md',
    labTitle: 'Lab 04 · Prompt Engineering & Tool Calling',
    status: 'review',
    updatedAt: '2026-09-18T02:15:00.000Z',
  },
  {
    id: 'demo-doc-3',
    title: 'Ghi chú RAG: chia đoạn và embedding',
    fileName: 'lab05-rag-notes.txt',
    labTitle: 'Lab 05 · RAG Foundations',
    status: 'draft',
    updatedAt: '2026-09-18T03:40:00.000Z',
  },
];

export function loadDemoDocuments(): DemoDocument[] {
  if (typeof window === 'undefined') return SEED_DOCUMENTS;
  try {
    const raw = localStorage.getItem(DEMO_DOCUMENTS_KEY);
    return raw ? (JSON.parse(raw) as DemoDocument[]) : SEED_DOCUMENTS;
  } catch {
    return SEED_DOCUMENTS;
  }
}

export function saveDemoDocuments(docs: DemoDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_DOCUMENTS_KEY, JSON.stringify(docs));
  } catch {
    // Trình duyệt chặn storage thì màn hình vẫn chạy với state trong bộ nhớ.
  }
}

export function resetDemoDocuments(): DemoDocument[] {
  saveDemoDocuments(SEED_DOCUMENTS);
  return SEED_DOCUMENTS;
}
