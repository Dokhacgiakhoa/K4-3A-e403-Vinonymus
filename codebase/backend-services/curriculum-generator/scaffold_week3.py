import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def scaffold_week_3():
    base_path = "01-Objective-Data-Structures-Python-Java/Month-01/week-03-dsa-hashmap-and-o1-data-retrieval"
    
    # 1. MASTER GUIDE
    guide = """# Hướng dẫn Tuần 03: Hashmap & O(1) Data Retrieval

## 🎯 Mục Tiêu
Tuần này chúng ta làm quen với một trong những cấu trúc dữ liệu quyền lực nhất giới Software Engineering: **Hashmap (Bảng băm)**.
- Hiểu được tại sao Hashmap lại tìm kiếm dữ liệu được với tốc độ O(1) (Nhanh như điện).
- Biết cách dùng Hashmap để đếm tần suất, kiểm tra trùng lặp và loại bỏ các vòng lặp lồng nhau (O(N^2)).

## 🧠 Cần Học Những Gì?
1. Đọc kỹ file `THEORY.md` để hiểu cơ chế ẩn dưới lớp vỏ của Hashmap (Hash Function & Collision).
2. Nghiền ngẫm file `00-SAMPLE-TUTORIAL.md`. Bài toán Two Sum là bài học vỡ lòng để bạn thấy "Đổi Không gian (Space) lấy Thời gian (Time)" nó kỳ diệu thế nào.

## 📝 Nhiệm Vụ Thực Hành
Vào 5 bài tập thực hành. Đọc đề và tự code giải thuật. Nhớ rằng: **Bắt buộc phải dùng Hashmap/HashSet, cấm dùng 2 vòng lặp for lồng nhau!**
"""

    # 2. THEORY
    theory = """# LÝ THUYẾT: BẢN CHẤT CỦA HASHMAP (BẢNG BĂM)

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
"""

    # 3. SAMPLE TUTORIAL
    sample = """# VÍ DỤ MẪU: TWO SUM (TÌM 2 SỐ CÓ TỔNG BẰNG TARGET)

**Đề bài:** Cho mảng số nguyên `nums` và một số `target`. Tìm chỉ số (index) của 2 số cộng lại bằng `target`.
**Ví dụ:** `nums = [2, 7, 11, 15], target = 9` -> Output: `[0, 1]` (Vì nums[0] + nums[1] = 2 + 7 = 9).

## Tư duy Ngây thơ (O(N^2))
Dùng 2 vòng lặp lồng nhau. Lấy số đầu tiên, đi cộng thử với toàn bộ số còn lại. Tốc độ rùa bò!

## Tư duy Hashmap: Đổi Không Gian lấy Thời Gian (O(N))
Ta dùng một cái Hashmap để "ghi nhớ" những số ta đã đi qua.
Khi đang đứng ở con số hiện tại `X`, ta tự hỏi: **"Mình cần con số Y nào để cộng lại bằng Target?"** (Y = Target - X).
Chỉ cần mở Sổ tay (Hashmap) ra tra xem mình đã từng gặp con số Y đó ở quá khứ chưa. Nếu có, lụm luôn!

## Lời giải Python
```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Dictionary lưu trữ dạng: {giá_trị_con_số: chỉ_số_của_nó}
        seen = {} 
        
        for i in range(len(nums)):
            current_num = nums[i]
            complement = target - current_num # Phần bù cần tìm
            
            if complement in seen: # Tra từ điển tốc độ O(1)
                return [seen[complement], i] # Tra thấy thì trả về ngay lập tức
                
            seen[current_num] = i # Nếu chưa thấy, lưu số hiện tại vào từ điển để chặng đường sau xài
            
        return []
```

## Lời giải Java
```java
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // HashMap lưu <Con số, Chỉ số của nó>
        HashMap<Integer, Integer> seen = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            
            seen.put(nums[i], i);
        }
        
        return new int[] {};
    }
}
```
"""

    # 4. PROBLEMS
    problems = [
        {
            "dir": "0217-contains-duplicate",
            "title": "Contains Duplicate",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/contains-duplicate/",
                "- **HackerRank:** (N/A nhưng có thể tìm bài tìm số trùng lặp cơ bản)"
            ],
            "tip": "Dùng `HashSet` để nhét từng số vào. Nếu `set.contains()` trả về true -> Trùng lặp!"
        },
        {
            "dir": "0383-ransom-note",
            "title": "Ransom Note",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/ransom-note/",
                "- **HackerRank:** https://www.hackerrank.com/challenges/ctci-ransom-note/problem"
            ],
            "tip": "Dùng `HashMap` để đếm tần suất xuất hiện (Frequency Map) của từng chữ cái."
        },
        {
            "dir": "0387-first-unique-character-in-a-string",
            "title": "First Unique Character in a String",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/first-unique-character-in-a-string/",
                "- **GeeksForGeeks:** https://practice.geeksforgeeks.org/problems/non-repeating-character-1587115620/1"
            ],
            "tip": "Chạy vòng for 2 lần. Lần 1: Đếm tần suất chữ cái lưu vào Hashmap. Lần 2: Check xem thằng nào có tần suất = 1 đầu tiên."
        },
        {
            "dir": "0349-intersection-of-two-arrays",
            "title": "Intersection of Two Arrays",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/intersection-of-two-arrays/",
                "- **HackerRank:** (Phép giao tập hợp cơ bản)"
            ],
            "tip": "Nhét mảng 1 vào `HashSet`. Quét mảng 2 xem phần tử nào đã có trong `HashSet` thì nó chính là phép giao."
        },
        {
            "dir": "0049-group-anagrams",
            "title": "Group Anagrams (Medium)",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/group-anagrams/"
            ],
            "tip": "BÀI TEST TƯ DUY KHÓ: Dùng một chuỗi đã được sắp xếp (Sorted String) làm Key trong `HashMap`. Value của nó là một danh sách (List) các chuỗi gốc."
        }
    ]

    create_file(f"{base_path}/WEEK_MASTER_GUIDE.md", guide)
    create_file(f"{base_path}/THEORY.md", theory)
    create_file(f"{base_path}/00-SAMPLE-TUTORIAL.md", sample)

    for p in problems:
        p_path = f"{base_path}/{p['dir']}"
        readme = f"# {p['title']}\n\n## 🎯 Nguồn Luyện Tập Đa Nền Tảng\n"
        for link in p['links']:
            readme += f"{link}\n"
        readme += f"\n## 💡 Gợi ý (Tip):\n{p['tip']}\n"
        readme += "\n## Phân tích Big O:\n- **Time Complexity:** O(?)\n- **Space Complexity:** O(?)\n"
        
        create_file(f"{p_path}/README.md", readme)
        create_file(f"{p_path}/solution.py", "class Solution:\n    # Code here\n    pass")
        create_file(f"{p_path}/Solution.java", "class Solution {\n    // Code here\n}")

    print("Scaffolded Week 03 manually!")

if __name__ == "__main__":
    scaffold_week_3()
