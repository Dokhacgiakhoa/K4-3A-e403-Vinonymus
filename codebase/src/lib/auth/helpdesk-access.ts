import { z } from 'zod';

export const backendUserRoleSchema = z.enum(['Visitor', 'Member', 'Lecture', 'SuperAdmin']);
export type BackendUserRole = z.infer<typeof backendUserRoleSchema>;

const authProfileSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.string().trim().min(1).max(128).optional(),
    role: backendUserRoleSchema,
  }),
});

export interface BackendUserIdentity {
  role: BackendUserRole;
  userId: string | null;
}

export function canAccessLearningFeatures(role: BackendUserRole): boolean {
  return role !== 'Visitor';
}

export async function resolveBackendUserRole(
  authorization: string | null,
): Promise<BackendUserRole> {
  return (await resolveBackendUserIdentity(authorization)).role;
}

export async function resolveBackendUserIdentity(
  authorization: string | null,
): Promise<BackendUserIdentity> {
  if (!authorization?.startsWith('Bearer ')) return { role: 'Visitor', userId: null };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_CORE_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: { Authorization: authorization },
      cache: 'no-store',
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) return { role: 'Visitor', userId: null };

    const profile = authProfileSchema.safeParse(await response.json());
    return profile.success
      ? { role: profile.data.data.role, userId: profile.data.data.id ?? null }
      : { role: 'Visitor', userId: null };
  } catch {
    // Fail closed: auth lỗi thì chỉ dùng quyền Visitor.
    return { role: 'Visitor', userId: null };
  }
}
