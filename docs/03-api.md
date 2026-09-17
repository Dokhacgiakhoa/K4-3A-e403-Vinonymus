# 03 — API

## 1. `POST /api/roadmap` — tạo kế hoạch tự học

> **Trạng thái:** đã build cho CP3; gọi LLM thật qua router đa nhà cung cấp, có logging prompt/raw response và fallback baseline.

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
  "message": "Tổng 75/90 phút cho Lab 04 · Prompt Engineering & Tool Calling."
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
| `tasks[].reason` | Từ LLM, cắt còn ≤160 ký tự |
| `diagnosis.summary` | Từ LLM, cắt còn ≤240 ký tự |

`clarify` và `refuse` có thể đến từ luật cứng (trước khi gọi LLM) hoặc từ LLM. Khi LLM trả `confidence = "low"`, server đổi thành `clarify`.

### Lỗi

| HTTP | Khi nào | Body |
|---|---|---|
| 400 | Body sai schema | `{ "error": "…", "field": "available_minutes" }` |
| 200 + `source: "baseline"` | Không có key / LLM lỗi / output không hợp lệ | Kế hoạch mặc định kèm nhãn |
| 500 | Lỗi không lường trước | `{ "error": "…" }` — không lộ stack trace |

## 2. `POST /api/chat` — Chat K.AI (có sẵn)

SSE stream với các sự kiện `status`, `token`, `citations`, `done`, `need_key`, `error`. Đặc tả gốc: [`legacy/aiia-docs/04-API-SPEC.md`](legacy/aiia-docs/04-API-SPEC.md). Không thuộc lát cắt dự thi.

## 3. Endpoint khác có sẵn

| Endpoint | Mục đích |
|---|---|
| `POST /api/chat/feedback` | Đánh giá 👍/👎 câu trả lời chat |
| `GET /api/faqs` | Danh sách FAQ |
| `GET /api/health` | Health check |
| `GET /api/auth/login/[provider]`, `/api/auth/callback/[provider]` | OAuth GitHub/Google (mock, cần cấu hình) |
