import { findLab } from '@/data/planner-catalog';
import type { CatalogItem } from '@/types/planner';
import type {
  CvDiagnosticTest,
  DiagnosticAnswer,
  DiagnosticLearningPathInput,
  DiagnosticScore,
  DiagnosticSkillId,
} from '@/types/cv-diagnostic';

export interface StudentLearningTask {
  itemId: string;
  title: string;
  url: string;
  minutes: number;
  reason: string;
  skillIds: DiagnosticSkillId[];
}

export type StudentDiagnosticPathResult =
  | {
      status: 'plan';
      role: 'student';
      studentId?: string;
      labId: string;
      scorePercent: number;
      diagnosis: string;
      tasks: StudentLearningTask[];
      message: string;
    }
  | {
      status: 'refuse';
      message: string;
    }
  | {
      status: 'clarify';
      question: string;
    };

const SKILL_TO_CATALOG_TAGS: Record<DiagnosticSkillId, string[]> = {
  'python-basics': ['setup', 'notebook'],
  'api-json': ['api key', 'json', 'schema'],
  'prompt-basics': ['prompt', 'instruction', 'context'],
  'structured-output': ['structured output', 'schema', 'json'],
  'function-calling': ['function calling', 'tool calling'],
  embedding: ['embedding'],
  'vector-store': ['vector store', 'pgvector'],
  retrieval: ['retrieval', 'rag'],
  'rag-evaluation': ['evaluation', 'faithfulness'],
  guardrails: ['guardrail', 'hax', 'human control'],
};

const MIN_MINUTES_FOR_PATH = 30;
const MAX_STUDENT_TASKS = 3;

function uniqueSkillIds(skillIds: DiagnosticSkillId[]): DiagnosticSkillId[] {
  return Array.from(new Set(skillIds));
}

function taskSkills(item: CatalogItem, weakSkillIds: DiagnosticSkillId[]): DiagnosticSkillId[] {
  return weakSkillIds.filter((skillId) => {
    const tags = SKILL_TO_CATALOG_TAGS[skillId];
    return tags.some((tag) => item.tags.includes(tag));
  });
}

function itemScore(item: CatalogItem, weakSkillIds: DiagnosticSkillId[]): number {
  const matchedSkills = taskSkills(item, weakSkillIds);
  if (matchedSkills.length === 0) return -100;
  return matchedSkills.length * 100 + (item.tags.includes('core') ? 30 : 0) + (item.level === 'basic' ? 5 : 0);
}

export function scoreDiagnosticTest(test: CvDiagnosticTest, answers: DiagnosticAnswer[]): DiagnosticScore {
  const answerByQuestionId = new Map(answers.map((answer) => [answer.questionId, answer]));
  const weakSkillIds: DiagnosticSkillId[] = [];
  const verifiedSkillIds: DiagnosticSkillId[] = [];
  let correctCount = 0;

  for (const question of test.questions) {
    const answer = answerByQuestionId.get(question.id);
    if (answer?.selectedChoiceIndex === question.correctChoiceIndex) {
      correctCount += 1;
      verifiedSkillIds.push(question.skillId);
    } else {
      weakSkillIds.push(question.skillId);
    }
  }

  return {
    studentId: test.studentId,
    labId: test.labId,
    scorePercent: Math.round((correctCount / test.questions.length) * 100),
    correctCount,
    totalQuestions: test.questions.length,
    weakSkillIds: uniqueSkillIds(weakSkillIds),
    verifiedSkillIds: uniqueSkillIds(verifiedSkillIds),
  };
}

export function createStudentLearningPathFromDiagnostic(input: DiagnosticLearningPathInput): StudentDiagnosticPathResult {
  if (input.role !== 'student') {
    return {
      status: 'refuse',
      message: 'AI Mentor chỉ tạo lộ trình học cho vai trò Student; không tạo nội dung quản trị, giảng viên hoặc khách xem.',
    };
  }

  if (input.availableMinutes < MIN_MINUTES_FOR_PATH) {
    return {
      status: 'clarify',
      question: `Bạn đang có ${input.availableMinutes} phút, chưa đủ để học một nhiệm vụ trọn vẹn. Bạn có thể dành ít nhất ${MIN_MINUTES_FOR_PATH} phút không?`,
    };
  }

  const lab = findLab(input.diagnosticScore.labId);
  if (!lab) {
    return {
      status: 'clarify',
      question: 'Mình chưa có thư viện tài liệu cho bài lab này. Bạn chọn lại lab trong danh sách nhé?',
    };
  }

  const weakSkillIds =
    input.diagnosticScore.weakSkillIds.length > 0
      ? input.diagnosticScore.weakSkillIds
      : input.diagnosticScore.verifiedSkillIds.slice(0, 2);

  const rankedItems = lab.items
    .map((item, index) => ({ item, index, score: itemScore(item, weakSkillIds) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);

  const tasks: StudentLearningTask[] = [];
  let usedMinutes = 0;
  for (const item of rankedItems) {
    if (tasks.length >= MAX_STUDENT_TASKS) break;
    if (usedMinutes + item.minutes > input.availableMinutes) continue;
    const skills = taskSkills(item, weakSkillIds);
    tasks.push({
      itemId: item.itemId,
      title: item.title,
      url: item.url,
      minutes: item.minutes,
      skillIds: skills,
      reason:
        skills.length > 0
          ? `Bài test cho thấy bạn cần củng cố ${skills.join(', ')}. ${item.why}`
          : item.why,
    });
    usedMinutes += item.minutes;
  }

  if (tasks.length === 0) {
    return {
      status: 'clarify',
      question: 'Điểm test chưa khớp tài liệu nào trong thư viện hiện có. Bạn chọn lab khác hoặc tăng quỹ thời gian nhé?',
    };
  }

  return {
    status: 'plan',
    role: 'student',
    studentId: input.studentId ?? input.diagnosticScore.studentId,
    labId: input.diagnosticScore.labId,
    scorePercent: input.diagnosticScore.scorePercent,
    diagnosis:
      input.diagnosticScore.weakSkillIds.length > 0
        ? `Bạn đạt ${input.diagnosticScore.scorePercent}/100; ưu tiên học lại ${input.diagnosticScore.weakSkillIds.join(', ')}.`
        : `Bạn đạt ${input.diagnosticScore.scorePercent}/100; lộ trình giữ nhịp ôn tập nhẹ từ các kỹ năng đã xác minh.`,
    tasks,
    message: `Tổng ${usedMinutes}/${input.availableMinutes} phút, chỉ dùng tài liệu trong thư viện của ${lab.title}.`,
  };
}

