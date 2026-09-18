import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRuleBasedCvDiagnosticTest } from '../codebase/src/lib/ai-mentor/cv-diagnostic';
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

interface CvDiagnosticEvalResult {
  id: string;
  title: string;
  passed: boolean;
  reasons: string[];
  actual_source: CvDiagnosticTest['source'];
  actual_background: CvDiagnosticTest['analysis']['suggestedBackground'];
  actual_question_skills: DiagnosticSkillId[];
}

const evalDir = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(evalDir, 'cv-diagnostic-set.json'), 'utf8')) as CvDiagnosticCase[];

function grade(testCase: CvDiagnosticCase, actual: CvDiagnosticTest): CvDiagnosticEvalResult {
  const reasons: string[] = [];
  const questionSkills = actual.questions.map((question) => question.skillId);

  if (actual.analysis.suggestedBackground !== testCase.expect.background) {
    reasons.push(`background=${actual.analysis.suggestedBackground}, cần ${testCase.expect.background}`);
  }
  if (actual.questions.length < testCase.expect.min_questions) {
    reasons.push(`chỉ có ${actual.questions.length} câu hỏi`);
  }
  for (const skillId of testCase.expect.must_include_question_skills) {
    if (!questionSkills.includes(skillId)) reasons.push(`thiếu câu hỏi ${skillId}`);
  }
  if (actual.questions.some((question) => question.choices.length < 2)) {
    reasons.push('có câu hỏi thiếu lựa chọn');
  }

  return {
    id: testCase.id,
    title: testCase.title,
    passed: reasons.length === 0,
    reasons,
    actual_source: actual.source,
    actual_background: actual.analysis.suggestedBackground,
    actual_question_skills: questionSkills,
  };
}

function main() {
  if (cases.length < 5) throw new Error(`CV diagnostic eval cần ít nhất 5 case, hiện có ${cases.length}`);
  const results = cases.map((testCase) => grade(testCase, createRuleBasedCvDiagnosticTest(testCase.input)));
  const passed = results.filter((result) => result.passed).length;
  const summary = {
    mode: 'cv-diagnostic-rules',
    run_at: new Date().toISOString(),
    passed,
    failed: results.length - passed,
    total: results.length,
    pass_rate: Number(((passed / results.length) * 100).toFixed(1)),
    cases: results,
  };

  for (const result of results) {
    console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.id} · ${result.title}${result.reasons.length ? ` · ${result.reasons.join('; ')}` : ''}`);
  }
  console.log(`KẾT QUẢ CV DIAGNOSTIC: ${passed}/${results.length} = ${summary.pass_rate}%`);
  writeFileSync(join(evalDir, 'latest-cv-diagnostic-results.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  if (passed !== results.length) process.exitCode = 1;
}

main();

