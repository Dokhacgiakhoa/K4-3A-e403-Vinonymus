# 00 — Tổng quan dự án

> **Đã cập nhật (04/08/2026):** dự án chuyển sang mô hình **không tài khoản**. Không có đăng nhập, không có trang admin web. Nội dung quản lý qua Git, người dùng tự mang API key riêng để hỏi đáp. Xem lý do đầy đủ ở `02-KIEN-TRUC.md` ADR-8, ADR-9.

---

## 1. Bối cảnh

Khóa học **AI in Action (AIIA)** của VinUni sinh ra rất nhiều thông tin rời rạc: lịch học, deadline bài tập, tiêu chí chấm điểm, tài liệu tham khảo, thông báo trên nhiều kênh khác nhau. Hậu quả:

- Sinh viên hỏi đi hỏi lại cùng một câu.
- Thông tin nằm trong ảnh chụp slide, ảnh chụp bảng lịch — không tìm kiếm được bằng Ctrl+F.
- Không có một "nguồn sự thật duy nhất" để tra cứu.

## 2. Giải pháp

Một **web app dạng chat**, đóng vai trò trợ lý tra cứu — kiêm luôn **sổ tay hướng dẫn (guide book)** cho học viên mới làm quen với AI:

- Nội dung khóa học được soạn thành file markdown trong repo (`data/`), công khai, ai xem trực tiếp trên GitHub cũng được.
- Người dùng hỏi bằng ngôn ngữ tự nhiên, nhận câu trả lời **kèm trích dẫn nguồn**.
- Câu hỏi phổ biến đã soạn sẵn FAQ → trả lời **tức thì, không cần API key**.
- Câu hỏi cần AI suy luận → người dùng **tự nhập API key miễn phí của chính mình** để hệ thống truy xuất + tổng hợp câu trả lời.

**Đây là điểm khác biệt cốt lõi so với một chatbot tra cứu thông thường:** việc yêu cầu người dùng tự lấy API key **không phải là rào cản, mà là một phần trải nghiệm học tập** — đây là web dành cho người đang học về AI, biết cách lấy và dùng một API key miễn phí là kỹ năng cơ bản đầu tiên nên có.

## 3. Mục tiêu

| # | Mục tiêu | Đo bằng |
|---|---|---|
| G1 | Giảm số câu hỏi lặp lại | ≥ 60% câu hỏi được hệ thống trả lời trọn vẹn |
| G2 | Trả lời nhanh | FAQ < 500ms; RAG hiển thị token đầu tiên < 3s (sau khi có key) |
| G3 | Trả lời đúng, không bịa | 100% câu trả lời RAG có trích dẫn nguồn; nói "không biết" khi không đủ dữ liệu |
| G4 | Cập nhật nội dung dễ, nhanh | Từ lúc sửa file đến lúc AI dùng được nội dung mới: dưới 5 phút (một lần chạy GitHub Action) |
| G5 | Chi phí vận hành bằng 0 | Không dịch vụ nào vượt free tier |
| G6 | Không có "hết quota chung" | Vì không có quota chung — mỗi người dùng ngân sách miễn phí của riêng họ |

### Không phải mục tiêu (out of scope — phiên bản 1)
- Không có tài khoản, không đăng nhập, không phân quyền người dùng.
- Không có trang quản trị web — quản lý nội dung hoàn toàn qua Git.
- Không đồng bộ lịch sử hội thoại nhiều thiết bị.
- Không tích hợp LMS / Google Classroom / email tự động.
- Không có app mobile native.
- Không hỗ trợ voice input/output.

## 4. Người dùng (personas)

Vì không còn tài khoản, không còn phân biệt Guest/Student/Editor/Owner như thiết kế ban đầu. Chỉ còn hai vai:

### P1 — Người dùng (bất kỳ ai vào web)
> *"Deadline bài tập nhóm là hôm nào nhỉ?"*

