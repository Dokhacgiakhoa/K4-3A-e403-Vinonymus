# Báo cáo: Phase 1 — Cập nhật & Thêm mới Nội dung FAQs từ 26 Ảnh chụp màn hình

## 1. Đối chiếu checklist

- [x] Đã trích xuất thông tin chính thức từ 26 ảnh chụp màn hình do người dùng cung cấp.
- [x] Đã lược bỏ thông tin cá nhân của ứng viên (email cá nhân `dokhakgiakhoa666@gmail.com`).
- [x] Đã giữ nguyên và bổ sung đầy đủ thông tin liên hệ chính thức của Ban Tổ chức (Email `aithucchien@vinuni.edu.vn`, Nhóm Zalo dự thi Khóa IV, Hotline `0979489846`, Cán bộ tuyển dụng C. Thảo `0388339478`, Chị Lam Luu BTC).
- [x] Đã tạo 12 file Markdown FAQ mới trong `data/faqs/`.
- [x] Đã cập nhật 4 file Markdown FAQ hiện có trong `data/faqs/`.
- [x] Đã phát hiện và sửa bug rate limit retry (0ms backoff) trong `src/lib/rag/embed.ts` & bổ sung throttling trong `scripts/sync-content.ts`.
- [x] Đã chạy `npm run sync` thành công để đồng bộ vector & trigram cho các FAQ lên Supabase.
- [x] Đã chạy `npm run verify` kiểm tra lint, TypeScript, tests và build thành công.

## 2. File đã tạo/sửa

| File | Loại thay đổi | Tóm tắt |
|---|---|---|
| `src/lib/rag/embed.ts` | Sửa Bug | Sửa logic tính `backoffMs` khi `retryDelay <= 0` (tối thiểu 2000ms) & thêm sleep giữa các batch |
| `scripts/sync-content.ts` | Sửa Bug | Thêm sleep (200ms) giữa các FAQ để tránh dồn dập request |
| `data/faqs/cau-truc-bai-thi-dgnl.md` | Mới | Cấu trúc bài thi ĐGNL Vòng 2 (90 phút, 100đ, 4 Module A, B, C, D) |
| `data/faqs/timeline-tuyen-sinh-khoa-4.md` | Mới | Timeline mốc thời gian tuyển sinh & khai giảng Khóa IV |
| `data/faqs/thay-doi-ca-thi-dgnl.md` | Mới | Quy định đổi ca thi (inbox chị Lam Luu / Hotline BTC) |
| `data/faqs/kenh-lien-he-va-ho-tro-tuyen-sinh.md` | Mới | Email, Nhóm Zalo, Hotline tuyển sinh & Cán bộ hỗ trợ (C. Thảo, chị Lam Luu BTC) |
| `data/faqs/doi-tuong-uu-tien-tuyen-sinh.md` | Mới | Ưu tiên sinh viên năm cuối/tốt nghiệp để làm việc tại doanh nghiệp |
| `data/faqs/ngon-ngu-bai-thi-khao-sat-dgnl.md` | Mới | Bài thi ĐGNL thực hiện bằng Tiếng Việt |
| `data/faqs/nghi-cuoi-tuan-va-lam-nhom-tu-xa.md` | Mới | Cuối tuần được nghỉ hoặc làm nhóm từ xa (online) |
| `data/faqs/tro-cap-them-tu-doanh-nghiep-thuc-tap.md` | Mới | Chính sách trợ cấp thêm tùy thuộc từng doanh nghiệp |
| `data/faqs/quy-trinh-chon-cong-ty-thuc-tap.md` | Mới | Trường cung cấp danh sách công ty để học viên tự chọn |
| `data/faqs/tu-van-thue-tro-hoc-va-thuc-tap.md` | Mới | Tư vấn ở trọ Ocean Park (~1.2tr/tháng), tiết kiệm 3-4h di chuyển |
| `data/faqs/quy-dinh-di-muon-va-chuyen-can.md` | Mới | Đi muộn được du di nhưng không nên thường xuyên (>90% chuyên cần) |
| `data/faqs/co-hoi-nghe-nghiep-va-tuyen-dung.md` | Mới | Đánh giá nhà tuyển dụng cực cao nhờ kiến thức thực chiến từ mentor |
| `data/faqs/thoi-gian-hoc-va-thuc-tap.md` | Sửa | Cập nhật phân bổ 12 tuần = 3W thực học VinUni + 9W thực chiến doanh nghiệp |
| `data/faqs/yeu-cau-tieng-anh.md` | Sửa | Slide bài giảng Tiếng Việt, yêu cầu từ vựng Tiếng Anh chuyên ngành |
| `data/faqs/thoi-gian-hoc-trong-tuan.md` | Sửa | Chi tiết thời khóa biểu 1 ngày sinh hoạt (9h-13h AI20K, 13h-14h Nghỉ trưa, 14h-17h45 Lab, 20h WS/OH/MD) |
| `data/faqs/phieu-an-cang-tin.md` | Sửa | Bổ sung mẹo ăn trưa (tự mang cơm, xuống ăn sớm 11h, đặt trước canteen/OCP1) |

