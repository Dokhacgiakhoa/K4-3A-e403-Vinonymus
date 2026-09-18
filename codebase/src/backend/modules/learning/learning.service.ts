import type { Json } from '@/types/database';
import type { PlatformDependencies } from '@/backend/platform/dependencies';

export type LearningOperation = 'list' | 'get' | 'delete' | 'task' | 'progress' | 'create';

export function executeLearningOperation(
  dependencies: PlatformDependencies,
  action: LearningOperation,
  actorId: string,
  target: string | null,
  data: Json,
): Promise<Json> {
  return dependencies.rpc('platform_learning', {
    p_actor: actorId,
    p_action: action,
    p_target: target,
    p_data: data,
  });
}