- Không đăng nhập, không cần biết Git.
- Hỏi câu FAQ → trả lời ngay, không cần làm gì thêm.
- Hỏi câu cần AI suy luận → được nhắc: *"Nhập API key miễn phí ở Cài đặt để tiếp tục."* Có link hướng dẫn lấy key.
- Lịch sử hội thoại lưu trên trình duyệt của họ, mất nếu xoá cache/đổi máy — đã báo trước, chấp nhận được.

### P2 — Người duy trì nội dung (bạn)
> *"Vừa có thông báo đổi lịch, tôi cần cập nhật ngay."*

- Là người có kỹ thuật, thao tác trực tiếp qua Git — không cần một giao diện web riêng.
- Luồng làm việc: sửa/thêm file `.md` trong `data/` → `git commit` → `git push` → GitHub Action tự đồng bộ vào database.
- Ảnh chụp thông báo → chạy script OCR cục bộ (`npm run ocr <ảnh>`), tự xem và sửa kết quả, rồi mới commit file markdown cuối cùng — **bước duyệt vẫn bắt buộc**, chỉ khác là diễn ra trên máy bạn thay vì trên một trang web.

## 5. Kịch bản sử dụng tiêu biểu

> Pipeline thật có **5 tầng** — mô tả đầy đủ ở `06-AI-PIPELINE.md` mục 1. Các kịch bản dưới đây chỉ minh hoạ, đừng coi là đặc tả.

### S1 — Hỏi trúng FAQ (tầng 1, không cần key để tìm)
1. Người dùng gõ: *"deadline assignment 2 là khi nào"*.
2. Trúng FAQ ngay ở tầng khớp chuỗi/trigram — **bước tìm kiếm không cần API key, không gọi LLM**.
3. Nếu có key, LLM diễn đạt lại câu trả lời cho tự nhiên (giữ nguyên mọi số liệu/mốc thời gian) và stream từng đoạn. Không có key thì trả thẳng nội dung `.md`.

### S2 — Hỏi cần suy luận, đã có key (tầng 2–3)
1. Người dùng đã nhập key Gemini ở Cài đặt từ trước.
2. Gõ câu hỏi phức tạp, không trúng FAQ.
3. Hệ thống dùng chính key đó để tạo embedding, tìm FAQ gần đúng rồi nhờ LLM xác minh; nếu vẫn không khớp thì truy xuất tài liệu trong `data/documents/` và sinh câu trả lời kèm trích dẫn đánh số — stream từng đoạn.

### S3 — Hỏi cần suy luận, chưa có key
1. Người dùng mới, chưa nhập key.
2. Câu hỏi trượt tầng 1 (FAQ khớp chuỗi/trigram).
3. Hệ thống gửi sự kiện `need_key` → hiện lời nhắc + nút tới trang Cài đặt + link hướng dẫn lấy key Gemini miễn phí trong ~2 phút. **Không tính là lỗi.**
4. Người dùng lấy key, quay lại, hỏi tiếp — key nhớ trong `localStorage`, không phải nhập lại mỗi lần.

### S4 — Hỏi ngoài phạm vi (tầng 4)
1. Người dùng gõ câu không liên quan tới khóa học.
2. Truy xuất qua cả FAQ lẫn tài liệu đều không ra kết quả đủ liên quan.
3. LLM **tự viết** câu trả lời thừa nhận chưa có thông tin và mời hỏi Ban Tổ chức ở nhóm cộng đồng — không dùng câu mẫu cố định (xem `06-AI-PIPELINE.md` mục 3b).
4. Câu hỏi ghi vào `unanswered_questions` để bạn xem và cân nhắc bổ sung FAQ.

### S4b — Chỉ là trò chuyện (tầng 0)
1. Người dùng gõ *"cậu là AI à"*, *"chào bạn"*, *"cảm ơn nhé"*, hoặc bất kỳ câu giao tiếp nào.
2. Hệ thống nhận ra đây không phải câu hỏi tra cứu → không chạy tìm kiếm, LLM đáp lại tự nhiên theo ngữ cảnh hội thoại.
3. **Không gắn nhãn nguồn, không hiện gợi ý FAQ** — đọc như một tin nhắn bình thường.

