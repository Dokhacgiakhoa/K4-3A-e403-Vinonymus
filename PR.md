# PR: Create student learning path from diagnostic score

> **Task:** A-03 · **Issue:** #100 · **Branch:** `feat/A-03-diagnostic-learning-path`
> **Người thực hiện:** Thành với Codex · **Hỗ trợ:** —

## 1. Mục tiêu
Hoàn thiện nhiệm vụ AI Mentor: sau khi học viên làm bài test năng lực, hệ thống chấm điểm, xác định kỹ năng yếu và tạo lộ trình học chỉ từ thư viện tài liệu đã kiểm chứng.

Luồng này chỉ phục vụ vai trò Student. Nếu role là Viewer, Lecturer hoặc Admin thì API từ chối, tránh việc AI Mentor sinh nội dung không phù hợp với giao diện/vai trò học viên.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Chấm bài diagnostic thành `scorePercent`, `weakSkillIds`, `verifiedSkillIds` | A-03 #100; phụ thuộc A-02 |
| Map weak skills sang item trong `planner-catalog.ts` | Bất biến: link hiển thị cho học viên chỉ lấy từ catalog |
| API `POST /api/ai-mentor/diagnostic-learning-path` chỉ nhận role Student để tạo plan | Yêu cầu role Student; `docs/hackathon/tasks-he-thong-4-vai-tro.md` |
| Thêm 5 case eval cho điểm test → lộ trình | Điều kiện xong của A-03 |
| Thêm eval gọi thẳng route `POST /api/ai-mentor/cv-diagnostic` bằng Gemini thật | Bổ sung bằng chứng A-02 tạo bài test bằng agent thật, không chỉ rule fallback |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/types/cv-diagnostic.ts` | Thêm kiểu answer, score, role và input tạo lộ trình |
| `codebase/src/lib/ai-mentor/diagnostic-learning-path.ts` | Chấm bài test và tạo Student learning path từ điểm diagnostic |
| `codebase/src/lib/prompts/diagnostic-learning-path.ts` | Zod schema cho API submit điểm test |
| `codebase/src/app/api/ai-mentor/diagnostic-learning-path/route.ts` | Route API tạo lộ trình từ điểm test |
| `codebase/src/lib/prompts/cv-diagnostic.ts` | Chuẩn hóa alias output LLM trước khi validate schema |
| `codebase/src/lib/ai-mentor/cv-diagnostic.ts` | Bù câu hỏi từ question bank khi AI parse được analysis nhưng thiếu câu hỏi hợp lệ |
| `codebase/tests/unit/diagnostic-learning-path.test.ts` | Unit test chấm điểm, tạo plan Student, từ chối role khác |
| `codebase/tests/unit/cv-diagnostic.test.ts` | Unit test repair câu hỏi CV diagnostic |
| `eval/diagnostic-learning-path-set.json` | 5 case eval cho A-03 |
| `eval/run-diagnostic-learning-path-eval.ts` | Runner eval A-03 |
| `eval/run-cv-diagnostic-ai-eval.ts` | Runner gọi API route CV diagnostic thật qua Gemini |
| `eval/latest-diagnostic-learning-path-results.json` | Artifact kết quả eval A-03 |
| `eval/latest-cv-diagnostic-ai-results.json` | Artifact kết quả eval route AI thật |
| `eval/run_results.md` | Ghi kết quả eval A-03 và AI route CV diagnostic |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Đánh dấu A-03 #100 hoàn thành |
| `PR.md` | Mô tả PR hiện tại |

## 4. Kiểm thử
- `npx.cmd vitest run tests/unit/diagnostic-learning-path.test.ts tests/unit/cv-diagnostic.test.ts` → pass, 6/6 tests.
- `npx.cmd tsx ../eval/run-diagnostic-learning-path-eval.ts` → pass, 5/5 = 100%.
- `npx.cmd tsx ../eval/run-cv-diagnostic-ai-eval.ts` → pass, 5/5 = 100%, cả 5 case trả `source = ai` qua Gemini.
- `npx.cmd tsc --noEmit` → pass.

Chưa chạy `npm run verify` toàn bộ vì PR này tập trung vào AI Mentor domain/API/eval; các lệnh trọng tâm phía trên đã chạy thật.

## 5. Tài liệu & changelog
Đã cập nhật `eval/run_results.md` và trạng thái A-03 trong `docs/hackathon/tasks-he-thong-4-vai-tro.md`. Không cập nhật `spec.md` §9 vì không đổi chuẩn đạt.

## 6. Rủi ro / việc còn lại
- PR này nằm trên nền A-02. Nếu A-02 chưa merge, base PR vào `feat/A-02-cv-diagnostic-test`; sau khi A-02 merge thì retarget về `main`.
- Lộ trình hiện lấy từ catalog tĩnh. Khi backend/thư viện lecturer thật sẵn sàng, cần thay nguồn catalog bằng API thư viện đã duyệt nhưng vẫn giữ rule catalog-only.
- UI submit điểm test vào route mới chưa nối sâu; phần này đã có API/domain/eval để frontend Student gọi tiếp.

Closes #100
