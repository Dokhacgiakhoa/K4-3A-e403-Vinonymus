# 04 — Đặc tả API

> **Đã viết lại theo mô hình không tài khoản.** Toàn bộ endpoint `/api/admin/*`, `/api/conversations/*`, `/api/me/*` bị loại bỏ — nội dung quản lý qua Git (`02-KIEN-TRUC.md`), lịch sử hội thoại sống ở `localStorage` (`08-ROADMAP.md`), quota hệ thống không còn tồn tại. Bộ API giờ chỉ còn **3 endpoint**.

## Quy ước chung

- Base URL: `/api`
- Xác thực: **không có**. Không cookie, không session.
- **API key của người dùng gửi trong header `X-LLM-Provider` + `X-LLM-Key`**, không phải cookie/token của hệ thống.
- Toàn bộ body validate bằng Zod. Sai schema → `422`.

### Vỏ response

Thiết kế gốc:
```jsonc
{ "ok": true, "data": { ... } }
{ "ok": false, "error": { "code": "...", "message": "...", "details": { ... } } }
```

> ⚠️ **Chưa khớp thiết kế gốc.** Cả 4 endpoint hiện tại đều trả **phẳng**, không bọc vỏ `{ok, data}`/`{ok, error}` ở trên — ví dụ lỗi validate ở `/api/chat` là `{ "error": "Câu hỏi không được để trống" }` (HTTP 400), không có field `code` chuẩn hoá. Bảng mã lỗi bên dưới vẫn đúng về mặt *khi nào lỗi gì xảy ra*, nhưng field `code` trong bảng hiện **không** thực sự xuất hiện trong response JSON thật — cần đồng bộ lại (hoặc sửa code để bọc đúng vỏ, hoặc viết lại tài liệu này theo response phẳng thực tế).

### Bảng mã lỗi

| HTTP | `code` | Khi nào | Thông báo |
|---|---|---|---|
| 400 | `BAD_REQUEST` | Tham số không hợp lệ | Yêu cầu không hợp lệ. |
| 401 | `MISSING_API_KEY` | Cần LLM mà không có key | Bạn cần nhập API key ở trang Cài đặt để dùng tính năng này. |
| 401 | `INVALID_API_KEY` | Provider từ chối key | API key không hợp lệ hoặc đã hết hạn. Kiểm tra lại ở Cài đặt. |
| 413 | `PAYLOAD_TOO_LARGE` | Câu hỏi quá dài | Câu hỏi vượt quá độ dài cho phép. |
| 422 | `VALIDATION_ERROR` | Zod fail | Dữ liệu nhập chưa đúng. |
| 429 | `RATE_LIMITED` | Gửi quá nhanh (chống spam theo IP) | Bạn thao tác hơi nhanh, thử lại sau ít giây. |
| 429 | `PROVIDER_RATE_LIMITED` | Chính key của người dùng bị provider giới hạn | Key của bạn đã hết lượt trong khung giờ này (giới hạn từ phía {provider}). Thử lại sau hoặc đổi provider khác ở Cài đặt. |
| 503 | `EMBEDDING_UNAVAILABLE` | Không tạo được embedding | Đang tạm dùng chế độ tìm kiếm rút gọn. |
| 500 | `INTERNAL_ERROR` | Lỗi ngoài dự kiến | Có lỗi xảy ra. Vui lòng thử lại. |

> Response lỗi không bao giờ chứa stack trace hay **bất kỳ phần nào của API key**.

---

## A. `POST /api/chat` — Đặt câu hỏi *(SSE)*

Endpoint duy nhất quan trọng của hệ thống. Stateless hoàn toàn — không biết gì về "hội thoại", chỉ nhận đúng những gì client gửi lên trong request này.

