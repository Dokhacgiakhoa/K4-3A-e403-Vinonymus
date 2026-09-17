import { z } from 'zod';
import { revisionInput } from './platform-common';

export const documentInput = z.object({
  title: z.string().trim().min(1).max(255), summary: z.string().trim().min(1).max(2000),
  labId: z.string().min(1).max(120), itemIds: z.array(z.string().min(1).max(120)).min(1).max(30),
  sourcePath: z.string().trim().min(1).max(500), fileName: z.string().trim().min(1).max(255),
  fileType: z.enum(['pdf','text','markdown']), mimeType: z.enum(['application/pdf','text/plain','text/markdown']),
  fileSizeBytes: z.number().int().min(0).max(100_000_000).default(0),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/, 'SHA-256 lowercase gồm 64 ký tự.'),
}).strict();
export const documentUpdate = documentInput.extend({ revision: z.number().int().positive() });
export const reviewInput = revisionInput.extend({
  decision: z.enum(['approved','rejected','needs_changes']), note: z.string().trim().min(1).max(2000),
});