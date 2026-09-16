# Báo cáo: Phase 1 — Bổ sung Bài FAQ & Ảnh Hướng dẫn Ôn tập ĐGNL Khóa IV (Đợt 1)

## 1. Đối chiếu checklist
- [x] Đã trích xuất nội dung 3 ảnh chụp bài đăng Facebook chính thức từ Fanpage Đào tạo Nhân tài AI thực chiến.
- [x] Đã tạo tệp FAQ mới `data/faqs/huong-dan-on-tap-dgnl-khoa-4.md` thuộc category `thi-dgnl` theo đúng Cấu trúc Dữ liệu 3 Phần.
- [x] Đã lưu 3 tệp ảnh chụp bằng chứng vào `public/images/faqs/` với tên chuẩn `kebab-case.png`.
- [x] Đã gắn liên kết ảnh vào `media_links` và phần 3 (Hidden Media & Links) của file markdown.
- [x] Tự chạy `npm run verify` (`lint` + `typecheck` + `vitest` + `build`) xác nhận **PASSED 100%** và git push lên `main`.

## 2. File đã tạo/sửa
| File | Loại thay đổi | Tóm tắt |
|---|---|---|
| `data/faqs/huong-dan-on-tap-dgnl-khoa-4.md` | Mới | FAQ Hướng dẫn ôn tập 4 nhóm kiến thức trọng tâm kỳ thi ĐGNL Khóa IV Đợt 1. |
| `public/images/faqs/huong-dan-on-tap-dgnl-khoa-4-infographic.png` | Mới | Infographic chính thức "ÔN GÌ? KHI ĐI THI ĐÁNH GIÁ NĂNG LỰC". |
| `public/images/faqs/huong-dan-on-tap-dgnl-khoa-4-post-p1.png` | Mới | Bài đăng chính thức Bật mí Vòng Đánh giá Năng lực Khóa IV Đợt 1 (Phần 1). |
| `public/images/faqs/huong-dan-on-tap-dgnl-khoa-4-post-p2.png` | Mới | Hướng dẫn kiểm tra email dự thi & Thông tin liên hệ tư vấn tuyển sinh (Phần 2). |

## 3. Lệnh đã chạy để xác minh — Output thật
```
$ npm run verify
> aiia-notebook@1.0.0 verify
> npm run lint && npm run typecheck && npm run test && npm run build

> aiia-notebook@1.0.0 typecheck
> tsc --noEmit

> aiia-notebook@1.0.0 test
> vitest run
 RUN  v3.2.7 D:/Github/AIIA-Notebook
 ✓ tests/unit/normalize.test.ts (6 tests) 7ms
 ✓ tests/unit/chunk.test.ts (2 tests) 7ms
 ✓ tests/eval/eval.test.ts (3 tests) 7ms
 ✓ tests/unit/router.test.ts (2 tests) 7ms
 ✓ tests/unit/pipeline.test.ts (2 tests) 46ms
 Test Files  5 passed (5)
      Tests  15 passed (15)

> aiia-notebook@1.0.0 build
> next build
 ✓ Compiled successfully in 3.2s
 ✓ Generating static pages (9/9)
```

```
$ git push origin main
To https://github.com/Dokhacgiakhoa/aiia-notebook.git
   0bb260e..1a65dc8  main -> main
```

## 4. Đối chiếu acceptance criteria
- **AC1: Thêm FAQ đúng 6 bước trong AGENTS.md**: Nội dung dựa 100% trên bài đăng nguồn, không thêm thông tin suy luận, đúng 1 trong 4 category (`thi-dgnl`).
- **AC2: 3-Part Data Architecture**: Part 1 (Notebook text), Part 2 (RAG keywords), Part 3 (Media Links below `---`).
- **AC3: Bằng chứng chính xác**: Lưu ảnh chụp nguồn từ Fanpage chính thức vào `public/images/faqs/`.

## 5. Sai lệch so với đặc tả (deviation log)
- Không có sai lệch. Tất cả quy tắc đặt tên, category và bảo mật đều được tuân thủ.

## 6. Câu hỏi mở — CẦN TRẢ LỜI TRƯỚC KHI DUYỆT
- Không có câu hỏi mở.

## 7. Chưa làm / chưa test — không được giấu
- Đã hoàn thành 100% và kiểm thử build PASSED.
