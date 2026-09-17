import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ChatApiHeaderKeys } from '@/types/chat';
import type { PlannedTask, PlannerInput, PlannerResult } from '@/types/planner';
import { findLab } from '@/data/planner-catalog';
import {
  MAX_TASKS,
  MIN_MINUTES,
  OUT_OF_SCOPE_MESSAGE,
  isOutOfScope,
  planWithRules,
} from '@/lib/planner/baseline-planner';
import { buildRoadmapUserPrompt, llmRoadmapOutputSchema, SYSTEM_PROMPT_ROADMAP } from '@/lib/prompts/roadmap';
import { routeLLMRequest } from '@/lib/llm/router';

export const runtime = 'nodejs';

const requestSchema = z.object({
  background: z.enum(['tech', 'non_tech']),
  available_minutes: z.number().int().min(0).max(600),
  lab_id: z.string().min(1),
  note: z.string().max(500).optional().default(''),
});

// Gom hết stream thành 1 chuỗi — output roadmap là JSON ngắn, không cần hiển thị dần như Chat.
async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let text = '';
  for await (const chunk of stream) {
    text += chunk;
  }
  return text;
}

// LLM đôi khi vẫn bọc JSON trong ```json ... ``` dù đã dặn không làm vậy.
function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? raw).trim();
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body không phải JSON hợp lệ' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: 'Dữ liệu gửi lên không hợp lệ, kiểm tra lại các trường đã nhập', field: firstIssue?.path.join('.') },
      { status: 400 }
    );
  }

  const input: PlannerInput = {
    background: parsed.data.background,
    availableMinutes: parsed.data.available_minutes,
    labId: parsed.data.lab_id,
    note: parsed.data.note,
  };

  // Luật cứng trước khi gọi LLM — rẻ, chắc chắn, không tốn lời gọi AI (docs/04-ai-pipeline.md §1).
  const lab = findLab(input.labId);
  if (!lab) {
    return NextResponse.json({
      status: 'clarify',
      question: 'Mình chưa có tài liệu cho bài lab này. Bạn chọn một bài lab trong danh sách nhé?',
    } satisfies PlannerResult);
  }
  if (isOutOfScope(input.note)) {
    return NextResponse.json({ status: 'refuse', message: OUT_OF_SCOPE_MESSAGE } satisfies PlannerResult);
  }
  if (input.availableMinutes < MIN_MINUTES) {
    return NextResponse.json({
      status: 'clarify',
      question: `Hôm nay bạn chỉ có ${input.availableMinutes} phút — chưa đủ cho một việc trọn vẹn. Bạn có thể dành ít nhất ${MIN_MINUTES} phút không, hay muốn ưu tiên chỉ phần chuẩn bị môi trường?`,
    } satisfies PlannerResult);
  }

  // Bóc key từ Header — không lưu, không log (AGENTS.md bất biến #2), giống api/chat/route.ts.
  const keys: ChatApiHeaderKeys = {
    gemini: req.headers.get('x-gemini-key') || undefined,
    openai: req.headers.get('x-openai-key') || undefined,
    claude: req.headers.get('x-claude-key') || undefined,
    deepseek: req.headers.get('x-deepseek-key') || undefined,
    groq: req.headers.get('x-groq-key') || undefined,
    cerebras: req.headers.get('x-cerebras-key') || undefined,
    openrouter: req.headers.get('x-openrouter-key') || undefined,
  };
  const hasAnyKey = Object.values(keys).some((k) => Boolean(k?.trim()));

  if (!hasAnyKey) {
    return NextResponse.json(planWithRules(input) satisfies PlannerResult);
  }

  try {
    const userPrompt = buildRoadmapUserPrompt(
      { background: input.background, availableMinutes: input.availableMinutes, note: input.note },
      lab
    );
    const { stream } = await routeLLMRequest(
      { systemPrompt: SYSTEM_PROMPT_ROADMAP, userPrompt },
      keys
    );
    const raw = await collectStream(stream);
    const json: unknown = JSON.parse(extractJson(raw));
    const llmOutput = llmRoadmapOutputSchema.parse(json);

    if (llmOutput.status === 'refuse') {
      return NextResponse.json({
        status: 'refuse',
        message: llmOutput.message || OUT_OF_SCOPE_MESSAGE,
      } satisfies PlannerResult);
    }

    // Mơ hồ theo LLM (ghi chú mâu thuẫn với nền tảng, v.v.) — hỏi lại thay vì đoán (FR-P05).
    if (!llmOutput.diagnosis || llmOutput.diagnosis.confidence === 'low') {
      return NextResponse.json({
        status: 'clarify',
        question:
          llmOutput.diagnosis?.summary
            ? `${llmOutput.diagnosis.summary} Bạn xác nhận lại nền tảng hoặc quỹ thời gian giúp mình nhé?`
            : 'Mình chưa chắc chọn đúng tài liệu cho bạn. Bạn mô tả rõ hơn bạn đang vướng ở đâu được không?',
      } satisfies PlannerResult);
    }

    // Lọc item_id theo catalog thật (FR-P04) — không tin item_id, minutes, url, title, type
    // do LLM tự sinh; chỉ dùng "reason" của LLM ghép với dữ liệu catalog.
    const itemById = new Map(lab.items.map((item) => [item.itemId, item]));
    const tasks: PlannedTask[] = [];
    let usedMinutes = 0;
    for (const t of llmOutput.tasks ?? []) {
      if (tasks.length >= MAX_TASKS) break;
      const item = itemById.get(t.item_id);
      if (!item) continue; // LLM bịa item_id không có trong catalog — bỏ qua, không hiển thị
      if (usedMinutes + item.minutes > input.availableMinutes) continue;
      tasks.push({
        itemId: item.itemId,
        title: item.title,
        url: item.url,
        type: item.type,
        minutes: item.minutes,
        reason: t.reason,
      });
      usedMinutes += item.minutes;
    }

    if (tasks.length === 0) {
      // Không còn việc nào hợp lệ sau khi lọc — an toàn hơn là dùng luật tĩnh (FR-P09).
      return NextResponse.json(planWithRules(input) satisfies PlannerResult);
    }

    return NextResponse.json({
      status: 'plan',
      source: 'ai',
      diagnosis: {
        background: input.background,
        confidence: llmOutput.diagnosis.confidence,
        summary: llmOutput.diagnosis.summary,
      },
      tasks,
      message: `Tổng ${usedMinutes}/${input.availableMinutes} phút cho ${lab.title}.`,
    } satisfies PlannerResult);
  } catch (err) {
    // Không có key hợp lệ, LLM lỗi, hoặc output không đúng schema — rơi về luật tĩnh,
    // không để học viên thấy lỗi 500 (FR-P09). Không log nội dung lỗi kèm key.
    console.warn('[api/roadmap] Gọi LLM thất bại, dùng baseline:', err instanceof Error ? err.message : err);
    return NextResponse.json(planWithRules(input) satisfies PlannerResult);
  }
}
