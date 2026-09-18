# PR: Chia lại việc giao diện và AI

> **Task:** quản lý task · **Issue:** #75 → #103 · **Branch:** `docs/reassign-ui-ai-tasks`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Nhóm thống nhất lại trên Discord (18/9, 12:48–12:55): **Khoa** làm backend + giao diện Student/Viewer, **Đức** làm AI Helpdesk + giao diện Admin/Lecturer, **Thành** làm AI Mentor, **Minh** giữ database. Mỗi vai trò có một giao diện riêng.

## 2. Truy vết
| Task | Trước | Sau |
|---|---|---|
| U-01 → U-04 (Student, Viewer) | Thành | Khoa |
| U-05 → U-08 (Lecturer, Admin) | Thành | Đức |
| A-01, A-02, A-03, A-06 (AI Mentor) | Đức | Thành |
| A-04, A-05 (thư viện, AI Helpdesk) | Đức | Đức |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Bảng phân vai; cột "Phụ trách" cho task giao diện/AI; U-01 đổi thành "tách giao diện riêng cho 4 vai trò"; hạn mới; lịch mục 8; cảnh báo Khoa quá tải và thứ tự cắt |
| `docs/hackathon/tasks.md`, `README.md` | Cập nhật vai trò thành viên |
| `PR.md` | Mô tả PR này |

Thay đổi trên GitHub (ngoài diff): 28 issue đang mở cập nhật hạn; 14 issue giao diện/AI đổi người phụ trách + nhãn `owner:*` + ghi chú chia lại; tiêu đề #90 (U-01); mô tả milestone #7.

## 4. Kiểm thử
- Script kiểm tra lịch: 0 task có hạn sớm hơn task nó phải chờ; không ai trùng giờ.
- Đọc lại qua `gh`: issue đang mở — Khoa 12, Minh 6, Đức 6, Thành 4; #90 đúng tiêu đề, người phụ trách, nhãn.
- Mọi dòng task trong bảng đủ số cột.
- `npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- **Khoa quá tải: 12 task** đến 21:00 (backend + giao diện Student/Viewer). Thứ tự cắt đề xuất: B-10 → U-04 → B-06; Minh có thể hỗ trợ B-08 buổi tối.
- Thành còn 4 task (nhẹ hơn các bạn) — có thể nhận thêm hỗ trợ nếu PM muốn.
