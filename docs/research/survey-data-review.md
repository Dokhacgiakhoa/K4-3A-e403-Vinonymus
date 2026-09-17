# Khảo sát Vinonymus — Làm sạch dữ liệu & phân tích kết quả

> ⚠️ **Bản cũ, không dùng làm số chính thức.** Số liệu dưới đây (n = 45) không khớp với sheet khi đối chiếu lúc 19:35 · 17/9. Số chính thức (n = 82) và cách làm sạch nằm ở `spec.md` §1.

> Nguồn: Google Sheet "Khảo sát Hackathon Vinonymus" (tab `Trang tính1`), xuất lúc 17/9/2026.
> File này **không chứa** email, số điện thoại/MoMo, Discord/Zalo hay tên thật — chỉ số liệu tổng hợp, theo đúng bất biến #1 của `AGENTS.md` (không đưa câu trả lời khảo sát gốc/PII vào tài liệu chia sẻ).

## 1. Làm sạch dữ liệu

Sheet gốc có **55 dòng**. Sau khi rà soát:

### 1.1 Loại bỏ 8 dòng test/dev (không phải người dùng thật)

| Mã | Tên hiển thị | Lý do loại |
|---|---|---|
| VIN-4606 | Đỗ Khắc Gia Khoa | Mã test tự đặt (`VIN-` prefix), không phải mã học viên thật |
| VIN-8702 | Đỗ Khắc Gia Khoa | Như trên |
| VIN-3709 | Đỗ Khắc Gia Khoa | Như trên |
| TEST001 | Nguyen Test | Tên/mã ghi rõ là test |
| TEST-DEBUG | Test Agent | Dòng debug kỹ thuật |
| VIN-MKT-01 | Đỗ Khắc Gia Khoa (Test) | Ghi rõ "(Test)" |
| VIN-EDU-02 | Đỗ Khắc Gia Khoa (Test) | Ghi rõ "(Test)" |
| TEST-EMAILSYNC-0917 | Claude Test Email Sync | Dòng test đồng bộ email xác nhận (17/9) |

### 1.2 Gộp 2 dòng trùng mã học viên

Mã `2733` (Đỗ Khắc Gia Khoa) xuất hiện **3 lần** — do nộp lại nhiều lần trong lúc thử nghiệm form. Giữ lại đúng 1 bản (bản nộp gần nhất), loại 2 bản trùng.

### 1.3 Chuẩn hoá nhãn câu trả lời bị lệch giữa các đợt

Một số câu hỏi có 2 cách ghi khác nhau cho cùng 1 lựa chọn (do label trong form từng được sửa chữ giữa các lượt nộp) — đã gộp về 1 nhãn duy nhất trước khi tính %:

- Câu 1: "...hoặc **fail testcase** mới biết..." → gộp vào "...hoặc **testcase fail** mới biết..."
- Câu 3: "Từ 15 đến 30 phút" → gộp vào "15 – 30 phút"

### 1.4 Kết quả làm sạch

**55 dòng gốc → loại 8 test → gộp 2 trùng lặp → còn 45 phản hồi thật, không trùng lặp** dùng để phân tích dưới đây.

---

## 2. Tổng quan mẫu (n = 45)

| Nền tảng | Số người | % |
|---|---:|---:|
| Dân Công nghệ thông tin (đã biết lập trình) | 29 | 64% |
| Đang theo chuyên sâu Data / AI | 15 | 33% |
| Người học trái ngành (chưa từng học code/AI) | 1 | 2% |

Mẫu nghiêng nhiều về nhóm đã có nền tảng kỹ thuật — cần lưu ý khi diễn giải: nhóm non-tech chỉ có 1 người, chưa đủ đại diện cho toàn bộ học viên trái ngành của khoá.

---

## 3. Phần 1 — Nỗi đau thực tế khi tự học & làm bài lab (Câu 1–4)

**Câu 1 — Tự nhận biết lỗ hổng kiến thức:**

| Trả lời | Số người | % |
|---|---:|---:|
| Hoàn toàn không biết — chỉ khi vào lớp làm bài lỗi/fail testcase mới biết | 16 | 36% |
| Biết là chưa hiểu, nhưng không biết đọc phần nào để bù | 22 | 49% |
| Tự biết rõ mình thiếu gì, tự tìm tài liệu bù đắp được | 6 | 13% |
| Chỉ nhận ra khi bài lab fail hoặc giảng viên chỉ ra | 1 | 2% |

→ **85% học viên** (16+22/45) **không tự xác định được lỗ hổng kiến thức của mình** trước khi vào lớp — đúng đúng vào bài toán "chẩn đoán" mà AI Mentor giải quyết.

**Câu 2 — Khó khăn đã/đang gặp phải (chọn nhiều ý):**

| Khó khăn | Số người chọn | % trên 45 |
|---|---:|---:|
| Tài liệu rải rác nhiều nơi (Discord/VLearn/GitHub/Drive) | 41 | 91% |
| Slide quá dài, không rõ trọng tâm | 41 | 91% |
| Thời gian rảnh quá ít (<1 tiếng) | 22 | 49% |
| Hỏi AI Tutor VLearn nhưng câu trả lời chung chung | 16 | 36% |
| Làm bài cập rập, sát hạn mới nộp | 8 | 18% |
| Không có bài test ngắn để tự kiểm tra | 8 | 18% |

