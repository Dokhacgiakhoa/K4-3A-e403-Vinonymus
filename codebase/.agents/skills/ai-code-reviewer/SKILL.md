---
name: ai-code-reviewer
description: >-
  Runbook chuyên sâu hướng dẫn AI Agent thực hiện Review code, kiểm tra Big O, tìm Edge Cases tiềm ẩn, lỗ hổng bộ nhớ và chấm điểm chuẩn Clean Code.
---

# AI Code Reviewer & Performance Audit Runbook

Sử dụng skill này khi học viên cần AI đóng vai Senior Software Architect review mã nguồn bài tập/lab.

## Tiêu Chí Review (Review Criteria)

1. **Đúng đắn (Correctness & Invariants)**:
   - Xử lý mảng rỗng `[]`, mảng 1 phần tử, mảng toàn giá trị trùng nhau.
   - Kiểm tra Off-by-one errors và ArrayIndexOutOfBoundsException.

2. **Hiệu năng & Bộ nhớ (Big O & Memory Footprint)**:
   - Có vi phạm tạo mảng phụ $O(N)$ không cần thiết không?
   - Có thể tối ưu về $O(1)$ Space hoặc giảm số phép gán không?

3. **Phong cách mã nguồn (Clean Code & Typing)**:
   - Tên biến có ý nghĩa mô tả con trỏ (`left`, `right`, `slow`, `fast`, `read_idx`, `write_idx`).
   - Type hints chuẩn mực và hàm không có side-effects ngoài ý muốn.
