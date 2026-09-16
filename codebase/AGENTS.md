# AGENTS.md — Quy ước cho AI coding agent

Đọc file này **trước khi viết dòng code đầu tiên**. Đây là các quy ước bắt buộc cho dự án AIIA Notebook.

> **Đang làm việc theo quy trình bàn giao Claude Code ↔ Antigravity?** Đọc [`docs/09-QUY-TRINH-PHOI-HOP.md`](./docs/09-QUY-TRINH-PHOI-HOP.md) — bắt buộc viết báo cáo hoàn thành theo đúng khung ở đó sau mỗi hạng mục, **không tự do định dạng**. Report thiếu phần "câu hỏi mở" hoặc "output lệnh thật" bị coi là không hợp lệ.

> **Mô hình dự án: không tài khoản.** Không đăng nhập, không admin panel web. Nội dung quản lý qua Git (`data/`), người dùng bắt buộc tự mang API key riêng để dùng tính năng AI. Nếu bạn thấy mình đang viết code cho login/session/vai trò người dùng — dừng lại, đọc lại `docs/02-KIEN-TRUC.md` ADR-8/ADR-9, có thể bạn đang implement nhầm phiên bản thiết kế cũ.

## Bắt đầu từ đâu

1. Đọc [`docs/08-ROADMAP.md`](./docs/08-ROADMAP.md) — làm tuần tự từ Phase 1.
2. Trước mỗi hạng mục, đọc tài liệu đặc tả tương ứng.
3. Không sang phase sau khi phase hiện tại chưa đạt đủ Definition of Done.

**Nguồn sự thật:** tài liệu trong `docs/`. Tài liệu và code mâu thuẫn → tài liệu đúng.

---

## Bất biến — không được vi phạm trong bất kỳ hoàn cảnh nào

1. **Không lưu API key của người dùng ở server dưới bất kỳ hình thức nào** — không database, không cache, không file, kể cả mã hoá, kể cả tạm thời. Các header chứa key (`x-gemini-key`, `x-openai-key`, `x-claude-key`, `x-deepseek-key`, `x-groq-key`, `x-cerebras-key`, `x-openrouter-key`, và cặp legacy `X-LLM-Provider`/`X-LLM-Key`) chỉ được đọc và dùng **trong đúng phạm vi một request**, sau đó phải mất đi.
2. **Không log API key của người dùng** — kể cả trong khối `catch`, kể cả log lỗi, kể cả khi debug. Trước khi log bất kỳ object request/header nào, phải lọc bỏ toàn bộ header key kể trên.
3. **Không import `lib/supabase/admin.ts` vào Client Component.** File này chứa service role key.
4. **Không đặt tiền tố `NEXT_PUBLIC_` cho bất kỳ khoá bí mật nào.**
5. **Không tắt RLS trên bất kỳ bảng nào.** Cần toàn quyền thì dùng service role phía server (chỉ trong route handler và `scripts/sync-content.ts`).
6. **Không thêm policy RLS `insert`/`update`/`delete` cho role `anon` trên `documents`, `chunks`, `faqs`, `faq_variants`, `categories`, `tags`.** Ghi nội dung chỉ qua service role trong sync script — đây là ranh giới bảo mật cốt lõi thay cho hệ thống tài khoản đã bỏ.
7. **Không xây dựng lại tính năng đăng nhập/tài khoản/vai trò** trừ khi người dùng yêu cầu rõ ràng thay đổi mô hình. Không âm thầm thêm bảng `profiles`, `auth.users`, session cookie.
8. **Không tin dữ liệu từ client.** Mọi input phải được validate ở server trước khi dùng. *(Hiện trạng: `src/app/api/chat/route.ts` và `/api/chat/feedback` đang validate thủ công; `zod` mới chỉ dùng ở `src/lib/env.ts`. Chuyển sang schema Zod cho các route là món nợ kỹ thuật còn treo — nhưng dù dùng cách nào, tuyệt đối không được bỏ bước validate.)*
9. **LLM được diễn đạt lại câu trả lời FAQ cho tự nhiên, nhưng KHÔNG được đổi hay bịa dữ kiện.** Đây là thay đổi có chủ đích so với thiết kế ban đầu ("trả nguyên văn"): người dùng cần Chat nói chuyện như một AI thật, nên `synthesizeFocusedFaqAnswer` (`src/lib/rag/faq-verify.ts`) cho LLM viết lại giọng văn. Ràng buộc bắt buộc vẫn giữ nguyên:
   - Mọi con số, mốc thời gian, tên riêng, link phải **giữ nguyên** như trong thân bài `.md` — không làm tròn, không diễn giải lại, không bổ sung thông tin không có trong nguồn.
   - Không có FAQ/tài liệu khớp thì **nói thật là chưa có**, không suy đoán (xem `src/lib/rag/converse.ts`).
   - Ảnh (`type: image`) không bao giờ được lọt ra câu trả lời — có lưới an toàn cứng `stripImagesFromStream()` (`src/lib/rag/stream-text.ts`) chạy trên stream, không phụ thuộc việc LLM có tuân thủ prompt hay không.
