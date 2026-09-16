import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

base_dir = "leetcode/week-01-array"

# 1. MASTER GUIDE
master_guide = """# TỔNG QUAN TUẦN 01: KHỞI ĐỘNG VỚI ARRAY & GIT

**Thời gian:** Tuần 1 (Bắt đầu dự án)
**Chủ đề cốt lõi:** Cấu trúc dữ liệu Array (Mảng)

## 🎯 1. Mục Tiêu (Goals & OKRs)
Tuần này bạn cần làm quen với "nhịp độ" của dự án 1000 giờ. Mục tiêu không phải là nhồi nhét quá nhiều kiến thức, mà là **xây dựng thói quen** và **nắm chắc công cụ**.

- **Học thuật:** Hiểu sâu cách mảng lưu trữ trong RAM. Làm được 5 bài LeetCode Easy/Medium về Array.
- **Kỹ năng:** Thành thạo lệnh Terminal và Git cơ bản (`git init`, `git add`, `git commit`, `git push`).

## 🧠 2. Cần Học Những Gì?
1. **Lý thuyết Bộ nhớ (Memory):** Đọc file `THEORY.md` để hiểu tại sao Java Array lại nhanh hơn Python List trong một số trường hợp, và tại sao mảng lại có truy xuất O(1).
2. **Kỹ thuật Con trỏ (Pointers):** Hai con trỏ chạy cùng chiều, hoặc ngược chiều trên một mảng. Rất quan trọng để giải bài In-place (O(1) Space).
3. **Phân tích Big-O:** Tập thói quen nhìn vào vòng lặp `for` và nhẩm ra ngay thuật toán này là O(n) hay O(n^2).

## 🛠️ 3. Cần Làm Quen Với Gì?
1. **VS Code / IDE:** Mở 2 file `.py` và `.java` cạnh nhau (Split screen) để gõ code.
2. **Git/GitHub:** Làm quen với việc code xong bài nào thì gõ `git add .` và `git commit -m "feat: solved problem X"`. Trải nghiệm cảm giác nhìn "cỏ xanh" trên GitHub.

## 📝 4. Nhiệm Vụ Thực Hành (Coding)
Vào từng thư mục bài tập dưới đây, đọc đề trong `README.md` và code vào 2 file `.py` / `.java`. Cấm dùng Copilot viết hộ logic!
- [ ] `0088-merge-sorted-array`
- [ ] `0027-remove-element`
- [ ] `0026-remove-duplicates`
- [ ] `0169-majority-element`
- [ ] `0121-best-time-to-buy-and-sell-stock`
"""
create_file(f"{base_dir}/WEEK_01_MASTER_GUIDE.md", master_guide)

# 2. THEORY
theory_content = """# BẢN CHẤT CỦA ARRAY (MẢNG) TRONG BỘ NHỚ

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
"""
create_file(f"{base_dir}/THEORY.md", theory_content)

# 3. KHO LEETCODE
problems = [
    ("0088-merge-sorted-array", "Merge Sorted Array", "https://leetcode.com/problems/merge-sorted-array/"),
    ("0027-remove-element", "Remove Element", "https://leetcode.com/problems/remove-element/"),
    ("0026-remove-duplicates", "Remove Duplicates from Sorted Array", "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"),
    ("0169-majority-element", "Majority Element", "https://leetcode.com/problems/majority-element/"),
    ("0121-best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/")
]

for folder, title, link in problems:
    p_dir = f"{base_dir}/{folder}"
    
    # README
    readme = f"""# {title}

**Link LeetCode:** {link}
**Độ khó:** Easy
**Chủ đề:** Array, Two Pointers

## Yêu cầu:
(Đọc trên web LeetCode và tự tóm tắt lại vào đây)

## Phân tích Big O:
- **Time Complexity:** O(?) - Giải thích: ...
- **Space Complexity:** O(?) - Giải thích: ...
"""
    create_file(f"{p_dir}/README.md", readme)
    
    # Java Skeleton
    java = f"""class Solution {{
    // TODO: Triển khai logic bằng Java
    // Nhớ rằng Java tĩnh, sử dụng vòng lặp for (int i = 0; ...)
    
}}
"""
    create_file(f"{p_dir}/Solution.java", java)
    
    # Python Skeleton
    python = f"""class Solution:
    # TODO: Triển khai logic bằng Python
    # Hạn chế dùng hàm có sẵn (như .sort() hay .remove()), hãy cố gắng tự duyệt mảng
    pass
"""
    create_file(f"{p_dir}/solution.py", python)

print("Scaffolding for Week 1 completed successfully.")
