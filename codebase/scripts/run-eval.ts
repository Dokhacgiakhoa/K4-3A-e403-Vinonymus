// Chạy golden set qua baseline (luật tĩnh) hoặc qua /api/roadmap thật.
// Đặt trong codebase/ (không phải eval/ ở gốc) để import được alias "@/..." — xem
// docs/hackathon/repo-fix-plan.md V7.
//
// Dùng:
//   npx tsx scripts/run-eval.ts --mode=baseline
//   EVAL_LLM_PROVIDER=gemini EVAL_LLM_KEY=xxx npx tsx scripts/run-eval.ts --mode=ai
//
// Không commit key. Không log nội dung key ra console hay ra eval/results.md.

import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';
import { findLab } from '@/data/planner-catalog';
import { planWithRules } from '@/lib/planner/baseline-planner';
import type { PlannerInput, PlannerResult } from '@/types/planner';

interface GoldenCase {
  id: string;
  group: string;
  source: string;
  note_source: string;
  input: { background: 'tech' | 'non_tech'; available_minutes: number; lab_id: string; note: string };
  expect: {
    status: 'plan' | 'clarify' | 'refuse';
    max_total_minutes?: number;
    must_include?: string[];
    must_not_include?: string[];
    no_external_links?: boolean;
    first_item_level?: 'basic' | 'advanced';
  };
}

interface GoldenSetFile {
  cases: GoldenCase[];
}

const GOLDEN_SET_PATH = join(__dirname, '..', '..', 'eval', 'golden-set.json');

const HEADER_BY_PROVIDER: Record<string, string> = {
  gemini: 'x-gemini-key',
  openai: 'x-openai-key',
  claude: 'x-claude-key',
  deepseek: 'x-deepseek-key',
  groq: 'x-groq-key',
  cerebras: 'x-cerebras-key',
  openrouter: 'x-openrouter-key',
  fpt: 'x-fpt-key',
};

function parseArgs(): { mode: 'baseline' | 'ai' } {
  const modeArg = process.argv.find((a) => a.startsWith('--mode='));
  const mode = modeArg?.split('=')[1];
  if (mode !== 'baseline' && mode !== 'ai') {
    console.error('Dùng: npx tsx scripts/run-eval.ts --mode=baseline|ai');
    process.exit(1);
  }
  return { mode };
}

function checkResult(
  c: GoldenCase,
  result: PlannerResult
): { pass: boolean; reason?: string; usedExternalLink?: boolean } {
  if (result.status !== c.expect.status) {
    return { pass: false, reason: `kỳ vọng status="${c.expect.status}", được "${result.status}"` };
  }
  if (result.status !== 'plan') return { pass: true };

  const lab = findLab(c.input.lab_id);
  const catalogUrls = new Set((lab?.items ?? []).map((i) => i.url));
  const catalogLevelByItemId = new Map((lab?.items ?? []).map((i) => [i.itemId, i.level]));
  const taskIds = result.tasks.map((t) => t.itemId);
  const totalMinutes = result.tasks.reduce((s, t) => s + t.minutes, 0);
  const usedExternalLink = result.tasks.some((t) => !catalogUrls.has(t.url));

  if (usedExternalLink) {
    return { pass: false, reason: 'có task dùng URL ngoài catalog', usedExternalLink: true };
  }
  if (result.tasks.length === 0 || result.tasks.length > 3) {
    return { pass: false, reason: `số việc = ${result.tasks.length}, kỳ vọng 1-3` };
  }
  if (c.expect.max_total_minutes !== undefined && totalMinutes > c.expect.max_total_minutes) {
    return { pass: false, reason: `tổng ${totalMinutes} phút > quỹ ${c.expect.max_total_minutes} phút` };
  }
  if (c.expect.must_include?.some((id) => !taskIds.includes(id))) {
    return { pass: false, reason: `thiếu item bắt buộc: ${c.expect.must_include.filter((id) => !taskIds.includes(id)).join(', ')}` };
  }
  if (c.expect.must_not_include?.some((id) => taskIds.includes(id))) {
    return { pass: false, reason: `có item lẽ ra phải loại: ${c.expect.must_not_include.filter((id) => taskIds.includes(id)).join(', ')}` };
  }
  if (c.expect.first_item_level) {
    const firstId = taskIds[0];
    const firstLevel = firstId ? catalogLevelByItemId.get(firstId) : undefined;
    if (firstLevel !== c.expect.first_item_level) {
      return { pass: false, reason: `việc đầu tiên mức "${firstLevel}", kỳ vọng "${c.expect.first_item_level}"` };
    }
  }
  return { pass: true, usedExternalLink: false };
}

