import type { AccountRole, Profile } from './models';
import type { PlatformDependencies } from './dependencies';
import { ApiError } from './http';

export function bearerToken(request: Request): string {
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) throw new ApiError(401, 'UNAUTHENTICATED', 'Cần Authorization: Bearer <accessToken>.');
  return token;
}

export async function authorize(request: Request, roles: readonly AccountRole[], deps: PlatformDependencies): Promise<Profile> {
  const profile = await deps.identify(bearerToken(request));
  if (!profile.is_active || !roles.includes(profile.role)) throw new ApiError(403, 'FORBIDDEN', 'Vai trò này không được phép thực hiện thao tác.');
  return profile;
}
