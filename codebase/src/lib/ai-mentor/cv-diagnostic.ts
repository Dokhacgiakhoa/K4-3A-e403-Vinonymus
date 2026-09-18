import { buildQuestion, CV_DIAGNOSTIC_SKILLS } from '@/data/cv-diagnostic-question-bank';
import type {
  CvDiagnosticAnalysis,
  CvDiagnosticInput,
  CvDiagnosticTest,
  CvExtractedSkill,
  DiagnosticQuestion,
  DiagnosticSkillId,
} from '@/types/cv-diagnostic';

const DEFAULT_WEAK_SKILLS: DiagnosticSkillId[] = ['prompt-basics', 'structured-output', 'function-calling'];
const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 5;

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFC');
}

function clip(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;
}

function uniqueSkillIds(skillIds: DiagnosticSkillId[]): DiagnosticSkillId[] {
  return Array.from(new Set(skillIds));
}

export function analyzeCvWithRules(input: CvDiagnosticInput): CvDiagnosticAnalysis {
  const normalizedCv = normalize(input.cvText);
  const knownSkills: CvExtractedSkill[] = [];

  for (const template of CV_DIAGNOSTIC_SKILLS) {
    const matchedAlias = template.aliases.find((alias) => normalizedCv.includes(normalize(alias)));
    if (!matchedAlias) continue;
    knownSkills.push({
      skillId: template.skillId,
      evidence: `CV nhắc tới "${matchedAlias}".`,
      confidence: 'medium',
    });
  }

  const knownSkillIds = new Set(knownSkills.map((skill) => skill.skillId));
  const labWeakSkills = inferWeakSkillsForLab(input.labId, normalizedCv);
  const weakSkillIds = uniqueSkillIds([
    ...labWeakSkills,
    ...DEFAULT_WEAK_SKILLS.filter((skillId) => !knownSkillIds.has(skillId)),
  ]).slice(0, MAX_QUESTIONS);

  return {
    source: 'rules',
    studentId: input.studentId,
    labId: input.labId,
    profileSummary:
      knownSkills.length > 0
        ? `CV thể hiện ${knownSkills.map((skill) => skill.skillId).join(', ')}; cần kiểm chứng bằng bài test ngắn.`
        : 'CV chưa nêu đủ kỹ năng AI cụ thể; cần bài test nền tảng để xác định điểm xuất phát.',
    knownSkills,
    weakSkillIds: weakSkillIds.length > 0 ? weakSkillIds : DEFAULT_WEAK_SKILLS,
    suggestedBackground: inferBackground(normalizedCv),
  };
}

function mentionsUncertainty(normalizedCv: string, skillId: DiagnosticSkillId): boolean {
  const template = CV_DIAGNOSTIC_SKILLS.find((skill) => skill.skillId === skillId);
  if (!template) return false;
  return template.aliases.some((alias) => {
    const index = normalizedCv.indexOf(normalize(alias));
    if (index === -1) return false;
    const prefix = normalizedCv.slice(Math.max(0, index - 40), index);
    return /(chưa|không|khong|yếu|yeu|mơ hồ|mo ho|cần học|can hoc|muốn kiểm tra|muon kiem tra)/.test(prefix);
  });
}

function inferWeakSkillsForLab(labId: string, normalizedCv: string): DiagnosticSkillId[] {
  if (labId.includes('rag') || normalizedCv.includes('rag')) {
    return ['embedding', 'vector-store', 'retrieval', 'rag-evaluation', 'guardrails'];
  }
  if (labId.includes('prompt') || normalizedCv.includes('function calling') || normalizedCv.includes('tool calling')) {
    return ['prompt-basics', 'structured-output', 'function-calling', 'api-json', 'guardrails'];
  }
  if (labId.includes('spec') || normalizedCv.includes('prd') || normalizedCv.includes('product')) {
    return ['prompt-basics', 'structured-output', 'guardrails'];
  }
  return DEFAULT_WEAK_SKILLS;
}

function inferBackground(normalizedCv: string): CvDiagnosticAnalysis['suggestedBackground'] {
  if (/(chưa hiểu|chua hieu|mới học|moi hoc|cơ bản|co ban)/.test(normalizedCv)) {
    if (/(python|api|json|code|javascript|typescript|sql)/.test(normalizedCv)) return 'tech_base';
  }
  if (/(rag|embedding|vector|fine-tuning|machine learning|deep learning|llm|langchain)/.test(normalizedCv)) return 'ai';
  if (/(python|typescript|javascript|java|c#|\.net|api|backend|frontend|sql|code)/.test(normalizedCv)) return 'tech_base';
  return 'non_tech';
}

export function generateDiagnosticTestFromAnalysis(
  analysis: CvDiagnosticAnalysis,
  input?: Pick<CvDiagnosticInput, 'maxQuestions'>,
): CvDiagnosticTest {
  const maxQuestions = Math.min(Math.max(input?.maxQuestions ?? MAX_QUESTIONS, MIN_QUESTIONS), MAX_QUESTIONS);
  const skillIds = uniqueSkillIds([
    ...analysis.weakSkillIds,
    ...DEFAULT_WEAK_SKILLS,
    ...analysis.knownSkills.map((skill) => skill.skillId),
  ]).slice(0, maxQuestions);

  const questions = skillIds.map((skillId, index) => buildQuestion(skillId, index));
  return {
    source: analysis.source,
    studentId: analysis.studentId,
    labId: analysis.labId,
    title: `Bài test chẩn đoán từ CV (${questions.length} câu)`,
    analysis,
    questions,
  };
}

export function createRuleBasedCvDiagnosticTest(input: CvDiagnosticInput): CvDiagnosticTest {
  return generateDiagnosticTestFromAnalysis(analyzeCvWithRules(input), input);
}

export function materializeCvDiagnosticTest(
  aiAnalysis: CvDiagnosticAnalysis,
  aiQuestions: DiagnosticQuestion[],
  fallbackInput: CvDiagnosticInput,
): CvDiagnosticTest {
  const fallback = createRuleBasedCvDiagnosticTest(fallbackInput);
  const allowedSkillIds = new Set(CV_DIAGNOSTIC_SKILLS.map((skill) => skill.skillId));
  const seen = new Set<string>();
  const questions = aiQuestions
    .filter((question) => allowedSkillIds.has(question.skillId))
    .filter((question) => {
      if (seen.has(question.skillId)) return false;
      seen.add(question.skillId);
      return question.choices.length >= 2 && question.correctChoiceIndex >= 0 && question.correctChoiceIndex < question.choices.length;
    })
    .slice(0, fallbackInput.maxQuestions ?? MAX_QUESTIONS)
    .map((question, index) => ({
      ...question,
      id: `cvq-ai-${index + 1}-${question.skillId}`,
      question: clip(question.question, 240),
      explanation: clip(question.explanation, 300),
      choices: question.choices.slice(0, 4).map((choice) => ({ text: clip(choice.text, 160) })),
    }));

  if (questions.length < MIN_QUESTIONS) return fallback;

  return {
    source: 'ai',
    studentId: fallbackInput.studentId,
    labId: fallbackInput.labId,
    title: `Bài test chẩn đoán từ CV (${questions.length} câu)`,
    analysis: {
      ...fallback.analysis,
      ...aiAnalysis,
      source: 'ai',
      studentId: fallbackInput.studentId,
      labId: fallbackInput.labId,
    },
    questions,
  };
}
