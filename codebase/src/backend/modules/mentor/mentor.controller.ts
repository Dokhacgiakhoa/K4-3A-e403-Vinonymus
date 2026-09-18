import { handler as platformHandler } from '@/backend/platform/controller';
import type { OperationId } from '@/backend/platform/endpoints';

export function handler(operation: Extract<OperationId, 'analyze' | 'createRoadmap' | 'roadmaps' | 'roadmap' | 'deleteRoadmap' | 'task'>) {
  return platformHandler(operation);
}