import { NextRequest, NextResponse } from 'next/server';
import { createStudentLearningPathFromDiagnostic } from '@/lib/ai-mentor/diagnostic-learning-path';
import { diagnosticLearningPathInputSchema } from '@/lib/prompts/diagnostic-learning-path';
import type { DiagnosticLearningPathInput, DiagnosticSkillId } from '@/types/cv-diagnostic';

export const runtime = 'nodejs';

const DIAGNOSTIC_SKILL_IDS = new Set<string>([
  'python-basics',
  'api-json',
  'prompt-basics',
  'structured-output',
  'function-calling',
  'embedding',
  'vector-store',
  'retrieval',
  'rag-evaluation',
  'guardrails',
]);

function toSkillIds(values: string[]): DiagnosticSkillId[] {
  return values.filter((value): value is DiagnosticSkillId => DIAGNOSTIC_SKILL_IDS.has(value));
}

export async function POST(req: NextRequest) {
  try {
    const parsed = diagnosticLearningPathInputSchema.safeParse(await req.json());
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? 'Dữ liệu điểm test không hợp lệ', field: issue?.path.join('.') },
        { status: 400 },
      );
    }

    const input: DiagnosticLearningPathInput = {
      role: parsed.data.role,
      studentId: parsed.data.student_id,
      availableMinutes: parsed.data.available_minutes,
      note: parsed.data.note,
      diagnosticScore: {
        studentId: parsed.data.diagnostic_score.studentId,
        labId: parsed.data.diagnostic_score.labId,
        scorePercent: parsed.data.diagnostic_score.scorePercent,
        correctCount: parsed.data.diagnostic_score.correctCount,
        totalQuestions: parsed.data.diagnostic_score.totalQuestions,
        weakSkillIds: toSkillIds(parsed.data.diagnostic_score.weakSkillIds),
        verifiedSkillIds: toSkillIds(parsed.data.diagnostic_score.verifiedSkillIds),
      },
    };

    return NextResponse.json(createStudentLearningPathFromDiagnostic(input));
  } catch {
    return NextResponse.json({ error: 'Không thể tạo lộ trình từ điểm diagnostic.' }, { status: 500 });
  }
}

