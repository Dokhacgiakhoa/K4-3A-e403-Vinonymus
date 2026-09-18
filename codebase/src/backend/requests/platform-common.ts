import { z } from 'zod';

export const accountRole = z.enum(['student', 'lecture', 'admin']);
export const documentStatus = z.enum(['draft', 'processing', 'review', 'published', 'archived', 'failed']);
export const background = z.enum(['non_tech', 'tech_base', 'ai']);
export const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).max(100000).default(0),
}).strict();
export const taskInput = z.object({ status: z.enum(['todo', 'in_progress', 'completed', 'skipped']) }).strict();
export const revisionInput = z.object({ revision: z.number().int().positive() }).strict();