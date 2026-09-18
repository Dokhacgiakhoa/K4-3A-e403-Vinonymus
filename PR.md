# PR: Seed catalog chuyên đề và bài học (D-05)

> **Task:** D-05 · **Issue:** #88 · **Branch:** `feat/D-05-curriculum-seed`

## Tóm tắt

Thêm seed chuẩn cho 3 lab đang có trong `planner-catalog.ts`: Prompt & Tool
Calling, AI Product Specification và RAG Foundations. Seed dùng UUID/slug ổn
định, cập nhật khi conflict và không tạo bản ghi trùng khi chạy lại.

Ba file seed cũ đã được rà soát; chúng là các bộ curriculum lịch sử khác nhau,
không dùng chung với catalog hiện tại. `03_catalog_curriculum_seed.sql` là nguồn
canonical duy nhất cho môi trường mới.

## File thay đổi

- `codebase/database/seeds/03_catalog_curriculum_seed.sql`: 3 chuyên đề + 3 bài học, idempotent.
- `codebase/database/seeds/README.md`: hướng dẫn chọn seed canonical và ghi chú 3 seed legacy.
- `docs/hackathon/tasks-he-thong-4-vai-tro.md`: đánh dấu D-05 hoàn thành.

## Kiểm tra thật

Đã kết nối Supabase bằng role backend `aiia_backend` trong một transaction thử
nghiệm. Xoá tạm đúng 3 slug D-05, chạy seed trên trạng thái trống rồi chạy lần
hai; transaction được rollback sau khi assert:

```text
first:  modules=3, topics=3
second: modules=3, topics=3
idempotent=true
```

Không có secret hoặc dữ liệu kiểm thử được ghi vào repository.

Sau đó đã chạy seed thật bằng role `aiia_backend` (không rollback) để nạp dữ
liệu mẫu cho backend; chạy lại lần nữa vẫn cho `modules=3, topics=3`.

## Issue liên quan

Closes #88
