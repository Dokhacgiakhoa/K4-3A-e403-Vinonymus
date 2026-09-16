# 01 — Đặc tả yêu cầu phần mềm (SRS) · AI Diagnostic Study Planner

> **Phạm vi:** chỉ lát cắt dự thi (xem [`spec.md`](../spec.md) §4). Các tính năng khác của codebase (Chat K.AI, tài khoản, gói Pro, backend .NET) nằm ngoài tài liệu này.
> **Trạng thái:** bản nháp v0.1 · 16/9 · chốt cùng `spec.md` tại CP4 (21:00 · 17/9).

Quy ước: **FR** = yêu cầu chức năng · **NFR** = phi chức năng · **P0** = bắt buộc cho demo · **P1** = nên có · **AC** = tiêu chí nghiệm thu.

---

## 1. Bối cảnh

| Mục | Nội dung |
|---|---|
| Người dùng | Học viên Khoá 4 AI20K đang tự học trước buổi lab/workshop tiếp theo |
| Việc cần làm | Biết hôm nay cần học/làm gì với quỹ thời gian rảnh để kịp hạn bài lab |
| Quyết định AI duy nhất | Từ nền tảng + quỹ thời gian + bài lab → **chọn và sắp thứ tự tối đa 3 tài liệu trong catalog**, kèm lý do; hoặc hỏi lại; hoặc từ chối |
| Kết quả | Checklist ≤3 việc có link, học viên chỉnh được trước khi làm |
| Mức tự động hoá | Conditional (xem `spec.md` §4) |

## 2. Thuật ngữ

| Thuật ngữ | Nghĩa |
|---|---|
| **Catalog** | Danh sách tài liệu cho từng bài lab do nhóm tự soạn tại `codebase/data/catalog/` — nguồn sự thật duy nhất cho link |
| **Plan** | Kết quả hợp lệ: 1–3 việc, mỗi việc trỏ đúng một `item_id` trong catalog |
| **Clarify** | Hệ thống hỏi lại một câu thay vì đoán |
| **Baseline** | Luật if/else cũ trong `roadmap-ai-engine.ts`, dùng để so sánh trước/sau và làm phương án dự phòng |

---

## 3. Yêu cầu chức năng

### FR-P01 — Nhập thông tin chẩn đoán `P0`
**AC:**
1. Học viên chọn **nền tảng**: `tech` hoặc `non_tech`.
2. Học viên nhập **quỹ thời gian hôm nay** (phút, số nguyên 0–600).
3. Học viên chọn **bài lab tiếp theo** từ danh sách lấy trong catalog.
4. Ô **ghi chú tự do** tuỳ chọn, tối đa 500 ký tự.
5. Không hỏi họ tên, email, mã học viên.

### FR-P02 — Kiểm tra đầu vào phía server `P0`
**AC:**
1. Mọi trường được kiểm bằng schema zod trước khi gọi LLM.
2. Sai kiểu / ngoài khoảng → HTTP 400, thông báo tiếng Việt chỉ rõ trường sai.
3. `lab_id` không có trong catalog → trả `clarify`, không gọi LLM.

### FR-P03 — Sinh kế hoạch bằng AI `P0`
**AC:**
1. Gọi LLM thật qua `lib/llm/router.ts`, dùng key người dùng gửi trong header.
2. Kết quả có **1–3 việc**, mỗi việc gồm: `item_id`, `reason` (≤160 ký tự), `minutes`.
3. Kèm **chẩn đoán**: nền tảng, mức tự tin (`high` / `low`) và một câu giải thích.
4. Tổng `minutes` ≤ quỹ thời gian học viên nhập.

### FR-P04 — Chỉ dùng tài liệu có trong catalog `P0`
**AC:**
1. Server loại mọi `item_id` không tồn tại trong catalog của bài lab đã chọn.
2. Link hiển thị luôn lấy từ catalog, **không bao giờ lấy từ chữ LLM sinh ra**.
3. Sau khi lọc còn 0 việc hợp lệ → dùng baseline (FR-P09) và báo rõ cho học viên.

