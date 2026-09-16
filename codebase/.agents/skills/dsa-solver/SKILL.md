---
name: dsa-solver
description: >-
  Runbook chuyên sâu hướng dẫn AI Agent phân tích, giải thuật toán DSA, tối ưu Big O và mô phỏng ô nhớ RAM (In-place). Dùng khi học viên giải các bài tập leetcode hoặc lab DSA.
---

# DSA Solver & Optimization Runbook

Sử dụng skill này khi cần giải thích thuật toán, tìm cạm bẫy (Edge Cases), tối ưu bộ nhớ In-place, và viết mã nguồn chuẩn kỹ sư.

## Quy Trình 4 Bước Chuẩn (The 4-Step Standard)

1. **Hiểu Đề & Phân Tích Ô Nhớ (Memory Analysis)**:
   - Xác định rõ ràng: Input types, Output types, Edge cases (`null`, empty array, 1 element).
   - Vẽ sơ đồ chuyển dịch ô nhớ RAM (Memory State Diagram) trước và sau khi thao tác.

2. **Thiết Kế Thuật Toán Tối Ưu (Algorithm Design)**:
   - Ưu tiên giải pháp **In-place O(1) Space** nếu bài toán cho phép.
   - Xác định chính xác mô hình Two Pointers: *Opposite Direction* hay *Fast & Slow Pointers*.

3. **Mô Phỏng Từng Bước (Dry-run)**:
   - Lập bảng trace các biến chỉ số (`left`, `right`, `slow`, `fast`) qua từng vòng lặp.

4. **Sinh Mã Nguồn Chuẩn Kỹ Sư (Production-Ready Code)**:
   - Bắt buộc có Type Annotations đầy đủ (Python 3.12+ / Java 21+).
   - Comments giải thích lý do "Tại sao" chọn cách xử lý đó.
   - Bảng tổng kết Time Complexity & Space Complexity chuẩn xác.
