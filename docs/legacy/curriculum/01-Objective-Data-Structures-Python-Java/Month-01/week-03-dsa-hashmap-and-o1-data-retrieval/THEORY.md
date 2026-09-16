# LÝ THUYẾT: BẢN CHẤT CỦA HASHMAP (BẢNG BĂM)

## 1. Tại sao Hashmap lại có tốc độ O(1)?
Khi bạn lưu dữ liệu vào Array, bạn phải quét từ đầu đến cuối (O(N)) để tìm một phần tử. 
Nhưng Hashmap hoạt động như một quyển từ điển thần kỳ:
- Khi bạn ném một cái Key (Ví dụ: `"Apple"`) vào, nó sẽ đi qua một cái máy xay thịt gọi là **Hash Function (Hàm băm)**.
- Máy xay này nhổ ra một con số nguyên (Ví dụ: `15`).
- Nó lập tức nhảy đến đúng vị trí số `15` trong RAM và lấy Value ra cho bạn.
👉 Không cần quét, không cần lặp. Chọc thẳng vào RAM để lấy. Tốc độ tuyệt đối `O(1)`.

## 2. Collision (Đụng độ) là gì?
Máy xay thịt (Hash Function) không hoàn hảo. Đôi khi `"Apple"` và `"Banana"` bị xay ra **cùng một con số** (Ví dụ đều ra `15`). Đây gọi là Collision.
- **Java xử lý thế nào:** Tại vị trí số `15` đó, thay vì lưu 1 giá trị, Java sẽ mọc ra một cái **Linked List** (hoặc Red-Black Tree nếu quá dài) chứa cả Apple và Banana.
👉 Do đó, nếu Code quá tệ, tốc độ O(1) của Hashmap có thể bị rớt xuống O(N) hoặc O(logN).

## 3. HashSet vs HashMap
- **HashSet (Tập hợp):** Chỉ lưu Key, không lưu Value. Dùng để kiểm tra xem một phần tử đã từng xuất hiện hay chưa (Kiểm tra trùng lặp).
- **HashMap (Từ điển):** Lưu theo cặp Key-Value. Dùng để đếm tần suất (Ví dụ: Chữ 'A' xuất hiện 5 lần -> Key='A', Value=5).
