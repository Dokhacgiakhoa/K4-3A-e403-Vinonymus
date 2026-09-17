# Đặc tả tính năng: Discord Study Activity & XP Integration (5 XP)

> **Trạng thái:** Bản thiết kế đề xuất (Draft Feature Spec)  
> **Dự án:** AI Diagnostic Study Planner · Nhóm Vinonymus (Track E)  
> **Mục tiêu:** Tích hợp ghi nhận hoạt động tự học và tính điểm (+5 XP) lên Discord Server của chương trình AI20K.

---

## 1. Bối cảnh & Mục tiêu

### 1.1. Hiện trạng kênh `#🤖-activity` (AI20K Build Phase - Cohort 4)
- Server chương trình hiện có kênh `#🤖-activity` ("Kênh theo dõi điểm XP, ghi nhận hoạt động Github").
- Bot `AI20K - GitHub Activity` và `Trợ lý Kute` tự động theo dõi commit GitHub của học viên để thông báo và ghi nhận **5 XP** kèm tag `<@discord_id>` và khẩu hiệu:
  > *“🚀 Commit mới lên sóng! <@id> vừa đẩy một commit mới! Giữ nhịp ship đều tay nào! 💪”*

### 1.2. Mục tiêu tích hợp
- Mở rộng kênh `#activity` để không chỉ ghi nhận hoạt động code GitHub mà còn ghi nhận **hoạt động tự học chuẩn bị bài Lab** thông qua AI Diagnostic Study Planner.
- Mỗi khi học viên hoàn thành một mốc học tập hợp lệ trên web, hệ thống gửi thông báo và ghi nhận chuẩn **+5 XP** tương ứng.
- **Yêu cầu môi trường dự thi:** Dự án đang trong giai đoạn chấm điểm, chưa được cấp API Key / Webhook chính thức của server ban tổ chức. Do đó, Backend phải hỗ trợ cơ chế **Dual-Mode (Live & Mock)**:
  - Khi chưa có Webhook URL: Chạy chế độ **Mock / Sandbox**, ghi log console đẹp mắt, trả về `200 OK` kèm `mocked: true` và preview payload để ban giám khảo chấm điểm trực tiếp mà không lỗi hệ thống.
  - Khi được cấp Webhook URL / Bot Key: Chỉ cần điền vào biến môi trường `.env.local`, hệ thống lập tức gửi tin nhắn thật lên kênh Discord mà không cần sửa code.

---

## 2. Quy tắc cộng điểm (+5 XP)

Hệ thống định nghĩa 3 sự kiện học tập chuẩn trên web, mỗi sự kiện ghi nhận đúng **5 XP**:

| Mã sự kiện (`event_type`) | Mô tả hành động trên Web | Mức XP | Nội dung thông báo Discord |
|---|---|:---:|---|
| `diagnostic_completed` | Học viên hoàn thành chẩn đoán nền tảng & quỹ thời gian cho bài Lab | **+5 XP** | 🎯 `<@id>` vừa hoàn thành chẩn đoán lộ trình tự học cho bài Lab! |
| `task_completed` | Học viên tick hoàn thành 1 đầu việc trọng tâm trong checklist | **+5 XP** | ⚡ `<@id>` vừa hoàn thành một mục tự học trọng tâm! |
| `session_completed` | Học viên hoàn thành toàn bộ phiên tự học trước buổi Lab | **+5 XP** | 🏆 `<@id>` đã hoàn tất trọn vẹn phiên tự học cho buổi Lab! |

---

## 3. Hợp đồng API (API Contract)

### `POST /api/integrations/discord/activity`

Ghi nhận một hoạt động học tập và gửi thông báo tích lũy điểm XP.

#### 3.1. Headers
```http
Content-Type: application/json
```

#### 3.2. Request Body
Validate ở server bằng Zod schema:

```json
{
  "student_name": "Nguyễn Văn A",
  "discord_user_id": "790540531609468928",
  "event_type": "diagnostic_completed",
  "lab_id": "lab-02",
  "task_title": "Chuẩn bị notebook và nơi nộp bài",
  "xp": 5,
  "metadata": {
    "available_minutes": 90,
    "background": "tech_base"
  }
}
```

