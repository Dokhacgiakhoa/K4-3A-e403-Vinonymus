# PR: Prioritize direct learner notes in AI planner

> **Task:** AI Mentor golden set · **Issue:** #98 · **Branch:** `fix/mentor-golden-g02`
> **Người thực hiện:** Thành với Codex · **Hỗ trợ:** —

## 1. Mục tiêu
Sửa case G02 của AI golden set: học viên tech-base đã biết code nhưng ghi rõ chưa hiểu tool calling/function calling thì tài liệu `ptc-function-calling` phải được ưu tiên trước khi lọc theo quỹ thời gian.

Thay đổi chỉ nằm ở bước materialize output LLM về catalog đã kiểm chứng. Link, title, minutes vẫn lấy từ catalog, không tin trực tiếp vào dữ liệu model sinh ra.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Ưu tiên item khớp trực tiếp ghi chú học viên trước khi lọc thời lượng | `spec.md` §7 quality bar; `docs/04-ai-pipeline.md` guardrail catalog |
| Thêm regression test cho G02 khi model xếp `ptc-function-calling` ở vị trí muộn | Golden set G02 trong `eval/golden-set.json` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/lib/planner/ai-planner.ts` | Thêm ranking hậu xử lý cho các item LLM chọn: khớp ghi chú học viên, ưu tiên `core`, giữ fallback an toàn qua catalog |
| `codebase/tests/unit/ai-planner.test.ts` | Thêm test đảm bảo `ptc-function-calling` được đưa lên trước khi tổng thời lượng bị cắt |
| `eval/latest-baseline-results.json` | Artifact sau khi chạy baseline eval |
| `eval/latest-ai-results.json` | Artifact sau khi chạy AI eval thật |
| `eval/run_results.md` | Ghi kết quả eval mới |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Đánh dấu A-01 #98 đã hoàn thành theo điều kiện issue |
| `PR.md` | Mô tả PR hiện tại |

## 4. Kiểm thử
- `npx.cmd vitest run tests/unit/ai-planner.test.ts tests/unit/baseline-planner.test.ts` → pass, 14/14 tests.
- `npx.cmd tsx ../eval/run-eval.ts baseline` → pass, 50/50 = 100%.
- `npx.cmd tsx ../eval/run-eval.ts ai` → fail tổng bộ theo chuẩn runner, 44/50 = 88%. G02 đã pass với `source = ai`.
- Test thủ công route `/api/roadmap` trên máy local → `source = ai`, task đầu là `ptc-function-calling`, tiếp theo `ptc-structured-output`.

Các case AI còn fail trong lượt này: G01, G19, G27, G28, G29, G47. Đây là việc còn lại ngoài phạm vi fix G02.

## 5. Tài liệu & changelog
Đã cập nhật `eval/run_results.md` bằng số chạy thật. Không cập nhật `spec.md` §9 vì không đổi yêu cầu sản phẩm.

## 6. Rủi ro / việc còn lại
- AI eval toàn bộ chưa đạt quality bar 90%: đang 44/50 = 88%.
- Cần xử lý tiếp nhóm fail còn lại bằng ranking theo level `basic`/`advanced`, giảm fallback baseline ở route AI, và chặn item cấm theo `must_not_include`.

Closes #98
