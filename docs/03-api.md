# 03 — API

## 1. `POST /api/roadmap` — tạo kế hoạch tự học

> **Trạng thái:** đã build cho CP3; FE tại `/learning-path` gọi LLM thật qua router đa nhà cung cấp, có fallback baseline. Người phụ trách: Minh.

### Đăng nhập

Khi đã cấu hình backend (`BACKEND_CORE_URL` hoặc `NEXT_PUBLIC_BACKEND_CORE_URL`), route yêu cầu header `Authorization: Bearer <token>` của tài khoản **đã được duyệt**. Server kiểm tra token bằng cách gọi `GET /api/v1/auth/me` của backend (kết quả được nhớ 60 giây).

| Tình huống | Kết quả |
|---|---|
| Chưa cấu hình backend | Không bắt đăng nhập |
| Thiếu token, token sai, tài khoản chờ duyệt hoặc bị từ chối | `401` `{ "error": "…", "code": "LOGIN_REQUIRED" }` |
| `ALLOW_ANON_AI_MENTOR=true` (chỉ dùng khi chạy eval ở máy) | Không bắt đăng nhập |

### Request

Header API key (tuỳ chọn, không lưu, không log). Thiếu header của provider nào thì server dùng biến môi trường tương ứng nếu có. Không có key nào thì trả kế hoạch baseline.

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

**Hạn mức cho khách:** người chưa đăng nhập (hoặc tài khoản chưa được duyệt) được hỏi **10 câu mỗi ngày** (theo giờ Việt Nam), đếm theo mã phiên ẩn danh `x-client-session-id`. Ngoài ra có trần 200 câu/ngày cho mỗi IP, vì cả lớp có thể dùng chung một IP. Người đã đăng nhập không bị giới hạn.

| Tình huống | Kết quả |
|---|---|
| Khách còn lượt | `200` SSE như bình thường, kèm header `x-guest-quota-limit`, `x-guest-quota-remaining` |
| Khách hết lượt | `429` `{ "error": "…", "code": "GUEST_QUOTA_EXCEEDED", "limit": 10 }`; lượt bị từ chối không bị trừ |

Bộ đếm lưu ở backend .NET (`POST /api/v1/quota/helpdesk/consume`, chỉ nhận mã băm SHA-256 của mã phiên và IP). Chưa có backend hoặc backend lỗi thì đếm trong bộ nhớ server; trên Vercel cách này chỉ chặn được một phần.

Chatbox AI Helpdesk (widget nổi `components/chat/floating-ai-widget.tsx`, bên trong dùng `chat-box.tsx`) gọi API này với `question`, `history` và các header key hiện có. SSE stream có các sự kiện `status`, `token`, `citations`, `done`, `need_key`, `error`. Pipeline ưu tiên FAQ; khi cần LLM thì dùng cùng router ở trên. Đặc tả gốc của dự án nền: [`legacy/aiia-docs/04-API-SPEC.md`](legacy/aiia-docs/04-API-SPEC.md). Không thuộc lát cắt dự thi.

Wizard lộ trình 4 sprint tại `/learning?mode=ai_roadmap` (menu "Lộ Trình AI Mentor") cũng **chưa có API riêng**; wizard chạy quy tắc trong trình duyệt và lưu `localStorage`. Wizard này không dùng `/api/roadmap`.

## 3. Endpoint khác có sẵn

| Endpoint | Mục đích |
|---|---|
| `POST /api/chat/feedback` | Đánh giá 👍/👎 câu trả lời chat (chi tiết bên dưới) |
| `POST /api/integrations/discord/activity` | Ghi nhận hoạt động tự học (+5 XP) lên Discord (Dual-Mode: Mock/Live, chi tiết bên dưới) |
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

### `POST /api/integrations/discord/activity`

Ghi nhận hoạt động tự học hoàn thành trên web và gửi thông báo cộng **+5 XP** lên kênh `#activity` của Discord server chương trình. Hỗ trợ cơ chế **Dual-Mode** (Mock Sandbox tự động sinh preview khi chưa có Webhook; gửi live khi có biến môi trường `DISCORD_WEBHOOK_URL`). Chi tiết đặc tả: [`docs/feature-discord-api.md`](feature-discord-api.md).

