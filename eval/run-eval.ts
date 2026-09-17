import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findLab } from '../codebase/src/data/planner-catalog';
import { planWithRules } from '../codebase/src/lib/planner/baseline-planner';
import type { PlannerBackground, PlannerResult } from '../codebase/src/types/planner';

type EvalMode = 'baseline' | 'ai';

interface GoldenCase {
  id: string;
  title: string;
  group: 'everyday' | 'source_truth' | 'ambiguity' | 'out_of_scope' | 'domain';
  rarity: 'common' | 'edge';
  source_refs: string[];
  input: {
    background: PlannerBackground;
    availableMinutes: number;
    labId: string;
    note: string;
  };
  expect: {
    status: PlannerResult['status'];
    must_include?: string[];
    must_not_include?: string[];
    first_task_level?: 'basic' | 'advanced';
    max_tasks?: number;
    max_total_minutes?: number;
    catalog_only?: boolean;
  };
}

interface CaseResult {
  id: string;
  title: string;
  group: GoldenCase['group'];
  passed: boolean;
  reasons: string[];
  actual_status: PlannerResult['status'];
  actual_source?: 'ai' | 'baseline';
}

const evalDir = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(evalDir, 'golden-set.json'), 'utf8')) as GoldenCase[];

function aiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const mappings = [
    ['GEMINI_API_KEY', 'x-gemini-key'],
    ['OPENAI_API_KEY', 'x-openai-key'],
    ['ANTHROPIC_API_KEY', 'x-claude-key'],
    ['DEEPSEEK_API_KEY', 'x-deepseek-key'],
    ['GROQ_API_KEY', 'x-groq-key'],
    ['CEREBRAS_API_KEY', 'x-cerebras-key'],
  ] as const;
  for (const [envName, headerName] of mappings) {
    const value = process.env[envName];
    if (value) headers[headerName] = value;
  }
  return headers;
}

async function runCase(testCase: GoldenCase, mode: EvalMode): Promise<PlannerResult> {
  if (mode === 'baseline') return planWithRules(testCase.input);

  const baseUrl = process.env.PLANNER_BASE_URL ?? 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/roadmap`, {
    method: 'POST',
    headers: aiHeaders(),
    body: JSON.stringify({
      background: testCase.input.background,
      available_minutes: testCase.input.availableMinutes,
      lab_id: testCase.input.labId,
      note: testCase.input.note,
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return (await response.json()) as PlannerResult;
}

function grade(testCase: GoldenCase, result: PlannerResult, mode: EvalMode): CaseResult {
  const reasons: string[] = [];
  if (result.status !== testCase.expect.status) {
    reasons.push(`status=${result.status}, cần ${testCase.expect.status}`);
  }

  if (result.status === 'plan') {
    const taskIds = result.tasks.map((task) => task.itemId);
    const lab = findLab(testCase.input.labId);
    const catalogById = new Map(lab?.items.map((item) => [item.itemId, item]) ?? []);
    const totalMinutes = result.tasks.reduce((sum, task) => sum + task.minutes, 0);

    if (mode === 'ai' && result.source !== 'ai') reasons.push('AI fallback về baseline');
    if (result.tasks.length === 0) reasons.push('kế hoạch không có nhiệm vụ');
    if (result.tasks.length > (testCase.expect.max_tasks ?? 3)) reasons.push('vượt số nhiệm vụ');
    if (totalMinutes > (testCase.expect.max_total_minutes ?? testCase.input.availableMinutes)) {
      reasons.push('vượt quỹ thời gian');
    }
    if (new Set(taskIds).size !== taskIds.length) reasons.push('item bị trùng');

    for (const required of testCase.expect.must_include ?? []) {
      if (!taskIds.includes(required)) reasons.push(`thiếu ${required}`);
    }
    for (const forbidden of testCase.expect.must_not_include ?? []) {
      if (taskIds.includes(forbidden)) reasons.push(`có item cấm ${forbidden}`);
    }

    if (testCase.expect.catalog_only) {
      for (const task of result.tasks) {
        const catalogItem = catalogById.get(task.itemId);
        if (!catalogItem) reasons.push(`item ngoài catalog ${task.itemId}`);
        else if (catalogItem.url !== task.url) reasons.push(`URL sai catalog ${task.itemId}`);
      }
    }

    if (testCase.expect.first_task_level && result.tasks[0]) {
      const level = catalogById.get(result.tasks[0].itemId)?.level;
      if (level !== testCase.expect.first_task_level) {
        reasons.push(`task đầu mức ${level ?? 'unknown'}, cần ${testCase.expect.first_task_level}`);
      }
    }
  }

  return {
    id: testCase.id,
    title: testCase.title,
    group: testCase.group,
    passed: reasons.length === 0,
    reasons,
    actual_status: result.status,
    actual_source: result.status === 'plan' ? result.source : undefined,
  };
}

async function main() {
  const mode = (process.argv[2] ?? 'baseline') as EvalMode;
  if (mode !== 'baseline' && mode !== 'ai') throw new Error('Mode phải là baseline hoặc ai');
  if (cases.length < 20) throw new Error(`Golden set chỉ có ${cases.length}/20 case`);

  const results: CaseResult[] = [];
  for (const testCase of cases) {
    try {
      results.push(grade(testCase, await runCase(testCase, mode), mode));
    } catch (error) {
      results.push({
        id: testCase.id,
        title: testCase.title,
        group: testCase.group,
        passed: false,
        reasons: [error instanceof Error ? error.message : String(error)],
        actual_status: 'clarify',
      });
    }
  }

  const passed = results.filter((result) => result.passed).length;
  const summary = {
    mode,
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
  console.log(`KẾT QUẢ ${mode}: ${passed}/${results.length} = ${summary.pass_rate}%`);
  writeFileSync(join(evalDir, `latest-${mode}-results.json`), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  if (passed !== results.length) process.exitCode = 1;
}

void main();
