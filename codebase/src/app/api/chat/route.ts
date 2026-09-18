import { NextRequest } from 'next/server';
import { z } from 'zod';
import type { ChatApiHeaderKeys, ChatApiRequestBody } from '@/types/chat';
import { processChatPipeline } from '@/lib/rag/pipeline';
import { logQuery } from '@/lib/rag/query-log';
import { resolveBackendUserIdentity } from '@/lib/auth/helpdesk-access';
import { getLearnerContext, learnerContextSchema } from '@/lib/learner-context';
import {
  CHAT_SESSION_COOKIE,
  clearChatMemory,
  loadChatMemory,
  openChatMemorySession,
  saveChatTurn,
  serializeGuestSessionCookie,
} from '@/lib/chat-session-memory';

export const runtime = 'nodejs';

const chatRequestSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(1, 'Câu hỏi không được để trống')
      .max(2_000, 'Câu hỏi không được vượt quá 2.000 ký tự'),
    history: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().max(8_000),
        }),
      )
      .max(6)
      .optional(),
    learner_context: learnerContextSchema.optional(),
  })
  .strict();

function readHelpdeskKeys(req: NextRequest): ChatApiHeaderKeys {
  return {
    // Helpdesk tạm khóa một model giống Planner để kết quả/eval có thể so sánh được.
    gemini:
      req.headers.get('x-gemini-key') ||
      req.headers.get('x-llm-key') ||
      process.env.GEMINI_API_KEY,
  };
}

function formatSse(event: string, data: Record<string, unknown>): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function withGuestCookie(response: Response, guestToken?: string): Response {
  if (guestToken) response.headers.append('Set-Cookie', serializeGuestSessionCookie(guestToken));
  return response;
}

async function resolveMemory(req: NextRequest) {
  const identity = await resolveBackendUserIdentity(req.headers.get('authorization'));
  const memory = await openChatMemorySession(
    identity,
    req.cookies.get(CHAT_SESSION_COOKIE)?.value,
  );
  return { identity, memory };
}

export async function GET(req: NextRequest) {
  const { memory } = await resolveMemory(req);
  const messages = await loadChatMemory(memory.sessionId, 50);
  return withGuestCookie(
    Response.json({ messages }, { headers: { 'Cache-Control': 'no-store' } }),
    memory.guestToken,
  );
}

export async function DELETE(req: NextRequest) {
  const { memory } = await resolveMemory(req);
  await clearChatMemory(memory.sessionId);
  return withGuestCookie(Response.json({ success: true }), memory.guestToken);
}