**Header** (mỗi provider một header riêng — client chỉ gửi header của provider nào có key trong `localStorage`; `X-LLM-Provider`/`X-LLM-Key` là cặp legacy, ánh xạ vào provider tương ứng nếu header riêng của provider đó chưa có):
```
X-Gemini-Key: AIza...
X-Groq-Key: gsk_...
X-Cerebras-Key: csk-...
X-Openrouter-Key: sk-or-v1-...
X-Openai-Key: sk-proj-...
X-Claude-Key: sk-ant-...
X-Deepseek-Key: sk-...
X-LLM-Provider: gemini            (legacy, tuỳ chọn)
X-LLM-Key: AIza...                (legacy, đi kèm provider ở trên)
```
> Đủ 7 provider, khớp với 7 ô nhập ở trang Cài đặt Key. Riêng **embedding** (tầng 2 và tầng 3) hiện chỉ chạy được bằng key **Gemini** — các provider khác vẫn dùng được cho việc sinh câu trả lời, xem `06-AI-PIPELINE.md` mục 5.

**Request**
```jsonc
{
  "question": "Deadline assignment 2 là khi nào?",   // 1–2000 ký tự — field tên là "question", không phải "message"
  "history": [                                        // Client tự quản lý, gửi tối đa 6 lượt gần nhất
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:** `text/event-stream`. Tên sự kiện là `token` (không phải `delta` như thiết kế gốc), và **`token` được phát nhiều lần liên tiếp** — câu trả lời stream từng đoạn ngay khi LLM sinh ra, không gom thành một cục (đo thực tế: một câu trả lời ngắn về thành ~27 sự kiện `token`).

```
event: status
data: {"stage":"faq","message":"Đang tìm trong FAQ…"}

event: citations
data: {"citations":[]}

event: token
data: {"text":"Deadline nộp "}

event: token
data: {"text":"Assignment 1 là "}

event: token
data: {"text":"**23:59 ngày 25/09/2026**."}

event: done
data: {"path":"faq","faqId":"uuid","isVerified":true,"verificationSource":"...","suggestions":["..."],"degraded":false}
```

**Các giá trị `path` trong sự kiện `done`:**

| `path` | Khi nào | Giao diện |
|---|---|---|
| `"faq"` | Trúng FAQ ở tầng 1 hoặc 2 | Badge "Đã xác thực"/"Chưa xác thực" + gợi ý |
| `"rag"` | Trả lời từ tài liệu `data/documents/` (tầng 3) | Badge "Từ tài liệu" + chip trích dẫn `[1][2]` |
| `"refused"` | Không tìm thấy / câu hỏi chưa đủ rõ | Badge "Không tìm thấy" + gợi ý |
| **không có** (`undefined`) | Câu chỉ là trò chuyện — tầng 0, hoặc tầng 4 khi LLM tự phán đoán đây không phải câu hỏi khóa học (nhãn `INTENT: chat`, xem `06-AI-PIPELINE.md` mục 3b) | **Không badge, không gợi ý** — như một tin nhắn trò chuyện bình thường |
| `"error"` | Exception ngoài dự kiến | Hiện thông báo lỗi |

`degraded: true` trong sự kiện `done` (path `faq` hoặc `refused`) nghĩa là: mọi provider LLM người dùng cung cấp đều lỗi/hết quota, hệ thống đã fallback về nội dung `.md` gốc rút gọn thay vì câu trả lời tự nhiên qua LLM — **vẫn trả lời HTTP 200 bình thường, không phải sự kiện `error`**. Client phải hiện cảnh báo rõ cho người dùng khi thấy cờ này (xem `01-SRS.md` NFR-04.4), không được coi là thành công hoàn toàn.

### Luồng xử lý theo việc có/không có key

| Bước | Cần key? | Ghi chú |
|---|---|---|
| Tầng 0: trò chuyện (chào hỏi, hỏi về bot…) | ⚠️ Có key thì tự nhiên | Không có key vẫn trả lời được bằng câu cố định (`FALLBACK_TEXT`) |
| Tầng 1: khớp chuỗi/trigram FAQ | ❌ Không | Luôn chạy trước, 0 chi phí |
| Tầng 2: vector FAQ + LLM xác minh & tổng hợp | ✅ Có | Embedding (chỉ qua key Gemini) + 1 lời gọi xác minh + 1 lời gọi tổng hợp |
| Tầng 3: RAG tổng quát trên `data/documents/` | ✅ Có | Dùng lại embedding của tầng 2, + 1 lời gọi tổng hợp có trích dẫn đánh số |
| Tầng 4: đối thoại khi không tìm thấy | ✅ Có | 1 lời gọi; đồng thời ghi `record_unanswered()` |

Chi tiết đầy đủ từng tầng: `06-AI-PIPELINE.md` mục 1.

**Nếu không có header key nào và câu hỏi trượt tầng 1:**
```
event: need_key
data: {"message":"Vui lòng cung cấp API key để sử dụng tính năng tra cứu AI sâu."}
```
Client hiện lời nhắc, **không** coi đây là lỗi (không phải `error` event) — đây là trạng thái bình thường của một người dùng chưa cấu hình key.

**Nếu có key nhưng mọi provider đều lỗi thật** (401/429/quota hết) và tìm thấy FAQ khớp → vẫn trả `done` với `path: 'faq'` và `degraded: true` (xem trên), **không** phải sự kiện `error`. Sự kiện `error` chỉ bắn khi có exception ngoài dự kiến trong toàn bộ pipeline (ví dụ lỗi kết nối Supabase), không còn dùng cho trường hợp LLM lỗi ở đường FAQ nữa.

```bash
curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Gemini-Key: AIza..." \
  -d '{"question":"Deadline assignment 2 la khi nao?","history":[]}'
