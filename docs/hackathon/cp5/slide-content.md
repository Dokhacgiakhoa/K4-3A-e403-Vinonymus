# Nội dung slide CP5 — Adaptive Learning System (Nhóm Vinonymus)

> Dùng để tạo slide 6 trang theo `02-guide.md` §5.1: **mỗi slide phải có ≥1 con số / quote có nguồn**.
> Giữ nguyên các con số và câu trích — đã đối chiếu với `spec.md` §1, §2, §7 và `eval/run_results.md`. Không thêm số liệu mới.
> Mỗi slide gồm: tiêu đề, nội dung hiển thị, nguồn (chữ nhỏ cuối slide), lời nói (không hiển thị).

---

## Slide 1 · User & Job (45 giây)

**Tiêu đề:** Học viên Khoá 4 trước mỗi buổi lab: không biết phải học bù phần nào

**Job:** Với quỹ thời gian rảnh hôm nay và trình độ của mình, biết chính xác cần học gì để làm kịp bài lab tiếp theo.

**3 con số:**
- **87%** — 71/82 học viên không tự xác định được phần cần học bù trước buổi lab
- **93%** — 76/82 gặp tài liệu rải rác nhiều nơi (Discord, Zoom, Drive, VLearn, GitHub)
- **0.13%** — lượt chat AI Tutor VLearn tự gợi ý bước học tiếp theo (18/13.494 lượt)

**Quote:** "Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước." — P02, học viên nền AI

**Nguồn:** khảo sát form n = 82 (17/9, tự khai, mẫu tự nguyện) · vlearn-pack 13.494 lượt chat · phỏng vấn P02 ngày 16/9 — chi tiết `spec.md` §1

**Lời nói:** Người dùng của chúng tôi là học viên Khoá 4 tự học trước mỗi buổi lab. 87% trong 82 người khảo sát không tự biết mình phải học bù phần nào. AI Tutor hiện tại gần như không bao giờ chủ động gợi ý bước tiếp theo.

---

## Slide 2 · Vì sao chọn tính năng này (45 giây)

**Tiêu đề:** 3 ứng viên — chọn cái có "một quyết định AI" rõ ràng

| Ứng viên | Bằng chứng | Quyết định |
|---|---|---|
| (1) Tổng hợp link tài liệu phân mảnh | 76/82 (93%) gặp tài liệu rải rác | Loại — chỉ là tra cứu, không có quyết định AI |
| (2) Tóm tắt trọng tâm bài giảng | 75/82 (91%) gặp slide dài; 8.8% lượt chat VLearn xin tóm tắt | Loại — trùng lõi Track A (AI Tutor) |
| **(3) Chẩn đoán nền tảng + thời gian → ≤3 việc trọng tâm cho lab tiếp theo** | 71/82 (87%) không biết học bù phần nào; 41/82 (50%) rảnh dưới 1 tiếng | **Chọn** — catalog đã kiểm chứng giải luôn một phần (1) |

**Tín hiệu chấp nhận:** 74/82 (90%) muốn dùng checklist 3 việc theo số phút rảnh mỗi ngày.

**Nguồn:** bảng impact `spec.md` §2 · khảo sát n = 82 · mining `docs/research/evidence-mining.md`

**Lời nói:** Nỗi đau lớn nhất là tài liệu rải rác, nhưng đó là bài toán tra cứu. Chúng tôi chọn bài toán cần AI ra quyết định: với nền tảng và thời gian của bạn, học gì trước.

---

## Slide 3 · Giải pháp & demo live (2 phút)

**Tiêu đề:** Lộ trình cá nhân hoá: AI Mentor đề xuất tối đa 3 việc, kèm link đã kiểm chứng

**Luồng:**
- Chọn nền tảng (non-tech / tech / AI) → số phút rảnh + bài lab → ghi chú
- AI Mentor trả checklist ≤3 việc, kèm lý do, thời lượng, link **chỉ lấy từ catalog**
- Thiếu thông tin → hỏi lại; xin làm hộ / đáp án / gia hạn → từ chối

**Mức tự động hoá: augment (hỗ trợ, không làm thay).** AI chỉ đề xuất, học viên tự tick/sửa. Cái giá khi AI sai: tốn vài chục phút đọc nhầm, không ảnh hưởng điểm.

**Demo trên sân khấu:**
- **Case chuẩn:** nền tech, 60 phút, lab tiếp theo → checklist 3 việc, tổng ≤ 60 phút, link nằm trong catalog.
- **Case khó:** "Làm hộ bài lab / cho đáp án" → AI từ chối, gợi ý liên hệ Lab Coach (case G16). Hoặc khai non-tech nhưng ghi "đã làm RAG production" → AI hỏi lại (case G14).

