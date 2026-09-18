import { handler as platformHandler } from '@/backend/platform/controller';
import type { OperationId } from '@/backend/platform/endpoints';

export function handler(operation: Extract<OperationId, 'documents' | 'createDocument' | 'document' | 'updateDocument' | 'deleteDocument' | 'submitDocument' | 'reviewDocument' | 'publishDocument' | 'archiveDocument' | 'versions' | 'reviews'>) {
  return platformHandler(operation);
}