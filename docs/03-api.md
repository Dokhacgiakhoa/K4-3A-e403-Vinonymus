# 03 — API

> **Mở rộng 4 role (17/9):** [luồng và danh sách endpoint v1](role-api-schema.md),
> [OpenAPI](role-api.openapi.json), [Postman](role-api.postman_collection.json).
> API bên dưới giữ contract cũ; không tự lưu roadmap và chưa đọc metadata Lecture mới.

## 1. `POST /api/roadmap` — tạo kế hoạch tự học

> **Trạng thái:** đã build cho CP3; FE tại `/personalized-path` gọi LLM thật qua router đa nhà cung cấp, có fallback baseline. Người phụ trách: Minh.

### Request

Header (tuỳ chọn, không lưu, không log). Thiếu header của provider nào thì server dùng biến môi trường tương ứng nếu có. Không có key nào thì trả kế hoạch baseline.

| Header | Biến môi trường dự phòng | Provider |
|---|---|---|
| `x-fpt-key` | `FPT_API_KEY` | FPT AI Factory (router thử đầu tiên) |
| `x-gemini-key` | `GEMINI_API_KEY` | Gemini |
| `x-openai-key` | `OPENAI_API_KEY` | OpenAI |
| `x-claude-key` | `ANTHROPIC_API_KEY` | Claude |
| `x-deepseek-key` | `DEEPSEEK_API_KEY` | DeepSeek |
| `x-groq-key` | `GROQ_API_KEY` | Groq |
| `x-cerebras-key` | `CEREBRAS_API_KEY` | Cerebras |

Router thử các provider có key theo thứ tự FPT → Gemini → OpenAI → Claude → DeepSeek → Groq → Cerebras. Model được cố định trong từng adapter, FE chưa cho chọn model. Lỗi tạm thời (503/429) được thử lại tối đa 2 lần; lỗi khác chuyển sang provider kế tiếp; key sai (401/403) dừng thử. Không có key, provider lỗi hoặc output không hợp lệ thì dùng `baseline`.

Body:

```json
{
  "background": "tech_base",
  "available_minutes": 90,
  "lab_id": "lab-prompt-tool-calling",
  "note": "Mình chưa quen notebook Colab"
}
```

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `background` | `"non_tech" \| "tech_base" \| "ai"` | bắt buộc |
| `available_minutes` | integer | 0–600 |
| `lab_id` | string | 1–100 ký tự; không có trong catalog → `clarify` |
| `note` | string | tuỳ chọn, ≤500 ký tự, coi là dữ liệu |

### Response `200`

Luôn có trường `status`, một trong ba giá trị. Response có header `x-planner-request-id` khi đã đi tới bước gọi LLM.

```json
{
  "status": "plan",
  "source": "ai",
  "diagnosis": {
    "background": "tech_base",
    "confidence": "high",
    "summary": "Đã quen code, còn thiếu thao tác notebook."
  },
  "tasks": [
    {
      "itemId": "ptc-setup-colab",
      "title": "Chuẩn bị notebook và Gemini API key",
      "url": "https://ai.google.dev/gemini-api/docs/quickstart",
      "type": "notebook",
      "minutes": 15,
      "reason": "Ghi chú cho biết bạn chưa quen Colab — làm trước để không kẹt khi vào bài."
    }
  ],
  "message": "Tổng 15/90 phút cho Lab 04 · Prompt Engineering & Tool Calling."
}
```

```json
{ "status": "clarify", "question": "Bạn đang có 20 phút, chưa đủ cho một nhiệm vụ trọn vẹn. Bạn có thể dành ít nhất 30 phút không?" }
```

```json
{ "status": "refuse", "message": "Mình chỉ giúp sắp xếp việc cần học; không làm bài hộ, đưa đáp án, chấm điểm hoặc xử lý gia hạn. Bạn hãy liên hệ Lab Coach cho các yêu cầu đó." }
```

| Trường | Ghi chú |
|---|---|
| `source` | `"ai"` hoặc `"baseline"` (FR-P09); chỉ có khi `status = "plan"` |
| `tasks[].itemId` | Response dùng camelCase; output nội bộ của LLM mới dùng `item_id` |
| `tasks[].title`, `url`, `type`, `minutes` | **Lấy từ catalog**, không lấy từ output LLM (FR-P04) |
| `tasks[].reason` | Từ LLM (cắt còn ≤160 ký tự) khi `source: "ai"`; do luật tĩnh tạo khi `source: "baseline"` |
| `diagnosis.summary` | Từ LLM, cắt còn ≤240 ký tự |

`clarify` và `refuse` có thể đến từ luật cứng (trước khi gọi LLM) hoặc từ LLM. Khi LLM trả `confidence = "low"`, server đổi thành `clarify`.

