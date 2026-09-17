import { z } from 'zod';
import { id, time } from './platform-base.response';

export const AuditList = z.array(z.object({id,actor_id:id.nullable(),action:z.string(),resource_id:id.nullable(),details:z.record(z.unknown()),created_at:time}));
export const Analytics = z.object({users:z.number(),activeUsers:z.number(),publishedDocuments:z.number(),pendingReviews:z.number(),roadmaps:z.number()});
