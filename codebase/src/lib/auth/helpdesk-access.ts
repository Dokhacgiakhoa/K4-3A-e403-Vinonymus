import { z } from 'zod';
import { createPlatformDependencies } from '@/backend/platform/dependencies';

export const backendUserRoleSchema = z.enum(['Visitor', 'Member', 'Lecture', 'SuperAdmin']);
export type BackendUserRole = z.infer<typeof backendUserRoleSchema>;

const profilePayloadSchema = z.object({
  id: z.string().trim().min(1).max(128).optional(),
  role: z.string().trim().min(1).optional(),
});

export interface BackendUserIdentity {
  role: BackendUserRole;
  userId: string | null;
}

export function canAccessLearningFeatures(role: BackendUserRole): boolean {
  return role !== 'Visitor';
}

function normalizeRole(role: string | undefined): BackendUserRole {
  const normalized = role?.trim().toLowerCase();
  if (normalized === 'lecture') return 'Lecture';
  if (normalized === 'admin' || normalized === 'superadmin') return 'SuperAdmin';
  if (normalized === 'student' || normalized === 'member') return 'Member';
  return 'Visitor';
}

function parseIdentity(payload: unknown): BackendUserIdentity | null {
  const root = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  const candidate = root.data ?? root.user ?? root;
  const parsed = profilePayloadSchema.safeParse(candidate);
  if (!parsed.success) return null;
  return {
    role: normalizeRole(parsed.data.role),
    userId: parsed.data.id ?? null,
  };
}

export async function resolveBackendUserRole(
  authorization: string | null,
): Promise<BackendUserRole> {
  return (await resolveBackendUserIdentity(authorization)).role;
}

export async function resolveBackendUserIdentity(
  authorization: string | null,
  requestOrigin?: string,
): Promise<BackendUserIdentity> {
  if (!authorization?.startsWith('Bearer ')) return { role: 'Visitor', userId: null };
  const token = authorization.slice('Bearer '.length).trim();

  try {
    const profile = await createPlatformDependencies().identify(token);
    return { role: normalizeRole(profile.role), userId: profile.id };
  } catch {
    // External backend deployments still use the HTTP fallback below.
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || requestOrigin || 'http://localhost:3000';
  for (const path of ['/api/v1/me', '/api/v1/auth/me']) {
    try {
      const response = await fetch(`${backendUrl}${path}`, {
        headers: { Authorization: authorization },
        cache: 'no-store',
        signal: AbortSignal.timeout(3_000),
      });
      if (!response.ok) continue;

      const identity = parseIdentity(await response.json());
      if (identity) return identity;
    } catch {
      // Thử endpoint tiếp theo; nếu tất cả lỗi thì fail closed ở dưới.
    }
  }

  return { role: 'Visitor', userId: null };
}
