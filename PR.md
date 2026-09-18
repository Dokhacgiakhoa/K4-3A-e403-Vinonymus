# PR: Gắn GitHub Issue vào bảng giao việc 4 vai trò

> **Task:** quản lý task · **Issue:** #73 → #103 · **Branch:** `docs/link-task-issues`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Tạo GitHub Issue cho từng task trong `docs/hackathon/tasks-he-thong-4-vai-tro.md` (như `tasks.md` cũ có issue cho từng việc) và gắn số issue vào bảng để bấm được.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| 31 issue #73 → #103, milestone "Hệ thống 4 vai trò" (#7) | 30 task ban đầu + B-11 |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Gắn link issue cạnh mỗi mã task; thêm dòng hướng dẫn dùng issue/milestone |
| `PR.md` | Mô tả PR này |

Thay đổi trên GitHub (ngoài diff): 1 milestone, 31 issue theo mẫu issue cũ (nhãn `owner:*`, bảng Phụ trách/Hỗ trợ/Phải chờ/Xong khi, checklist). Cột "Phải chờ" trong issue có link sang issue của task phải chờ. B-01, B-02 (PR #71) và B-11 (PR #72) đã đóng kèm bình luận dẫn PR.

## 4. Kiểm thử
- Đọc lại qua `gh`: 31 issue trong milestone — 28 mở, 3 đóng; phân công Khoa 11, Thành 8, Đức 6, Minh 6 (khớp bảng).
- Mở issue mẫu #80 (B-08): đúng người phụ trách, nhãn, milestone; "Phải chờ" dẫn đúng #79, #86, #101.
- Bảng giao việc: 31/31 mã task có link issue.
- `npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- Issue chưa có hạn: PM đặt hạn (có thể thêm vào milestone hoặc từng issue).
