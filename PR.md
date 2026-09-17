# PR: Tích hợp Discord Activity (+5 XP), mở rộng 50 Golden cases và tối ưu Eval đạt 100%

> **Task:** T4-05, T4-06 · **Issue:** — · **Branch:** `main`
> **Người thực hiện:** Đinh Ngọc Đức (`@Duc`), Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Antigravity

## 1. Mục tiêu
- Tích hợp API ghi nhận tiến độ học tập và cộng điểm kinh nghiệm (+5 XP) lên Discord Server AI20K qua kênh `#activity` với Dual-Mode (Mock Sandbox cho môi trường chấm điểm/demo an toàn và Live Webhook cho production).
- Mở rộng bộ kiểm thử tự động từ 20 case lên **50 case độc lập** trong `eval/golden-set.json` theo **Mô hình Khách hàng kép (Dual-Stakeholder)**:
  - **40 case Nỗi đau Học viên (80%):** phân mảnh học liệu, ngợp tài liệu, học lệch trình độ (non-tech/tech-base/AI), thiếu thời gian.
  - **10 case Nỗi đau Hệ thống VLearn & Vận hành (20%):** tập trung giải quyết triệt để 3 nhóm rủi ro lớn: **Lỗi hệ thống** (Unhandled Exception 500, repo 404, DoS token 0m), **Bị bypass** (leo thang đặc quyền nộp bài sau deadline 23h59, lách guardrail làm giả hoãn nộp), và **Leak tài liệu ra ngoài** (lộ barem đáp án, code giải mẫu, testcase ẩn, system prompt, API key).
- Nâng cấp thuật toán Baseline Planner với cơ chế phát hiện mâu thuẫn (`hasContradiction`), tôn trọng yêu cầu loại trừ (`isExcludedByNote`), nâng tỷ lệ pass rate từ 85% (17/20) lên **100% (50/50)**.
- Chuẩn hóa và đóng 100% toàn bộ các Checkpoint CP1–CP4 trong tài liệu dự án.

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| Module Discord Activity API | FR-P07 trong `docs/01-SRS.md`, đặc tả chi tiết `docs/feature-discord-api.md` |
| Mở rộng Golden set lên 50 case | §7 trong `spec.md`, `eval/run_results.md` |
| Bộ lọc mâu thuẫn & loại trừ baseline | FR-P02, FR-P03 trong `docs/01-SRS.md`, `docs/04-ai-pipeline.md` |
| Đồng bộ Checkpoint CP1–CP4 100% | `docs/hackathon/checkpoints.md`, `docs/hackathon/tasks.md` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/types/discord.ts` | Thêm kiểu dữ liệu và Zod schema cho Discord Activity payload & response |
| `codebase/src/lib/integrations/discord-service.ts` | Triển khai Dual-Mode service (Mock Sandbox + Live Webhook) định dạng chuẩn Discord Embed |
| `codebase/src/app/api/integrations/discord/activity/route.ts` | Route handler POST xử lý tích hợp Discord Activity |
| `codebase/src/data/planner-catalog.ts` | Bổ sung tag `human control` cho `aps-pair` |
| `codebase/src/lib/planner/baseline-planner.ts` | Thêm `hasContradiction`, `isExcludedByNote`, tối ưu quy tắc lấp nhiệm vụ cho học viên AI |
| `codebase/src/lib/prompts/planner.ts` | Bổ sung chỉ dẫn ưu tiên xếp nhiệm vụ khớp nhu cầu lên đầu mảng tasks |
| `codebase/tests/unit/discord-service.test.ts` | 10 unit tests cho Discord service |
| `codebase/tests/unit/discord-route.test.ts` | 3 unit tests cho Discord route API |
| `codebase/tests/unit/baseline-planner.test.ts` | Bổ sung unit tests cho phát hiện mâu thuẫn và loại trừ item |
| `eval/golden-set.json` | Mở rộng từ 20 lên 50 test cases độc lập (G01–G50) gắn với 50 mã tham chiếu data pack |
| `eval/run-eval.ts` | Nâng ngưỡng kiểm tra số lượng case tối thiểu lên 50 |
| `eval/latest-baseline-results.json` | Kết quả chạy thật 50/50 case baseline (100%) |
| `eval/run_results.md` | Báo cáo chi tiết cơ cấu 50 case và phân tích các ca cải tiến |
| `docs/feature-discord-api.md` | Đặc tả kỹ thuật đầy đủ cho tính năng Discord Activity API |
| `docs/01-SRS.md` | Đóng toàn bộ các mục `[TODO]` chưa chốt tại §7 |
| `docs/research/evidence-mining.md` | Làm rõ cơ cấu 52 tin nhắn E1 (4 tin xin trực tiếp + 48 tin chia sẻ link) |
| `docs/hackathon/checkpoints.md` | Đánh dấu hoàn thành 100% cho CP1, CP2, CP3, CP4 |
| `docs/hackathon/tasks.md` | Cập nhật tiến độ task và milestone thành viên |
| `spec.md` | Cập nhật §1, §7 (bảng 50 case) và §9 (changelog) |
| `README.md` | Cập nhật bảng trạng thái Checkpoints 100% |

## 4. Kiểm thử
- `npm run verify` (`lint` + `typecheck` + `test` + `audit` + `build`):
  - ESLint: 0 error.
  - TypeScript: 0 error (`tsc --noEmit`).
  - Unit tests: **88/88 passed** (16 test suites).
  - FAQ Audit: 53 files reviewed, 0 critical errors, 0 warnings.
  - Build: 24/24 static/dynamic routes build thành công.
- `npx tsx ../eval/run-eval.ts baseline`:
  - Chạy thực tế toàn bộ 50 case: **50/50 passed = 100%**.
  - **0 link ngoài catalog**.
  - Toàn bộ case ngoài phạm vi trả `refuse` 100%.

## 5. Tài liệu & changelog
- Đã tạo `docs/feature-discord-api.md`.
- Đã cập nhật `docs/00-muc-luc.md`, `docs/03-api.md`, `docs/01-SRS.md`, `docs/research/evidence-mining.md`.
- Đã ghi mục mới vào `spec.md` §9 Changelog (18/9).

## 6. Rủi ro / việc còn lại
- Không có. Tất cả các case kiểm thử và build đều đã vượt qua 100%.