### S5 — Bạn cập nhật nội dung từ ảnh chụp
1. Chụp màn hình bảng lịch học.
2. Chạy `npm run ocr -- lich-hoc.png` — script gọi AI đọc ảnh, in ra markdown.
3. Bạn xem, sửa vài chỗ đọc sai, lưu vào `data/documents/lich-hoc/tuan-5.md`.
4. `git add . && git commit -m "cap nhat lich tuan 5" && git push`.
5. GitHub Action tự chạy, vài phút sau người dùng hỏi được ngay — **không cần deploy lại app**.

## 6. Tiêu chí thành công

| Chỉ số | Ngưỡng đạt |
|---|---|
| Tỉ lệ câu hỏi đi qua đường FAQ (không cần key) | ≥ 30% |
| Tỉ lệ người dùng bỏ đi ngay khi thấy lời nhắc nhập key | Đo bằng SQL trên `query_logs` (`path='need_key'`, gom theo `client_session_id`) — truy vấn sẵn ở `05-FEATURES.md` F14 |
| Tỉ lệ đánh giá 👍 | ≥ 80% — đo bằng SQL trên `query_feedback`, truy vấn sẵn ở `05-FEATURES.md` F14 |
| Độ trễ P95 đường FAQ | ≤ 500ms |
| Thời gian từ commit tới nội dung dùng được | ≤ 5 phút |
| Chi phí hạ tầng thực tế | 0 đồng |

## 7. Thuật ngữ

| Thuật ngữ | Nghĩa |
|---|---|
| **KB** | Kho tri thức — toàn bộ file trong `data/` |
| **Document / Chunk / Embedding / RAG** | Như thiết kế gốc — xem `06-AI-PIPELINE.md` |
| **Tầng 0 → 4** | 5 tầng của pipeline chat: trò chuyện → FAQ khớp chuỗi → FAQ vector + xác minh → RAG tài liệu → đối thoại/không tìm thấy. Xem `06-AI-PIPELINE.md` mục 1. *(Thay cho cách gọi cũ "Fast Path / Deep Path" — không còn đủ để mô tả)* |
| **BYOK** | Bring Your Own Key — giờ là **cơ chế duy nhất**, không phải tuỳ chọn |
| **Git-as-CMS** | Quản lý nội dung bằng cách sửa file + commit, thay cho trang admin web |
| **Sync pipeline** | `scripts/sync-content.ts` chạy bởi GitHub Action, đồng bộ `data/` vào Supabase |
| **client_session_id** | UUID ngẫu nhiên sinh trên trình duyệt, dùng chống spam đánh giá — không định danh ai |

## 8. Giả định và phụ thuộc

**Giả định:**
- Quy mô ~200–500 người dùng.
- Kho tri thức < 5.000 chunk.
- Nội dung **hoàn toàn công khai** — không có thông tin cá nhân sinh viên, không có gì cần bảo mật. Đây là tiền đề cho phép bỏ hẳn hệ thống tài khoản; nếu giả định này thay đổi (ví dụ sau này cần lưu điểm số riêng từng sinh viên), phải quay lại thiết kế có auth.
- Người dùng chấp nhận việc lịch sử hội thoại không đồng bộ nhiều thiết bị.
- Bạn (người duy trì nội dung) quen thuộc với Git ở mức cơ bản (add, commit, push).

**Phụ thuộc bên ngoài:**
- Supabase (chỉ dùng Postgres) — vẫn có rủi ro pause sau 7 ngày, đã có cron chống.
- GitHub Actions — miễn phí cho repo public, chạy pipeline đồng bộ và cron keep-alive.
- Mỗi người dùng cần tự có key của ít nhất một nhà cung cấp LLM để dùng tính năng AI — đây không phải rủi ro của hệ thống nữa, mà là một bước onboarding.

---

**Tiếp theo:** [`01-SRS.md`](./01-SRS.md) — yêu cầu chi tiết (đã viết lại).