10. **`scripts/ocr-image.ts` không được tự ghi vào `data/`.** Chỉ in kết quả ra, người chạy tự copy-paste sau khi kiểm tra.
11. **Không dùng `dangerouslySetInnerHTML`.** Markdown qua `react-markdown` + `rehype-sanitize`.
12. **Không thử lại request LLM sau khi đã bắt đầu stream.**
13. **Không sửa file migration đã chạy trên production.** Tạo file mới.
13b. **Mọi thay đổi lược đồ/hàm SQL phải có file trong `supabase/migrations/`** — tuyệt đối không áp thẳng lên DB (qua Studio, MCP `apply_migration`, hay psql) rồi coi là xong. Lỗi này đã xảy ra thật: `match_faq()` được thêm `source_path` + `p_vector_threshold` trực tiếp trên DB mà không có file migration, khiến repo dựng ra một DB **khác** với DB đang chạy — local vẫn hoạt động nên không ai phát hiện, nhưng deploy mới sẽ hỏng (xem `supabase/migrations/0011_match_faq_source_path.sql`).
14. **`lib/rag/chunk.ts` và `lib/rag/embed.ts` dùng chung** giữa `app/` và `scripts/sync-content.ts` — không viết hai bản logic khác nhau ở hai nơi.
15. **Không tự tải/nhúng bất kỳ font nào rồi gán nhãn là "font chính thức AI in Action".** Font logo thật thuộc về ban tổ chức, hiện chưa có file — `--font-display` trong `docs/07-UI-UX.md` chỉ là hàng thay thế tạm (Exo 2). Khi có file logo thật, thay bằng ảnh/SVG tĩnh trong header, không cố render chữ "AI in Action" bằng web font.
16. **Không claim đã test/đã chạy build khi chưa thực sự chạy lệnh đó trong phiên làm việc hiện tại.** Báo cáo hoàn thành phải dán nguyên văn output lệnh, không diễn giải hay suy luận "chắc sẽ pass".
17. **Không khẳng định một file/hàm/bảng đã tồn tại mà chưa tự đọc/grep ra thật.** Đặc biệt trước khi sửa một file hoặc gọi một hàm SQL.
18. **Không tự quyết định đổi kiến trúc/phạm vi đã chốt trong `docs/`** (kể cả khi thấy "hợp lý hơn") mà không ghi vào mục "câu hỏi mở" của báo cáo hoàn thành để người review quyết định.
19. **Chỉ chạy `npm run sync` hoặc deploy khi người dùng yêu cầu trực tiếp.** Nếu người dùng không nói/không yêu cầu sync hoặc deploy, chỉ thực hiện cập nhật/chỉnh sửa file ở môi trường local để người dùng tự kiểm tra chức năng.

---

## Thêm / sửa nội dung FAQ

> Chi tiết quy trình thêm/sửa FAQ, kiểm tra trùng lặp, cấu trúc dữ liệu 3 phần và bảng slug category đã được đóng gói vào Skill: `@[skills/faq-curator]`. Khi xử lý các yêu cầu liên quan đến FAQ, kích hoạt và tuân thủ tuyệt đối các bước trong `faq-curator`.

---

## Quy tắc phân lớp

```
app/api/*  →  lib/rag, lib/llm  →  lib/supabase  →  Postgres
scripts/sync-content.ts  →  lib/rag/{chunk,embed}  →  lib/supabase/admin  →  Postgres
```

- Component không bao giờ gọi thẳng provider LLM hay database.
- `lib/rag`, `lib/llm` không bao giờ import từ `app/`.
- Mọi tương tác với LLM đi qua `lib/llm/router.ts`.

## TypeScript

