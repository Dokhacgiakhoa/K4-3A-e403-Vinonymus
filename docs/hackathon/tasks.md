# Phân công công việc theo checkpoint

> Nguồn sự thật cho **ai làm gì, hạn nào**. Hạn nộp chính thức: [`checkpoints.md`](checkpoints.md).
> Cập nhật trạng thái ngay khi xong việc: ⬜ chưa làm · 🔄 đang làm · ✅ xong · ⛔ bị chặn (ghi lý do ở cột Ghi chú).

## Thành viên

| Tag | Họ tên | Vai trò | GitHub |
|---|---|---|---|
| `@Khoa` | Đỗ Khắc Gia Khoa (đội trưởng) | PM | [@Dokhacgiakhoa](https://github.com/Dokhacgiakhoa) |
| `@Minh` | Trần Nhật Minh | BE | `[TODO]` |
| `@Duc` | Đinh Ngọc Đức | AI | `[TODO]` |
| `@Thanh` | Nguyễn Việt Thành | FE | `[TODO]` |

**Quy tắc:** mỗi việc có đúng **1 người phụ trách** (chịu trách nhiệm cuối và phải giải thích được khi giám khảo hỏi). Người hỗ trợ giúp làm, không thay người phụ trách. Việc nộp form luôn do `@Khoa` làm bằng mã 02733.

---

## CP1 · Canvas + repo — 19:30 · 16/9 · ✅ đã nộp

| ID | Việc | Phụ trách | Hỗ trợ | Kết quả / file | Trạng thái |
|---|---|---|---|---|---|
| T1-01 | Điền Canvas 4 ô, nộp form CP1 | `@Khoa` | — | [`cp1-canvas.md`](cp1-canvas.md) | ✅ |
| T1-02 | Tạo repo công khai, README bảng thành viên | `@Khoa` | — | `README.md` | ✅ |
| T1-03 | Phỏng vấn 2 willing user (P01, P02) | `@Khoa` | `@Thanh` ghi P01 · `@Duc` ghi P02 | [`../research/survey-log.md`](../research/survey-log.md) | ✅ |
| T1-04 | **Mỗi người tự nộp link repo vào bài lab trên VLearn** | `@Khoa` `@Minh` `@Duc` `@Thanh` | — | Bài lab VLearn | ⬜ Khoa · ⬜ Minh · ⬜ Đức · ⬜ Thành |

---

## CP2 · Luồng hoạt động — 21:00 · 16/9

Mục tiêu: người xem thấy được cả luồng từ đầu đến cuối. **Chưa cần AI chạy thật.**

| ID | Việc | Phụ trách | Hỗ trợ | Kết quả / file | Hạn | Trạng thái |
|---|---|---|---|---|---|---|
| T2-01 | Cho trang Planner mở được **không cần đăng nhập / gói Pro** (để demo) | `@Minh` | `@Thanh` | `codebase/src/app/learning/page.tsx` | 20:15 | ⬜ |
| T2-02 | Đổi nội dung wizard theo [`05-ui-flow.md`](../05-ui-flow.md): nền tảng → thời gian + bài lab → ghi chú → checklist ≤3 việc; gắn cứng 1 kết quả mẫu | `@Thanh` | `@Minh` | `ai-mentor-wizard.tsx` | 20:30 | ⬜ |
| T2-03 | Quay màn hình đi hết một lượt (phương án dự phòng: xuất sơ đồ mermaid trong `05-ui-flow.md` ra ảnh) | `@Thanh` | — | Video / ảnh sơ đồ | 20:45 | ⬜ |
| T2-04 | Nộp form CP2 | `@Khoa` | — | Form CP2 | 20:55 | ⬜ |
| T2-05 | Xác nhận lời đáp P01 / P02 trong `survey-log.md` đúng nguyên văn | `@Thanh` (P01) | `@Duc` (P02) | `survey-log.md` | 21:00 | ⬜ |
| T2-06 | Chuẩn bị cho CP3: nháp prompt v0 + danh sách tên 20 case golden set | `@Duc` | — | [`04-ai-pipeline.md`](../04-ai-pipeline.md), `eval/` | 23:00 | ⬜ |

---

## CP3 · Video AI chạy thật + số đo — 16:00 · 17/9

Mục tiêu: **≥1 lời gọi AI thật** trong video 30 giây, và con số "thử bao nhiêu, đúng bao nhiêu".

| ID | Việc | Phụ trách | Hỗ trợ | Kết quả / file | Hạn | Trạng thái |
|---|---|---|---|---|---|---|
| T3-01 | Soạn catalog 2–3 bài lab — **chỉ link công khai**, không link Zoom/passcode, không chép data pack | `@Duc` | `@Minh` | `codebase/data/catalog/*.yaml` | 17/9 · 10:00 | ⬜ |
| T3-02 | Build `POST /api/roadmap`: validate zod → luật cứng (clarify) → gọi LLM router → lọc `item_id` theo catalog → fallback baseline | `@Minh` | `@Duc` | `codebase/src/app/api/roadmap/route.ts` | 17/9 · 12:00 | ⬜ |
| T3-03 | Cập nhật tên model cũ trong LLM router | `@Minh` | — | `codebase/src/lib/llm/router.ts` | 17/9 · 12:00 | ⬜ |
| T3-04 | Prompt v1 + schema zod cho output LLM | `@Duc` | `@Minh` | `codebase/src/lib/prompts/`, `04-ai-pipeline.md` | 17/9 · 12:00 | ⬜ |
| T3-05 | Golden set ≥20 case (≥10 case phát triển từ dữ liệu thật, chỉ dẫn mã) theo cơ cấu trong `eval/results.md` | `@Duc` | `@Khoa` | `eval/golden-set.json` | 17/9 · 12:00 | ⬜ |
| T3-06 | Nối wizard với `/api/roadmap`; hiển thị plan / clarify / refuse / nhãn "Gợi ý mặc định"; checklist tick–bỏ–đổi thứ tự lưu `localStorage` | `@Thanh` | `@Minh` | `ai-mentor-wizard.tsx` | 17/9 · 13:30 | ⬜ |
| T3-07 | Script chạy eval; chạy baseline (lượt 0) và AI (lượt 1); ghi số thật kể cả khi xấu | `@Duc` | `@Minh` | `eval/run-eval.ts`, `eval/results.md` | 17/9 · 15:00 | ⬜ |
| T3-08 | Quay video 30 giây bấm thật, thấy AI trả kết quả | `@Thanh` | — | Video CP3 | 17/9 · 15:30 | ⬜ |
| T3-09 | Nộp form CP3 (video + số đo) | `@Khoa` | — | Form CP3 | 17/9 · 15:50 | ⬜ |
| T3-10 | Mở rộng phỏng vấn thêm ≥3 người ngoài nhóm, có người non-tech, **không mô tả giải pháp trước khi hỏi xong** | `@Khoa` | `@Thanh` ghi chép | `survey-log.md` | 17/9 · 15:00 | ⬜ |
| T3-11 | Đọc tay 52 tin E1, tách tin **xin** tài liệu và tin **chia sẻ** | `@Khoa` | — | `evidence-mining.md` | 17/9 · 15:00 | ⬜ |

---

## CP4 · Chốt `spec.md` — 21:00 · 17/9

Mục tiêu: **khoá chuẩn "đạt"** trước khi xem kết quả cuối; tự khai phần chưa xong. Sau 21:00 không sửa quality bar.

| ID | Việc | Phụ trách | Hỗ trợ | Kết quả / file | Hạn | Trạng thái |
|---|---|---|---|---|---|---|
| T4-01 | §1–§2: cập nhật số khảo sát mới, số E1 đã tách, hoàn thiện bảng impact | `@Khoa` | — | `spec.md` | 17/9 · 18:00 | ⬜ |
| T4-02 | §3: thêm ≥1 sản phẩm tương tự ngoài chương trình | `@Khoa` | `@Thanh` | `spec.md` | 17/9 · 18:00 | ⬜ |
| T4-03 | §5: bảng 4 lớp chỗ khó, ≥8 kịch bản, trỏ về case trong golden set | `@Duc` | `@Minh` | `spec.md` | 17/9 · 18:30 | ⬜ |
| T4-04 | §6: bốn đường đi của trải nghiệm, kèm ảnh chụp từ app thật | `@Thanh` | `@Duc` | `spec.md` | 17/9 · 18:30 | ⬜ |
| T4-05 | §7: chốt quality bar ("Đạt khi ≥ __% qua bộ, và 0 link ngoài catalog") + bảng kết quả | `@Duc` | `@Khoa` | `spec.md`, `eval/results.md` | 17/9 · 19:30 | ⬜ |
| T4-06 | Cập nhật `03-api.md`, `02-kien-truc.md` cho khớp code đã build | `@Minh` | — | `docs/` | 17/9 · 19:30 | ⬜ |
| T4-07 | Trả lời "Câu hỏi mở" trong SRS, chốt SRS v1 | `@Khoa` | `@Minh` | `docs/01-SRS.md` | 17/9 · 19:30 | ⬜ |
| T4-08 | Review chéo `spec.md` — mỗi người đọc phần của người khác | `@Khoa` `@Minh` `@Duc` `@Thanh` | — | Góp ý trong commit/PR | 17/9 · 20:15 | ⬜ |
| T4-09 | Nộp form CP4 (link `spec.md` + tự khai phần chưa xong) | `@Khoa` | — | Form CP4 | 17/9 · 20:50 | ⬜ |

---

## CP5 · Slide + video dự phòng — 13:00 · 18/9 (nộp cuối)

Mục tiêu: R6 (5 người ngoài nhóm dùng thử) + slide PDF + video dự phòng.

| ID | Việc | Phụ trách | Hỗ trợ | Kết quả / file | Hạn | Trạng thái |
|---|---|---|---|---|---|---|
| T5-01 | 5 người ngoài nhóm dùng thử (W1, W2 đã khai + V3–V5); giao task rồi ngồi im quan sát; ghi quote nguyên văn | `@Khoa` | `@Thanh` ghi chép | `validation/log.md` | 18/9 · 10:00 | ⬜ |
| T5-02 | Chọn ≥1 thay đổi từ phản hồi, ghi `spec.md` §9 (hoặc giải thích vì sao giữ nguyên) | `@Khoa` | `@Duc` | `spec.md` | 18/9 · 10:30 | ⬜ |
| T5-03 | Sửa sản phẩm theo thay đổi đã chọn | `@Thanh` (UI) | `@Minh` (API) | `codebase/` | 18/9 · 11:30 | ⬜ |
| T5-04 | Chạy lại eval sau khi sửa (lượt 2) | `@Duc` | — | `eval/results.md` | 18/9 · 11:30 | ⬜ |
| T5-05 | `npm run verify` pass; README "Chạy thử" chạy đúng trên máy sạch | `@Minh` | — | Output lệnh dán vào commit | 18/9 · 11:30 | ⬜ |
| T5-06 | Slide 6 trang theo `02-guide.md` §5.1 của đề, xuất PDF | `@Khoa` | `@Duc` (số eval) · `@Thanh` (ảnh) | `demo-slides.pdf` | 18/9 · 12:00 | ⬜ |
| T5-07 | Quay video demo dự phòng — đúng phần sẽ demo trên sân khấu | `@Thanh` | — | Video CP5 | 18/9 · 12:15 | ⬜ |
| T5-08 | Nộp form CP5 (PDF + video) | `@Khoa` | — | Form CP5 | 18/9 · 12:45 | ⬜ |

---

## CP6 · Thuyết trình — 17:30 · 18/9

| ID | Việc | Phụ trách | Hỗ trợ | Kết quả / file | Hạn | Trạng thái |
|---|---|---|---|---|---|---|
| T6-01 | Kịch bản pitch 6 phút (vòng cụm) và 7 phút (chung kết), phân vai nói | `@Khoa` | Cả nhóm | Ghi chú pitch | 18/9 · 15:00 | ⬜ |
| T6-02 | Mỗi người luyện giải thích phần có tên mình (luật vibe-coding) — hỏi chéo nhau | `@Khoa` `@Minh` `@Duc` `@Thanh` | — | — | 18/9 · 16:30 | ⬜ |
| T6-03 | Máy demo sẵn sàng: app chạy, key hợp lệ, video dự phòng mở được offline | `@Thanh` | `@Minh` | — | 18/9 · 17:00 | ⬜ |
| T6-04 | Viết reflection cá nhân | `@Khoa` `@Minh` `@Duc` `@Thanh` | — | `reflection/*.md` | sau CP6 | ⬜ Khoa · ⬜ Minh · ⬜ Đức · ⬜ Thành |
| T6-05 | Đầu tư 100 điểm vòng cụm (không đầu tư đội mình, tổng đúng 100) | `@Khoa` | Cả nhóm góp ý | Form đầu tư | trong vòng cụm | ⬜ |

---

## Việc theo từng người

| Người | CP2 | CP3 | CP4 | CP5 | CP6 |
|---|---|---|---|---|---|
| `@Khoa` | T2-04 | T3-09 · T3-10 · T3-11 | T4-01 · T4-02 · T4-07 · T4-09 | T5-01 · T5-02 · T5-06 · T5-08 | T6-01 · T6-05 |
| `@Minh` | T2-01 | T3-02 · T3-03 | T4-06 | T5-05 | — |
| `@Duc` | T2-06 | T3-01 · T3-04 · T3-05 · T3-07 | T4-03 · T4-05 | T5-04 | — |
| `@Thanh` | T2-02 · T2-03 · T2-05 | T3-06 · T3-08 | T4-04 | T5-03 · T5-07 | T6-03 |
| Cả nhóm | T1-04 | — | T4-08 | — | T6-02 · T6-04 |

Chỉ tính việc **phụ trách chính**; việc hỗ trợ xem cột "Hỗ trợ" trong từng bảng.
