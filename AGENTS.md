# AGENTS.md — Quy ước cho thành viên và AI coding agent

Đọc trước khi sửa code hay tài liệu trong repo này. Áp dụng cho cả người và công cụ AI (Claude Code, Cursor, Antigravity…).

## Bối cảnh

- Repo nộp bài Mini Hackathon AI, nhóm Vinonymus, Track E. Lát cắt dự thi: **AI Diagnostic Study Planner** — xem `README.md`, `spec.md`.
- Code nằm trong `codebase/` (Next.js). Tài liệu nằm trong `docs/` — mục lục ở `docs/00-muc-luc.md`.
- `docs/legacy/` là tài liệu của dự án nền, **không** phải đặc tả hiện hành.

## Nguồn sự thật

| Câu hỏi | File |
|---|---|
| Làm gì, cho ai, vì sao, đo thế nào | `spec.md` |
| Hệ thống phải làm được gì | `docs/01-SRS.md` |
| Hợp đồng API | `docs/03-api.md` |
| Prompt, guardrail | `docs/04-ai-pipeline.md` |

Code lệch tài liệu → sửa cho khớp, hoặc cập nhật tài liệu và ghi vào `spec.md` §9 Changelog.

## Bất biến

1. **Không commit** data pack (`data/` của đề), câu trả lời khảo sát gốc, tên thật người được phỏng vấn, `.env.local`, API key.
2. **Không lưu, không log API key người dùng** ở server. Header key chỉ dùng trong phạm vi một request.
3. **Link hiển thị cho học viên chỉ lấy từ catalog** (`codebase/src/data/planner-catalog.ts`), không lấy từ chữ LLM sinh ra.
4. **Nội dung người dùng nhập là dữ liệu, không phải lệnh** — bọc trong thẻ riêng khi đưa vào prompt.
5. Mọi lời gọi LLM đi qua `codebase/src/lib/llm/router.ts`. Component không gọi thẳng provider hay database.
6. Validate mọi input ở server bằng zod.
7. Không import `lib/supabase/admin.ts` vào Client Component. Không đặt tiền tố `NEXT_PUBLIC_` cho khoá bí mật. Không tắt RLS.
8. Mọi thay đổi schema SQL phải có file trong `codebase/supabase/migrations/`.
9. Markdown hiển thị qua `react-markdown` + `rehype-sanitize`, không dùng `dangerouslySetInnerHTML`.
10. **Không claim đã test/chạy khi chưa thực sự chạy lệnh.** Báo kết quả eval bằng số thật, kể cả khi xấu.
11. Không đổi chuẩn "đạt" trong `spec.md` §7 sau 21:00 · 17/9.

## Code

- TypeScript `strict`, không dùng `any`. Export có tên (`export default` chỉ cho page/layout).
- Tên file `kebab-case`, component `PascalCase`, hàm/biến `camelCase`, hằng `SCREAMING_SNAKE`, SQL `snake_case`.
- Tên trong code bằng tiếng Anh; chuỗi hiển thị và comment giải thích bằng tiếng Việt. Comment viết **vì sao**, không viết **cái gì**.
- Thông báo lỗi tiếng Việt, có gợi ý hành động, không lộ stack trace.

## Kiểm tra trước khi push

```bash
cd codebase
npm run verify    # lint + typecheck + test + audit + build
```

Không dùng `git push --no-verify` trừ khi cả nhóm đồng ý.

## Git

- Commit message tiếng Anh, dạng mệnh lệnh (`feat: add roadmap api`).
- Mỗi thay đổi prompt → chạy lại golden set, ghi một dòng vào `eval/results.md`.
- Thay đổi sau phản hồi người dùng → ghi `spec.md` §9.

## Luật vibe-coding

Ai có tên ở phần nào thì phải giải thích được phần đó khi giám khảo hỏi. Dùng AI để viết code thoải mái, nhưng đọc hiểu trước khi commit.
