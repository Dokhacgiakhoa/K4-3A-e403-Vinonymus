---
name: faq-curator
description: Quy trình chuẩn thêm, chỉnh sửa, kiểm tra trùng lặp và xác minh nội dung FAQ (ảnh/tin nhắn) cho AIIA Notebook.
---

# FAQ Curator — Quy trình Thêm & Sửa Nội Dung FAQ

Khi người dùng gửi ảnh chụp màn hình, tin nhắn, hoặc bất kỳ nội dung nào và bảo "lưu thành FAQ", làm đúng theo trình tự sau — không được bỏ bước nào.

## 1. Trình tự các bước

1. **Đọc kỹ nội dung nguồn trước khi viết**: Với ảnh chụp màn hình: chỉ trích xuất đúng những gì đọc được, không suy đoán hay bổ sung chi tiết không có trong ảnh. Nếu chữ mờ/không chắc đọc đúng, hỏi lại người dùng thay vì đoán.
2. **Kiểm tra trùng lặp TRƯỚC khi tạo file mới**: Đọc qua toàn bộ file `.md` trong cùng `category` dự kiến (và grep nhanh vài từ khóa chính của nội dung mới trên toàn bộ `data/faqs/`) để xem đã có FAQ nào nói về chủ đề này chưa. Nếu nội dung mới:
   - **Trùng hoàn toàn** một FAQ đã có → không tạo file mới, chỉ bổ sung/cập nhật FAQ đó (thêm chi tiết còn thiếu, sửa thông tin lỗi thời).
   - **Có phần trùng, phần mới** (vd cùng nói về số điện thoại/email liên hệ, địa điểm thi) → chỉ giữ phần thông tin mới ở FAQ mới, **không chép lại nguyên văn** phần đã có sẵn ở FAQ khác; nếu cần, thêm thông tin mới đó vào thẳng FAQ gốc thay vì tạo bản sao rải rác nhiều nơi.
   - **Chủ đề khác nhưng dễ gây nhầm lẫn cấu trúc** (vd cả hai đều liệt kê "4 Nhóm ...") → đặt `title`/heading rõ ràng để phân biệt mục đích hai FAQ (vd "nội dung được kiểm tra" khác với "nên ôn gì trước khi thi"), tránh người đọc tưởng nhầm là 2 bản của cùng 1 thông tin.
   - Chạy `npm run audit` (`scripts/audit-faqs.ts`) để đối chiếu câu hỏi/variants/nội dung.
   - **Thông tin liên hệ/địa điểm thi dùng chung** đã có nguồn chuẩn: `kenh-lien-he-va-ho-tro-tuyen-sinh.md` và `cau-truc-bai-thi-dgnl.md`. FAQ khác cần nhắc tới thì khai báo `related_questions` trong frontmatter trỏ sang câu hỏi của FAQ nguồn đó, không chép lại nội dung.
3. **Một FAQ = một file `.md` mới trong `data/faqs/`**, tên file `kebab-case` mô tả đúng chủ đề. Không nhét nhiều câu hỏi không liên quan vào chung 1 file.
4. **Frontmatter bắt buộc đủ các trường**:
   ```yaml
   ---
   question: "Câu hỏi chính, đầy đủ, đúng ngữ pháp"
   variants:
     - "vài cách diễn đạt khác, viết thường, bỏ dấu câu"
     - "không cần bỏ dấu tiếng Việt — giữ nguyên dấu"
   category: <1 trong 4 slug bên dưới>
   priority: <số nguyên, câu quan trọng/hay hỏi thì để cao hơn>
   is_active: true
   is_verified: <true nếu có ảnh/link bằng chứng, false nếu chưa>
   verification_source: <"Bài đăng Admin Lam Luu" hoặc "Kênh chính thức BTC">
   media_links:
     - type: link
       url: "https://facebook.com/..."
       title: "Mô tả ngắn nguồn link"
     - type: image
       url: /images/faqs/ten-anh-mo-ta-noi-dung.png
       caption: "Mô tả ngắn nội dung ảnh"
   ---
   ```
5. **Cấu trúc Dữ liệu 3 Phần (3-Part Data Architecture)**:
   - **Phần 1 (Notebook hiển thị + RAG)**: Toàn bộ phần thân bài (`content`) sau `---`. Ngắn gọn, khoa học, súc tích, dùng chung cho cả giao diện Notebook lẫn AI Chat. **TUYỆT ĐỐI KHÔNG được chèn `![alt](url)` (ảnh) hay thêm bất kỳ heading dạng "### Hình ảnh..." / "### Trích dẫn..." nào vào phần thân bài**.
   - **Phần 3 (Dữ liệu Ẩn - Media & Links)**: Khai báo DUY NHẤT trong mảng `media_links` ở frontmatter:
     - `type: link` → hiển thị cho người dùng dưới dạng trích dẫn `👉 [title](url)` khi AI trả lời trong Chat.
     - `type: image` → **KHÔNG BAO GIỜ hiển thị cho người dùng**, kể cả trong Chat lẫn Notebook. Ảnh chỉ là dữ liệu xác minh nội bộ, lưu tại `public/images/faqs/`.
     - Phải tự mở ảnh ra xem nội dung thật trước khi gắn vào `media_links`.
6. **`category` CHỈ được là một trong 4 giá trị**:

   | slug | Dùng cho |
   |---|---|
   | `thi-dgnl` | Mọi thứ về kỳ thi ĐGNL, hồ sơ, điều kiện đăng ký/dự thi. |
   | `chuong-trinh-hoc` | Nội dung học tập sau khi đã đỗ: lịch học, đề cương, bài tập, thực tập, đồ án. |
   | `tien-ich` | Ăn uống, sinh hoạt, gửi xe, phòng lab, trợ cấp sinh hoạt. |
   | `quy-dinh` | Nội quy: điểm danh, chuyển lớp/nhóm/khóa, các quy tắc bắt buộc tuân thủ. |

7. **Không tự viết lại/diễn giải câu trả lời**: Đúng nguyên văn thông tin nguồn, chỉ định dạng lại thành markdown cho dễ đọc.
8. **Chỉ chạy `npm run sync` khi người dùng yêu cầu trực tiếp**.
9. **Chạy `npm run verify`** trước khi coi là xong (đã gồm `npm run audit`).
10. **Chính xác về thuật ngữ**: Khoản 8.000.000 VNĐ CHỈ ĐƯỢC GỌI LÀ **Trợ cấp sinh hoạt** (hoặc **Khoản trợ cấp**), TUYỆT ĐỐI KHÔNG DÙNG TỪ "Học bổng".
