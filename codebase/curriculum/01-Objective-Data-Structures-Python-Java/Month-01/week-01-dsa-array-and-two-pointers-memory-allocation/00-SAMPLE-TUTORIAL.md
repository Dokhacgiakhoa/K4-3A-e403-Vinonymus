# VÍ DỤ MẪU: KỸ THUẬT HAI CON TRỎ (TWO POINTERS) TRÊN MẢNG
*Hãy học kỹ ví dụ này trước khi bạn tự giải 5 bài tập thực hành.*

**Kiến thức trọng tâm:** Array In-place Manipulation (Thao tác mảng tại chỗ không tốn thêm bộ nhớ).
**Bài toán mẫu:** [283. Move Zeroes (LeetCode)](https://leetcode.com/problems/move-zeroes/)

## 1. Đề bài
Cho một mảng số nguyên `nums`. Hãy di chuyển tất cả các số `0` về cuối mảng, đồng thời **giữ nguyên thứ tự** của các số khác `0`.
**Điều kiện:** Phải làm "In-place" (O(1) Space), không được tạo mảng copy.

**Ví dụ:**
- Input: `nums = [0, 1, 0, 3, 12]`
- Output: `[1, 3, 12, 0, 0]`

## 2. Tư duy Thuật toán (Cách con người giải)
Nếu dùng cách "ngây thơ": Tạo mảng mới, nhét các số khác 0 vào, rồi điền số 0 vào cuối. Cách này tốn bộ nhớ O(N). Đề bài cấm!

**Kỹ thuật Hai Con Trỏ (Two Pointers):**
Ta dùng 2 "ngón tay" (2 biến index) chỉ vào mảng:
- `read_pointer` (Ngón trỏ): Chạy từ đầu đến cuối mảng để đọc từng con số.
- `write_pointer` (Ngón cái): Chỉ đứng im ở vị trí cần ghi đè số khác 0 vào. Khi nào ghi xong mới nhích lên 1 bước.

**Mô phỏng:** `[0, 1, 0, 3, 12]`
1. Ban đầu `read = 0`, `write = 0`.
2. `read` thấy số `0` -> Bỏ qua.
3. `read` tiến lên thấy số `1` -> Bốc số `1` ném vào vị trí của `write`. Mảng thành `[1, 1, 0, 3, 12]`. Sau đó `write` nhích lên vị trí số 1.
4. Cứ tiếp tục như vậy, tất cả số khác 0 sẽ bị dồn hết lên đầu mảng.
5. Khi `read` chạy hết mảng, ta chỉ việc nhét toàn bộ số `0` vào các vị trí từ `write` trở đi cho đến cuối mảng.

## 3. Lời giải Mẫu (Python & Java)

### Python (Dynamic Array)
```python
class Solution:
    def moveZeroes(self, nums: list[int]) -> None:
        write_pointer = 0
        
        # Bước 1: Dồn hết các số khác 0 lên đầu mảng
        for read_pointer in range(len(nums)):
            if nums[read_pointer] != 0:
                nums[write_pointer] = nums[read_pointer]
                write_pointer += 1
                
        # Bước 2: Điền số 0 vào phần còn lại của mảng
        while write_pointer < len(nums):
            nums[write_pointer] = 0
            write_pointer += 1
```

### Java (Static Array)
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int writePointer = 0;
        
        // Bước 1: Dồn các số khác 0 lên đầu
        for (int readPointer = 0; readPointer < nums.length; readPointer++) {
            if (nums[readPointer] != 0) {
                nums[writePointer] = nums[readPointer];
                writePointer++;
            }
        }
        
        // Bước 2: Phủ số 0 vào cuối
        while (writePointer < nums.length) {
            nums[writePointer] = 0;
            writePointer++;
        }
    }
}
```

## 4. Phân tích Độ phức tạp (Big O)
- **Time Complexity:** `O(N)`. Ta chạy qua mảng `N` phần tử đúng 1 lần bằng vòng lặp for/while. Tốc độ tuyến tính.
- **Space Complexity:** `O(1)`. Không hề tạo ra mảng mới, chỉ dùng 2 biến int `read_pointer` và `write_pointer` tốn vài bytes bộ nhớ.

---
👉 **Bài học rút ra:** Tư duy 2 con trỏ chạy cùng chiều là chìa khóa để giải quyết mọi bài toán dồn mảng, xóa phần tử trong mảng (O(1) space).

👉 **Bây giờ đến lượt bạn:** Áp dụng tư duy này để giải 2 bài tập `0027-remove-element` và `0026-remove-duplicates` trong thư mục Tuần 1. Đề bài ở LeetCode hoàn toàn dùng chung 1 logic này!
