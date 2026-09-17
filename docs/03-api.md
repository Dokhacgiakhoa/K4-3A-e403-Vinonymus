# 03 — API

## 1. `POST /api/roadmap` — tạo kế hoạch tự học

> **Trạng thái:** đã có route handler và FE tại `/planner` đã gọi API. Người phụ trách: Minh.

### Request

Header API key là tuỳ chọn. FE lấy key từ `localStorage` và gửi trong phạm vi request; không có key thì API trả kế hoạch `baseline`:

| Header | Provider |
|---|---|
| `x-gemini-key` | Gemini |
| `x-openai-key` | OpenAI |
| `x-claude-key` | Claude |
| `x-groq-key`, `x-cerebras-key`, `x-deepseek-key`, `x-openrouter-key` | Khác |
| `x-fpt-key` | FE/API nhận key, nhưng router hiện chưa đăng ký FPT adapter; chỉ có key này sẽ rơi về `baseline` |

Router thử các provider có key theo thứ tự Gemini → OpenAI → Claude → DeepSeek → Groq → Cerebras → OpenRouter. Model được cố định trong từng adapter, FE chưa cho chọn model. Lỗi trước token đầu tiên có thể chuyển sang provider kế tiếp; key sai (401/403) dừng thử và Planner dùng `baseline`. Lỗi sau token đầu tiên hoặc JSON LLM sai cũng khiến Planner dùng `baseline`.

Body:

```json
{
  "background": "tech",
  "available_minutes": 90,
  "lab_id": "lab-prompt-tool-calling",
  "note": "Mình chưa quen notebook Colab"
}
```

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `background` | `"tech" \| "non_tech"` | bắt buộc |
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
    "background": "tech",
    "confidence": "high",
    "summary": "Đã quen code, còn thiếu thao tác notebook."
  },
  "tasks": [
    {
      "itemId": "ptc-setup-colab",
      "title": "Chuẩn bị notebook Colab và API key",
      "url": "https://ai.google.dev/gemini-api/docs/quickstart",
      "type": "notebook",
      "minutes": 15,
      "reason": "Ghi chú cho biết bạn chưa quen Colab — làm trước để không kẹt khi vào bài."
    }
  ],
  "message": "Tổng 15/90 phút cho Lab · Prompt Engineering & Tool Calling."
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
| 200 + `source: "baseline"` | Không có key / LLM lỗi / output không hợp lệ | Kế hoạch mặc định kèm nhãn |
| 200 + `status: "clarify"` / `"refuse"` | Lab không có trong catalog, thời gian dưới 30 phút, yêu cầu ngoài phạm vi hoặc chẩn đoán thiếu chắc chắn | `question` hoặc `message` tương ứng |

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
