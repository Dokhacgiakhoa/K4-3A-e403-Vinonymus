import { z } from 'zod';
import { background } from './platform-common';

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