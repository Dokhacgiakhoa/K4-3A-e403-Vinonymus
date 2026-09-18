# PR: Add document chunks and pgvector retrieval

> **Task:** D-03 · **Issue:** #86 · **Branch:** `feat/D-03-document-chunks-vector`
> **Người thực hiện:** Trần Nhật Minh (`@Minh`) · **Hỗ trợ:** —

## 1. Mục tiêu

Lưu các đoạn văn bản của tài liệu giảng viên cùng embedding 768 chiều trong
schema `app`, phục vụ AI Mentor tìm kiếm ngữ nghĩa. Dùng HNSW với cosine
distance và RPC server-side giới hạn tối đa 50 kết quả.

## 2. Truy vết

| Thay đổi | Yêu cầu liên quan |
|---|---|
| `lecture_document_chunks` + pgvector | D-03 / #86; D-02 / #85 |
| 768 chiều, `gemini-embedding-001`, cosine | Quyết định embedding hiện có trong pipeline legacy; chờ A-04 ghi nhận chính thức |

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `codebase/database/migrations/20260918_document_chunks_vector.sql` | Thêm metadata indexing, bảng chunk, vector 768D, HNSW index và hàm tìm kiếm top-k. |
| `docs/diagrams/database-class-diagram.mmd` | Bổ sung `LectureDocumentChunk` và quan hệ với tài liệu. |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Cập nhật trạng thái D-03. |
| `PR.md` | Ghi kết quả truy vấn thật. |

## 4. Kiểm thử

- Migration chạy thành công 2 lần liên tiếp trên Supabase.
- Xác nhận bảng chunk và HNSW index tồn tại.
- Tạo 6 chunk mẫu với vector 768 chiều trong transaction kiểm thử.
- Role `aiia_backend` gọi `app.search_lecture_document_chunks` thành công.
- Truy vấn top-5 trả đúng 5 kết quả theo cosine similarity giảm dần:
  `1.0, 0.95, 0.85, 0.75, 0.65`.
- Dữ liệu mẫu đã được xoá sau kiểm thử; không ghi secret vào repository/log.

## 5. Tài liệu & changelog

- Sơ đồ database khớp migration mới.

## 6. Rủi ro / việc còn lại

- A-04 cần ghi quyết định 768 chiều vào `docs/04-ai-pipeline.md`; nếu đổi chiều
  sau đó phải tạo migration/index và embed lại toàn bộ dữ liệu.
- D-03 không thêm API upload hoặc pipeline embedding; phần đó thuộc B-08/A-05.

Closes #86
