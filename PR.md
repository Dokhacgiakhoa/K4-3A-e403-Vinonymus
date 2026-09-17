# PR: Đổi quy ước mô tả PR từ srs.md sang PR.md, thêm rule cho Claude, Codex, Gemini

> **Task:** quy trình repo (ngoài bảng task) · **Issue:** — · **Branch:** `chore/pr-md-convention`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Mỗi PR trước đây kèm `srs.md` ở gốc repo để mô tả PR. Tên này dễ nhầm với SRS chính thức (`docs/01-SRS.md`). PR này đổi quy ước sang `PR.md` và lưu quy ước thành rule cho cả ba công cụ AI nhóm đang dùng. Nhờ vậy mọi người và mọi agent viết mô tả PR theo cùng một mẫu.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Quy ước `PR.md` | `AGENTS.md` mục Git |
| Rule cho 3 AI | `AGENTS.md` bối cảnh: "Áp dụng cho cả người và công cụ AI" |
| Checklist mẫu PR | `.github/pull_request_template.md` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `srs.md` → `PR.md` | Đổi tên; nội dung thay bằng mô tả PR này. Báo cáo T4-04 cũ vẫn còn trong lịch sử git (PR #53) |
| `AGENTS.md` | Thêm luật bắt buộc `PR.md` và đường dẫn rule của 3 AI |
| `.claude/skills/pr-md/SKILL.md` | Skill cho Claude Code |
| `.agents/skills/pr-md/SKILL.md` | Skill cho Codex (Gemini CLI cũng đọc thư mục này) |
| `.agents/rules/pr-md.md` | Rule `always_on` cho Gemini trong Antigravity |
| `.github/pull_request_template.md` | Thêm mục kiểm tra `PR.md`; sửa đường dẫn cũ `eval/results.md` → `eval/run_results.md` |

## 4. Kiểm thử
- Chỉ đổi tài liệu và file cấu hình AI, không đổi code.
- `npm run verify` chạy qua hook pre-push khi push branch này.
- **Chưa kiểm thử:** chưa mở Antigravity, Codex và Claude Code để xác nhận từng công cụ tự nhận rule/skill mới. Đường dẫn chọn theo tài liệu chính thức: Antigravity dùng `.agents/rules`, Codex dùng `.agents/skills`, Claude Code dùng `.claude/skills`.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì đây là thay đổi quy trình repo, không phải thay đổi sản phẩm.

## 6. Rủi ro / việc còn lại
- Mọi PR sau đều sửa `PR.md`, nên hai PR mở song song sẽ conflict ở file này. Khi merge, giữ bản của PR đang merge (đã ghi trong rule).
- Sửa quy ước thì phải sửa cả ba file rule cho giống nhau.
- PR #47 (`BE`) đang mở vẫn chưa có `PR.md`; cần bổ sung trước khi merge.
