# AI SPEC — AI Diagnostic Study Planner · Nhóm Vinonymus · K4-3A-E403 · Cụm C2
Hướng: **E — Làn mở** (trong phạm vi AI20k)
Loại: [x] Tính năng mới

> ⚠️ **Bản nháp — chưa chốt.** Đánh dấu `[TODO]` là phần còn thiếu, chưa đủ để khoá chuẩn "đạt" tại hạn chốt spec (21:00 17/9, CP4). Xem chi tiết ở cuối file.

## §1. User & Job
- **Job executor:** Học viên Khoá 4 đang tự học trước mỗi buổi Lab/workshop (không phải "học viên nói chung").
- **Core JTBD** (không tên sản phẩm/AI): Biết chính xác hôm nay cần học/làm gì với quỹ thời gian rảnh của mình, để hoàn thành bài lab đúng hạn.
- **Problem statement** (không chữ AI): Học viên phải tự lục tài liệu phân mảnh trên nhiều nền tảng (Discord, Zoom, Drive, VLearn, GitHub), không biết đâu là trọng tâm trong slide dài, dẫn đến làm bài sát deadline hoặc nộp muộn.
- **Evidence:**
  - **Chuẩn B — mining (đã có, từ `discord-pack` + `vlearn-pack`; phương pháp đếm: `docs/research/evidence-mining.md`):**
    - 6.7% (52/779 tin của người, đếm theo từ khoá link/slide/zoom/drive/tài liệu, 3 ngày 12–14/09) nhắc tới tài liệu/link buổi học — gồm cả tin xin lẫn tin chia sẻ; số tin xin trực tiếp là 4, cần đọc tay 52 tin để tách trước CP4. VD: `M10991` "cho e xin slide của thầy"; `M23639` "em muốn xin slide nay thầy dạy ở 3a-lec-d301".
    - 8.8% (1.189/13.494 lượt chat VLearn, đếm theo từ khoá "tóm tắt"/"trọng tâm"; riêng khoá 4 là 182/3.097 = 5.9%): học viên xin tóm tắt/chỉ điểm trọng tâm thay vì tự đọc hết. VD: `turn_id T10312` (K4, 10/09) "tóm tắt các key".
    - AI Tutor chỉ 0.13% lượt tự gợi ý bước học tiếp theo (`suggest_next_topic`: 18/13.494) — không chủ động dẫn đường, học viên phải tự biết cần hỏi gì.
    - Bản tin ngày 14/09 (Discord): một học viên hỏi xin gia hạn vì lỡ nộp muộn Lab2 1 phút; một học viên khác hỏi quy định xử lý nộp muộn sau 23h59 — cho thấy học viên không ước lượng đúng thời gian cần cho bài.
  - **Chuẩn A — phỏng vấn người thật (n = 2, 16/9; nhật ký: `docs/research/survey-log.md`):**
    - 2/2 người tự học trước lab trong 7 ngày qua, 2/2 gặp khó khăn, 2/2 cùng mẫu khó khăn: tài liệu phân tán / không biết trọng tâm theo quỹ thời gian → vào lab cập rập.
    - P01 (tech): "Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu."
    - P02 (AI): "Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước."
    - `[TODO]` Mẫu nhỏ và cả hai là willing user → hỏi thêm học viên K4 khác (có người non-tech) trước CP4; chưa đạt ngưỡng ≥20 người của chuẩn A.
  - **≥5 quote/ví dụ nguyên văn:** đạt — `M10991`, `M23639`, `M24139`, `T10312`, bản tin 14/09, P01, P02 (chi tiết trong `docs/research/`).

## §2. Impact & quyết định chọn
`[TODO — DRAFT, nhóm xác nhận lại số liệu trước khi chốt]`

