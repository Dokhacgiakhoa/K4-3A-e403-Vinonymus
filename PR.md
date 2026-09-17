# PR: Chặn push thẳng vào main/production, cập nhật quy ước AI

> **Task:** bảo mật quy trình repo · **Issue:** — · **Branch:** `chore/block-direct-push`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Phát hiện 2 commit đêm 17→18/9 (`0d7c11f`, `dab02d4`) bị đẩy thẳng vào `main`, không qua PR, đứng tên chủ repo (qua Antigravity). Rà toàn bộ 81 commit trên `main`: không có thành viên nào khác push thẳng — chỉ có chủ repo, do GitHub Ruleset đang cho chủ repo bypass "always" (bỏ qua mọi luật, kể cả yêu cầu qua PR).

PR này sửa Ruleset để chủ repo chỉ được bypass khi **merge PR** (tự duyệt được), không còn bypass được khi **push thẳng**. Đồng thời ghi quy tắc này vào `AGENTS.md` và 3 file rule AI để các công cụ (Claude Code, Codex, Antigravity/Gemini) không thử push thẳng nữa.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Ruleset GitHub (ngoài repo, không có trong diff) | Quyết định của chủ repo, ghi lại trong mục 4 |
| Quy tắc "không push thẳng" | `AGENTS.md` mục Git; 3 file rule PR.md |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `AGENTS.md` | Thêm dòng đầu mục Git: cấm push thẳng vào `main`/`production`, mô tả quy trình nhánh → PR → merge |
| `.agents/rules/pr-md.md`, `.claude/skills/pr-md/SKILL.md`, `.agents/skills/pr-md/SKILL.md` | Thêm mục "Không push thẳng vào main / production" ngay đầu file (giống hệt nhau ở cả ba) |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- **Thay đổi trên GitHub (đã áp dụng trước khi mở PR này, không nằm trong diff code):** cập nhật Ruleset "Protect main and production branches" (id `23541708`) qua `gh api`:
  - Thêm `refs/heads/production` vào phạm vi áp dụng (trước chỉ có `refs/heads/main`).
  - Đổi `bypass_actors[0].bypass_mode` từ `"always"` sang `"pull_request"` cho `RepositoryRole: Admin`.
  - Xác nhận bằng cách đọc lại ruleset: `current_user_can_bypass` đổi từ `"always"` thành `"pull_requests_only"` — giá trị này GitHub tính trực tiếp từ luật, không phải suy đoán.
- **Không thử push thẳng thật vào `main`** để kiểm chứng, vì làm vậy sẽ tự vi phạm đúng quy tắc mình đang thêm. `git push --dry-run` không dùng được để kiểm tra vì không gửi yêu cầu cập nhật ref thật lên server, nên không kích hoạt luật phía server.
- `npm run verify` chạy qua hook pre-push khi push nhánh này (chỉ đổi tài liệu).

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì không đổi sản phẩm hay chuẩn đạt.

## 6. Rủi ro / việc còn lại
- Nếu cần merge PR thật gấp mà GitHub báo lỗi khi push nhánh (không phải merge, mà là push nhánh mới) thì không liên quan tới luật này — luật chỉ áp cho `refs/heads/main` và `refs/heads/production`, các nhánh khác vẫn push bình thường.
- Nếu sau này muốn thêm người review thật thay vì tự duyệt, đổi `bypass_mode` của Admin thành không có trong `bypass_actors` nữa, hoặc thêm reviewer khác vào PR trước khi merge.
