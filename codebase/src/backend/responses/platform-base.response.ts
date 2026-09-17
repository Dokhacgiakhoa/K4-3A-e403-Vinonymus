import { z } from 'zod';
import { accountRole, background, documentStatus, taskInput } from '../requests/platform-common';

export const id = z.string().uuid();
export const time = z.string();
export const profile = z.object({
  id, display_name:z.string(),role:accountRole,tier:z.enum(['free','vip']),is_active:z.boolean(),
  background:background.nullable(),goal:z.string(),weekly_minutes:z.number().int(),created_at:time,updated_at:time,
});
export const task = z.object({ itemId:z.string(),title:z.string(),url:z.string().url(),type:z.enum(['slide','video','notebook','doc']),
  minutes:z.number(),reason:z.string(),status:taskInput.shape.status,completedAt:time.nullable() });
export const diagnosis = z.object({background,confidence:z.enum(['high','low']),summary:z.string()});
export const roadmap = z.object({id,student_id:id,lab_id:z.string(),source:z.enum(['ai','baseline']),diagnosis,tasks:z.array(task).min(1).max(3),created_at:time,updated_at:time});
export const publicDoc = z.object({id,title:z.string(),summary:z.string(),lab_id:z.string().nullable(),item_ids:z.array(z.string()),
  file_type:z.enum(['pdf','text','markdown']),status:documentStatus,revision:z.number().int(),published_at:time.nullable()});
export const doc = publicDoc.extend({owner_id:id,source_path:z.string(),file_name:z.string(),mime_type:z.string(),file_size_bytes:z.number(),
  qdrant_collection:z.string(),content_hash:z.string(),chunk_count:z.number().int(),review_note:z.string().nullable(),
  published_by:id.nullable(),created_at:time,updated_at:time,approved_revision:z.number().int().nullable(),deleted_at:time.nullable()});
export const docSummary = publicDoc.extend({owner_id:id,updated_at:time});
export const item = z.object({itemId:z.string(),title:z.string(),url:z.string().url(),type:z.enum(['slide','video','notebook','doc']),
  minutes:z.number(),level:z.enum(['basic','advanced']),tags:z.array(z.string()),why:z.string()});