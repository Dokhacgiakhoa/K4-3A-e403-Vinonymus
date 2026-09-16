---
name: mock-test-validator
description: Thẩm định tự động các câu hỏi và bộ đề thi trắc nghiệm mô phỏng SFIA: đảm bảo tính độc lập học thuật 100%, tuân thủ NDA, đầy đủ giải thích gốc rễ.
---

# Mock Test Validator Skill

Sử dụng skill này khi cần thêm câu hỏi mới vào ngân hàng đề thi `mockTests` trong `src/data/sfia-community-data.ts`.

## Tiêu Chí Thẩm Định Bắt Buộc:

1. **Tuân Thủ Tuyệt Đối Cam Kết Bảo Mật (NDA Compliance)**:
   - Câu hỏi PHẢI ĐƯỢC TỔNG HỢP từ tài liệu mở quốc tế (Stanford CS224N, DeepLearning.AI, PyTorch, HuggingFace, SFIA Foundation).
   - KHÔNG ĐƯỢC trích xuất hoặc sao chép bất kỳ đề thi nội bộ nào từ các chương trình doanh nghiệp.
   - Ghi rõ nguồn học thuật trong trường `sources`.

2. **Cấu Trúc Câu Hỏi Chuẩn JSON**:
   ```typescript
   {
     id: string; // "Q1", "Q2"...
     questionText: string; // Nội dung câu hỏi rõ ràng
     bloomLevel: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
     codeBlock?: string; // Đoạn mã nguồn hoặc công thức nếu có
     options: Array<{ id: string; text: string }>; // Đủ 4 phương án A, B, C, D
     correctOption: string; // "A" | "B" | "C" | "D"
     explanation: string; // BẮT BUỘC: Giải thích chi tiết lý do tại sao đúng/sai
   }
   ```

3. **Chất Lượng Giải Thích Gốc Rễ (Root-Cause Explanation)**:
   - Lời giải thích phải nêu rõ nguyên lý toán học / cơ chế hệ điều hành / kiến trúc mạng.
   - Không được viết qua loa kiểu "A là đáp án đúng".
