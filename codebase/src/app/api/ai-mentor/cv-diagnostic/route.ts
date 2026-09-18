import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createRuleBasedCvDiagnosticTest,
  materializeCvDiagnosticTest,
} from '@/lib/ai-mentor/cv-diagnostic';
import { routeLLMRequest } from '@/lib/llm/router';
import {
  buildCvDiagnosticUserPrompt,
  CV_DIAGNOSTIC_SYSTEM_PROMPT,
  cvDiagnosticApiInputSchema,
  parseCvDiagnosticLLMOutput,
} from '@/lib/prompts/cv-diagnostic';
import { getSessionUser, isLoginEnforced } from '@/lib/server/session';
import type { ChatApiHeaderKeys } from '@/types/chat';
import type { CvDiagnosticInput } from '@/types/cv-diagnostic';

export const runtime = 'nodejs';

function readApiKeys(req: NextRequest): ChatApiHeaderKeys {
  return {
    gemini: req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY,
    openai: req.headers.get('x-openai-key') || process.env.OPENAI_API_KEY,
    claude: req.headers.get('x-claude-key') || process.env.ANTHROPIC_API_KEY,
    deepseek: req.headers.get('x-deepseek-key') || process.env.DEEPSEEK_API_KEY,
    groq: req.headers.get('x-groq-key') || process.env.GROQ_API_KEY,
    cerebras: req.headers.get('x-cerebras-key') || process.env.CEREBRAS_API_KEY,
    fpt: req.headers.get('x-fpt-key') || process.env.FPT_API_KEY,
  };
}

async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let raw = '';
  for await (const chunk of stream) {
    raw += chunk;
    if (raw.length > 25_000) throw new Error('Phản hồi LLM vượt giới hạn 25.000 ký tự');
  }
  return raw;
}

export async function POST(req: NextRequest) {
  const requestId = randomUUID();

  try {
    if (isLoginEnforced() && !(await getSessionUser(req.headers.get('authorization')))) {
      return NextResponse.json(
        {
          error: 'Bạn cần đăng nhập bằng tài khoản đã được duyệt để dùng AI Mentor đọc CV.',
          code: 'LOGIN_REQUIRED',
        },
        { status: 401 },
      );
    }

    const parsed = cvDiagnosticApiInputSchema.safeParse(await req.json());
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue?.message ?? 'Dữ liệu CV không hợp lệ', field: issue?.path.join('.') },
        { status: 400 },
      );
    }

    const input: CvDiagnosticInput = {
      studentId: parsed.data.student_id,
      labId: parsed.data.lab_id,
      cvText: parsed.data.cv_text,
      goal: parsed.data.goal,
      maxQuestions: parsed.data.max_questions,
    };
    const fallback = createRuleBasedCvDiagnosticTest(input);

    try {
      const routed = await routeLLMRequest(
        {
          systemPrompt: CV_DIAGNOSTIC_SYSTEM_PROMPT,
          userPrompt: buildCvDiagnosticUserPrompt(input),
        },
        readApiKeys(req),
      );
      const raw = await collectStream(routed.stream);
      const parsedOutput = parseCvDiagnosticLLMOutput(raw, input);
      const result = materializeCvDiagnosticTest(parsedOutput.analysis, parsedOutput.questions, input);
      return NextResponse.json(result, {
        headers: {
          'x-ai-mentor-request-id': requestId,
          'x-ai-provider': routed.provider,
          'x-ai-model': routed.model,
        },
      });
    } catch (error) {
      console.warn(
        `[AIMentor:CvDiagnostic:${requestId}] fallback`,
        error instanceof Error ? error.message : String(error),
      );
      return NextResponse.json(fallback, { headers: { 'x-ai-mentor-request-id': requestId } });
    }
  } catch (error) {
    console.error(`[AIMentor:CvDiagnostic:${requestId}] unexpected`, error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Không thể phân tích CV để tạo bài test.' }, { status: 500 });
  }
}