### FR-P05 — Hỏi lại khi thiếu thông tin `P0`
**AC:** trả `clarify` kèm đúng một câu hỏi khi:
1. Quỹ thời gian < 30 phút.
2. Ghi chú mâu thuẫn với nền tảng đã chọn (LLM đánh `confidence = low`).
3. Bài lab không có trong catalog.

### FR-P06 — Từ chối yêu cầu ngoài phạm vi `P0`
**AC:**
1. Ghi chú đòi làm bài hộ, xin đáp án, hỏi điểm số, xin gia hạn deadline → trả `refuse`.
2. Câu từ chối vẫn hữu ích: trỏ học viên tới kênh chính thức (TA/Lab Coach) và vẫn đề xuất việc học nếu đủ thông tin.
3. Nội dung ghi chú được coi là **dữ liệu**, không phải lệnh (chống prompt injection).

### FR-P07 — Học viên chỉnh checklist `P0`
**AC:** tick hoàn thành, bỏ việc, đổi thứ tự. Thay đổi lưu ở trình duyệt, không gửi lên server.

### FR-P08 — Giải thích từng việc `P0`
**AC:** mỗi việc hiển thị lý do, thời lượng ước tính, loại tài liệu (slide / video / notebook / doc).

### FR-P09 — Phương án dự phòng `P1`
**AC:** không có key, LLM lỗi, hoặc kết quả không hợp lệ → dùng baseline, gắn nhãn "Gợi ý mặc định, chưa cá nhân hoá".

### FR-P10 — Ghi log phục vụ eval `P1`
**AC:** chỉ ghi: đầu vào đã chuẩn hoá (không ghi chú tự do), trạng thái trả về, `item_id` đã chọn, độ trễ, provider. Không ghi key, không ghi thông tin định danh.

---

## 4. Yêu cầu phi chức năng

| Mã | Yêu cầu | Đo bằng |
|---|---|---|
| NFR-01 | **Không bịa link:** 100% link hiển thị có trong catalog | Chạy golden set, đếm link ngoài catalog = 0 |
| NFR-02 | Độ trễ tạo kế hoạch P95 ≤ 10 giây | Log `latency_ms` |
| NFR-03 | Không lưu/log API key ở server | Review code + grep header key |
| NFR-04 | Giao diện và thông báo lỗi bằng tiếng Việt | Review UI |
| NFR-05 | Chạy được khi không có Supabase và backend .NET | Chạy local với `.env.local` trống |
| NFR-06 | Chi phí mỗi lần tạo kế hoạch ≤ 1 lời gọi LLM | Đếm lời gọi trong log |
| NFR-07 | Dùng được ở màn hình điện thoại (≥360px) | Kiểm tra thủ công |

## 5. Ngoài phạm vi

Xem `spec.md` §4 Non-goals: không tài khoản/thanh toán/chứng chỉ, không nộp bài hộ, không thay thế VLearn Tutor, không lưu lịch sử nhiều buổi.

## 6. Truy vết

| Yêu cầu | `spec.md` | Kiểm thử |
|---|---|---|
| FR-P03, FR-P08 | §4 lát cắt, §4b Explainability | `eval/` — nhóm case happy path |
| FR-P04, NFR-01 | §5 lớp ① nguồn sự thật | `eval/` — case bẫy link |
| FR-P05 | §5 lớp ② mơ hồ, §6 low-confidence | `eval/` — case thiếu thông tin |
| FR-P06 | §5 lớp ③ ngoài phạm vi | `eval/` — case làm hộ / injection |
| FR-P07 | §4b Human-in-control, §6 correction | Validation R6 |

## 7. Câu hỏi mở `[TODO]`

1. Quality bar cụ thể (% qua golden set) — nhóm chốt tại CP4.
2. Catalog phủ bao nhiêu bài lab cho demo — đề xuất 2–3 bài.
3. Ngưỡng 30 phút ở FR-P05 có hợp lý không — kiểm lại khi có khảo sát.
