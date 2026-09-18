# PR: Tài khoản dùng thử theo vai trò và Lộ trình cá nhân hoá sau đăng nhập

> **Task:** U-01, U-02 (một phần) · **Issue:** #90, #91 · **Branch:** `feat/demo-role-accounts`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) · **Hỗ trợ:** Claude Code

## 1. Mục tiêu

- Backend .NET chưa deploy (B-03 → B-05), nên thêm **tài khoản dùng thử** Học viên / Giảng viên / Quản trị
  chạy trên trình duyệt để giám khảo xem được giao diện của từng vai trò. Mọi màn hình demo có dải
  "Bản demo giao diện — chưa nối backend".
- Đưa **Lộ trình cá nhân hoá** vào trang chỉ mở cho học viên đã đăng nhập (`/learning-path`), khớp mô hình
  truy cập đã chốt: khách chỉ dùng AI Helpdesk có giới hạn, AI Mentor dành cho học viên.

## 2. Truy vết

| Thay đổi | Yêu cầu liên quan |
|---|---|
| Menu theo vai trò (Học viên / Giảng viên / Quản trị) | U-01 #90 |
| Bỏ menu "Lộ Trình AI Mentor" dẫn tới wizard giả; menu học viên trỏ về trang lộ trình thật | U-02 #91 |
| `/learning-path` chỉ mở cho học viên; `/personalized-path`, `/planner`, `/ai-mentor` chuyển hướng về đây | Mô hình truy cập trong `spec.md` §1; ghi `spec.md` §9 |
| Trang Giảng viên (tạo nháp, gửi duyệt) và Quản trị (duyệt tài liệu, duyệt tài khoản) dùng dữ liệu mẫu | Luồng B-07/U-05/U-07 ở mức giao diện |

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `codebase/src/lib/demo/demo-accounts.ts` | Tài khoản demo, vai trò, dữ liệu mẫu tài khoản chờ duyệt và tài liệu giảng viên |
| `codebase/src/components/demo/demo-banner.tsx` | Dải cảnh báo "bản demo giao diện" |
| `codebase/src/components/auth/auth-modal.tsx` | Mục "Dùng thử nhanh" 3 vai trò |
| `codebase/src/components/layout/app-sidebar.tsx` | Menu theo vai trò, nút đổi vai trò demo, nhãn vai trò |
| `codebase/src/components/layout/main-header.tsx` | Thay bộ chuyển Free/Pro/Admin bằng vai trò demo |
| `codebase/src/lib/client-storage.ts` | Thêm vai trò `lecturer`, cờ `isDemo` |
| `codebase/src/components/lecturer/lecturer-documents-view.tsx`, `codebase/src/app/lecturer/documents/page.tsx` | Trang "Tài liệu của tôi" |
| `codebase/src/components/admin/document-review-view.tsx`, `codebase/src/app/admin/documents/page.tsx` | Trang "Duyệt tài liệu" |
| `codebase/src/components/admin/account-approval-view.tsx` | Chế độ demo dùng danh sách mẫu, không gọi backend |
| `codebase/src/components/planner/student-path-gate.tsx`, `codebase/src/app/learning-path/page.tsx` | Trang lộ trình sau đăng nhập |
| `codebase/src/app/personalized-path/page.tsx` | Xoá, thay bằng chuyển hướng trong `codebase/next.config.ts` |
| `codebase/src/components/presentation/slides-deck-view.tsx` | Slide trỏ về `/learning-path` |
| `README.md`, `spec.md`, `docs/02-kien-truc.md`, `docs/03-api.md`, `docs/05-ui-flow.md` | Đường dẫn mới; `spec.md` §9 thêm một dòng changelog |

## 4. Kiểm thử

- `npx tsc --noEmit`: không lỗi. `npx vitest run`: 101/101 test qua. `npm run lint`: không lỗi, không cảnh báo mới.
- Chạy `npm run dev`, thử trên trình duyệt:
  - Khách mở `/personalized-path` → chuyển sang `/learning-path`, hiện yêu cầu đăng nhập.
  - Dùng thử Học viên → vào trang lộ trình, menu học viên.
  - Đổi sang Giảng viên → "Tài liệu của tôi", gửi duyệt 1 tài liệu nháp.
  - Đổi sang Quản trị → tài liệu vừa gửi xuất hiện ở "Chờ duyệt (2)"; "Duyệt tài khoản" duyệt 1 tài khoản mẫu, danh sách còn 1.

## 5. Tài liệu & changelog

- `spec.md` §9 thêm dòng 18/9 (chiều). Không đổi chuẩn đạt §7.

## 6. Rủi ro / việc còn lại

- Tài khoản demo không có JWT: khi bật chốt đăng nhập (B-05), API lộ trình sẽ đòi token thật — tài khoản demo
  chỉ còn dùng được khi chưa bật chốt, hoặc phải thay bằng tài khoản demo thật (B-04).
- Trang Giảng viên / Quản trị chưa chặn theo vai trò ở route; gõ thẳng URL vẫn mở được (dữ liệu chỉ là mẫu).
