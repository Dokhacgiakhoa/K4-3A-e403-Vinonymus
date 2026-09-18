import { handler as platformHandler } from '@/backend/platform/controller';
import type { OperationId } from '@/backend/platform/endpoints';

export function handler(operation: Extract<OperationId, 'nodes' | 'progress' | 'updateProgress' | 'studentDocuments' | 'studentDocument'>) {
  return platformHandler(operation);
}