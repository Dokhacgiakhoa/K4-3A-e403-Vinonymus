/**
 * SHARED TECHNICAL CONTRACT (TypeScript <-> C# .NET 10)
 * Ánh xạ 1:1 với AIIANotebook.Domain.Entities và DTOs của backend-core
 */

export type SFIALevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

export type UserTier = 'Guest' | 'Free' | 'Pro';

export type PaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded';

export interface AppUserDto {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  tier: UserTier;
  currentLevel: SFIALevel;
  totalStudyHours: number;
  aiTokenQuota: number;
  aiTokenUsed: number;
  isActive: boolean;
  createdAt: string;
}

export interface CurriculumModuleDto {
  id: string;
  moduleNumber: number;
  title: string;
  slug: string;
  description: string;
  targetLevel: SFIALevel;
  bloomLevel: string;
  estimatedHours: number;
  humanAiRatio: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface QuizQuestionDto {
  id: string;
  level: SFIALevel;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  isSimulationMock: boolean;
}

export interface SubmitQuizRequestDto {
  userId: string;
  moduleId?: string;
  userAnswers: Record<string, string>;
}

export interface SubmitQuizResultDto {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  isPassed: boolean;
  feedbackMessage: string;
}

export interface VietQrInvoiceDto {
  orderCode: string;
  amountVnd: number;
  bankId: string;
  accountNumber: string;
  accountName: string;
  description: string;
  qrCodeUrl: string;
}
