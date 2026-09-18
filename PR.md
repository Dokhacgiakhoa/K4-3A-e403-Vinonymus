# PR: Cập nhật sơ đồ database theo migration (D-06)

> **Task:** D-06 · **Issue:** #89 · **Branch:** `feat/D-06-database-diagram`

## Tóm tắt

Cập nhật `docs/diagrams/database-class-diagram.mmd` để phản ánh đúng schema
`app` hiện tại. Sơ đồ gồm toàn bộ bảng từ D-01 đến D-04, các cột chính, khóa
chính/duy nhất, quan hệ khóa ngoại và vector `embedding(768)` của D-03.

## Kiểm tra thật

- Đối chiếu trực tiếp với Supabase `information_schema`: đủ **16/16 bảng**,
  không có bảng thừa hoặc thiếu.
- Xác nhận database có **17 khóa ngoại**; các quan hệ FK tương ứng đã được thể
  hiện trong sơ đồ.
- Kiểm tra cú pháp Mermaid cơ bản: **16 class**, tên class duy nhất, dấu `{}` cân
  bằng (`16/16`), `git diff --check` không có lỗi trong các file D-06.

Không thay đổi dữ liệu hoặc migration; chỉ cập nhật tài liệu sơ đồ và trạng thái
task.

## Issue liên quan

Closes #89