async function runBaseline(c: GoldenCase): Promise<PlannerResult> {
  const input: PlannerInput = {
    background: c.input.background,
    availableMinutes: c.input.available_minutes,
    labId: c.input.lab_id,
    note: c.input.note,
  };
  return planWithRules(input);
}

async function runAi(c: GoldenCase): Promise<PlannerResult> {
  const provider = process.env.EVAL_LLM_PROVIDER || 'gemini';
  const key = process.env.EVAL_LLM_KEY;
  const header = HEADER_BY_PROVIDER[provider];
  if (!key || !header) {
    throw new Error('Thiếu EVAL_LLM_KEY hoặc EVAL_LLM_PROVIDER không hợp lệ');
  }
  const { POST } = await import('@/app/api/roadmap/route');
  const req = new NextRequest('http://localhost/api/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [header]: key },
    body: JSON.stringify(c.input),
  });
  const res = await POST(req);
  return (await res.json()) as PlannerResult;
}

async function main() {
  const { mode } = parseArgs();
  const file = JSON.parse(readFileSync(GOLDEN_SET_PATH, 'utf-8')) as GoldenSetFile;

  // Free tier Gemini giới hạn 5 request/phút — cách nhau đủ xa để không tự rớt về
  // baseline vì rate limit rồi báo nhầm thành "AI trượt case".
  const delayMs = Number(process.env.EVAL_DELAY_MS ?? (mode === 'ai' ? 13000 : 0));

  let passCount = 0;
  let externalLinkCount = 0;
  let aiSourcedCount = 0;
  let rateLimitedCount = 0;
  const failing: { id: string; reason: string }[] = [];
  const bySourceType = { real: 0, synthetic: 0 };

  for (const [i, c] of file.cases.entries()) {
    if (c.source !== 'synthetic') bySourceType.real += 1;
    else bySourceType.synthetic += 1;

    if (mode === 'ai' && i > 0 && delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }

    let result: PlannerResult;
    try {
      result = mode === 'baseline' ? await runBaseline(c) : await runAi(c);
    } catch (err) {
      failing.push({ id: c.id, reason: `lỗi khi chạy: ${err instanceof Error ? err.message : String(err)}` });
      continue;
    }

    if (mode === 'ai' && result.status === 'plan') {
      if (result.source === 'ai') aiSourcedCount += 1;
      else rateLimitedCount += 1; // rơi về baseline — không tính là AI đã được đánh giá thật
    }

    const check = checkResult(c, result);
    if (check.usedExternalLink) externalLinkCount += 1;
    if (check.pass) {
      passCount += 1;
    } else {
      failing.push({ id: c.id, reason: check.reason ?? 'không rõ lý do' });
    }
  }

  const total = file.cases.length;
  const pct = ((passCount / total) * 100).toFixed(1);

  console.log(`\n=== Kết quả eval (mode=${mode}) ===`);
  console.log(`Qua ${passCount}/${total} (${pct}%). Case có link ngoài catalog: ${externalLinkCount}.`);
  console.log(`Case dựa trên dữ liệu thật: ${bySourceType.real}/${total} (yêu cầu ≥10).`);
  if (mode === 'ai') {
    console.log(
      `Số case thật sự chạy qua LLM (source="ai"): ${aiSourcedCount}/${total}. Rơi về baseline vì lỗi/rate-limit: ${rateLimitedCount}.`
    );
    if (aiSourcedCount < total) {
      console.log(
        '⚠️  Không phải toàn bộ case đã được LLM đánh giá thật — số "qua/tổng" ở trên là hỗn hợp AI + fallback baseline, không dùng làm số CP3 chính thức nếu aiSourcedCount thấp.'
      );
    }
  }
  if (failing.length > 0) {
    console.log('\nCase trượt:');
    for (const f of failing) console.log(`  - ${f.id}: ${f.reason}`);
  }

  const versionLabel =
    mode === 'baseline'
      ? 'Baseline luật if/else'
      : `AI v1 (${process.env.EVAL_LLM_PROVIDER || 'gemini'}, ${aiSourcedCount}/${total} case chạy LLM thật)`;
  console.log('\nDòng ghi vào eval/results.md:');
  console.log(
    `| ${mode === 'baseline' ? '0' : '1'} | ${new Date().toISOString().slice(0, 16).replace('T', ' ')} | ${versionLabel} | ${passCount}/${total} | ${pct}% | ${externalLinkCount} | ${failing.map((f) => f.id).join(', ') || '—'} |`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
