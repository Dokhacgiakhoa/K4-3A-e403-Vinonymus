# 03 — API

> **Mở rộng 4 role (17/9):** [luồng và danh sách endpoint v1](role-api-schema.md),
> [OpenAPI](role-api.openapi.json), [Postman](role-api.postman_collection.json).
> API bên dưới giữ contract cũ; không tự lưu roadmap và chưa đọc metadata Lecture mới.

## 1. `POST /api/roadmap` — tạo kế hoạch tự học

> **Trạng thái:** đã build cho CP3; FE tại `/planner` gọi LLM thật qua router đa nhà cung cấp, có fallback baseline. Người phụ trách: Minh.

### Request

Header API key là tuỳ chọn. FE lấy key từ `localStorage` và gửi trong phạm vi request. Route dùng biến môi trường của server nếu thiếu header tương ứng; chỉ trả kế hoạch `baseline` khi không có key nào hoặc lời gọi LLM thất bại:

| Header | Provider |
|---|---|
| `x-gemini-key` | Gemini |
| `x-openai-key` | OpenAI |
| `x-claude-key` | Claude |
| `x-groq-key`, `x-cerebras-key`, `x-deepseek-key` | Khác |
| `x-fpt-key` | FPT AI Factory |

Router thử các provider có key theo thứ tự FPT → Gemini → OpenAI → Claude → DeepSeek → Groq → Cerebras. Model được cố định trong từng adapter, FE chưa cho chọn model. Lỗi tạm thời có thể được thử lại; lỗi trước token đầu tiên có thể chuyển sang provider kế tiếp; key sai (401/403) dừng thử. Không có key, provider lỗi hoặc output không hợp lệ thì Planner dùng `baseline`.

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
| `lab_id` | string không rỗng | phải có trong catalog, nếu không → `clarify` |
| `note` | string | tuỳ chọn, ≤500 ký tự, coi là dữ liệu |

### Response `200`

Luôn có trường `status`, một trong ba giá trị:

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
{ "status": "clarify", "question": "Hôm nay bạn chỉ có 20 phút — chưa đủ cho một việc trọn vẹn. Bạn có thể dành ít nhất 30 phút không, hay muốn ưu tiên chỉ phần chuẩn bị môi trường?" }
```

```json
{ "status": "refuse", "message": "Mình chỉ giúp sắp xếp việc cần học, không làm bài hộ, không đưa đáp án và không xử lý gia hạn hay điểm số. Những việc đó bạn nhắn Lab Coach của phòng nhé." }
```

| Trường | Ghi chú |
|---|---|
| `source` | `"ai"` hoặc `"baseline"` (FR-P09) |
| `tasks[].itemId`, `title`, `url`, `type`, `minutes` | **Lấy từ catalog**, không lấy từ output LLM (FR-P04); tối đa 3 việc, không vượt quỹ thời gian |
| `tasks[].reason` | Lý do do LLM sinh khi `source: "ai"`, hoặc do luật tĩnh tạo khi `source: "baseline"` |

Route kiểm tra lab, ghi chú ngoài phạm vi và thời gian dưới 30 phút trước khi gọi LLM. FE cho tick, bỏ, đổi thứ tự việc và lưu kế hoạch/checklist trong `localStorage`.

### Lỗi

| HTTP | Khi nào | Body |
|---|---|---|
| 400 | Body sai schema | `{ "error": "…", "field": "available_minutes" }` |
| 200 + `source: "baseline"` | Không có key ở header lẫn server / LLM lỗi / output không hợp lệ | Kế hoạch mặc định kèm nhãn |
| 200 + `status: "clarify"` / `"refuse"` | Lab không có trong catalog, thời gian dưới 30 phút, yêu cầu ngoài phạm vi hoặc chẩn đoán thiếu chắc chắn | `question` hoặc `message` tương ứng |
| 500 | Lỗi không lường trước | `{ "error": "Không thể xử lý yêu cầu lập kế hoạch." }` |

## 2. `POST /api/chat` — Chat K.AI (có sẵn)

FE Chat K.AI gọi API này với `question`, `history` và các header key hiện có. SSE stream có các sự kiện `status`, `token`, `citations`, `done`, `need_key`, `error`. Pipeline ưu tiên FAQ; khi cần LLM thì dùng cùng router ở trên. Đặc tả gốc của dự án nền: [`legacy/aiia-docs/04-API-SPEC.md`](legacy/aiia-docs/04-API-SPEC.md). Không thuộc lát cắt dự thi.

Widget nổi ghi "AI Helpdesk 24/7" trong `components/chat/floating-ai-widget.tsx` **chưa gọi** endpoint này: câu trả lời và bộ chọn model hiện là mô phỏng trên FE. AI Mentor 4 sprint tại `/learning?mode=ai_roadmap` cũng **chưa có API riêng**; wizard chạy quy tắc trong trình duyệt và lưu `localStorage`. Hai giao diện này không dùng `/api/roadmap`.

## 3. Endpoint khác có sẵn

| Endpoint | Mục đích |
|---|---|
| `POST /api/chat/feedback` | Đánh giá 👍/👎 câu trả lời chat |
| `GET /api/faqs` | Danh sách FAQ |
| `GET /api/health` | Health check |
| `GET /api/auth/login/[provider]`, `/api/auth/callback/[provider]` | OAuth GitHub/Google (mock, cần cấu hình) |
