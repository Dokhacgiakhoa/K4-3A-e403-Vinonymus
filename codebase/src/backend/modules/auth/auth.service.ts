import type { Json } from '@/types/database';
import type { AuthInput, PlatformDependencies } from '@/backend/platform/dependencies';

export type AuthOperation = 'register' | 'login' | 'refresh' | 'logout';

export function authenticate(
  dependencies: PlatformDependencies,
  operation: AuthOperation,
  input: AuthInput,
  token?: string,
): Promise<Json> {
  return dependencies.auth(operation, input, token);
}