# PR: Cập nhật README theo lỗ hổng curriculum/payments vừa vá

> **Task:** đồng bộ README · **Issue:** — · **Branch:** `docs/readme-access-model`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
PR #65 đã sửa backend để endpoint ghi danh/tiến độ/chứng chỉ/thanh toán lấy người dùng từ token thay vì nhận `userId` từ request, nhưng README chưa nhắc tới việc này. README cũng chưa nói rõ cách Lộ trình cá nhân hoá vẫn mở tự do khi chạy local không cấu hình backend.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Dòng backend trong bảng Trạng thái prototype | PR #65 (vá lỗ hổng curriculum/payments) |
| Hướng dẫn Chạy thử | `.env.example` mục Backend .NET (thêm ở PR #64) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `README.md` | Dòng backend trong bảng Trạng thái prototype ghi thêm việc đã vá lỗ hổng; mục Chạy thử nói rõ để trống biến backend thì không bắt đăng nhập |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Chỉ đổi tài liệu. `npm run verify` chạy qua hook pre-push.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì không đổi sản phẩm hay chuẩn đạt.

## 6. Rủi ro / việc còn lại
- Không có.
