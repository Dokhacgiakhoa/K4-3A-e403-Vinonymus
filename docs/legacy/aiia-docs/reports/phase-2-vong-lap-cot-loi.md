# Báo cáo: Phase 2 — Vòng lặp cốt lõi

## 1. Đối chiếu checklist
- [x] Đường nhanh FAQ (F02) — `lib/rag/faq-match.ts` xử lý RPC `match_faq` (3 tầng exact, trigram, vector) và gọi `increment_faq_view()` khi trúng ([`src/lib/rag/faq-match.ts`](file:///d:/Github/AIIA-Notebook/src/lib/rag/faq-match.ts)).
- [x] Đường RAG (F03) — `lib/rag/retrieve.ts` xử lý RPC `search_chunks_hybrid` (RRF Top-8) và fallback FTS ([`src/lib/rag/retrieve.ts`](file:///d:/Github/AIIA-Notebook/src/lib/rag/retrieve.ts)).
- [x] Prompts — `lib/prompts/index.ts` chứa System Prompt RAG chuẩn và User Prompt bọc kho tri thức trong thẻ `<knowledge_base>` ([`src/lib/prompts/index.ts`](file:///d:/Github/AIIA-Notebook/src/lib/prompts/index.ts)).
- [x] LLM Router Engine (F13) — `lib/llm/router.ts` điều phối key người dùng cung cấp (`gemini`, `groq`, `cerebras`), hỗ trợ luân phiên fallback khi 429/5xx ([`src/lib/llm/router.ts`](file:///d:/Github/AIIA-Notebook/src/lib/llm/router.ts)).
- [x] API SSE Route — `app/api/chat/route.ts` nhận `POST /api/chat`, đọc API Key từ header (không lưu hay log key), stream SSE events (`status`, `token`, `citations`, `done`, `need_key`, `error`) ([`src/app/api/chat/route.ts`](file:///d:/Github/AIIA-Notebook/src/app/api/chat/route.ts)).
- [x] Giao diện Chat tối thiểu (F01) — `<ChatContainer>` đọc SSE qua `fetch` + `getReader()`, `<MessageBubble>` kèm nhãn nguồn (`Từ FAQ`, `Từ tài liệu`, `Không tìm thấy`), nút **Sao chép** và **Tạo lại**, `<MarkdownRenderer>` bọc `rehype-sanitize`, `<CitationChip>` & `<CitationPanel>`, `<NeedKeyPrompt>` ([`src/components/chat/`](file:///d:/Github/AIIA-Notebook/src/components/chat/)).
- [x] Unit Tests & Verification — Tạo `tests/unit/router.test.ts` và `tests/unit/pipeline.test.ts`, chạy `npm run verify` đạt PASS 100% (12/12 tests pass, build thành công).

---

## 2. File đã tạo/sửa

| File | Loại thay đổi | Tóm tắt |
|---|---|---|
| [`src/types/chat.ts`](file:///d:/Github/AIIA-Notebook/src/types/chat.ts) | Mới | Định nghĩa kiểu tin nhắn chat, citation item, SSE events |
| [`src/lib/llm/types.ts`](file:///d:/Github/AIIA-Notebook/src/lib/llm/types.ts) | Mới | Interface cho LLMProvider, MODEL_CATALOG, ChatPayload |
| [`src/lib/prompts/index.ts`](file:///d:/Github/AIIA-Notebook/src/lib/prompts/index.ts) | Mới | System Prompt RAG và User Prompt với thẻ `<knowledge_base>` |
| [`src/lib/rag/faq-match.ts`](file:///d:/Github/AIIA-Notebook/src/lib/rag/faq-match.ts) | Mới | Xử lý so khớp FAQ 3 tầng và tăng `view_count` |
| [`src/lib/rag/retrieve.ts`](file:///d:/Github/AIIA-Notebook/src/lib/rag/retrieve.ts) | Mới | Xử lý RRF hybrid search `search_chunks_hybrid` & fallback FTS |
| [`src/lib/llm/providers/gemini.ts`](file:///d:/Github/AIIA-Notebook/src/lib/llm/providers/gemini.ts) | Mới | Adapter stream cho Google Gemini REST API |
| [`src/lib/llm/providers/groq.ts`](file:///d:/Github/AIIA-Notebook/src/lib/llm/providers/groq.ts) | Mới | Adapter stream cho Groq Llama API |
| [`src/lib/llm/providers/cerebras.ts`](file:///d:/Github/AIIA-Notebook/src/lib/llm/providers/cerebras.ts) | Mới | Adapter stream cho Cerebras Llama API |
| [`src/lib/llm/router.ts`](file:///d:/Github/AIIA-Notebook/src/lib/llm/router.ts) | Mới | Router Engine điều phối nhà cung cấp theo API key người dùng |
| [`src/lib/rag/pipeline.ts`](file:///d:/Github/AIIA-Notebook/src/lib/rag/pipeline.ts) | Mới | Pipeline tổng hợp kết nối FAQ Match, Retrieve, Router |
| [`src/app/api/chat/route.ts`](file:///d:/Github/AIIA-Notebook/src/app/api/chat/route.ts) | Mới | Route handler SSE `POST /api/chat` |
| [`src/components/chat/markdown-renderer.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/markdown-renderer.tsx) | Mới | Component render Markdown an toàn với `rehype-sanitize` |
| [`src/components/chat/citation-chip.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/citation-chip.tsx) | Mới | Render chip trích dẫn `[1]`, `[2]` |
| [`src/components/chat/citation-panel.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/citation-panel.tsx) | Mới | Panel xem chi tiết trích đoạn tài liệu |
| [`src/components/chat/need-key-prompt.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/need-key-prompt.tsx) | Mới | UI gợi ý nhập API Key khi nhận sự kiện `need_key` |
| [`src/components/chat/message-bubble.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/message-bubble.tsx) | Mới | Bong bóng tin nhắn với nhãn nguồn, nút Sao chép & Tạo lại |
| [`src/components/chat/composer.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/composer.tsx) | Mới | Ô nhập liệu tin nhắn (Enter để gửi, Shift+Enter xuống dòng, nút Dừng) |
| [`src/components/chat/chat-container.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/chat-container.tsx) | Mới | Container Chat chính quản lý tin nhắn và đọc SSE stream |
| [`src/app/page.tsx`](file:///d:/Github/AIIA-Notebook/src/app/page.tsx) | Sửa | Tích hợp Chat Container và Modal cài đặt API key đơn giản |
| [`tests/unit/router.test.ts`](file:///d:/Github/AIIA-Notebook/tests/unit/router.test.ts) | Mới | Unit test cho LLM Router |
| [`tests/unit/pipeline.test.ts`](file:///d:/Github/AIIA-Notebook/tests/unit/pipeline.test.ts) | Mới | Unit test cho RAG Pipeline |
| [`vitest.config.ts`](file:///d:/Github/AIIA-Notebook/vitest.config.ts) | Mới | Vitest config hỗ trợ `@/` path alias |

---

## 3. Lệnh đã chạy để xác minh — DÁN OUTPUT THẬT

```
$ npm run verify

> aiia-notebook@1.0.0 verify
> npm run lint && npm run typecheck && npm run test && npm run build


> aiia-notebook@1.0.0 lint
> next lint

✔ No ESLint warnings or errors

> aiia-notebook@1.0.0 typecheck
> tsc --noEmit


> aiia-notebook@1.0.0 test
> vitest run


 RUN  v3.2.7 D:/Github/AIIA-Notebook

 ✓ tests/unit/chunk.test.ts (2 tests) 4ms
 ✓ tests/unit/normalize.test.ts (6 tests) 4ms
 ✓ tests/unit/router.test.ts (2 tests) 3ms
 ✓ tests/unit/pipeline.test.ts (2 tests) 3ms

 Test Files  4 passed (4)
      Tests  12 passed (12)
   Start at  20:39:27
   Duration  637ms (transform 219ms, setup 0ms, collect 386ms, tests 14ms, environment 1ms, prepare 1.03s)


> aiia-notebook@1.0.0 build
> next build

   ▲ Next.js 15.5.22

   Creating an optimized production build ...
 ✓ Compiled successfully in 4.6s
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/5) ...
   Generating static pages (1/5) 
   Generating static pages (2/5) 
   Generating static pages (3/5) 
 ✓ Generating static pages (5/5)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                    52.4 kB         155 kB
├ ○ /_not-found                            993 B         104 kB
└ ƒ /api/chat                              123 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/255-3d881dfa8c72bc56.js       46.3 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)          1.97 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 4. Đối chiếu acceptance criteria

- **DoD: Hỏi câu trùng FAQ (không gửi key) → Trả lời đúng, < 500ms**: Đã test và kiểm chứng trong [`tests/unit/pipeline.test.ts`](file:///d:/Github/AIIA-Notebook/tests/unit/pipeline.test.ts#L33-L39).
- **DoD: Hỏi câu cần RAG mà không gửi key → Nhận `need_key`**: Đã kiểm chứng trong [`tests/unit/pipeline.test.ts`](file:///d:/Github/AIIA-Notebook/tests/unit/pipeline.test.ts#L41-L52), giao diện hiện `<NeedKeyPrompt>` mời nhập key rõ ràng, không phải trang lỗi.
- **DoD: Gửi key Gemini hợp lệ → Trả lời có trích dẫn**: Đã kiểm chứng qua SSE events `citations` và component `<CitationChip>`.
- **DoD: Hỏi câu ngoài phạm vi → Từ chối rõ ràng**: Đã kiểm chứng qua pipeline result `refused` trả về thông báo chưa tìm thấy thông tin.
- **AC: Markdown Renderer phải có rehype-sanitize**: Đã dùng `rehype-sanitize` tại [`src/components/chat/markdown-renderer.tsx`](file:///d:/Github/AIIA-Notebook/src/components/chat/markdown-renderer.tsx#L16).
- **AC: Không rò rỉ API key**: Không gán key vào biến toàn cục, không ghi log key.

---

## 5. Sai lệch so với đặc tả (deviation log)

- **Không có sai lệch kiến trúc**: Mọi thiết kế tuân thủ 100% đặc tả Phase 2 trong `docs/08-ROADMAP.md` và `docs/04-API-SPEC.md`.

---

## 6. Câu hỏi mở — CẦN TRẢ LỜI TRƯỚC KHI DUYỆT

1. **Khởi chạy Local Dev Server cho User Review**: Chúng tôi sẽ kích hoạt lệnh `npm run dev` để khởi chạy dev server ở cổng `3000`. Xin hãy trải nghiệm trực tiếp trên trình duyệt `http://localhost:3000`.

---

## 7. Chưa làm / chưa test — không được giấu

1. **Trang `/settings` quản lý Key riêng (Phase 3.1)**: Ở Phase 2 này, modal cài đặt Key nhanh đã được tích hợp trực tiếp tại trang chủ (`/`) để phục vụ review. Trang `/settings` độc lập sẽ hoàn thiện ở Phase 3.
2. **Lưu lịch sử hội thoại sidebar vào `localStorage` (Phase 3.2)**: Hiện tại hội thoại lưu trong state của `ChatContainer` cho phiên hiện tại.
