# PR: Ghi rõ vai trò AI Mentor và AI Helpdesk; sửa hướng dẫn deploy

> **Task:** mô tả sản phẩm · **Issue:** — · **Branch:** `docs/ai-roles`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
- **AI Mentor** là AI thực thi, chạy phía sau, **không trò chuyện** với người dùng. Kết quả của nó hiện qua các tính năng như Lộ trình cá nhân hoá.
- **AI Helpdesk** là AI **duy nhất người dùng trò chuyện**, ở chatbox, dùng để tra cứu và giải đáp về tài liệu và lộ trình học.
- Sửa hướng dẫn deploy: web thật chỉ cập nhật khi merge vào nhánh `production`, không phải `main`.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Vai trò 2 AI | `spec.md` phần Phạm vi |
| Cách deploy | Thực tế trên Vercel: mọi deploy từ `main` là bản xem thử; web thật lấy từ `production` (PR #61) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `README.md` | Bảng 2 AI thêm cột "Người dùng có trò chuyện không?"; sơ đồ và bảng vận hành ghi bước PR `main` → `production` |
| `spec.md` | Phạm vi ghi vai trò 2 AI; thêm dòng §9 |
| `AGENTS.md` | Dòng bối cảnh ghi vai trò 2 AI |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Chỉ đổi tài liệu. `npm run verify` chạy qua hook pre-push.

## 5. Tài liệu & changelog
Đã ghi `spec.md` §9. Chuẩn đạt §7 không đổi.

## 6. Rủi ro / việc còn lại
- Trang Lộ trình cá nhân hoá vẫn có một câu hỏi lại khi thiếu thông tin ("Mình cần hỏi lại một chút"). Đây là thông báo trên form, không phải trò chuyện, nhưng giọng văn giống AI đang nói. Cần thống nhất cách viết.
- Widget AI Helpdesk hiện vẫn là mô phỏng, chưa gọi `/api/chat`.
