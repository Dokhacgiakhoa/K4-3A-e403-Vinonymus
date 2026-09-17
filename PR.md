# PR: Đổi cách gọi sang Adaptive Learning System (AI Mentor & AI Helpdesk)

> **Task:** CP4 · chốt `spec.md` · **Issue:** — · **Branch:** `docs/adaptive-learning-naming`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Thống nhất tên gọi sản phẩm trước khi nộp CP4. Hệ thống là **Adaptive Learning System** gồm 2 AI:
- **AI Mentor:** xây dựng lộ trình cá nhân hoá, trang `/planner`, là lát cắt dự thi. Trước đây gọi là "AI Diagnostic Study Planner".
- **AI Helpdesk:** giải đáp trên chat box. Trước đây gọi là "Chat K.AI".

Chỉ đổi tên gọi. Phạm vi lát cắt và chuẩn đạt ở `spec.md` §7 giữ nguyên.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Tiêu đề, dòng phạm vi, câu lát cắt, bảng §3 | `spec.md` §1–§4 |
| Banner "bản nháp" → "đã chốt tại CP4" | Yêu cầu CP4 |
| Changelog | `spec.md` §9 |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `README.md` | Tiêu đề; bảng giới thiệu 2 AI; đổi "Planner"/"Chat K.AI" thành AI Mentor/AI Helpdesk ở phần luồng, kiến trúc, trạng thái, deploy |
| `spec.md` | Tiêu đề; dòng phạm vi; banner đã chốt; câu lát cắt; "Planner" → "AI Mentor" ở §3; thêm dòng §9 |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Chỉ đổi tài liệu, không đổi code.
- `npm run verify` chạy qua hook pre-push khi push branch này.

## 5. Tài liệu & changelog
Đã ghi `spec.md` §9. Các tài liệu trong `docs/` (SRS, API, pipeline, UI flow) và tên route, tên file trong code vẫn dùng chữ "Planner"; chưa đổi trong PR này.

## 6. Rủi ro / việc còn lại
- Đổi cách gọi trong `docs/` cho đồng bộ.
- Dòng changelog cũ trong `spec.md` §9 vẫn giữ tên cũ vì là lịch sử.
