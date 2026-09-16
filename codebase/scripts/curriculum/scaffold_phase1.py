import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def scaffold_dsa_weeks():
    # Cấu trúc Data cho Tuần 2: String
    weeks_data = {
        "01-Objective-Data-Structures-Python-Java/Month-01/week-02-dsa-string-manipulation-and-ascii": {
            "title": "String Manipulation & ASCII",
            "guide": """# Hướng dẫn Tuần 02: String & ASCII

## 🎯 Mục Tiêu
- Nắm vững tính chất Immutability (Bất biến) của String trong Java và Python.
- Làm quen với bảng mã ASCII và cách thao tác ký tự (char).
- Giải quyết 5 bài tập về String trên đa nền tảng (LeetCode, HackerRank, Codewars).

## 🧠 Cần Học Những Gì?
1. Đọc `THEORY.md` để hiểu vì sao cộng chuỗi `s += "a"` trong Java lại là thảm họa bộ nhớ O(N^2), và tại sao phải dùng `StringBuilder`.
2. Đọc `00-SAMPLE-TUTORIAL.md` về cách đảo ngược chuỗi (Reverse String) dùng kỹ thuật Two Pointers học từ tuần trước.

## 📝 Nhiệm Vụ Thực Hành
Vào 5 bài tập dưới đây, click vào bất kỳ link nền tảng nào bạn thích (LeetCode hoặc HackerRank) để đọc đề và code vào file rỗng.
""",
            "theory": """# LÝ THUYẾT: BẢN CHẤT CỦA STRING

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
""",
            "sample": """# VÍ DỤ MẪU: REVERSE STRING (ĐẢO NGƯỢC CHUỖI)

**Đề bài:** Cho một chuỗi ký tự (dưới dạng mảng char). Hãy đảo ngược nó tại chỗ (In-place O(1) Space).
**Ví dụ:** `['h', 'e', 'l', 'l', 'o']` -> `['o', 'l', 'l', 'e', 'h']`

## Tư duy: Hai Con Trỏ (Two Pointers)
- Con trỏ `left` đứng ở đầu, con trỏ `right` đứng ở cuối.
- Đổi chỗ (Swap) 2 ký tự cho nhau.
- `left` tiến lên, `right` lùi lại. Dừng lại khi `left >= right`.

## Lời giải Java
```java
class Solution {
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}
```
""",
            "problems": [
                {
                    "dir_name": "0344-reverse-string",
                    "title": "Reverse String",
                    "links": [
                        "- **LeetCode:** https://leetcode.com/problems/reverse-string/",
                        "- **HackerRank:** https://www.hackerrank.com/challenges/reverse-arrays/problem (Biến thể Array)"
                    ]
                },
                {
                    "dir_name": "0125-valid-palindrome",
                    "title": "Valid Palindrome",
                    "links": [
                        "- **LeetCode:** https://leetcode.com/problems/valid-palindrome/",
                        "- **Codewars:** https://www.codewars.com/kata/52774a314c2333f0a7000688 (Mức độ 6 kyu)"
                    ]
                },
                {
                    "dir_name": "0242-valid-anagram",
                    "title": "Valid Anagram",
                    "links": [
                        "- **LeetCode:** https://leetcode.com/problems/valid-anagram/",
                        "- **HackerRank:** https://www.hackerrank.com/challenges/make-it-anagram/problem"
                    ]
                },
                {
                    "dir_name": "0028-find-the-index-of-the-first-occurrence",
                    "title": "Find the Index of the First Occurrence in a String",
                    "links": [
                        "- **LeetCode:** https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
                        "- **GeeksForGeeks:** https://practice.geeksforgeeks.org/problems/implement-strstr/1"
                    ]
                },
                {
                    "dir_name": "0014-longest-common-prefix",
                    "title": "Longest Common Prefix",
                    "links": [
                        "- **LeetCode:** https://leetcode.com/problems/longest-common-prefix/",
                        "- **Codeforces:** (Phù hợp để luyện thêm kỹ năng xử lý mảng chuỗi)"
                    ]
                }
            ]
        }
    }

    # Generate the files
    for week_path, data in weeks_data.items():
        create_file(f"{week_path}/WEEK_MASTER_GUIDE.md", data["guide"])
        create_file(f"{week_path}/THEORY.md", data["theory"])
        create_file(f"{week_path}/00-SAMPLE-TUTORIAL.md", data["sample"])
        
        for prob in data["problems"]:
            prob_path = f"{week_path}/{prob['dir_name']}"
            
            readme_content = f"# {prob['title']}\n\n"
            readme_content += "## 🎯 Nguồn Luyện Tập Đa Nền Tảng\n"
            readme_content += "Bạn có thể đọc đề và submit code trên bất kỳ trang nào dưới đây:\n\n"
            for link in prob["links"]:
                readme_content += f"{link}\n"
            readme_content += "\n## Phân tích Big O:\n- **Time Complexity:** O(?)\n- **Space Complexity:** O(?)\n"
            
            create_file(f"{prob_path}/README.md", readme_content)
            create_file(f"{prob_path}/solution.py", f"class Solution:\n    # Code here\n    pass")
            create_file(f"{prob_path}/Solution.java", f"class Solution {{\n    // Code here\n}}")
            
    print("Scaffolded Week 02 successfully with multi-platform links!")

if __name__ == "__main__":
    scaffold_dsa_weeks()
