# LÝ THUYẾT: BẢN CHẤT CỦA STRING

## 1. String Immutability (Sự bất biến)
Trong cả Java và Python, String là bất biến (Immutable). Nghĩa là một khi chuỗi được tạo ra trong RAM, bạn **KHÔNG THỂ** thay đổi nó. 

**Ví dụ:** Khi bạn thực hiện `s = s + "a"`, máy tính không hề nhét chữ "a" vào cuối chuỗi `s` hiện tại. Nó sẽ **tạo ra một chuỗi mới hoàn toàn**, sao chép toàn bộ chuỗi cũ sang chỗ mới, rồi mới thêm "a" vào.
👉 **Hệ quả:** Nếu bạn nối chuỗi 10,000 lần trong một vòng lặp `for`, bạn sẽ tạo ra 10,000 cái chuỗi rác trong RAM, độ phức tạp thời gian biến thành O(N^2).

## 2. Giải pháp: StringBuilder / Danh sách ký tự
- **Trong Java:** Phải dùng `StringBuilder` để nối chuỗi (Nó là một Array có thể phình to).
- **Trong Python:** Dùng một List chứa các ký tự `['a', 'b', 'c']`, sau đó nối lại bằng `"".join(list)`.

## 3. Bảng mã ASCII
Mỗi ký tự (char) thực chất chỉ là một con số nguyên (int) từ 0 đến 255.
- Ký tự `'a'` = 97, `'b'` = 98 ... `'z'` = 122.
- Ký tự `'A'` = 65, `'B'` = 66 ... `'Z'` = 90.
👉 Bạn có thể dùng phép trừ: `'c' - 'a' = 2` để giải quyết rất nhiều bài toán đếm tần suất chữ cái (Tạo một mảng int[26]).