```

> **Về tầng RAG tổng quát:** đã được nối vào `processChatPipeline` (tầng 3). Khi trả lời từ tài liệu, sự kiện `citations` mang **dữ liệu chunk thật** (khác nhánh FAQ luôn gửi mảng rỗng), và câu trả lời có trích dẫn đánh số `[1][2]` khớp với danh sách chip trích dẫn.

> ⚠️ **Bất biến bắt buộc trong route handler:** giá trị `X-LLM-Key` đọc ra, dùng để gọi provider trong đúng request này, rồi **không được gán vào bất kỳ biến nào sống lâu hơn phạm vi request** (không cache, không log, không đưa vào `query_logs`).

---

## B. `POST /api/chat/feedback` — Đánh giá câu trả lời

Triển khai theo các tầng trong [`src/backend/README.md`](../src/backend/README.md):
route → controller → service → repository → RPC `submit_feedback`.
Request được validate bằng Zod: `queryLogId` phải là UUID, `rating` là -1/1,
`reason` nếu có thuộc `wrong`, `incomplete`, `irrelevant`, `other`;
`note` tối đa 2.000 ký tự và `clientSessionId` nếu có dài 1–200 ký tự.
Các trường tùy chọn chấp nhận `null`. JSON hỏng hoặc dữ liệu sai trả 400;
lỗi lưu trả 500 với thông báo chung, không trả lỗi nội bộ database.

```jsonc
// Request
{
  "queryLogId": "uuid",
  "rating": -1,
  "reason": "wrong",
  "note": "Deadline đã được dời rồi",
  "clientSessionId": "uuid-sinh-ngau-nhien-o-localStorage"
}

// 200 (response thật KHÔNG dùng vỏ {ok, data} — trả phẳng)
{ "success": true }

