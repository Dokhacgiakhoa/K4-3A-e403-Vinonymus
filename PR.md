# PR: Giao việc xây hệ thống 4 vai trò

> **Task:** giao việc sau CP4 · **Issue:** — · **Branch:** `docs/team-task-assignment`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
PM phân vai lại từ 18/9: **Khoa** làm backend .NET, **Minh** chỉ làm database, **Đức và Thành** làm giao diện và AI. PR này tạo danh sách task nhỏ cho từng mảng, kèm điều kiện "xong khi" và thứ tự phụ thuộc, và đưa quy tắc "xong task nào commit task đó" vào quy ước chung.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Task backend B-01, B-02 | PR refactor backend Clean Architecture (nhánh `refactor/backend-clean-architecture`, đang làm) |
| Task database D-02 → D-04 | Phần thiết kế database trong PR #69 (không merge nguyên trạng vì dựng backend TypeScript + Supabase Auth song song với .NET) |
| Task U-01 → U-04 | Lỗ hổng đã ghi trong README mục "Luồng người dùng" (4 vai trò) |
| Task A-02, A-03 | 4 nhiệm vụ của AI Mentor trong README |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Mới: phân vai, cách làm việc, 30 task (B-01 → B-10, D-01 → D-06, U-01 → U-08, A-01 → A-06), sơ đồ thứ tự |
| `docs/hackathon/tasks.md` | Thêm link sang file mới; cập nhật vai trò trong bảng thành viên |
| `README.md` | Cập nhật cột "Vai trò chính" trong bảng thành viên; thêm link file giao việc |
| `AGENTS.md` | Thêm quy tắc: xong task nào commit task đó, không dồn commit/PR lớn |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Sơ đồ Mermaid thứ tự task: render kiểm tra, `valid: true`.
- Đối chiếu tên file/đường dẫn nhắc trong task với code thật trên `main`: `app-sidebar.tsx` (mục "Lộ Trình AI Mentor" → `/learning?mode=ai_roadmap`), `lib/client-storage.ts` (`tier`, `plan`), `backend-core/.../UserRole.cs` (`Visitor`/`Member`/`Lecture`/`SuperAdmin`), `codebase/database/migrations/` (mẫu tên `YYYYMMDD_*.sql`).
- `npm run verify` chạy tay trên nhánh này (hook pre-push không chạy trong worktree phụ vì thiếu thư mục husky): lint, typecheck, 89/89 test, audit FAQ 53 file, build — tất cả qua.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9: không đổi sản phẩm hay chuẩn đạt, chỉ phân việc.

## 6. Rủi ro / việc còn lại
- Chưa tạo GitHub Issue cho từng task mới (file `tasks.md` cũ có issue cho từng việc). Tạo issue sẽ gửi thông báo tới cả nhóm — để PM quyết.
- Cột hạn chưa có: PM đặt hạn theo lịch CP5/CP6.
