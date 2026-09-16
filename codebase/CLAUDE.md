# CLAUDE.md — Quy ước cho Claude Code

Đọc file này và `AGENTS.md` trước khi làm việc với dự án AIIA Notebook.

## Quy tắc quan trọng:
1. **Chỉ chạy `npm run sync` hoặc deploy khi người dùng yêu cầu trực tiếp.** Nếu người dùng không nói/không yêu cầu sync hoặc deploy, chỉ thực hiện cập nhật/chỉnh sửa và kiểm tra ở môi trường local để người dùng tự test chức năng.
2. **Không tự ý lưu/log API Key người dùng.**
3. **Tuân thủ quy trình bàn giao & review** quy định trong `AGENTS.md` và `docs/09-QUY-TRINH-PHOI-HOP.md`.
4. **Tuân thủ Kiến trúc Dữ liệu 3 Phần (3-Part Data Architecture)** — chi tiết đầy đủ ở `AGENTS.md` mục 4, tóm tắt:
   - **Phần 1**: Thân bài file `.md` (Notebook hiển thị + RAG). Ngắn gọn, cô đọng. **TUYỆT ĐỐI không chèn `![ảnh]` hay heading "Hình ảnh chứng minh" vào đây** — pipeline Chat không đọc phần này để lấy bằng chứng.
   - **Phần 2**: Cũng chính là thân bài trên, dùng cho AI Chat truy vấn & trả lời đúng trọng tâm.
   - **Phần 3**: Khai báo DUY NHẤT trong `media_links` (frontmatter YAML). `type: link` hiển thị khi AI trả lời trong Chat; `type: image` KHÔNG BAO GIỜ hiển thị cho người dùng (chỉ là dữ liệu xác minh nội bộ, vì hệ thống chưa có OCR). Trước khi gắn ảnh phải tự mở ra xem đúng nội dung khớp FAQ, không suy đoán theo tên file.
5. **Trước khi thêm/sửa FAQ: kiểm tra trùng lặp.** `npm run audit` (nằm trong `npm run verify`, chạy tự động ở pre-push hook) chặn FAQ trùng nội dung hoặc trùng dữ kiện tham chiếu (SĐT/email lặp ở ≥2 file) — báo LỖI NẶNG thì phải sửa, không được bỏ qua.
6. **Mọi thay đổi lược đồ/hàm SQL phải kèm file trong `supabase/migrations/`** — không áp thẳng lên DB rồi thôi (`AGENTS.md` bất biến #13b).
7. **LLM được diễn đạt lại câu trả lời FAQ cho tự nhiên nhưng không được đổi/bịa dữ kiện** (`AGENTS.md` bất biến #9) — số liệu, mốc thời gian, link phải giữ nguyên như thân bài `.md`.

## Kiến trúc hiện tại (đọc chi tiết trước khi sửa code chat)
Pipeline chat có **5 tầng** — nguồn sự thật duy nhất ở [`docs/06-AI-PIPELINE.md`](./docs/06-AI-PIPELINE.md) mục 1. Đừng chép mô tả pipeline sang file khác, chép ra nhiều nơi là chắc chắn lệch lại.
