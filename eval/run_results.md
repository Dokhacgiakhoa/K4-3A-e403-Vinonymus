# CP3 · Golden set và kết quả kiểm thử

> Phụ trách: Đức. Golden set: `golden-set.json`. Runner: `run-eval.ts`.

## 1. Cấu trúc Golden set

Tổng cộng **20 case độc lập**:

| Nhóm | Số case | Mã |
|---|---:|---|
| Tình huống thường ngày | 8 | G01–G08 |
| ① Nguồn sự thật | 3 | G09–G11 |
| ② Mơ hồ / thiếu hoặc mâu thuẫn thông tin | 4 | G12–G15 |
| ③ Ngoài phạm vi / thẩm quyền | 3 | G16–G18 |
| ④ Đặc thù nghiệp vụ | 2 | G19–G20 |

- Edge cases: G12, G13, G14, G18 — **4 case**.
- Case phát triển từ dữ liệu thật: **20/20**, dùng **20 mã nguồn khác nhau** dạng `M#####` hoặc `T#####`; tất cả mã đã được đối chiếu tồn tại trong `discord-pack`/`vlearn-pack`. Golden set chỉ lưu mã tham chiếu và tình huống tổng hợp, không chép data pack hay PII.

## 2. Chuẩn một case đạt

Một case đạt khi đồng thời thỏa các điều kiện áp dụng cho case đó:

1. `status` đúng kỳ vọng: `plan`, `clarify` hoặc `refuse`.
2. Kế hoạch có 1–3 nhiệm vụ, không trùng `itemId`.
3. Tổng thời lượng không vượt quỹ thời gian.
4. Mọi `itemId`, tiêu đề và URL đều khớp catalog của bài lab; **0 link ngoài catalog**.
5. Đủ `must_include`, không có `must_not_include`.
6. Case domain phải xếp đúng mức `basic` hoặc `advanced` ở nhiệm vụ đầu.
7. Ở lượt AI, case `plan` chỉ đạt khi `source = ai`; fallback baseline được tính là trượt.

## 3. Kết quả chạy

| Lượt | Thời điểm UTC+7 | Phiên bản | Qua / Tổng | Tỷ lệ | Link ngoài catalog | Trạng thái |
|---|---|---|---:|---:|---:|---|
| 0 | 17/09/2026 13:02 | Baseline luật tĩnh | **17/20** | **85%** | **0** | Đã chạy lại sau khi chuẩn hóa nguồn |
| 1 | 17/09/2026 13:27 | AI v1 · Gemini 3.5 Flash-Lite | **18/20** | **90%** | **0** | Đã chạy; 15 lời gọi Gemini thật, 5 case chặn sớm bằng luật an toàn |
| 2 | 17/09/2026 14:31 | AI v2 · Gemini 3.5 Flash-Lite | **19/20** | **95%** | **0** | Lượt mới nhất sau sửa prompt và xử lý output dài; 15 lời gọi Gemini thật |

Artifact máy đọc được: `latest-baseline-results.json` và `latest-ai-results.json`.

## 4. Phân tích 3 case baseline chưa đạt

| Case | Sai ở đâu | Nguyên nhân | Kỳ vọng AI v1 |
|---|---|---|---|
| G06 | Thiếu `aps-pair` | Baseline khớp từ khóa `problem statement` và `guardrail`, lấp đủ 60 phút trước khi tới PAIR | Hiểu mục tiêu guardrail + human control để chọn PAIR và HAX |
| G14 | Trả `plan` thay vì `clarify` | Luật tĩnh không phát hiện non-tech mâu thuẫn với kinh nghiệm RAG production | Phát hiện mâu thuẫn nền tảng |
| G15 | Trả `plan` thay vì `clarify` | Luật tĩnh không phát hiện chọn AI nhưng chưa từng code/API/notebook | Hỏi lại trước khi lập kế hoạch |

Đây là số đo thật; không sửa Golden set để làm tăng tỷ lệ baseline.

## 5. Phân tích 1 case AI v2 chưa đạt

| Case | Kết quả thực tế | Vì sao chưa đạt | Hướng sửa sau CP3 |
|---|---|---|---|
| G02 | Kế hoạch AI thiếu `ptc-function-calling` | Gemini có chọn đúng item nhưng xếp sau hai item khác; khi ghép catalog, item cuối làm tổng thời gian vượt 60 phút nên bị lọc | Yêu cầu mô hình xếp item khớp trực tiếp ghi chú lên đầu; chưa thêm luật gán cứng theo case |

Lượt mới nhất không bịa link và không fallback baseline. Đây là số đo thật của một lần chạy đủ 20 case; không chọn lại kỳ vọng sau khi xem kết quả.

## 6. Cách chạy lại

Từ thư mục `codebase/`:

```bash
npx tsx ../eval/run-eval.ts baseline
```

Sau khi chạy `npm run dev` và có ít nhất một API key hợp lệ:

```bash
npx tsx ../eval/run-eval.ts ai
```

Runner tự tạo `latest-baseline-results.json` hoặc `latest-ai-results.json`. Mỗi case thất bại làm process trả exit code 1 để không thể bỏ qua số xấu trong CI hoặc terminal.

## 7. Kịch bản quay video CP3 khoảng 30 giây

1. Mở `/planner`; bảo đảm đã lưu API key hợp lệ trong Settings.
2. Chọn **Tech-base**, **60 phút**, **Lab 04 · Prompt Engineering & Tool Calling**.
3. Ghi chú: `Mình đã biết code nhưng chưa dùng function calling.`
4. Bấm **Lập kế hoạch** và giữ nguyên cảnh loading cho tới khi có kết quả.
5. Quay rõ badge **AI**, phần chẩn đoán và checklist có `Function calling với Gemini API`.
6. Không dùng video có badge gợi ý mặc định; badge đó chứng minh fallback chứ không chứng minh lời gọi AI thật.

## 8. Dữ liệu điền form CP3

> Các số CP3 bên dưới là kết quả lịch sử, không phải kết quả của đợt mở rộng API.

- **Đã thử bao nhiêu lần:** 20.
- **Trong đó bao nhiêu lần đạt:** 19 (**95%**).
- **Chuẩn đạt:** dùng nguyên văn mục 2 phía trên.
- **Những lần chưa đạt sai ở đâu:** G02 thiếu tài liệu `ptc-function-calling`. Gemini đã chọn đúng item nhưng xếp thứ ba; khi ghép catalog, item này làm tổng vượt 60 phút nên bị lọc. Kết quả vẫn không bịa link và không fallback baseline.

## 9. Regression Khi Mở Rộng API 4 Role (17/9)

- Chạy lại `npm run eval -- baseline`: 17/20 (85%), vẫn lỗi G06 (thiếu aps-pair), G14 và G15 (không clarify input mâu thuẫn). Không đổi golden-set hoặc quality bar.
- Route Planner dùng chung service với API v1; không thay prompt Planner cũ. Mentor analyze thêm prompt định hướng riêng, chưa được eval bằng live model.
- Mentor có 6 test fixture: valid evidence/catalog, lab bịa, evidence bịa, URL bịa, JSON lỗi và provider lỗi. Đây là kiểm thử hậu kiểm/fallback với LLM mock, không phải điểm chất lượng AI.
- Không chạy lại AI golden-set live; không sử dụng điểm CP3 19/20 để khẳng định chất lượng Mentor mới.
- Xem [báo cáo API](../docs/role-api-test-report.md) cho kết quả integration và HTTP smoke.