**Nguồn:** web k4-3a-e403-vinonymus.vercel.app/personalized-path · luồng chi tiết `docs/05-ui-flow.md` · video demo dự phòng nộp kèm CP5

**Lời nói:** Demo 1 case chuẩn, 1 case khó. Case khó quan trọng hơn: AI biết từ chối và biết hỏi lại khi thông tin mâu thuẫn.

---

## Slide 4 · Kết quả đo (45 giây)

**Tiêu đề:** Đạt Quality Bar khoá tại CP4: AI v2 19/20, 0 link ngoài catalog

**Quality Bar (khoá 21:00 · 17/9):** ≥18/20 case đạt **VÀ** 0 URL ngoài catalog **VÀ** 3/3 case G16–G18 trả "từ chối".

| Lượt | Đạt | Link ngoài catalog |
|---|---|---|
| Baseline luật tĩnh (20 case) | 17/20 · 85% | 0 |
| AI v1 · Gemini Flash-Lite | 18/20 · 90% | 0 |
| **AI v2 · Gemini Flash-Lite** | **19/20 · 95%** | **0** |

**Failure đáng kể nhất — G02:** Gemini chọn đúng tài liệu `ptc-function-calling` nhưng xếp thứ ba; bước kiểm tra giới hạn 60 phút loại mất tài liệu này. Không bịa link, không rơi về kế hoạch mặc định — nhóm giữ nguyên case và số 19/20.

**Minh bạch:** ngưỡng chốt sau khi đã có lượt v1, v2. Bộ mở rộng 50 case hiện chỉ chạy baseline luật tĩnh (50/50) — luật đã được chỉnh theo chính các case này, nên không dùng làm bằng chứng chất lượng AI.

**Nguồn:** `eval/run_results.md` lượt 0–3 · `eval/latest-ai-results.json` · `spec.md` §7

**Lời nói:** Chúng tôi chốt chuẩn đạt trước hạn, và bản AI vượt chuẩn. Đây là case chưa đạt và vì sao.

---

## Slide 5 · User thật nói gì (45 giây)

> ⚠️ **Kiểm tra trước khi nộp:** nội dung dưới đây viết theo hiện trạng `validation/log.md` (chưa có buổi dùng thử nào được ghi). Nếu nhóm đã cho người ngoài dùng thử, thay phần bên phải bằng quote nguyên văn + thay đổi đã làm.

**Tiêu đề:** Chưa hoàn thành 5 buổi cho người ngoài dùng thử — nói thẳng thay vì tô vẽ

**Đã có (phỏng vấn trước khi build, 16/9):**
- "Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu." — P01, học viên nền tech
- "Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước." — P02, học viên nền AI
- 71/82 người khảo sát sẵn sàng dùng thử.

**Thay cho validation — đo trên golden set:**
- AI v2 **đạt** Quality Bar: 19/20 case, 0 link ngoài catalog
- 3/3 case ngoài phạm vi (xin đáp án, mở cổng nộp muộn, đòi system prompt) → **từ chối**
- Chưa đạt: G02 — thiếu 1 tài liệu vì giới hạn thời lượng

**Nguồn:** `docs/research/survey-log.md` · `eval/run_results.md` · theo luật `02-guide.md` §5.1: không có validation thì báo kết quả golden set

**Lời nói:** Chúng tôi chưa làm đủ 5 buổi cho người ngoài dùng thử. Thay vào đó, đây là kết quả đo trên golden set, gồm cả case chưa đạt.

---

## Slide 6 · Nếu có thêm 1 tuần (30 giây)

**Tiêu đề:** 3 việc ưu tiên, đều trỏ về lỗ hổng đang có

1. **Cho 5 người thật dùng thử** — giao task, ngồi im quan sát, ghi quote nguyên văn. Đúng phần còn thiếu ở slide 5.
2. **Bài test chẩn đoán từ CV** — 74/82 (90%) muốn có bài test ngắn; hiện AI Mentor chỉ dựa trên nền tảng tự khai.
3. **Thư viện tài liệu giảng viên** — giảng viên tải tài liệu lên, AI Mentor đọc vào thư viện thay cho catalog nhóm soạn tay.

**Bài học lớn nhất:** chốt chuẩn "đạt" và đo bằng golden set từ sớm giúp nhóm nói được con số thật — kể cả con số chưa đẹp.

**Chân trang:** Nhóm Vinonymus · K4-3A-E403 · Khoa (PM · backend) · Minh (database) · Đức (AI) · Thành (giao diện)

**Nguồn:** repo github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus · task board `docs/hackathon/tasks-he-thong-4-vai-tro.md`

**Lời nói:** Nếu có thêm một tuần, chúng tôi làm đúng ba việc còn thiếu. Bài học lớn nhất: đo sớm để nói số thật.
