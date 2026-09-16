# BẢN CHẤT CỦA ARRAY (MẢNG) TRONG BỘ NHỚ

Dưới góc nhìn của một Kỹ sư Hệ thống, "Mảng" không chỉ là danh sách chứa các con số. Nó là cách CPU giao tiếp với RAM.

## 1. Array hoạt động như thế nào trong RAM?
Khi bạn khai báo một mảng (Static Array) 5 phần tử số nguyên (mỗi số 4 bytes), HĐH sẽ cấp phát cho bạn **1 khối bộ nhớ liên tục** dài đúng 20 bytes.
Vì nó "liên tục", CPU có thể nhảy đến bất kỳ vị trí nào ngay lập tức (O(1) Time) bằng công thức toán học:
`Địa_chỉ_phần_tử_i = Địa_chỉ_cơ_sở + (i * kích_thước_1_phần_tử)`

## 2. Trận chiến: Python List vs Java Array

### Java Array (Nhanh, Cứng nhắc)
- Khi khai báo `int[] arr = new int[5];`, Java khóa chặt độ dài mảng. Bạn không thể thêm phần tử thứ 6.
- Các con số nằm sát rạt nhau trong RAM. CPU lấy dữ liệu cực kỳ nhanh nhờ **CPU Caching** (Spatial Locality).

### Python List (Chậm, Linh hoạt)
- `arr = [1, 2, 3]` trong Python thực chất là một mảng **Dynamic Array** chứa các *con trỏ* (Pointers).
- Các con trỏ này trỏ lung tung đến các Object số nguyên nằm rải rác trong RAM.
- **Ưu điểm:** Bạn có thể `.append()` vô hạn. Python tự động tạo mảng mới to gấp đôi mảng cũ dưới background và copy dữ liệu sang.
- **Nhược điểm:** Tốn thêm bộ nhớ cho Pointers, và chậm hơn do CPU phải nhảy đi tìm địa chỉ thực sự (Cache Miss).

## 3. Tại sao các bài tập LeetCode tuần 1 lại bắt làm "In-place"?
Các bài như *Remove Element* yêu cầu thuật toán **O(1) Space Complexity**.
Nghĩa là bạn không được quyền khai báo một mảng `result` mới để chứa kết quả. Bạn phải dùng **2 con trỏ (Two Pointers)** lùa vòng quanh chính cái mảng cũ, ghi đè phần tử lên nhau để tiết kiệm RAM. Đây là kỹ năng sinh tồn của lập trình viên nhúng/game.
