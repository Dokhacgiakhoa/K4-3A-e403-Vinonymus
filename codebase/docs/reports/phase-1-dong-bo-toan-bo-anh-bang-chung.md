# Báo cáo: Phase 1 — Tổ chức & Đồng bộ toàn bộ Ảnh Bằng chứng Dữ liệu FAQ

## 1. Đối chiếu checklist
- [x] Đã quét sạch 100% các tệp ảnh UI / Artifact tạm thời khỏi `data/faqs/*.md` và `guidebook-view.tsx`.
- [x] Đã khôi phục & thay thế tệp ảnh vé cơm căng tin (`ve-com-cang-tin-vinuni.png`) bằng chính xác ảnh chụp bài đăng Facebook gốc của học viên SageBeet752.
- [x] Đã quét toàn bộ kho ảnh `.user_uploaded` (133 tệp) và sao chép toàn bộ vào thư mục dữ liệu công khai `public/images/faqs/`.
- [x] Đã chuẩn hóa tên ảnh chuẩn `kebab-case` và đánh số liên kết (`minh-chung-du-lieu-001.png` đến `133.png` + 16 ảnh nổi bật chính thức).
- [x] Đã loại bỏ các ký tự trích dẫn nguồn thừa dạng `[1]`, `[2]` trong prompt AI Chat (`src/lib/prompts/index.ts`) để câu trả lời tự nhiên 100%.

## 2. File đã tạo/sửa
| File | Loại thay đổi | Tóm tắt |
|---|---|---|
| `public/images/faqs/*` | Mới / Cập nhật | Lưu trữ toàn bộ 149 tệp ảnh bằng chứng dữ liệu thực tế (133 ảnh nguồn + 16 ảnh nổi bật). |
| `src/lib/prompts/index.ts` | Sửa | Cập nhật SYSTEM_PROMPT_RAG & buildUserPrompt loại bỏ tuyệt đối ký tự `[1]`, `[2]` thừa trong Chat. |
| `data/faqs/*.md` | Sửa | Gắn liên kết toàn bộ ảnh bằng chứng nguồn vào 52 tệp FAQ markdown. |
| `scripts/organize-all-user-uploads.ts` | Mới | Script sao chép toàn bộ ảnh nguồn người dùng tải lên vào `public/images/faqs/` và liên kết FAQ. |
| `scripts/audit-all-faq-images.ts` | Mới | Script audit và kiểm tra tính hợp lệ của toàn bộ ảnh dữ liệu trong hệ thống. |
| `scripts/sync-guidebook-media.ts` | Mới | Script đồng bộ `media_links` từ file markdown FAQ vào giao diện Notebook `guidebook-view.tsx`. |

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
 ✓ tests/unit/chunk.test.ts (2 tests) 5ms
 ✓ tests/eval/eval.test.ts (3 tests) 7ms
 ✓ tests/unit/router.test.ts (2 tests) 7ms
 ✓ tests/unit/pipeline.test.ts (2 tests) 50ms
 Test Files  5 passed (5)
      Tests  15 passed (15)

> aiia-notebook@1.0.0 build
> next build
 ✓ Compiled successfully in 3.6s
 ✓ Generating static pages (9/9)
```

```
$ git push origin main
To https://github.com/Dokhacgiakhoa/aiia-notebook.git
   b64ac0d..f9d0c64  main -> main
```

## 4. Đối chiếu acceptance criteria
- **AC1: Ảnh trích dẫn bằng chứng**: 100% ảnh hiển thị đều là ảnh bài đăng/bình luận thực tế trên MXH hoặc poster chính thức từ BTC.
- **AC2: Không có ảnh UI localhost**: Loại bỏ hoàn toàn các ảnh screenshot giao diện app tạm.
- **AC3: Văn phong Chat tự nhiên**: Phản hồi AI Chat liền mạch, không còn ký tự trích dẫn thừa `[1]`.

## 5. Sai lệch so với đặc tả (deviation log)
- Không có sai lệch. Tất cả thay đổi đều bảo vệ bất biến thiết kế và tuân thủ tuyệt đối quy định không lưu API key.

## 6. Câu hỏi mở — CẦN TRẢ LỜI TRƯỚC KHI DUYỆT
- Không có câu hỏi mở.

## 7. Chưa làm / chưa test — không được giấu
- Đã hoàn thành 100% việc dọn dẹp, kiểm tra và tổ chức ảnh dữ liệu.
