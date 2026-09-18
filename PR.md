# PR: Kịch bản pitch — luồng hoạt động, demo đã chạy thử, hỏi đáp

> **Task:** T6-01 (#36), T6-02 (#37) · **Issue:** #36, #37 · **Branch:** `docs/pitch-flow-demo-qa`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Chuẩn bị cho CP6: bổ sung slide luồng hoạt động, sửa slide demo cho khớp web thật, thêm kịch bản demo từng bước và bộ câu hỏi giám khảo kèm trả lời.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Slide 7 "Luồng hoạt động" | `docs/05-ui-flow.md`, `docs/04-ai-pipeline.md`, `codebase/src/app/api/roadmap/route.ts` |
| Demo case ③ đổi từ G14 sang "chỉ rảnh 20 phút" | Chạy thử web chính: G14 chưa hỏi lại vì bản vá chưa lên `production` |
| Hỏi đáp | `02-guide.md` §5.2 (3 câu bắt buộc), `04-rubric.md` CP6 |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/hackathon/cp5/slide-content.md` | Viết lại theo deck 16 slide; thêm mục "Chuẩn bị demo" (dữ liệu nhập + kết quả chạy thử) và "Chuẩn bị hỏi đáp" (11 câu, ai trả lời) |
| `PR.md` | Mô tả PR này |

Slide web (ngoài repo) cập nhật lên 16 slide: https://claude.ai/artifact/TB2Lhp6t1rH7eqReAVZWFV

## 4. Kiểm thử
Gọi thật `POST https://k4-3a-e403-vinonymus.kailabs.io.vn/api/roadmap` lúc 15:13 · 18/9 (không gửi API key):
- Case chuẩn (tech-base, 60 phút, lab Prompt & Tool Calling): `plan`, 3 việc, tổng 60 phút, `source = baseline` (vì không có key).
- Xin đáp án / code giải: `refuse`, gợi ý liên hệ Lab Coach.
- 20 phút: `clarify` — "Bạn có thể dành ít nhất 30 phút không?".
- Lab không tồn tại: `clarify`.
- G14 (khai non-tech nhưng vận hành RAG production): `plan` — **chưa hỏi lại** trên `production` (nhánh `production` ở PR #61, `main` đi trước 63 commit).

Thời lượng cộng từ ghi chú slide: bản đủ ~10'05", bản 7 phút ~7'25", bản 6 phút ~5'45".
`npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- Demo cần **API key Gemini nhập sẵn** trên máy trình bày để kết quả mang nhãn AI.
- Không đưa `main` lên `production` trước CP6: `main` có code bắt đăng nhập; nếu Vercel đã đặt `NEXT_PUBLIC_BACKEND_CORE_URL` thì `/personalized-path` sẽ đòi đăng nhập và hỏng demo. PM quyết sau khi kiểm tra biến môi trường.
