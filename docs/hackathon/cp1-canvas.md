# Canvas CP1 — bản đã nộp (16/9)

**Hướng E · AI Diagnostic Study Planner** — cá nhân hoá kế hoạch tự học theo ngày cho học viên Khoá 4.

## 01 · Người dùng & Nỗi đau
- **Job:** Học viên Khoá 4 đang tự học trước mỗi bài lab/workshop, cần biết với quỹ thời gian rảnh và nền tảng (tech/non-tech) của mình thì hôm nay phải học cụ thể gì.
- **Pain:** Phải lục tài liệu phân mảnh trên 5 nền tảng (Discord, Zoom, Drive, VLearn, GitHub); đọc lan man slide dài mà không biết đâu là trọng tâm; đến sát hạn mới làm lab nên dễ nộp muộn.

## 02 · Bằng chứng ban đầu
Mining `discord-pack` và `vlearn-pack`. Phương pháp đếm: [`../research/evidence-mining.md`](../research/evidence-mining.md).
- **6.7%** (52/779 tin của người) hỏi xin lại slide, sổ tay, link buổi học — `M10991`, `M23639`.
- **8.8%** (1.189/13.494 lượt chat VLearn; riêng K4 182/3.097 = 5.9%) xin tóm tắt/trọng tâm — `T10312`. AI Tutor chỉ **0.13%** lượt tự gợi ý bước học tiếp theo (`suggest_next_topic` 18/13.494).
- Bản tin 14/09: một học viên hỏi xin gia hạn vì nộp muộn Lab2 1 phút; một học viên khác hỏi quy định xử lý nộp muộn sau 23h59.

## 03 · Lát cắt & Automation
- **Lát cắt:** Một học viên K4 cần lên kế hoạch tự học cho bài lab tiếp theo · được AI chẩn đoán nền tảng và quỹ thời gian · đề xuất đúng 3 đầu việc trọng tâm kèm link tài liệu · giúp hoàn thành bài đúng hạn.
- **Automation:** Conditional — tự sinh checklist khi đủ thông tin; hỏi lại khi thời gian < 30 phút; học viên toàn quyền tick chọn/đổi thứ tự.

## 04 · Người thử & Phân công
- **Willing user:** 2 học viên K4 ngoài nhóm (W1 — nền tảng tech, W2 — hướng AI). Tên đầy đủ đã khai trong form CP1, không ghi công khai ở repo.
- **Phân công:** Khoa — PM · Minh — BE · Đức — AI · Thành — FE (chi tiết ở `README.md`).

## Sau CP1 cần bổ sung
- Canvas chỉ có bằng chứng chuẩn B (mining). Hướng dẫn CP1 của lớp ([`huong-dan-cp1.md`](huong-dan-cp1.md)) nhấn mạnh khảo sát người thật → bổ sung ở [`../research/survey-log.md`](../research/survey-log.md).
