import type { Json } from '@/types/database';
import type { PlatformDependencies } from '@/backend/platform/dependencies';

export type AdminOperation = 'users' | 'get' | 'role' | 'status' | 'audit' | 'analytics';

export function executeAdminOperation(
  dependencies: PlatformDependencies,
  action: AdminOperation,
  actorId: string,
  target: string | null,
  data: Json,
): Promise<Json> {
  return dependencies.rpc('platform_admin', { p_actor: actorId, p_action: action, p_target: target, p_data: data });
}