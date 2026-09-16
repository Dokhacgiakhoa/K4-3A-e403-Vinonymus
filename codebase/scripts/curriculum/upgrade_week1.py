import os

def rewrite_week1():
    base_path = "01-Objective-Data-Structures-Python-Java/Month-01/week-01-dsa-array-and-two-pointers-memory-allocation"
    
    data = {
        "0026-remove-duplicates": {
            "title": "Remove Duplicates from Sorted Array",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
                "- **Codewars:** (Tìm bài tương đương thao tác Array in-place)"
            ],
            "tip": "Dùng 2 con trỏ cùng chiều. Trỏ `slow` dùng để ghi đè phần tử mới, trỏ `fast` dùng để dò tìm phần tử khác biệt."
        },
        "0027-remove-element": {
            "title": "Remove Element",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/remove-element/",
                "- **HackerRank:** (N/A, luyện thao tác mảng cơ bản)"
            ],
            "tip": "Tương tự bài 26, nhưng thay vì so sánh 2 số cạnh nhau, hãy so sánh `nums[fast]` với biến `val`."
        },
        "0088-merge-sorted-array": {
            "title": "Merge Sorted Array",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/merge-sorted-array/",
                "- **GeeksForGeeks:** https://practice.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1"
            ],
            "tip": "Dùng 2 con trỏ, nhưng **bắt đầu từ cuối mảng** (điểm lớn nhất) thay vì đầu mảng để không bị ghi đè dữ liệu chưa xử lý."
        },
        "0121-best-time-to-buy-and-sell-stock": {
            "title": "Best Time to Buy and Sell Stock",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
                "- **HackerRank:** (Có dạng bài tương tự tìm chênh lệch lớn nhất)"
            ],
            "tip": "Lưu lại `min_price` nhỏ nhất từng thấy. Cập nhật `max_profit` liên tục khi gặp giá cao hơn ở các bước tiếp theo."
        },
        "0169-majority-element": {
            "title": "Majority Element",
            "links": [
                "- **LeetCode:** https://leetcode.com/problems/majority-element/",
                "- **Codeforces:** (Phù hợp để luyện thêm logic vòng lặp)"
            ],
            "tip": "Thuật toán Boyer-Moore Voting: Nếu cùng phe thì +1, khác phe thì -1. Khi đếm về 0 thì đổi tướng."
        }
    }

    for dir_name, info in data.items():
        file_path = f"{base_path}/{dir_name}/README.md"
        content = f"# {info['title']}\n\n## 🎯 Nguồn Luyện Tập Đa Nền Tảng\n"
        for link in info['links']:
            content += f"{link}\n"
        content += f"\n## 💡 Gợi ý (Tip):\n{info['tip']}\n"
        content += "\n## Phân tích Big O:\n- **Time Complexity:** O(?)\n- **Space Complexity:** O(?)\n"
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    rewrite_week1()
    print("Upgraded Week 1 READMEs to manual quality standard!")
