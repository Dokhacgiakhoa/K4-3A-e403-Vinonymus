import { z } from 'zod';

export const accountRole = z.enum(['student', 'lecture', 'admin']);
export const documentStatus = z.enum(['draft', 'processing', 'review', 'published', 'archived', 'failed']);
export const background = z.enum(['non_tech', 'tech_base', 'ai']);
export const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).max(100000).default(0),
}).strict();
export const registerInput = z.object({
  email: z.string().trim().email().max(254).transform(s => s.toLowerCase()),
  password: z.string().min(8).max(72),
  displayName: z.string().trim().min(2).max(100),
}).strict();
export const loginInput = registerInput.pick({ email: true, password: true }).extend({ password: z.string().min(1).max(72) });
export const refreshInput = z.object({ refreshToken: z.string().min(1).max(4096) }).strict();
export const profileInput = z.object({
  displayName: z.string().trim().min(2).max(100).optional(),
  background: background.optional(),
  goal: z.string().trim().max(500).optional(),
  weeklyMinutes: z.number().int().min(0).max(10080).optional(),
}).strict().refine(v => Object.keys(v).length > 0, 'Cần ít nhất một trường cập nhật.');
export const analysisInput = z.object({
  background, goal: z.string().trim().min(1).max(500),
  available_minutes: z.number().int().min(0).max(600),
  note: z.string().trim().max(2000).default(''),
  cv_text: z.string().trim().max(20000).default(''),
}).strict();
export const roadmapInput = z.object({
  background, available_minutes: z.number().int().min(0).max(600),
  lab_id: z.string().min(1).max(120), note: z.string().max(500).default(''),
}).strict();
export const taskInput = z.object({ status: z.enum(['todo', 'in_progress', 'completed', 'skipped']) }).strict();
export const progressInput = taskInput.extend({ roadmapId: z.string().uuid(), nodeId: z.string().min(1).max(120) });
export const revisionInput = z.object({ revision: z.number().int().positive() }).strict();
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
const question = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]{1,60}$/), text: z.string().trim().min(1).max(2000),
  options: z.object({ A: z.string().min(1).max(1000), B: z.string().min(1).max(1000), C: z.string().min(1).max(1000), D: z.string().min(1).max(1000) }).strict(),
  correctOption: z.enum(['A','B','C','D']), explanation: z.string().trim().min(1).max(2000),
}).strict();
export const quizInput = z.object({
  title: z.string().trim().min(1).max(255), labId: z.string().min(1).max(120),
  passPercent: z.number().int().min(1).max(100).default(70),
  questions: z.array(question).min(1).max(30).refine(qs => new Set(qs.map(q => q.id)).size === qs.length, 'ID câu hỏi phải duy nhất.'),
}).strict();
export const quizUpdate = quizInput.extend({ revision: z.number().int().positive() });
export const submissionInput = revisionInput.extend({
  requestId: z.string().uuid(),
  answers: z.array(z.object({ questionId: z.string().min(1).max(60), option: z.enum(['A','B','C','D']) }).strict()).min(1).max(30)
    .refine(a => new Set(a.map(v => v.questionId)).size === a.length, 'Không được trả lời trùng câu hỏi.'),
});
export const roleInput = z.object({ role: accountRole, tier: z.enum(['free','vip']).optional() }).strict();
export const statusInput = z.object({ isActive: z.boolean() }).strict();
