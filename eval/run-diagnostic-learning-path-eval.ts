import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findLab } from '../codebase/src/data/planner-catalog';
import { createStudentLearningPathFromDiagnostic } from '../codebase/src/lib/ai-mentor/diagnostic-learning-path';
import type { DiagnosticLearningPathInput } from '../codebase/src/types/cv-diagnostic';

interface PathCase {
  id: string;
  title: string;
  input: DiagnosticLearningPathInput;
  expect: {
    status: 'plan' | 'refuse' | 'clarify';
    must_include?: string[];
    catalog_only?: boolean;
    role?: 'student';
  };
}

interface PathEvalResult {
  id: string;
  title: string;
  passed: boolean;
  reasons: string[];
  actual_status: 'plan' | 'refuse' | 'clarify';
  actual_task_ids: string[];
}

const evalDir = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(evalDir, 'diagnostic-learning-path-set.json'), 'utf8')) as PathCase[];

function grade(testCase: PathCase): PathEvalResult {
  const result = createStudentLearningPathFromDiagnostic(testCase.input);
  const reasons: string[] = [];
  const taskIds = result.status === 'plan' ? result.tasks.map((task) => task.itemId) : [];

  if (result.status !== testCase.expect.status) {
    reasons.push(`status=${result.status}, cần ${testCase.expect.status}`);
  }

  if (result.status === 'plan') {
    if (testCase.expect.role && result.role !== testCase.expect.role) {
      reasons.push(`role=${result.role}, cần ${testCase.expect.role}`);
    }
    for (const itemId of testCase.expect.must_include ?? []) {
      if (!taskIds.includes(itemId)) reasons.push(`thiếu ${itemId}`);
    }
    if (testCase.expect.catalog_only) {
      const lab = findLab(testCase.input.diagnosticScore.labId);
      const catalogById = new Map(lab?.items.map((item) => [item.itemId, item]) ?? []);
      for (const task of result.tasks) {
        const item = catalogById.get(task.itemId);
        if (!item) reasons.push(`item ngoài catalog ${task.itemId}`);
        else if (item.url !== task.url) reasons.push(`URL sai catalog ${task.itemId}`);
      }
    }
  }

  return {
    id: testCase.id,
    title: testCase.title,
    passed: reasons.length === 0,
    reasons,
    actual_status: result.status,
    actual_task_ids: taskIds,
  };
}

function main() {
  if (cases.length < 5) throw new Error(`Diagnostic path eval cần ít nhất 5 case, hiện có ${cases.length}`);
  const results = cases.map(grade);
  const passed = results.filter((result) => result.passed).length;
  const summary = {
    mode: 'diagnostic-learning-path-rules',
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
  console.log(`KẾT QUẢ DIAGNOSTIC PATH: ${passed}/${results.length} = ${summary.pass_rate}%`);
  writeFileSync(join(evalDir, 'latest-diagnostic-learning-path-results.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  if (passed !== results.length) process.exitCode = 1;
}

main();