| Trường | Ràng buộc (zod) | Mô tả |
|---|---|---|
| `student_name` | string, 1–100 ký tự, bắt buộc | Tên hiển thị học viên |
| `discord_user_id` | string (17–20 số), tuỳ chọn | Discord Snowflake ID để tag `<@id>` |
| `event_type` | enum, bắt buộc | `diagnostic_completed` \| `task_completed` \| `session_completed` |
| `lab_id` | string, bắt buộc | Mã bài lab (VD: `lab-02`) |
| `task_title` | string, tuỳ chọn, ≤200 ký tự | Tiêu đề việc học đã hoàn thành |
| `xp` | integer, 1–50, mặc định `5` | Điểm XP cộng thưởng (mặc định chuẩn 5 XP) |
| `metadata` | object, tuỳ chọn | Ngữ cảnh bổ sung |

| HTTP | Khi nào | Body |
|---|---|---|
| 200 (Live) | Gửi thành công tới Webhook Discord | `{ "success": true, "mocked": false, "message": "…", "data": { … } }` |
| 200 (Mock) | Chưa cấu hình Webhook (chấm điểm / demo) | `{ "success": true, "mocked": true, "message": "…", "data": { … }, "preview": { … } }` |
| 400 | Sai schema dữ liệu đầu vào | `{ "error": "…", "field": "…", "hint": "…" }` |
| 502 | Máy chủ Discord từ chối hoặc timeout 5s | `{ "error": "…", "hint": "…" }` |
| 500 | Lỗi nội bộ không lường trước | `{ "error": "Đã xảy ra lỗi nội bộ…", "hint": "…" }` |

Kiểm thử: `codebase/tests/unit/discord-service.test.ts` (10 test), `codebase/tests/unit/discord-route.test.ts` (3 test).

## 4. Backend .NET (`codebase/backend-core`)

| Endpoint | Ai gọi | Mục đích |
|---|---|---|
| `POST /api/v1/auth/register` | Trình duyệt | Tạo tài khoản ở trạng thái **chờ duyệt**; **không** trả token |
| `POST /api/v1/auth/login` | Trình duyệt | Trả token chỉ khi tài khoản đã được duyệt; chờ duyệt/bị từ chối trả `400` kèm thông báo và `approvalStatus` |
| `GET /api/v1/auth/me` | Next.js server, trình duyệt | `401` nếu token sai hoặc tài khoản chưa được duyệt |
| `POST /api/v1/auth/oauth-sync` | Chỉ Next.js server | Bắt buộc header `X-Internal-Key` trùng `Backend__InternalApiKey`; thiếu khoá thì `403` (OAuth bị tắt) |
| `GET /api/v1/admin/users?status=Pending|Approved|Rejected` | Trang `/admin/approvals` | Chỉ tài khoản SuperAdmin; khác thì `403` |
| `POST /api/v1/admin/users/{id}/approval` | Trang `/admin/approvals` | Body `{ "status": "Approved" | "Rejected" }`; chỉ SuperAdmin |
| `GET /api/v1/curriculum/modules`, `/modules/{id}` | Trình duyệt | Không cần đăng nhập; có token hợp lệ thì kèm tiến độ của chính người đó |
| `POST /api/v1/curriculum/enroll`, `/unenroll`, `/progress/toggle`; `GET /api/v1/curriculum/certificates?moduleId=` | Trình duyệt | Bắt buộc token của tài khoản đã duyệt, không thì `401`. Người dùng lấy từ token; body chỉ gồm `moduleId` (và `topicId`) |
| `POST /api/v1/payments/vietqr` | Trình duyệt | Bắt buộc token; body `{ amountVnd, planName }` |
| `POST /api/v1/quota/helpdesk/consume` | Next.js server | Body `{ sessionHash, ipHash }` (SHA-256 hex); trả `{ allowed, limit, remaining }` |

Biến môi trường bắt buộc khi deploy: `Jwt__Secret` (≥ 32 ký tự, không dùng lại giá trị cũ từng nằm trong repo), `ConnectionStrings__DefaultConnection` hoặc `DATABASE_URL`, `Cors__AllowedOrigins__0…`. Tuỳ chọn: `Backend__InternalApiKey`, `GuestQuota__SessionDailyLimit`, `GuestQuota__IpDailyLimit`. Schema: chạy lần lượt các file trong `codebase/database/migrations/`.
