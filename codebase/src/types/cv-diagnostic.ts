export type DiagnosticSkillId =
  | 'python-basics'
  | 'api-json'
  | 'prompt-basics'
  | 'structured-output'
  | 'function-calling'
  | 'embedding'
  | 'vector-store'
  | 'retrieval'
  | 'rag-evaluation'
  | 'guardrails';

export interface CvDiagnosticInput {
  studentId?: string;
  labId: string;
  cvText: string;
  goal?: string;
  maxQuestions?: number;
}

export interface CvExtractedSkill {
  skillId: DiagnosticSkillId;
  evidence: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface CvDiagnosticAnalysis {
  source: 'ai' | 'rules';
  studentId?: string;
  labId: string;
  profileSummary: string;
  knownSkills: CvExtractedSkill[];
  weakSkillIds: DiagnosticSkillId[];
  suggestedBackground: 'non_tech' | 'tech_base' | 'ai';
  refusalReason?: string;
}

export interface DiagnosticChoice {
  text: string;
}

export interface DiagnosticQuestion {
  id: string;
  skillId: DiagnosticSkillId;
  question: string;
  choices: DiagnosticChoice[];
  correctChoiceIndex: number;
  explanation: string;
}

export interface CvDiagnosticTest {
  source: 'ai' | 'rules';
  studentId?: string;
  labId: string;
  title: string;
  analysis: CvDiagnosticAnalysis;
  questions: DiagnosticQuestion[];
}

