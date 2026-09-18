import { endpoints, type EndpointSpec, type OperationId } from './endpoints';
import type { AccountRole } from './models';

export type PlatformRole = 'guest' | AccountRole;
export type StudentTier = 'free' | 'vip';
export type DocumentStatus = 'draft' | 'processing' | 'review' | 'published' | 'archived' | 'failed';
export type LectureFileType = 'pdf' | 'text' | 'markdown';
export type Permission = OperationId;

export function hasPermission(role: PlatformRole, permission: Permission): boolean {
  const spec: EndpointSpec = endpoints[permission];
  return spec.roles.length === 0 || (role !== 'guest' && spec.roles.includes(role));
}