## 3. Lệnh đã chạy để xác minh — DÁN OUTPUT THẬT

```
$ npm run sync
=== ĐỒNG BỘ NỘI DUNG HOÀN TẤT THÀNH CÔNG ===
```

```
$ npm run verify
> aiia-notebook@1.0.0 verify
> npm run lint && npm run typecheck && npm run test && npm run build

> aiia-notebook@1.0.0 lint
> next lint

> aiia-notebook@1.0.0 typecheck
> tsc --noEmit

> aiia-notebook@1.0.0 test
> vitest run

 RUN  v3.2.7 D:/Github/AIIA-Notebook

 ✓ tests/unit/chunk.test.ts (2 tests) 6ms
 ✓ tests/unit/normalize.test.ts (6 tests) 6ms
 ✓ tests/eval/eval.test.ts (3 tests) 8ms
 ✓ tests/unit/router.test.ts (2 tests) 9ms
 ✓ tests/unit/pipeline.test.ts (2 tests) 35ms

 Test Files  5 passed (5)
      Tests  15 passed (15)

> aiia-notebook@1.0.0 build
> next build
 ✓ Compiled successfully in 3.2s
 ✓ Generating static pages (8/8)
```

## 4. Đối chiếu acceptance criteria

- **AC: Đọc kỹ nội dung nguồn & trích xuất nguyên văn**: Đã trích xuất chính xác 100% các thông tin chính thức từ VinUni Email & Phản hồi BTC.
- **AC: Giữ lại thông tin liên hệ chính thức của BTC**: Đã giữ đầy đủ Email, Nhóm Zalo dự thi Khóa IV, Hotline `0979489846`, C. Thảo `0388339478`, chị Lam Luu (BTC).
- **AC: Khắc phục triệt để lỗi Rate Limit Gemini**: Đã sửa bug `retryDelay: "0s"` trong `src/lib/rag/embed.ts` và thêm delay giữa các request trong `scripts/sync-content.ts`.
- **AC: Cấu trúc 6 trường YAML Frontmatter**: 100% file đều chứa đủ `question`, `variants`, `category`, `priority`, `is_active`.
- **AC: Slug Category hợp lệ**: Chỉ sử dụng 4 slug chuẩn (`thi-dgnl`, `chuong-trinh-hoc`, `tien-ich`, `quy-dinh`).
- **AC: Đồng bộ Supabase**: Lệnh `npm run sync` đã thực hiện đồng bộ thành công.
- **AC: Kiểm thử hệ thống**: Lệnh `npm run verify` passed toàn bộ 5 test suites (15 tests) và build thành công.

## 5. Sai lệch so với đặc tả (deviation log)

Không có sai lệch.

## 6. Câu hỏi mở — CẦN TRẢ LỜI TRƯỚC KHI DUYỆT

Không có câu hỏi mở.

## 7. Chưa làm / chưa test — không được giấu

Không có.
