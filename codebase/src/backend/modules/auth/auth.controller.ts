import { handler as platformHandler } from '@/backend/platform/controller';
import type { AuthOperation } from './auth.service';

export function handler(operation: AuthOperation) {
  return platformHandler(operation);
}