export async function POST(req: NextRequest) {
  try {
    const parsed = chatRequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { question, history, learner_context: learnerContextCandidate } =
      parsed.data satisfies ChatApiRequestBody;
    const keys = readHelpdeskKeys(req);
    const { identity, memory } = await resolveMemory(req);
    const learnerContext = getLearnerContext(identity.role, learnerContextCandidate);
    const persistedHistory = await loadChatMemory(memory.sessionId, 6);
    const effectiveHistory = persistedHistory.length > 0
      ? persistedHistory.map(({ role, content }) => ({ role, content }))
      : history;

    // UUID ẩn danh sinh ở trình duyệt — chỉ để gom các lượt hỏi cùng một phiên khi thống kê,
    // KHÔNG định danh cá nhân.
    const sessionHeader = req.headers.get('x-client-session-id');
    const clientSessionId = z.string().uuid().safeParse(sessionHeader).data;
    const startedAt = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(formatSse(event, data)));
        };

        try {
          send('status', { stage: 'routing', message: 'Đang phân tích và chọn nguồn…' });

          const result = await processChatPipeline(
            question,
            keys,
            effectiveHistory,
            identity.role,
            learnerContext,
          );

          // Phát từng đoạn ngay khi LLM sinh ra, để người dùng thấy chữ hiện dần thay vì chờ
          // viết xong mới hiện một cục. Đồng thời gom lại phần đầu câu trả lời để ghi query_logs.
          let fullAnswer = '';
          const persistTurn = (citations = result.type === 'rag' ? result.citations : []) =>
            saveChatTurn(memory.sessionId, question, fullAnswer, citations);
          const pipeStream = async (stream: AsyncIterable<string>) => {
            for await (const chunk of stream) {
              if (chunk) {
                fullAnswer += chunk;
                send('token', { text: chunk });
              }
            }
          };

          if (result.type === 'meta') {
            await pipeStream(result.stream);
            await persistTurn();
            const queryLogId = await logQuery({
              question, path: 'meta', answer: fullAnswer,
              provider: result.provider, model: result.model,
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            // path rỗng ⇒ giao diện không gắn badge nguồn cho câu trò chuyện
            send('done', {
              path: undefined,
              provider: result.provider,
              model: result.model,
              queryLogId,
            });
            controller.close();
            return;
          }

          if (result.type === 'faq') {
            send('citations', { citations: [] });
            await pipeStream(result.stream);
            await persistTurn();
            const queryLogId = await logQuery({
              question, path: 'faq', answer: fullAnswer, faqId: result.faqId,
              provider: result.provider, model: result.model,
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            send('done', {
              path: 'faq',
              provider: result.provider,
              model: result.model,
              faqId: result.faqId,
              isVerified: result.isVerified,
              verificationSource: result.verificationSource,
              suggestions: result.suggestions || [],
              degraded: result.degraded ?? false,
              queryLogId,
            });
            controller.close();
            return;
          }

          if (result.type === 'rag') {
            send('citations', { citations: result.citations });
            await pipeStream(result.stream);
            await persistTurn(result.citations);
            const queryLogId = await logQuery({
              question, path: 'rag', answer: fullAnswer, citations: result.citations,
              provider: result.provider, model: result.model,
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            send('done', {
              path: 'rag',
              provider: result.provider,
              model: result.model,
              degraded: false,
              queryLogId,
            });
            controller.close();
            return;
          }

          if (result.type === 'need_key') {
            send('need_key', { message: 'Vui lòng cung cấp API key để sử dụng tính năng tra cứu AI sâu.' });
            // Ghi lại để tính "tỉ lệ người dùng bỏ đi ngay khi thấy lời nhắc nhập key"
            // (docs/00-TONG-QUAN.md mục 6) — gom theo client_session_id.
            await logQuery({
              question, path: 'need_key',
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            send('done', { path: 'error' });
            controller.close();
            return;
          }

          if (result.type === 'refused') {
            await pipeStream(result.stream);
            await persistTurn();
            // LLM đã tự phán đoán trong lúc stream: nếu đây thật ra chỉ là câu trò chuyện thì
            // đừng dán nhãn "Không tìm thấy" kèm gợi ý FAQ — một câu đùa mà bị gắn nhãn tra cứu
            // thất bại thì đọc như bot hỏng, dù nội dung có tự nhiên tới đâu.
            const isChat = Boolean(result.outcome?.conversational);
            const queryLogId = await logQuery({
              question,
              // Ghi đúng bản chất: câu trò chuyện log là 'meta', chỉ câu hỏi thật mới là 'refused'
              // — nếu gộp chung thì thống kê "không trả lời được" sẽ bị thổi phồng bởi lời chào.
              path: isChat ? 'meta' : 'refused',
              answer: fullAnswer,
              provider: result.provider,
              model: result.model,
              latencyMs: Date.now() - startedAt,
              clientSessionId,
            });
            if (isChat) {
              send('done', {
                path: undefined,
                provider: result.provider,
                model: result.model,
                queryLogId,
              });
            } else {
              send('done', {
                path: 'refused',
                provider: result.provider,
                model: result.model,
                suggestions: result.suggestions || [],
                degraded: result.degraded ?? false,
                queryLogId,
              });
            }
            controller.close();
            return;
          }
        } catch (err: unknown) {
          console.error('[api/chat] Pipeline lỗi:', err instanceof Error ? err.name : 'unknown');
          send('error', { message: 'Không thể xử lý câu hỏi lúc này. Bạn kiểm tra API key rồi thử lại.' });
          send('done', { path: 'error' });
          controller.close();
        }
      },
    });

    return withGuestCookie(new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    }), memory.guestToken);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Không thể đọc yêu cầu. Vui lòng thử lại.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
