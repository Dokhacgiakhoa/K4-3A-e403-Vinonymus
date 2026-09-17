# API Schema cho Frontend

> Bản này mô tả API công khai cũ. Luồng Guest/Student/Lecture/Admin và 53 thao tác
> TypeScript v1 đã được triển khai riêng: xem [API 4 role](role-api-schema.md),
> [OpenAPI](role-api.openapi.json), [Postman](role-api.postman_collection.json).
> Publish metadata tài liệu v1 chưa đưa nội dung vào Chat/RAG cũ.

Tai lieu nay mo ta cac endpoint Next.js hien co the chay duoc trong thu muc
`codebase/src/app/api`. Base URL khi chay local la `http://localhost:3000`.

## 1. API chinh cua Planner

### `POST /api/roadmap`

Tao checklist hoc tap cho bai lab tiep theo. Day la endpoint chinh cua lat cat
hackathon trong README.

Endpoint khong yeu cau dang nhap. API key LLM duoc gui trong header va chi dung
trong request hien tai.

#### Request headers

Co the gui mot hoac nhieu header sau:

```text
x-gemini-key: <key>
x-openai-key: <key>
x-claude-key: <key>
x-deepseek-key: <key>
x-groq-key: <key>
x-cerebras-key: <key>
x-fpt-key: <key>
```

Neu khong co key, endpoint van co the tra ket qua baseline bang luat tinh.

#### Request body

```json
{
  "background": "tech_base",
  "available_minutes": 90,
  "lab_id": "lab-prompt-tool-calling",
  "note": "Minh chua quen notebook Colab"
}
```

| Field | Type | Required | Constraint |
|---|---|---:|---|
| `background` | string | Co | `non_tech`, `tech_base` hoac `ai` |
| `available_minutes` | integer | Co | Tu 0 den 600 |
| `lab_id` | string | Co | Phai ton tai trong `planner-catalog.ts` |
| `note` | string | Khong | Toi da 500 ky tu |

#### Response thanh cong: `status = plan`

```json
{
  "status": "plan",
  "source": "ai",
  "diagnosis": {
    "background": "tech_base",
    "confidence": "high",
    "summary": "Ban con thieu thao tac notebook."
  },
  "tasks": [
    {
      "itemId": "ptc-setup-colab",
      "title": "Chuan bi notebook va Gemini API key",
      "url": "https://ai.google.dev/gemini-api/docs/quickstart",
      "type": "notebook",
      "minutes": 15,
      "reason": "Lam buoc chuan bi moi truong truoc khi vao lab."
    }
  ],
  "message": "Tong 15/90 phut cho lab."
}
```

`tasks` co toi da 3 phan tu. `itemId`, `title`, `url`, `type` va `minutes`
duoc lay tu catalog da kiem chung; khong lay link truc tiep tu output cua LLM.
`source` co the la `ai` hoac `baseline`.

#### Response can hoi lai: `status = clarify`

```json
{
  "status": "clarify",
  "question": "Ban chi co 20 phut, chua du cho mot viec tron ven."
}
```

FE hien thi cau hoi va cho nguoi dung quay lai sua input.

#### Response tu choi: `status = refuse`

```json
{
  "status": "refuse",
  "message": "Minh chi giup sap xep viec can hoc, khong lam bai ho."
}
```

Dung cho yeu cau lam bai ho, xin dap an, xin diem, xin gia han hoac yeu cau
ngoai pham vi.

#### Error

```json
// 400 - body sai schema
{ "error": "Du lieu khong hop le", "field": "available_minutes" }

// 500 - loi khong du kien
{ "error": "Khong the xu ly yeu cau lap ke hoach." }
```

Neu LLM khong co key, bi loi hoac tra output khong hop le, FE nhan `200` voi
`source: "baseline"`, khong phai loi API.

## 2. API Chat/RAG

### `POST /api/chat`

Dung cho Chat K.AI, khong phai buoc bat buoc trong luong Planner. Endpoint tra
ve `text/event-stream` va stream nhieu event.