// Lỗi (400/500, cũng trả phẳng, không dùng vỏ ở đầu tài liệu)
{ "error": "Dữ liệu đánh giá không hợp lệ (rating phải là 1 hoặc -1)" }
```

`clientSessionId` do client tự sinh (`crypto.randomUUID()`) và lưu trong `localStorage`, gửi kèm mỗi lần — chỉ để chặn đánh giá trùng lặp qua ràng buộc `unique (query_log_id, client_session_id)`, không định danh người dùng thật.

---

## C. `GET /api/health` — Kiểm tra sức khoẻ + chống Supabase pause

Hành vi phụ thuộc biến môi trường `CRON_SECRET`:

| Tình huống | Hành vi |
|---|---|
| `CRON_SECRET` **chưa cấu hình** | Trả health-check cơ bản, không chạm Supabase (thiếu cấu hình phụ trợ không được chặn app — cùng tinh thần `01-SRS.md` FR-53.4) |
| Có `CRON_SECRET`, header `Authorization: Bearer <CRON_SECRET>` **khớp** | Ping Supabase thật (`select` nhẹ trên `categories`, giữ project không bị pause) **+** xoá bản ghi `semantic_cache` đã hết hạn. Response có thêm `"db"` |
| Có `CRON_SECRET`, header sai/thiếu | Vẫn trả 200 với health-check cơ bản, **không** trả mã lỗi khác biệt — tránh biến endpoint này thành nơi dò secret |

```jsonc
// Không có/sai secret
{ "status": "ok", "appName": "AIIA Notebook", "timestamp": "2026-08-08T...", "env": "production" }
// Đúng secret
{ "status": "ok", "appName": "AIIA Notebook", "timestamp": "...", "env": "production", "db": "connected" }
```

`.github/workflows/keepalive.yml` gọi endpoint này mỗi 3 ngày kèm `Authorization: Bearer ${{ secrets.CRON_SECRET }}`. **Cần khai báo secret `CRON_SECRET` trên GitHub repo** (và cùng giá trị trên Vercel) thì nhánh ping Supabase mới thực sự chạy; thiếu secret thì cron vẫn chạy nhưng chỉ đánh thức Vercel, không giữ được Supabase khỏi pause.

---

## D. `GET /api/faqs` — Danh sách FAQ đang active *(chưa có trong thiết kế gốc)*

Đọc trực tiếp `data/faqs/*.md` cục bộ (không qua Supabase), lọc `is_active: true`. Dùng để dựng danh mục FAQ hiển thị ở trang Notebook.

```jsonc
// 200
{ "faqs": [ { "question": "...", "category": "thi-dgnl", ... } ] }
```

---

## Những gì đã bị loại bỏ khỏi bản đặc tả gốc

| Nhóm endpoint gốc | Thay bằng |
|---|---|
| `/api/admin/documents/*` | Sửa file trong `data/documents/`, push, GitHub Action tự đồng bộ (`02-KIEN-TRUC.md` mục 7) |
| `/api/admin/documents/ingest/image` | Chạy `scripts/ocr-image.ts` cục bộ, tự duyệt kết quả, commit markdown (`05-FEATURES.md` F08) |
| `/api/admin/faqs/*` | Sửa file trong `data/faqs/` |
| `/api/admin/unanswered` | Đọc trực tiếp bảng `unanswered_questions` qua Supabase Studio/SQL |
| `/api/admin/analytics`, `/llm/status` | Đọc trực tiếp `query_logs` qua SQL — không có dashboard dựng riêng ở v1 |
| `/api/admin/settings` | Sửa `data/config.yaml`, push |
| `/api/admin/users`, `/transfer-ownership` | Không còn khái niệm người dùng hệ thống |
| `/api/admin/audit` | `git log data/` |
| `/api/conversations/*` | Không cần — lịch sử sống ở `localStorage` phía client |
| `/api/me`, `/api/me/quota`, `/api/me/api-keys` | Không cần — key nhập trực tiếp vào form Cài đặt, lưu `localStorage`, không có gì để server trả về |

Nếu về sau thực sự cần một giao diện quản trị nội dung qua web (ví dụ có nhiều người không rành Git cùng tham gia soạn nội dung), đó là lúc quay lại thiết kế auth + admin API — không mở rộng ngầm bộ 3 endpoint này.

---

**Tiếp theo:** [`05-FEATURES.md`](./05-FEATURES.md) — đặc tả tính năng (đã viết lại).
