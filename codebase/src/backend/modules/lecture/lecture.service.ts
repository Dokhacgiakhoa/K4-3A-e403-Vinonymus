import type { Json } from '@/types/database';
import type { PlatformDependencies } from '@/backend/platform/dependencies';

export type LectureOperation = 'list' | 'create' | 'get' | 'update' | 'delete' | 'submit' | 'review' | 'publish' | 'archive' | 'versions' | 'reviews';

export function executeLectureOperation(
  dependencies: PlatformDependencies,
  action: LectureOperation,
  actorId: string,
  target: string | null,
  data: Json,
): Promise<Json> {
  return dependencies.rpc('platform_documents', { p_actor: actorId, p_action: action, p_target: target, p_data: data });
}