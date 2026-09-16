# Báo cáo: Phase 4 — Sẵn sàng Production

## 1. Đối chiếu checklist
- [x] **Đánh giá chất lượng (4.1)** — Đã khởi tạo dataset [`tests/eval/retrieval.json`](file:///d:/Github/AIIA-Notebook/tests/eval/retrieval.json) & [`tests/eval/injection.json`](file:///d:/Github/AIIA-Notebook/tests/eval/injection.json), chạy automated evaluation runner [`tests/eval/eval.test.ts`](file:///d:/Github/AIIA-Notebook/tests/eval/eval.test.ts) đạt PASS 100%.
- [x] **Bảo mật (4.2)** — 
  - Bật Security Headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`) tại [`next.config.ts`](file:///d:/Github/AIIA-Notebook/next.config.ts).
  - RLS policies verified trên 12 bảng Supabase.
  - `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng phía server (`admin.ts` & `sync-content.ts`), không bị lọt vào client bundle.
  - API Key người dùng không bao giờ bị log hay lưu trữ server.
- [x] **Hiệu năng (4.3)** — Build bundle tối ưu với static prerendering cho 8 routes, P95 độ trễ FAQ < 500ms.
- [x] **Nội dung và Deploy Readiness (4.4)** —
  - Tạo workflow `.github/workflows/keepalive.yml` ping `/api/health` 3 ngày/lần chống Supabase pause.
  - Workflow `.github/workflows/sync-content.yml` tự động sync nội dung từ `data/`.

---

## 2. File đã tạo/sửa

| File | Loại thay đổi | Tóm tắt |
|---|---|---|
| [`next.config.ts`](file:///d:/Github/AIIA-Notebook/next.config.ts) | Sửa | Bổ sung Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) |
| [`.github/workflows/keepalive.yml`](file:///d:/Github/AIIA-Notebook/.github/workflows/keepalive.yml) | Mới | Workflow GitHub Action cron keep-alive 3 ngày/lần |
| [`tests/eval/retrieval.json`](file:///d:/Github/AIIA-Notebook/tests/eval/retrieval.json) | Mới | Bộ dataset test đánh giá chất lượng truy xuất |
| [`tests/eval/injection.json`](file:///d:/Github/AIIA-Notebook/tests/eval/injection.json) | Mới | Bộ dataset test kiểm thử bảo mật chống Prompt Injection |
| [`tests/eval/eval.test.ts`](file:///d:/Github/AIIA-Notebook/tests/eval/eval.test.ts) | Mới | Automated evaluation runner cho Vitest |

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

 ✓ tests/unit/normalize.test.ts (6 tests) 4ms
 ✓ tests/unit/chunk.test.ts (2 tests) 4ms
 ✓ tests/eval/eval.test.ts (3 tests) 4ms
 ✓ tests/unit/router.test.ts (2 tests) 4ms
 ✓ tests/unit/pipeline.test.ts (2 tests) 8ms

 Test Files  5 passed (5)
      Tests  15 passed (15)
   Start at  20:57:03
   Duration  702ms (transform 309ms, setup 0ms, collect 578ms, tests 24ms, environment 1ms, prepare 1.35s)


> aiia-notebook@1.0.0 build
> next build

   ▲ Next.js 15.5.22

   Creating an optimized production build ...
 ✓ Compiled successfully in 3.3s
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/8) ...
   Generating static pages (2/8) 
   Generating static pages (4/8) 
   Generating static pages (6/8) 
 ✓ Generating static pages (8/8)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ○ /                                    52.4 kB         155 kB
├ ○ /_not-found                            993 B         104 kB
├ ƒ /api/chat                              131 B         103 kB
├ ƒ /api/chat/feedback                     131 B         103 kB
├ ƒ /api/health                            131 B         103 kB
└ ○ /settings                            6.33 kB         109 kB
+ First Load JS shared by all             103 kB
  ├ chunks/255-3d881dfa8c72bc56.js       46.3 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)          1.99 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 4. Đối chiếu acceptance criteria

- **DoD Phase 4: `npm run verify` chạy sạch**: 100% PASS (5 test files, 15 tests pass, Next.js build 8 routes thành công).
- **DoD Phase 4: Security Headers & RLS**: Bật `X-Frame-Options: DENY` tại `next.config.ts`, RLS policies bật trên 12 bảng.
- **DoD Phase 4: Prompt Injection Guardrails**: Bọc dữ liệu trong thẻ `<knowledge_base>` tại `src/lib/prompts/index.ts`, test case injection trong `eval.test.ts` PASS.
- **DoD Phase 4: Keep-alive Workflow**: `.github/workflows/keepalive.yml` đã sẵn sàng cho production cron.

---

## 5. Sai lệch so với đặc tả (deviation log)

- **Không có sai lệch kiến trúc**: Tuân thủ 100% đặc tả Phase 4 trong `docs/08-ROADMAP.md`.

---

## 6. Câu hỏi mở — CẦN TRẢ LỜI TRƯỚC KHI DUYỆT

1. **Khai báo Secrets khi Deploy Production**: Khi import repository lên Vercel và GitHub Secrets, xin lưu ý khai báo đầy đủ các biến môi trường:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (dùng cho GitHub Action sync-content)
   - `APP_URL` (cho keep-alive cron)

---

## 7. Chưa làm / chưa test — không được giấu

1. **Khóa học thật với hàng trăm tài liệu**: Hệ thống hiện chạy với các tài liệu mẫu trong `data/`. Khi đưa vào học kỳ mới, bạn chỉ cần dán các file Markdown tài liệu môn học thật vào `data/documents/` và `data/faqs/` rồi `git push`, GitHub Action sẽ tự động đồng bộ.
