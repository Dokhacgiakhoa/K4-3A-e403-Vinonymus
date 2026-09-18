import { handler as platformHandler } from '@/backend/platform/controller';
import type { OperationId } from '@/backend/platform/endpoints';

export function handler(operation: Extract<OperationId, 'users' | 'user' | 'userRole' | 'userStatus' | 'adminDocuments' | 'adminDocument' | 'adminReview' | 'adminPublish' | 'adminArchive' | 'adminDelete' | 'audit' | 'analytics'>) {
  return platformHandler(operation);
}