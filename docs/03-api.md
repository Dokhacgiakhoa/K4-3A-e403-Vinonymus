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

Component chat (`components/chat/chat-box.tsx`) gọi API này với `question`, `history` và các header key hiện có. SSE stream có các sự kiện `status`, `token`, `citations`, `done`, `need_key`, `error`. Pipeline ưu tiên FAQ; khi cần LLM thì dùng cùng router ở trên. Đặc tả gốc của dự án nền: [`legacy/aiia-docs/04-API-SPEC.md`](legacy/aiia-docs/04-API-SPEC.md). Không thuộc lát cắt dự thi.

Widget nổi ghi "AI Helpdesk 24/7" trong `components/chat/floating-ai-widget.tsx` **chưa gọi** endpoint này: câu trả lời và bộ chọn model hiện là mô phỏng trên FE. Wizard lộ trình 4 sprint tại `/learning?mode=ai_roadmap` (menu "Lộ Trình AI Mentor") cũng **chưa có API riêng**; wizard chạy quy tắc trong trình duyệt và lưu `localStorage`. Hai giao diện này không dùng `/api/roadmap`. Component `chat-box.tsx` hiện cũng chưa được gắn vào trang nào.

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