FE cho tick, bỏ, đổi thứ tự việc và lưu kế hoạch/checklist trong `localStorage`.

### Lỗi

| HTTP | Khi nào | Body |
|---|---|---|
| 400 | Body sai schema | `{ "error": "…", "field": "available_minutes" }` |
| 200 + `source: "baseline"` | Không có key ở header lẫn server / LLM lỗi / output không hợp lệ | Kế hoạch mặc định kèm nhãn |
| 200 + `status: "clarify"` / `"refuse"` | Lab không có trong catalog, thời gian dưới 30 phút, yêu cầu ngoài phạm vi hoặc chẩn đoán thiếu chắc chắn | `question` hoặc `message` tương ứng |
| 500 | Lỗi không lường trước | `{ "error": "Không thể xử lý yêu cầu lập kế hoạch." }` |

## 2. `POST /api/chat` — AI Helpdesk (trước gọi Chat K.AI)

Component chat (`components/chat/chat-box.tsx`) gọi API này với `question`, tối đa 6 tin `history`, `learner_context` rút gọn từ roadmap nếu có, JWT hiện có trong `Authorization: Bearer …` và Gemini key nếu người dùng đã cấu hình. API xác thực JWT qua backend `/api/v1/auth/me` và giữ nguyên role `Visitor`, `Member`, `Lecture` hoặc `SuperAdmin`; role không được nhận từ body. API luôn loại bỏ `learner_context` của `Visitor`; role có quyền học mới được dùng context để điều chỉnh mức giải thích, không dùng context làm nguồn kiến thức. `Member`, `Lecture` và `SuperAdmin` có quyền mở Lộ trình cá nhân hoá; `Visitor` phải đăng nhập tài khoản được cấp quyền học. Thiếu token, role lạ hoặc backend lỗi đều fail closed về `Visitor`. FAQ là nội dung công khai. RAG document dùng metadata `audience`: `Visitor` chỉ truy xuất `public` bằng anon client; `Member`, `Lecture` và `SuperAdmin` mới được API server dùng service role để truy xuất thêm `learning`. Migration `0021_private_learning_documents.sql` phải được áp dụng trước khi sync corpus private. SSE stream có các sự kiện `status`, `token`, `citations`, `done`, `need_key`, `error`. Không thuộc lát cắt dự thi.

Session memory dùng `chat_sessions` và `chat_messages` trong Supabase, tối đa 50 tin và đưa 6 tin gần nhất vào prompt. Tài khoản đăng nhập được gắn bằng backend `user_id`; guest dùng cookie `HttpOnly` 7 ngày và database chỉ lưu hash. `GET /api/chat` đọc history, `DELETE /api/chat` xoá history; localStorage chỉ là fallback. Memory không phải nguồn của learner context.

Widget nổi "AI Helpdesk 24/7" gắn `ChatBox` vào layout toàn app và gọi endpoint này thật. Helpdesk dùng Gemini 3.5 Flash-Lite để chọn `search`, `clarify`, `refuse`, `handoff_planner` hoặc `chat`; sau đó mới gọi FAQ/RAG tool khi cần. Wizard lộ trình 4 sprint tại `/learning?mode=ai_roadmap` vẫn chạy quy tắc trong trình duyệt, chưa có API riêng và không dùng `/api/roadmap`.

## 3. Endpoint khác có sẵn

| Endpoint | Mục đích |
|---|---|
| `POST /api/chat/feedback` | Đánh giá 👍/👎 câu trả lời chat (chi tiết bên dưới) |
| `GET /api/faqs` | Danh sách FAQ |
| `GET /api/health` | Health check |
| `GET /api/auth/login/[provider]`, `/api/auth/callback/[provider]` | OAuth GitHub/Google (mock, cần cấu hình) |

### `POST /api/chat/feedback`

Tách lớp trong `codebase/src/backend/`: route → controller → service → repository → RPC `submit_feedback` (migration `0014_submit_feedback_rpc.sql`). Ghi qua RPC để không phải mở quyền UPDATE/SELECT cho người dùng ẩn danh.

| Trường | Ràng buộc (zod) |
|---|---|
| `queryLogId` | UUID, bắt buộc |
| `rating` | `-1` hoặc `1` |
| `reason` | tuỳ chọn: `wrong`, `incomplete`, `irrelevant`, `other` |
| `note` | tuỳ chọn, ≤ 2.000 ký tự |
| `clientSessionId` | tuỳ chọn, 1–200 ký tự |

| HTTP | Khi nào | Body |
|---|---|---|
| 200 | Lưu được | `{ "success": true }` |
| 400 | JSON hỏng hoặc sai schema | `{ "error": "…", "field": "…" }` |
| 500 | Lỗi lưu | Thông báo chung, không trả lỗi nội bộ database |

Kiểm thử: `codebase/tests/unit/backend-feedback.test.ts` (8 test).