| Trường | Kiểu | Bắt buộc? | Mô tả |
|---|---|:---:|---|
| `student_name` | `string` (min 1) | Có | Tên hiển thị của học viên |
| `discord_user_id` | `string` | Không | Discord Snowflake ID (nếu học viên đã liên kết tài khoản) |
| `event_type` | `enum` | Có | Một trong 3 giá trị: `"diagnostic_completed"`, `"task_completed"`, `"session_completed"` |
| `lab_id` | `string` | Có | Mã bài lab trong catalog (VD: `"lab-02"`, `"lab-03"`) |
| `task_title` | `string` | Không | Tiêu đề công việc nếu là `task_completed` |
| `xp` | `number` | Không | Mặc định là `5` |
| `metadata` | `object` | Không | Dữ liệu ngữ cảnh bổ sung (thời gian học, nền tảng) |

---

#### 3.3. Response `200 OK` (Live Mode - Có Webhook thật)
```json
{
  "success": true,
  "mocked": false,
  "message": "Đã gửi thông báo hoạt động học tập (+5 XP) lên Discord thành công.",
  "data": {
    "event_type": "diagnostic_completed",
    "xp": 5,
    "discord_user_id": "790540531609468928"
  }
}
```

#### 3.4. Response `200 OK` (Mock Mode - Khi chưa cấu hình Webhook)
```json
{
  "success": true,
  "mocked": true,
  "message": "Chế độ mô phỏng: Đã tạo payload Discord chuẩn và ghi log thành công.",
  "preview": {
    "content": "🎯 **Hoạt động tự học mới lên sóng!**\n<@790540531609468928> vừa hoàn thành chẩn đoán lộ trình tự học!",
    "embeds": [
      {
        "title": "📚 AI Diagnostic Study Planner · Ghi nhận +5 XP",
        "color": 5793266,
        "fields": [
          { "name": "Học viên", "value": "Nguyễn Văn A (<@790540531609468928>)", "inline": true },
          { "name": "Bài học", "value": "lab-02", "inline": true },
          { "name": "Điểm XP", "value": "+5 XP ⚡", "inline": true }
        ],
        "footer": { "text": "Giữ nhịp học đều tay nào! 📚" },
        "timestamp": "2026-09-17T16:25:00.000Z"
      }
    ]
  }
}
```

#### 3.5. Xử lý lỗi
- **400 Bad Request**: Input sai schema Zod (thông báo lỗi tiếng Việt cụ thể).
- **500 Internal Server Error**: Lỗi máy chủ (không để lộ stack trace).

---

## 4. Kiến trúc triển khai trong `codebase/`

```
codebase/src/
├── types/
│   └── discord.ts                  # Schema Zod & TypeScript types
├── lib/
│   └── integrations/
│       └── discord-service.ts      # Discord Service xử lý Mock & Live Webhook
└── app/
    └── api/
        └── integrations/
            └── discord/
                └── activity/
                    └── route.ts    # Next.js API Route nhận sự kiện & dispatch
```

### Biến môi trường (`codebase/.env.example` & `.env.local`):
```bash
# ---------- Discord Activity Integration ----------
# Bỏ trống để chạy chế độ Mock/Sandbox phục vụ chấm điểm và demo
DISCORD_WEBHOOK_URL=
# ID server / role dự án (tùy chọn)
DISCORD_ACTIVITY_CHANNEL_ID=
```

---

## 5. Kế hoạch xác minh & kiểm thử (Verification)
1. **Unit Test (`codebase/tests/unit/discord-service.test.ts`)**:
   - Kiểm tra định dạng Rich Embed và mention `<@id>`.
   - Kiểm tra hoạt động Mock Mode khi không có URL webhook.
   - Kiểm tra gửi HTTP request chuẩn khi có URL webhook.
   - Kiểm tra validate schema Zod (chặn input sai, chặn xp < 0).
2. **Kiểm tra tiêu chuẩn repo**:
   - Chạy `npm run verify` (lint + typecheck + test + audit + build).
   - Đảm bảo quy tắc `AGENTS.md`: Không dùng `any`, thông báo tiếng Việt, export có tên.
