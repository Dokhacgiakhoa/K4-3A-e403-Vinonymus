import { z } from 'zod';

export const diagnosticLearningPathInputSchema = z.object({
  role: z.enum(['student', 'viewer', 'lecturer', 'admin']),
  student_id: z.string().trim().max(80).optional(),
  available_minutes: z.number().int().min(0).max(240),
  note: z.string().trim().max(500).optional(),
  diagnostic_score: z.object({
    studentId: z.string().trim().max(80).optional(),
    labId: z.string().trim().min(1).max(80),
    scorePercent: z.number().int().min(0).max(100),
    correctCount: z.number().int().min(0),
    totalQuestions: z.number().int().min(1).max(20),
    weakSkillIds: z.array(z.string()).max(10),
    verifiedSkillIds: z.array(z.string()).max(10),
  }),
});

