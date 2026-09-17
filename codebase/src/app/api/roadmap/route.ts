import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { findLab } from '@/data/planner-catalog';
import { routeLLMRequest } from '@/lib/llm/router';
import { materializePlannerResult } from '@/lib/planner/ai-planner';
import { planWithRules } from '@/lib/planner/baseline-planner';
import {
  buildPlannerUserPrompt,
  parsePlannerLLMOutput,
  plannerApiInputSchema,
  PLANNER_SYSTEM_PROMPT,
} from '@/lib/prompts/planner';
import type { ChatApiHeaderKeys } from '@/types/chat';
import type { PlannerInput } from '@/types/planner';

export const runtime = 'nodejs';

function readApiKeys(req: NextRequest): ChatApiHeaderKeys {
  return {
    gemini: req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY,
    openai: req.headers.get('x-openai-key') || process.env.OPENAI_API_KEY,
    claude: req.headers.get('x-claude-key') || process.env.ANTHROPIC_API_KEY,
    deepseek: req.headers.get('x-deepseek-key') || process.env.DEEPSEEK_API_KEY,
    groq: req.headers.get('x-groq-key') || process.env.GROQ_API_KEY,
    cerebras: req.headers.get('x-cerebras-key') || process.env.CEREBRAS_API_KEY,
  };
}

async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let raw = '';
  for await (const chunk of stream) {
    raw += chunk;
    if (raw.length > 20_000) throw new Error('Phản hồi LLM vượt giới hạn 20.000 ký tự');
  }
  return raw;
}

export async function POST(req: NextRequest) {
  const requestId = randomUUID();

  try {
    const parsed = plannerApiInputSchema.safeParse(await req.json());
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? 'Dữ liệu không hợp lệ', field: issue?.path.join('.') },
        { status: 400 },
      );
    }

    const input: PlannerInput = {
      background: parsed.data.background,
      availableMinutes: parsed.data.available_minutes,
      labId: parsed.data.lab_id,
      note: parsed.data.note,
    };
    const preflight = planWithRules(input);
    if (preflight.status !== 'plan') return NextResponse.json(preflight);

    const lab = findLab(input.labId);
    if (!lab) return NextResponse.json(preflight);

    const userPrompt = buildPlannerUserPrompt(input, lab);
    console.info(`[Planner:${requestId}] input`, input);
    console.info(`[Planner:${requestId}] prompt`, {
      system: PLANNER_SYSTEM_PROMPT,
      user: userPrompt,
    });

    try {
      const routed = await routeLLMRequest(
        { systemPrompt: PLANNER_SYSTEM_PROMPT, userPrompt },
        readApiKeys(req),
      );
      const raw = await collectStream(routed.stream);
      console.info(`[Planner:${requestId}] raw`, {
        provider: routed.provider,
        model: routed.model,
        response: raw,
      });

      const result = materializePlannerResult(parsePlannerLLMOutput(raw), input, lab);
      console.info(`[Planner:${requestId}] result`, result);
      return NextResponse.json(result, { headers: { 'x-planner-request-id': requestId } });
    } catch (error) {
      console.warn(
        `[Planner:${requestId}] fallback`,
        error instanceof Error ? error.message : String(error),
      );
      return NextResponse.json(preflight, { headers: { 'x-planner-request-id': requestId } });
    }
  } catch (error) {
    console.error(`[Planner:${requestId}] unexpected`, error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Không thể xử lý yêu cầu lập kế hoạch.' }, { status: 500 });
  }
}