| Ứng viên | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi trong thời gian thi | Chọn? |
|---|---|---|---|---|---|
| (1) Tổng hợp/tìm lại tài liệu phân mảnh (link slide/zoom/drive) | 6.7% tin Discord 3 ngày (52/779) nhắc tới tài liệu/link | mỗi buổi học mới lại hỏi | 20–40 phút gom lại/lần | Cao — chỉ cần tổng hợp link, không cần quyết định AI rõ | **Loại** — thiếu "1 quyết định AI", gần như thuần index hoá |
| (2) Tóm tắt & chỉ trọng tâm bài giảng theo yêu cầu | 8.8% lượt chat VLearn (1.189/13.494); riêng K4 5.9% (182/3.097) | mỗi buổi/bài mới | vài phút chờ + rủi ro bỏ sót ý chính | Trung bình — cần RAG trên transcript | **Loại** — trùng lõi Track A (VLearn Tutor tối ưu), muốn giữ khác biệt cho Track E |
| (3) Chẩn đoán nền tảng + thời gian → đề xuất 3 việc trọng tâm cho buổi lab tiếp theo | Mining E1/E2 + phỏng vấn 2/2 cùng mẫu khó khăn (n nhỏ) `[TODO: mở rộng]` | mỗi buổi lab/workshop (~2–3 lần/tuần) | phân bổ sai thời gian → sát deadline, nộp muộn (bằng chứng bản tin 14/09) | Vừa sức — tận dụng UI wizard có sẵn (`ai-mentor-wizard.tsx`) + LLM router có sẵn trong `codebase/` | **✅ Chọn** |

- **Ứng viên đã loại:** (1) vì không có "1 quyết định AI" rõ ràng, chỉ là tra cứu/tổng hợp link. (2) vì trùng phạm vi Track A (VLearn Tutor tối ưu tóm tắt) — chọn giữ (3) để giữ đúng tính chất Track E (bài toán không nằm trong A–D).
- **Ứng viên chọn:** (3) — kết hợp cả 2 evidence mining (tài liệu phân mảnh + xin tóm tắt) làm input chẩn đoán, có bằng chứng hậu quả rõ nhất (nộp muộn deadline), và tận dụng được hạ tầng AI + UI đã có sẵn trong `codebase/` để build kịp trong thời gian thi.

## §3. Giải pháp tương tự đã nghiên cứu
- **VLearn AI Tutor** (đang chạy thật trong khoá): trả lời khi được hỏi, nhưng bị động — không chủ động đề xuất việc cần làm khi học viên chưa biết hỏi gì. *Khác biệt:* sản phẩm nhóm mình chủ động đưa checklist ngay đầu buổi.
- **Bot "Trợ lý" + bản tin ngày Discord**: tổng hợp câu hỏi cho TA xem, không cá nhân hoá theo từng học viên. *Khác biệt:* sản phẩm nhắm vào từng cá nhân, không phải bản tin chung cho TA.
- `[TODO: nhóm bổ sung ≥1 sản phẩm ngoài chương trình, ví dụ ứng dụng lộ trình học/planner cá nhân hoá đã có trên thị trường]`

## §4. Thiết kế
- **Lát cắt MỘT CÂU:** Một học viên Khoá 4 cần lên kế hoạch tự học cho bài Lab tiếp theo · được AI chẩn đoán nền tảng (tech/non-tech) và quỹ thời gian rảnh · để đề xuất đúng 3 đầu việc trọng tâm kèm link tài liệu chính xác · giúp học viên hoàn thành bài đúng hạn.
- **Non-goals (≥3):**
  - Không build/hoàn thiện hệ thống tài khoản, ghi danh, thanh toán, chứng chỉ (giữ nguyên phần mock có sẵn trong `codebase/`, không phải phạm vi thi).
  - Không tự động nộp bài hộ học viên hay thay đổi deadline.
  - Không thay thế AI Tutor VLearn hiện có (không trả lời tự do mọi câu hỏi trong tài liệu).
  - Không lưu lịch sử nhiều buổi học/cá nhân hoá dài hạn — chỉ 1 lượt chẩn đoán/phiên.
