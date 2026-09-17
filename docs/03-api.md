# 03 — API

## 1. `POST /api/roadmap` — tạo kế hoạch tự học

> **Trạng thái:** đã build cho CP3; gọi LLM thật qua router đa nhà cung cấp, có logging prompt/raw response và fallback baseline.

### Request

Header (ít nhất một key, không lưu, không log):

| Header | Provider |
|---|---|
| `x-gemini-key` | Gemini |
| `x-openai-key` | OpenAI |
| `x-claude-key` | Claude |
| `x-groq-key`, `x-cerebras-key`, `x-deepseek-key` | Khác |

Body:

```json
{
  "background": "tech_base",
  "available_minutes": 90,
  "lab_id": "lab-02",
  "note": "Mình chưa quen notebook Colab"
}
```

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `background` | `"non_tech" \| "tech_base" \| "ai"` | bắt buộc |
| `available_minutes` | integer | 0–600 |
| `lab_id` | string | phải có trong catalog, nếu không → `clarify` |
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
      "item_id": "lab-02-colab-setup",
      "title": "Chuẩn bị notebook và nơi nộp bài",
      "url": "https://…",
      "type": "notebook",
      "minutes": 20,
      "reason": "Ghi chú cho biết bạn chưa quen Colab — làm trước để không kẹt khi vào bài."
    }
  ],
  "message": "Tổng 75/90 phút."
}
```

```json
{ "status": "clarify", "question": "Hôm nay bạn chỉ có 20 phút — bạn muốn ưu tiên đọc lý thuyết hay làm thử bài?" }
```

```json
{ "status": "refuse", "message": "Mình không làm bài hộ được. Nếu cần gia hạn, hãy nhắn Lab Coach của phòng.", "tasks": [] }
```

| Trường | Ghi chú |
|---|---|
| `source` | `"ai"` hoặc `"baseline"` (FR-P09) |
| `tasks[].title`, `url`, `type` | **Lấy từ catalog**, không lấy từ output LLM (FR-P04) |

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