- `strict: true`. Cấm `any`.
- Kiểu database lấy từ `src/types/database.ts` (sinh bằng `supabase gen types`).
- Zod schema là nguồn sự thật cho dữ liệu vào/ra.
- Export có tên. `export default` chỉ cho page/layout Next.js.

## Đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| File component | `kebab-case.tsx` | `message-bubble.tsx` |
| File lib | `kebab-case.ts` | `faq-match.ts` |
| Component React | `PascalCase` | `MessageBubble` |
| Hàm, biến | `camelCase` | `normalizeText` |
| Hằng số | `SCREAMING_SNAKE` | `EMBEDDING_DIM` |
| Bảng, cột SQL | `snake_case` | `query_logs` |
| Hàm SQL | `snake_case` | `search_chunks_hybrid` |

Đặt tên bằng tiếng Anh. Chuỗi hiển thị cho người dùng và comment giải thích dùng tiếng Việt.

## Xử lý lỗi

- Route handler trả đúng vỏ response ở `docs/04-API-SPEC.md`.
- Thông báo lỗi tiếng Việt, dễ hiểu, có gợi ý hành động.
- Sự kiện `need_key` **không phải lỗi** — không log như một exception, không trả HTTP status lỗi.
- Không để stack trace lọt vào response.

## Comment

Viết cho **tại sao**, không cho **cái gì**.

```ts
// ✅ Tốt
// X-LLM-Key chỉ tồn tại trong scope của hàm này — KHÔNG gán ra biến ngoài,
// vì request khác có thể đang chạy song song với key của người dùng khác.
async function handleChat(req: Request) { ... }

// ❌ Thừa
// Xử lý request chat
async function handleChat(req: Request) { ... }
```

## Test

Bắt buộc test:
- `normalizeText()` — đối chiếu `normalize_text()` SQL, kết quả phải giống hệt
- `chunk()` — bảng markdown không bị cắt đôi
- LLM router — chọn đúng provider trong số key request cung cấp, xử lý đúng khi thiếu key hoàn toàn
- `scripts/sync-content.ts` — chạy với `data/` mẫu, xác nhận đúng: file mới thêm, file sửa cập nhật, file xoá bị gỡ khỏi DB
- Bộ test prompt injection (`docs/06-AI-PIPELINE.md` mục 8.2) — chạy lại mỗi lần sửa prompt

## Git

- Nhánh: `phase-N/ten-tinh-nang`
- Commit message tiếng Anh, dạng mệnh lệnh
- Không commit `.env.local`
- **Bắt buộc chạy `npm run verify` (= lint + typecheck + test + build) và xác nhận PASS trước mỗi lần `git push`** — không phải chỉ trước khi merge. Có git hook `pre-push` tự chạy việc này (thiết lập ở Phase 1.1 trong `docs/08-ROADMAP.md`), nhưng **không dựa hoàn toàn vào hook** — nếu hook bị bypass (`--no-verify`) hoặc chưa cài xong, vẫn phải tự chạy tay và dán output vào báo cáo hoàn thành (`docs/09-QUY-TRINH-PHOI-HOP.md` mục 4, phần 3).
- Không bao giờ dùng `git push --no-verify` để né hook, trừ khi người dùng yêu cầu rõ ràng.

---

## Trước khi báo hoàn thành một hạng mục

- [ ] `npm run build` không lỗi, không cảnh báo TypeScript
- [ ] Đã đối chiếu với acceptance criteria trong `docs/01-SRS.md` và `docs/05-FEATURES.md`
- [ ] Không vi phạm bất biến nào ở trên
- [ ] Grep code vừa viết: không có chỗ nào gán `X-LLM-Key`/API key vào biến sống ngoài phạm vi request
- [ ] Chuỗi hiển thị cho người dùng đều tiếng Việt
- [ ] Tài liệu đã cập nhật nếu có gì lệch so với đặc tả

## Khi gặp việc chưa rõ

1. Tìm trong `docs/` trước.
2. Xem mục "Những chỗ dễ sai nhất" ở cuối `docs/08-ROADMAP.md`.
3. Vẫn không rõ: chọn phương án an toàn hơn (không lưu key server-side, không mở lại RLS ghi), ghi lại quyết định trong code comment, nêu rõ khi báo cáo.

**Không tự ý mở rộng phạm vi**, đặc biệt là **không tự ý thêm lại hệ thống tài khoản/đăng nhập** dù có vẻ "tiện" hay "chuẩn hơn". Đây là quyết định thiết kế đã cân nhắc kỹ, không phải thiếu sót cần bạn bổ sung.