- **Mức prototype nhắm tới:** [x] Working (một phần) — phần chẩn đoán + đề xuất việc: AI chạy thật qua route mới; phần tài khoản/tiến độ/chứng chỉ: mock, không dùng trong lát cắt (xem `README.md` mục Trạng thái prototype).
- **Automation:** [x] conditional — Lý do theo cost-of-error: nếu AI tự chọn sai trọng tâm mà học viên làm theo ngay không kiểm tra, có thể học sai hướng sát deadline — cost-of-error cao, nên giữ học viên luôn thấy lý do và tự tick chọn/sửa checklist, AI không tự động hoá hoàn toàn.
- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR):**

  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | Giải thích được (Explainability) | Mỗi việc trong checklist có 1 dòng lý do + link nguồn tài liệu, không chỉ đưa kết quả trần |
  | Người dùng kiểm soát cuối (Human-in-control) | Học viên tick chọn/bỏ/đổi thứ tự việc trước khi bắt đầu học — AI chỉ đề xuất |
  | Biết mình không biết (Graceful failure) | Khi input mơ hồ (VD quỹ thời gian <30 phút) hệ thống hỏi lại thay vì tự đoán |
  | Không vượt phạm vi (Scoped trust) | Chỉ đề xuất tài liệu/link có trong nguồn đã kiểm chứng, không tự bịa link ngoài |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
`[TODO — Đức (AI) chủ trì, điền theo 4 lớp trong 01-challenge-brief.md: ① nguồn sự thật ② mơ hồ/thiếu thông tin ③ ngoài phạm vi ④ đặc thù domain, mỗi lớp ≥2 kịch bản cụ thể]`

## §6. Bốn đường đi của trải nghiệm
`[TODO — viết sau khi có bản demo thật: Happy path · Low-confidence · Failure/không căn cứ · Correction · Ngoài phạm vi · Case đặc thù domain]`

## §7. Kiểm thử
`[TODO — sau khi Minh/Đức dựng xong /api/roadmap: golden set ≥20 case, quality bar, bảng % kết quả]`

## §8. Phân công & kế hoạch
- **Phân công có tên:**
  - Đỗ Khắc Gia Khoa — spec, bằng chứng, khảo sát, điều phối checkpoint, validation (R6)
  - Trần Nhật Minh — code API `/api/roadmap`, tích hợp LLM router có sẵn trong `codebase/src/lib/llm/router.ts`
  - Đinh Ngọc Đức — thiết kế prompt, xây golden set, chạy eval trước/sau
  - Nguyễn Việt Thành — giao diện wizard (`ai-mentor-wizard.tsx`), quay video demo
- **Willing users (≥2 tên):** W1, W2 — tên đầy đủ đã khai trong form CP1 (không ghi công khai ở repo); lên lịch dùng thử trước CP5, nhật ký tại `validation/log.md`.
- **Multi-prototype:** không làm (bonus, bỏ qua do giới hạn thời gian).

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 16/9 19:30 (CP1) | Chốt Track E, lát cắt "AI Diagnostic Study Planner" | Sau khi mining bằng chứng từ `discord-pack` + `vlearn-pack` |
| 16/9 (sau CP1) | Sắp xếp lại repo: tài liệu gom về `docs/`, thêm SRS riêng cho lát cắt, tài liệu dự án nền chuyển sang `docs/legacy/` | Tài liệu cũ mô tả sản phẩm khác, dễ gây hiểu nhầm khi chấm |
| 17/9 | Đồng bộ `docs/02-kien-truc.md` và `docs/03-api.md` với code Planner, router và trạng thái AI Mentor/Helpdesk | API Planner đã nối FE; tài liệu cũ còn ghi chưa build và chưa phân biệt các giao diện mô phỏng |

---

## Việc còn thiếu trước hạn chốt spec (21:00 · 17/9)
1. **Mở rộng khảo sát** (chuẩn A, §1) — mới có n = 2, cần thêm người ngoài nhóm, có cả nền tảng non-tech.
2. **Số liệu §2** cần khảo sát A để hoàn thiện cột "bao nhiêu người" của ứng viên (3).
3. **§3** cần thêm 1 sản phẩm tương tự ngoài chương trình.
4. **§5, §6, §7** cần build xong `/api/roadmap` thật mới viết được.
