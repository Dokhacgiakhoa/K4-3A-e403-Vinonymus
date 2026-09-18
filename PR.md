# PR: Đặt hạn cho task hệ thống 4 vai trò (hạn chót 21:00 · 18/9)

> **Task:** quản lý task · **Issue:** #75 → #103 (28 issue đang mở) · **Branch:** `docs/task-deadlines`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
PM chốt hạn chót 21:00 hôm nay cho mọi task. PR này chia giờ nội bộ cho từng task theo thứ tự phụ thuộc, chừa giờ nộp CP5 (13:00) và tập/thuyết trình CP6 (16:30–18:30).

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Cột "Hạn" + mục 8 "Lịch hôm nay" | 28 task còn mở trong milestone "Hệ thống 4 vai trò" |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Thêm cột "Hạn" vào 4 bảng task; dòng hạn chót ở đầu file; mục 8 lịch theo giờ cho từng người |
| `PR.md` | Mô tả PR này |

Thay đổi trên GitHub (ngoài diff): milestone #7 đặt hạn 18/9, mô tả ghi 21:00; 28 issue đang mở thêm dòng "Hạn nội bộ".

## 4. Kiểm thử
- Script kiểm tra thứ tự: với cả 28 task, hạn của task luôn muộn hơn hạn của mọi task nó phải chờ — **0 vi phạm**.
- Mỗi người làm tuần tự, không trùng giờ; không xếp task nào vào 16:30–18:30.
- Kiểm tra cột bảng: mọi dòng task đủ 6 cột.
- Đọc lại issue mẫu #80 (B-08): có "Hạn nội bộ 19:45 · 18/9".
- `npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- **Lịch rất sát.** Buổi tối (18:30–21:00) dồn nhiều task nặng: B-08 (tải file + xử lý nền), A-03, A-05, A-06, U-05 → U-08. Chậm một task ở chiều là kéo trễ cả chuỗi phía sau.
- **B-03 (deploy) cần PM chọn nơi chạy** và có thể phải trả phí; nếu chưa chọn trước 14:00 thì B-04, B-05 cũng trễ.
- Giờ tập pitch/thuyết trình CP6 là giả định (16:30–18:30); lịch thật khác thì dời các task buổi chiều/tối tương ứng.
