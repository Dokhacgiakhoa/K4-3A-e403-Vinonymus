# PR: Add CV-based diagnostic test for AI Mentor

> **Task:** A-02 · **Issue:** #99 · **Branch:** `feat/A-02-cv-diagnostic-test`
> **Người thực hiện:** Thành với Codex · **Hỗ trợ:** —

## 1. Mục tiêu
Hoàn thiện nhiệm vụ AI Mentor: đọc nội dung CV hoặc mô tả năng lực của học viên, trích xuất kỹ năng, xác định lỗ hổng và sinh bài test năng lực online.

Luồng mới có schema đầu ra rõ ràng, prompt contract cho LLM, validate bằng zod và fallback rule-based khi model lỗi hoặc không có API key.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Thêm API `POST /api/ai-mentor/cv-diagnostic` gọi LLM qua `lib/llm/router.ts` | A-02 #99; AGENTS bất biến #5 |
| Thêm prompt/schema cho CV diagnostic, coi CV là dữ liệu không phải lệnh | `docs/04-ai-pipeline.md`; A-06 chuẩn bị chống instruction trong dữ liệu |
| Thêm 5 case eval riêng cho CV → bài test | Điều kiện xong của A-02 trong `docs/hackathon/tasks-he-thong-4-vai-tro.md` |
| UI hồ sơ gọi API để lấy câu hỏi test sinh từ CV, fallback về câu hỏi mẫu khi lỗi | Yêu cầu bỏ rule cố định trong màn hình mẫu |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/types/cv-diagnostic.ts` | Kiểu dữ liệu analysis/test/question cho CV diagnostic |
| `codebase/src/data/cv-diagnostic-question-bank.ts` | Ngân hàng skill và câu hỏi kiểm chứng được dùng làm fallback an toàn |
| `codebase/src/lib/ai-mentor/cv-diagnostic.ts` | Rule fallback, phân tích CV, materialize output AI đã validate |
| `codebase/src/lib/prompts/cv-diagnostic.ts` | Prompt contract, input schema, output schema và parser JSON |
| `codebase/src/app/api/ai-mentor/cv-diagnostic/route.ts` | Route API thật cho AI Mentor đọc CV và sinh bài test |
| `codebase/src/components/settings/user-profile-editor.tsx` | Gọi route CV diagnostic để modal bài test dùng câu hỏi sinh từ CV |
| `codebase/tests/unit/cv-diagnostic.test.ts` | Unit test cho phân tích CV, RAG skills và fallback output AI |
| `eval/cv-diagnostic-set.json` | 5 case eval cho A-02 |
| `eval/run-cv-diagnostic-eval.ts` | Runner eval riêng cho CV diagnostic |
| `eval/latest-cv-diagnostic-results.json` | Artifact kết quả eval mới |
| `eval/run_results.md` | Ghi kết quả 5/5 cho A-02 |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Đánh dấu A-02 #99 hoàn thành |
| `PR.md` | Mô tả PR hiện tại |

## 4. Kiểm thử
- `npx.cmd vitest run tests/unit/cv-diagnostic.test.ts` → pass, 3/3 tests.
- `npx.cmd tsx ../eval/run-cv-diagnostic-eval.ts` → pass, 5/5 = 100%.
- `npx.cmd tsc --noEmit` → pass.

Chưa chạy `npm run verify` toàn bộ vì task hiện tại chỉ đổi module AI Mentor, API route và UI nhỏ; các lệnh trọng tâm phía trên đã chạy thật.

## 5. Tài liệu & changelog
Đã cập nhật `eval/run_results.md` và trạng thái A-02 trong `docs/hackathon/tasks-he-thong-4-vai-tro.md`. Không cập nhật `spec.md` §9 vì không đổi chuẩn đạt.

## 6. Rủi ro / việc còn lại
- Nếu #98 chưa merge, PR này nên base vào `fix/mentor-golden-g02`; sau khi #98 merge thì có thể retarget về `main`.
- Route đã có fallback rule-based, nhưng chất lượng câu hỏi AI thật còn cần kiểm thử thêm bằng API key ở nhiều CV dài/PDF OCR.
- Phần đọc PDF thật vẫn cần backend/OCR; hiện route nhận `cv_text` đã extract hoặc mô tả văn bản.

Closes #99
