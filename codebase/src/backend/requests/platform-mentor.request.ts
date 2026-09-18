import { z } from 'zod';
import { background, taskInput } from './platform-common';

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
export const progressInput = taskInput.extend({ roadmapId: z.string().uuid(), nodeId: z.string().min(1).max(120) });