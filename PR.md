# PR: Add lecturer document versions and approval history

> **Task:** D-02 · **Issue:** #85 · **Branch:** `feat/D-02-lecture-documents`
> **Người thực hiện:** Trần Nhật Minh (`@Minh`) · **Hỗ trợ:** —

## 1. Mục tiêu

Thêm ba bảng PostgreSQL thuần cho quy trình tài liệu giảng viên trong schema
`app`: tài liệu, snapshot phiên bản và lịch sử duyệt. Thiết kế dùng `app.users`
thay cho Supabase Auth/profiles của PR cũ.

## 2. Truy vết

| Thay đổi | Yêu cầu liên quan |
|---|---|
| `lecture_documents`, versions, reviews | D-02 / #85; thiết kế nền từ PR #69 |
| Sơ đồ quan hệ và FK tới `app.users` | D-02 / D-01 |

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `codebase/database/migrations/20260918_lecture_documents_review.sql` | Tạo bảng tài liệu, phiên bản, lịch sử duyệt; index, CHECK, FK và quyền role backend. |
| `docs/diagrams/database-class-diagram.mmd` | Bổ sung quan hệ tài liệu–phiên bản–duyệt và `AppUser`. |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Cập nhật trạng thái D-02. |
| `PR.md` | Ghi kiểm thử thật của PR này. |

## 4. Kiểm thử

- Migration chạy thành công trên Supabase: `20260918_lecture_documents_review.sql`.
- Chạy lại lần hai thành công (idempotent).
- Kiểm tra schema: đủ 3 bảng; tổng `41` constraint (FK/CHECK/UNIQUE).
- Kết nối bằng role `aiia_backend`: đọc thành công cả ba bảng; dữ liệu ban đầu
  `documents=0`, `versions=0`, `reviews=0`.
- Không ghi connection string hoặc secret vào repository/log.

## 5. Tài liệu & changelog

- Cập nhật `docs/diagrams/database-class-diagram.mmd` theo đúng migration.

## 6. Rủi ro / việc còn lại

- API tạo phiên bản, gửi duyệt và duyệt tài liệu thuộc các task backend tiếp theo.
- Cần @Khoa review schema trước khi merge.

Closes #85
