import { describe, expect, it } from 'vitest';
import {
  analyzeCvWithRules,
  createRuleBasedCvDiagnosticTest,
  materializeCvDiagnosticTest,
} from '@/lib/ai-mentor/cv-diagnostic';

describe('cv diagnostic mentor', () => {
  it('trích kỹ năng từ CV và tạo test function calling cho học viên tech-base', () => {
    const test = createRuleBasedCvDiagnosticTest({
      studentId: 'stu_001',
      labId: 'lab-prompt-tool-calling',
      cvText: 'Tôi đã học Python, REST API, JSON và muốn kiểm tra structured output, schema validation, function calling.',
    });

    expect(test.source).toBe('rules');
    expect(test.questions.length).toBeGreaterThanOrEqual(3);
    expect(test.analysis.suggestedBackground).toBe('tech_base');
    expect(test.questions.some((question) => question.skillId === 'function-calling')).toBe(true);
    expect(test.questions.every((question) => question.choices.length >= 2)).toBe(true);
  });

  it('ưu tiên RAG skills khi CV nhắc embedding và vector store', () => {
    const analysis = analyzeCvWithRules({
      labId: 'lab-rag-foundations',
      cvText: 'Tôi biết Python cơ bản nhưng chưa hiểu embedding, vector database, retrieval và đánh giá faithfulness trong RAG.',
    });

    expect(analysis.weakSkillIds).toContain('embedding');
    expect(analysis.weakSkillIds).toContain('vector-store');
    expect(analysis.weakSkillIds).toContain('retrieval');
  });

  it('lọc output AI sai schema nghiệp vụ về skill hợp lệ và fallback khi thiếu câu hỏi', () => {
    const result = materializeCvDiagnosticTest(
      {
        source: 'ai',
        labId: 'lab-prompt-tool-calling',
        profileSummary: 'Học viên cần kiểm tra tool calling.',
        knownSkills: [],
        weakSkillIds: ['function-calling'],
        suggestedBackground: 'tech_base',
      },
      [
        {
          id: 'bad',
          skillId: 'function-calling',
          question: 'Tool call cần validate gì?',
          choices: [{ text: 'Tham số' }, { text: 'Không cần' }],
          correctChoiceIndex: 0,
          explanation: 'Ứng dụng phải validate tham số tool.',
        },
      ],
      {
        labId: 'lab-prompt-tool-calling',
        cvText: 'Tôi biết API và JSON nhưng chưa hiểu function calling.',
      },
    );

    expect(result.source).toBe('rules');
    expect(result.questions.length).toBeGreaterThanOrEqual(3);
  });
});

