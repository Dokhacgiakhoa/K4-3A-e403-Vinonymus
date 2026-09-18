import { describe, expect, it } from 'vitest';
import { createRuleBasedCvDiagnosticTest } from '@/lib/ai-mentor/cv-diagnostic';
import {
  createStudentLearningPathFromDiagnostic,
  scoreDiagnosticTest,
} from '@/lib/ai-mentor/diagnostic-learning-path';

describe('diagnostic learning path', () => {
  it('chấm bài test và đưa function-calling vào weak skills', () => {
    const test = createRuleBasedCvDiagnosticTest({
      studentId: 'stu_001',
      labId: 'lab-prompt-tool-calling',
      cvText: 'Tôi biết Python API JSON nhưng chưa hiểu function calling.',
    });
    const score = scoreDiagnosticTest(
      test,
      test.questions.map((question) => ({
        questionId: question.id,
        selectedChoiceIndex:
          question.skillId === 'function-calling'
            ? (question.correctChoiceIndex + 1) % question.choices.length
            : question.correctChoiceIndex,
      })),
    );

    expect(score.scorePercent).toBeLessThan(100);
    expect(score.weakSkillIds).toContain('function-calling');
  });

  it('tạo lộ trình Student từ weak skill và chỉ dùng item trong catalog', () => {
    const result = createStudentLearningPathFromDiagnostic({
      role: 'student',
      availableMinutes: 60,
      diagnosticScore: {
        labId: 'lab-prompt-tool-calling',
        scorePercent: 60,
        correctCount: 3,
        totalQuestions: 5,
        weakSkillIds: ['function-calling', 'structured-output'],
        verifiedSkillIds: ['api-json'],
      },
    });

    expect(result.status).toBe('plan');
    if (result.status !== 'plan') return;
    expect(result.role).toBe('student');
    expect(result.tasks.map((task) => task.itemId)).toContain('ptc-function-calling');
    expect(result.tasks.every((task) => task.url.startsWith('https://'))).toBe(true);
  });

  it('từ chối tạo nội dung cho role không phải Student', () => {
    const result = createStudentLearningPathFromDiagnostic({
      role: 'lecturer',
      availableMinutes: 60,
      diagnosticScore: {
        labId: 'lab-prompt-tool-calling',
        scorePercent: 40,
        correctCount: 2,
        totalQuestions: 5,
        weakSkillIds: ['function-calling'],
        verifiedSkillIds: [],
      },
    });

    expect(result.status).toBe('refuse');
  });
});