→ Hai nỗi đau lớn nhất **(91% mỗi loại)**: tài liệu phân tán và slide quá dài/không rõ trọng tâm — khớp với evidence mining ở `spec.md` §1.

**Câu 3 — Thời gian mất để gom tài liệu mỗi buổi:**

| Thời gian | Số người | % |
|---|---:|---:|
| Dưới 15 phút | 3 | 7% |
| 15 – 30 phút | 33 | 73% |
| 30 – 45 phút | 4 | 9% |
| Trên 45 phút | 5 | 11% |

→ **93% mất từ 15 phút trở lên** chỉ để gom tài liệu — đây là quỹ thời gian AI Mentor có thể tiết kiệm trực tiếp.

**Câu 4 — Cách xử lý khi kẹt bài (chọn nhiều ý):**

| Cách xử lý | Số người | % |
|---|---:|---:|
| Dùng AI bên ngoài (ChatGPT/Claude/Gemini...) | 44 | 98% |
| Hỏi bạn bè/đồng đội | 15 | 33% |
| Tự search Google/StackOverflow | 13 | 29% |
| Hỏi AI Tutor VLearn | 6 | 13% |
| Đợi lên lớp hỏi Mentor/Trợ giảng | 4 | 9% |

→ **98% đã quen dùng AI ngoài** để tự gỡ kẹt — cho thấy rào cản chấp nhận AI Mentor rất thấp, vấn đề là AI ngoài không biết ngữ cảnh bài lab.

---

## 4. Phần 2 — Tính khả thi của AI Mentor & AI Helpdesk (Câu 5–8)

| Câu hỏi | Rất tích cực | Cần xem thử | Không cần/Từ chối |
|---|---:|---:|---:|
| C5. AI Mentor chẩn đoán + lọc 3 việc theo thời gian rảnh | 34 (76%) | 11 (24%) | 0 |
| C6. AI Mentor tự lên kế hoạch học thích ứng | 34 (76%) | 11 (24%) | 0 |
| C7. AI Mentor chỉ đích danh bài học bù lỗ hổng | 39 (87%) | 5 (11%) | 1 (2%) |

→ Không có ai chọn "không cần thiết" ở Câu 5/6, và chỉ 1 người ở Câu 7 — tín hiệu tích cực rất mạnh cho hướng giải pháp đã chọn ở `spec.md` §2.

**Câu 8 — Tính năng muốn dùng mỗi ngày nhất (chọn nhiều ý):**

| Tính năng | Số người | % |
|---|---:|---:|
| AI Mentor: Bài test chẩn đoán ngắn | 41 | 91% |
| AI Mentor: Checklist 3 việc trọng tâm kèm thời gian | 41 | 91% |
| AI Helpdesk 24/7: hỏi đáp quy chế, gỡ kẹt tức thì | 10 | 22% |
| AI Mentor: gom sẵn link catalog | 7 | 16% |
| Cảnh báo trễ hạn + lộ trình SFIA | 5 | 11% |

→ Hai tính năng cốt lõi của lát cắt dự thi (chẩn đoán + checklist) đúng là 2 tính năng được muốn nhất — validate đúng phạm vi đã chọn, không lệch sang các tính năng phụ.

---

## 5. Phần 3 — Đánh giá giao diện & trải nghiệm (Câu 9–11)

- **Điểm ý tưởng trung bình: 4,80 / 5** (37 chọn 5 sao, 7 chọn 4 sao, 1 chọn 3 sao — không ai chọn dưới 3 sao).
- **Độ trực quan UI:** 30/45 (67%) "đẹp và rất dễ dùng"; 13/45 (29%) "tạm ổn, cần tinh gọn"; 2/45 (4%) "khó dùng, rối mắt".
- **Điểm cần cải thiện (chọn nhiều ý):** 36/45 (80%) nói "đã ổn, không cần sửa nhiều"; còn lại rải đều ở bố cục (24%), font (18%), màu sắc (18%), light mode (18%).

→ Light mode là góp ý UI duy nhất có tỷ trọng đáng chú ý dù không nhiều (8/45) — có thể xem xét nếu còn thời gian, không phải ưu tiên bắt buộc.

---

## 6. Phần 4 — Đăng ký trải nghiệm sớm & góp ý (Câu 12)

- **84,4%** (38/45) sẵn sàng dùng thử bản demo tương tác ở đợt tới → nguồn ứng viên dồi dào cho R6 (validation ≥5 người ngoài nhóm, `spec.md` §8).
- 6/45 (13%) chưa chắc, 1/45 (2%) không có nhu cầu.
- 7 góp ý tự do (đã ẩn danh, không gắn tên): đa số tích cực về giải thưởng/giao diện; 1 góp ý kỹ thuật cụ thể là bổ sung light mode.

---

## 7. Khuyến nghị cho `spec.md`

1. Dùng số liệu Câu 1–3 (85% không tự chẩn đoán được lỗ hổng, 93% mất ≥15 phút gom tài liệu) làm evidence chuẩn A bổ sung — mẫu 45 người, đủ vượt ngưỡng ≥20 người ở §1, khác hẳn mẫu n=2 hiện có.
2. Câu 5–8 dùng làm bằng chứng validate hướng giải pháp đã chọn ở §2 (không có phản hồi phản đối tính năng cốt lõi).
3. 38 người sẵn sàng dùng thử ở Câu 12 là nguồn ứng viên rõ ràng cho R6 — nên liên hệ ngay, đừng chờ đến CP5.
