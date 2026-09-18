import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CvDiagnosticInput, CvDiagnosticTest, DiagnosticSkillId } from '../codebase/src/types/cv-diagnostic';

interface CvDiagnosticCase {
  id: string;
  title: string;
  input: CvDiagnosticInput;
  expect: {
    background: CvDiagnosticTest['analysis']['suggestedBackground'];
    must_include_question_skills: DiagnosticSkillId[];
    min_questions: number;
  };
}

interface CvDiagnosticAiEvalResult {
  id: string;
  title: string;
  passed: boolean;
  reasons: string[];
  actual_source?: CvDiagnosticTest['source'];
  actual_provider?: string | null;
  actual_model?: string | null;
  actual_background?: CvDiagnosticTest['analysis']['suggestedBackground'];
  actual_question_skills?: DiagnosticSkillId[];
}

const evalDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(evalDir, '..');
const cases = JSON.parse(readFileSync(join(evalDir, 'cv-diagnostic-set.json'), 'utf8')) as CvDiagnosticCase[];

function loadLocalEnv() {
  const envPath = join(repoRoot, 'codebase', '.env.local');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

function aiHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const mappings = [
    ['GEMINI_API_KEY', 'x-gemini-key'],
    ['OPENAI_API_KEY', 'x-openai-key'],
    ['ANTHROPIC_API_KEY', 'x-claude-key'],
    ['DEEPSEEK_API_KEY', 'x-deepseek-key'],
    ['GROQ_API_KEY', 'x-groq-key'],
    ['CEREBRAS_API_KEY', 'x-cerebras-key'],
    ['FPT_API_KEY', 'x-fpt-key'],
  ] as const;

  for (const [envName, headerName] of mappings) {
    const value = process.env[envName]?.trim();
    if (value) headers[headerName] = value;
  }
  return headers;
}

function hasAnyProviderKey(): boolean {
  return [
    'GEMINI_API_KEY',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'DEEPSEEK_API_KEY',
    'GROQ_API_KEY',
    'CEREBRAS_API_KEY',
    'FPT_API_KEY',
  ].some((envName) => Boolean(process.env[envName]?.trim()));
}

async function runCase(testCase: CvDiagnosticCase): Promise<{
  actual: CvDiagnosticTest;
  provider: string | null;
  model: string | null;
}> {
  const baseUrl = process.env.CV_DIAGNOSTIC_BASE_URL ?? process.env.PLANNER_BASE_URL ?? 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/ai-mentor/cv-diagnostic`, {
    method: 'POST',
    headers: aiHeaders(),
    body: JSON.stringify({
      student_id: testCase.input.studentId,
      lab_id: testCase.input.labId,
      cv_text: testCase.input.cvText,
      goal: testCase.input.goal,
      max_questions: testCase.input.maxQuestions,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  const body = (await response.json()) as CvDiagnosticTest | { error?: string };
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${'error' in body ? body.error : 'khong co thong bao loi'}`);
  }

  return {
    actual: body as CvDiagnosticTest,
    provider: response.headers.get('x-ai-provider'),
    model: response.headers.get('x-ai-model'),
  };
}

function grade(
  testCase: CvDiagnosticCase,
  actual: CvDiagnosticTest,
  provider: string | null,
  model: string | null,
): CvDiagnosticAiEvalResult {
  const reasons: string[] = [];
  const questionSkills = actual.questions.map((question) => question.skillId);

  if (actual.source !== 'ai') reasons.push(`source=${actual.source}, can ai`);
  if (!provider) reasons.push('thieu header x-ai-provider nen co the da fallback');
  if (actual.analysis.suggestedBackground !== testCase.expect.background) {
    reasons.push(`background=${actual.analysis.suggestedBackground}, can ${testCase.expect.background}`);
  }
  if (actual.questions.length < testCase.expect.min_questions) {
    reasons.push(`chi co ${actual.questions.length} cau hoi`);
  }
  for (const skillId of testCase.expect.must_include_question_skills) {
    if (!questionSkills.includes(skillId)) reasons.push(`thieu cau hoi ${skillId}`);
  }
  if (actual.questions.some((question) => question.choices.length < 2)) {
    reasons.push('co cau hoi thieu lua chon');
  }

  return {
    id: testCase.id,
    title: testCase.title,
    passed: reasons.length === 0,
    reasons,
    actual_source: actual.source,
    actual_provider: provider,
    actual_model: model,
    actual_background: actual.analysis.suggestedBackground,
    actual_question_skills: questionSkills,
  };
}

async function main() {
  loadLocalEnv();
  process.env.ALLOW_ANON_AI_MENTOR ??= 'true';

  if (cases.length < 5) throw new Error(`CV diagnostic AI eval can it nhat 5 case, hien co ${cases.length}`);
  if (!hasAnyProviderKey()) {
    throw new Error('Khong tim thay API key provider nao trong env hoac codebase/.env.local');
  }

  const results: CvDiagnosticAiEvalResult[] = [];
  for (const testCase of cases) {
    try {
      const { actual, provider, model } = await runCase(testCase);
      results.push(grade(testCase, actual, provider, model));
    } catch (error) {
      results.push({
        id: testCase.id,
        title: testCase.title,
        passed: false,
        reasons: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  const passed = results.filter((result) => result.passed).length;
  const summary = {
    mode: 'cv-diagnostic-ai-route',
    run_at: new Date().toISOString(),
    passed,
    failed: results.length - passed,
    total: results.length,
    pass_rate: Number(((passed / results.length) * 100).toFixed(1)),
    cases: results,
  };

  for (const result of results) {
    const providerLabel = result.actual_provider ? ` · ${result.actual_provider}` : '';
    console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.id}${providerLabel} · ${result.title}${result.reasons.length ? ` · ${result.reasons.join('; ')}` : ''}`);
  }
  console.log(`KET QUA CV DIAGNOSTIC AI ROUTE: ${passed}/${results.length} = ${summary.pass_rate}%`);
  writeFileSync(join(evalDir, 'latest-cv-diagnostic-ai-results.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  if (passed !== results.length) process.exitCode = 1;
}

void main();
