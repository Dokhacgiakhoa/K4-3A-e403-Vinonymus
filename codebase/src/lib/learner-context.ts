import { z } from 'zod';
import type { BackendUserRole } from '@/lib/auth/helpdesk-access';

export const learnerContextSchema = z
  .object({
    background: z.enum(['non_tech', 'tech_base', 'ai']),
    availableMinutes: z.number().int().min(0).max(600),
    labId: z.string().trim().min(1).max(100),
    note: z.string().trim().max(500).optional(),
    source: z.enum(['ai', 'baseline']),
    diagnosis: z.string().trim().min(1).max(500),
    tasks: z
      .array(
        z
          .object({
            title: z.string().trim().min(1).max(200),
            reason: z.string().trim().max(500),
            minutes: z.number().int().min(0).max(600),
            done: z.boolean(),
          })
          .strict(),
      )
      .max(3),
  })
  .strict();

export type LearnerContext = z.infer<typeof learnerContextSchema>;

const savedPlannerSchema = z.object({
  input: z.object({
    background: learnerContextSchema.shape.background,
    availableMinutes: learnerContextSchema.shape.availableMinutes,
    labId: learnerContextSchema.shape.labId,
    note: z.string().max(500),
  }),
  result: z.object({
    status: z.literal('plan'),
    source: learnerContextSchema.shape.source,
    diagnosis: z.object({ summary: learnerContextSchema.shape.diagnosis }),
  }),
  checklist: z.array(
    z.object({
      title: z.string().trim().min(1).max(200),
      reason: z.string().trim().max(500),
      minutes: z.number().int().min(0).max(600),
      done: z.boolean(),
    }),
  ),
});

export function parseLearnerContext(raw: string): LearnerContext | undefined {
  try {
    const saved = savedPlannerSchema.safeParse(JSON.parse(raw));
    if (!saved.success) return undefined;

    return {
      background: saved.data.input.background,
      availableMinutes: saved.data.input.availableMinutes,
      labId: saved.data.input.labId,
      note: saved.data.input.note || undefined,
      source: saved.data.result.source,
      diagnosis: saved.data.result.diagnosis.summary,
      tasks: saved.data.checklist.slice(0, 3).map(({ title, reason, minutes, done }) => ({
        title,
        reason,
        minutes,
        done,
      })),
    };
  } catch {
    return undefined;
  }
}

export function readLearnerContextFromBrowser(): LearnerContext | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('vinonymus_planner_v2');
    return raw ? parseLearnerContext(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function getLearnerContext(
  role: BackendUserRole,
  candidate?: LearnerContext,
): LearnerContext | undefined {
  return role === 'Visitor' ? undefined : candidate;
}

export function buildLearnerContextBlock(context?: LearnerContext): string {
  if (!context) return '';
  return `\n<learner_context>\n${JSON.stringify(context)}\n</learner_context>\n`;
}
