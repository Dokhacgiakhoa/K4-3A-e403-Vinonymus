import { NextRequest } from 'next/server';
import type { ChatApiHeaderKeys, ChatApiRequestBody } from '@/types/chat';
import { processChatPipeline } from '@/lib/rag/pipeline';
import { logQuery } from '@/lib/rag/query-log';

export const runtime = 'nodejs';

function formatSse(event: string, data: Record<string, unknown>): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatApiRequestBody;
    const { question, history } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return new Response(JSON.stringify({ error: 'Câu hỏi không được để trống' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (question.length > 2000) {
      return new Response(JSON.stringify({ error: 'Câu hỏi không được vượt quá 2.000 ký tự' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Bóc tách API keys từ Header (Không lưu hay log key)
    const keys: ChatApiHeaderKeys = {
      gemini: req.headers.get('x-gemini-key') || req.headers.get('x-llm-key') || undefined,
      openai: req.headers.get('x-openai-key') || undefined,
      claude: req.headers.get('x-claude-key') || undefined,
      deepseek: req.headers.get('x-deepseek-key') || undefined,
      groq: req.headers.get('x-groq-key') || undefined,
      cerebras: req.headers.get('x-cerebras-key') || undefined,
      openrouter: req.headers.get('x-openrouter-key') || undefined,
    };

    const legacyProvider = req.headers.get('x-llm-provider');
    const legacyKey = req.headers.get('x-llm-key');
    if (legacyProvider && legacyKey && !keys[legacyProvider as keyof ChatApiHeaderKeys]) {
      keys[legacyProvider as keyof ChatApiHeaderKeys] = legacyKey;
    }

    // UUID ẩn danh sinh ở trình duyệt — chỉ để gom các lượt hỏi cùng một phiên khi thống kê,
    // KHÔNG định danh cá nhân.
    const clientSessionId = req.headers.get('x-client-session-id') || undefined;
    const startedAt = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(formatSse(event, data)));
        };

        try {
          send('status', { stage: 'faq', message: 'Đang tìm trong FAQ…' });

          const result = await processChatPipeline(question, keys, history);

          // Phát từng đoạn ngay khi LLM sinh ra, để người dùng thấy chữ hiện dần thay vì chờ
          // viết xong mới hiện một cục. Đồng thời gom lại phần đầu câu trả lời để ghi query_logs.
          let fullAnswer = '';
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
            const queryLogId = await logQuery({
              question, path: 'meta', answer: fullAnswer,
              provider: result.provider, model: result.model,
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            // path rỗng ⇒ giao diện không gắn badge nguồn cho câu trò chuyện
            send('done', { path: undefined, queryLogId });
            controller.close();
            return;
          }

          if (result.type === 'faq') {
            send('citations', { citations: [] });
            await pipeStream(result.stream);
            const queryLogId = await logQuery({
              question, path: 'faq', answer: fullAnswer, faqId: result.faqId,
              provider: result.provider, model: result.model,
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            send('done', {
              path: 'faq',
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
            const queryLogId = await logQuery({
              question, path: 'rag', answer: fullAnswer, citations: result.citations,
              provider: result.provider, model: result.model,
              latencyMs: Date.now() - startedAt, clientSessionId,
            });
            send('done', { path: 'rag', degraded: false, queryLogId });
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
              send('done', { path: undefined, queryLogId });
            } else {
              send('done', {
                path: 'refused',
                suggestions: result.suggestions || [],
                degraded: result.degraded ?? false,
                queryLogId,
              });
            }
            controller.close();
            return;
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          send('error', { message: errMsg || 'Đã xảy ra lỗi không xác định khi xử lý câu hỏi.' });
          send('done', { path: 'error' });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Invalid request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