#### Request

```json
{
  "question": "Deadline assignment 2 la khi nao?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

`question` dai tu 1 den 2.000 ky tu. `history` la tuy chon va do FE tu quan
ly. Gui API key qua cac header `x-*-key` tuong tu `/api/roadmap`.

#### SSE events

```text
event: status
data: {"stage":"faq","message":"Dang tim trong FAQ..."}

event: citations
data: {"citations":[]}

event: token
data: {"text":"Deadline assignment 2 la..."}

event: done
data: {"path":"faq","queryLogId":"uuid","degraded":false}
```

FE can xu ly cac event:

| Event | Muc dich |
|---|---|
| `status` | Cap nhat trang thai pipeline |
| `token` | Noi them tung doan cau tra loi |
| `citations` | Hien thi citation/chunk nguon |
| `done` | Ket thuc cau tra loi, co `queryLogId` de feedback |
| `need_key` | Yeu cau nguoi dung nhap API key |
| `error` | Loi pipeline bat ngo |

### `POST /api/chat/feedback`

Luu danh gia cua nguoi dung cho mot cau tra loi Chat.

```json
{
  "queryLogId": "uuid",
  "rating": 1,
  "reason": "incomplete",
  "note": "Can them vi du",
  "clientSessionId": "uuid"
}
```

- `queryLogId`: UUID tu event `done` cua `/api/chat`.
- `rating`: `1` (like) hoac `-1` (dislike).
- `reason`: `wrong`, `incomplete`, `irrelevant` hoac `other`, co the bo trong.
- `note`: tuy chon, toi da 2.000 ky tu.

Response thanh cong:

```json
{ "success": true }
```

## 3. API ho tro

### `GET /api/faqs`

Lay cac FAQ dang active tu cac file local de hien thi danh muc FAQ.

```json
{
  "faqs": [
    {
      "question": "...",
      "answer": "...",
      "category": "...",
      "is_active": true
    }
  ]
}
```

### `GET /api/health`

Kiem tra app co dang hoat dong khong.

```json
{
  "status": "ok",
  "appName": "AIIA Notebook",
  "timestamp": "2026-09-17T00:00:00.000Z",
  "env": "development"
}
```

Neu cron secret hop le, response co them `db: "connected"` hoac
`db: "error"`. FE thong thuong khong can gui secret.

### `POST /api/contact/survey`

Nhan form khao sat nguoi dung va chuyen sang Google Sheets webhook.

Cac field bat buoc gom `fullName`, `studentId`, `email`, `background`,
`rewardAccount`, cac cau tra loi khao sat va `overallRating`. Chi tiet validate
nam trong `codebase/src/app/api/contact/survey/route.ts`.

Response thanh cong:

```json
{
  "success": true,
  "ticketCode": "P001",
  "message": "Khao sat da duoc gui thanh cong."
}
```

## 4. OAuth routes

### `GET /api/auth/login/[provider]`

Khoi tao dang nhap Google/GitHub. Day la route redirect tren trinh duyet, khong
phai JSON API thong thuong. `provider` la `google` hoac `github`.

### `GET /api/auth/callback/[provider]`

Nhan callback tu OAuth provider, xu ly thong tin user va redirect ve app. Can
cau hinh bien moi truong OAuth; khong thuoc luong Planner trong README.

Các route OAuth/client auth cũ còn phụ thuộc cấu hình và backend .NET; không nằm
trong luồng xác thực Supabase của API v1 và không được xác nhận chạy end-to-end
trong đợt bàn giao này. FE dùng register/login/refresh/logout v1 cho 4 role.

## 5. Phần Mở Rộng

API auth/profile, catalog/node, roadmap lưu DB, progress, metadata học liệu,
review/publish và admin đã có trong [contract v1](role-api-schema.md).
Thanh toán, chứng chỉ, upload/parse file và Qdrant chưa thuộc đợt triển khai này.
