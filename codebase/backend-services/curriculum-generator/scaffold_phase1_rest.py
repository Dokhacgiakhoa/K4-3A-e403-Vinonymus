import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def scaffold_rest():
    data = {
        "01-Objective-Data-Structures-Python-Java/Month-01/week-04-dsa-sliding-window-and-pointers-optimization": {
            "title": "Sliding Window",
            "guide": "# Tuần 04: Sliding Window\n\nKỹ thuật Cửa sổ trượt giúp biến O(N^2) thành O(N) cho các bài toán mảng con liên tiếp.",
            "theory": "# LÝ THUYẾT: SLIDING WINDOW\n\nCửa sổ trượt là 2 con trỏ `left` và `right`. `right` mở rộng cửa sổ để nạp thêm dữ liệu, `left` thu hẹp cửa sổ khi vi phạm điều kiện.",
            "sample": "# VÍ DỤ MẪU: Maximum Average Subarray I\n\nKhởi tạo tổng của `k` phần tử đầu tiên. Trượt cửa sổ: `sum = sum - nums[left] + nums[right]`.",
            "problems": [
                {"dir": "0003-longest-substring-without-repeating-characters", "title": "Longest Substring Without Repeating Characters", "tip": "Dùng HashSet lưu ký tự trong cửa sổ. Nếu gặp ký tự trùng, thu hẹp `left` cho đến khi hết trùng."},
                {"dir": "0209-minimum-size-subarray-sum", "title": "Minimum Size Subarray Sum", "tip": "Kéo `right` để cộng dồn. Khi tổng >= target, cập nhật min length và thu hẹp `left`."},
                {"dir": "0424-longest-repeating-character-replacement", "title": "Longest Repeating Character Replacement", "tip": "Cửa sổ hợp lệ khi: `length - max_freq <= k`."},
                {"dir": "0567-permutation-in-string", "title": "Permutation in String", "tip": "Fixed window cỡ `len(s1)`. Dùng 2 mảng tần suất 26 ký tự đẻ so sánh."},
                {"dir": "0713-subarray-product-less-than-k", "title": "Subarray Product Less Than K", "tip": "Số lượng mảng con kết thúc tại `right` là `right - left + 1`."}
            ]
        },
        "01-Objective-Data-Structures-Python-Java/Month-02/week-05-dsa-linked-list-memory-architecture": {
            "title": "Linked List Memory",
            "guide": "# Tuần 05: Linked List Memory\n\nLàm quen với bộ nhớ phân mảnh Heap và con trỏ Reference.",
            "theory": "# LÝ THUYẾT: LINKED LIST\n\nArray là mảng liên tiếp trong RAM. Linked list là các cục nhớ (Node) trôi nổi trong Heap, nối với nhau bằng con trỏ `next`. Không thể truy cập O(1) bằng index.",
            "sample": "# VÍ DỤ MẪU: Reverse Linked List\n\nDùng 3 con trỏ: `prev`, `curr`, `next`. `curr.next = prev`, rồi nhích cả 3 lên.",
            "problems": [
                {"dir": "0021-merge-two-sorted-lists", "title": "Merge Two Sorted Lists", "tip": "Dùng một Dummy Node ở đầu để dễ nối 2 danh sách."},
                {"dir": "0083-remove-duplicates-from-sorted-list", "title": "Remove Duplicates from Sorted List", "tip": "Nếu `curr.val == curr.next.val` thì `curr.next = curr.next.next`."},
                {"dir": "0203-remove-linked-list-elements", "title": "Remove Linked List Elements", "tip": "Luôn dùng Dummy Node khi thao tác xóa, vì có thể xóa ngay Node đầu tiên."},
                {"dir": "0234-palindrome-linked-list", "title": "Palindrome Linked List", "tip": "Dùng Fast/Slow tìm điểm giữa. Reverse nửa sau. So sánh 2 nửa."},
                {"dir": "0092-reverse-linked-list-ii", "title": "Reverse Linked List II", "tip": "Tìm vị trí left. Reverse từ left tới right, sau đó khâu nối lại phần đuôi và phần đầu."}
            ]
        },
        "01-Objective-Data-Structures-Python-Java/Month-02/week-06-dsa-fast-and-slow-pointers-linked-list": {
            "title": "Fast & Slow Pointers",
            "guide": "# Tuần 06: Fast & Slow Pointers\n\nThuật toán Rùa và Thỏ.",
            "theory": "# LÝ THUYẾT: RÙA VÀ THỎ\n\nThỏ chạy nhanh gấp 2 Rùa. Nếu có chu trình (Cycle), Thỏ chắc chắn sẽ bắt kịp Rùa. Nếu tìm điểm giữa, khi Thỏ tới đích thì Rùa ở chính giữa.",
            "sample": "# VÍ DỤ MẪU: Middle of the Linked List\n\n`slow = head`, `fast = head`. `slow` nhảy 1 bước, `fast` nhảy 2 bước.",
            "problems": [
                {"dir": "0141-linked-list-cycle", "title": "Linked List Cycle", "tip": "Nếu `fast == slow` thì có chu trình."},
                {"dir": "0142-linked-list-cycle-ii", "title": "Linked List Cycle II", "tip": "Khi `fast` gặp `slow`, cho 1 con trỏ chạy từ `head`, con trỏ kia chạy tiếp từ điểm gặp. Chúng sẽ giao nhau tại gốc chu trình."},
                {"dir": "0160-intersection-of-two-linked-lists", "title": "Intersection of Two Linked Lists", "tip": "Con trỏ A đi hết list A thì nhảy sang list B. Con trỏ B đi hết list B thì nhảy sang A."},
                {"dir": "0019-remove-nth-node-from-end-of-list", "title": "Remove Nth Node From End of List", "tip": "Cho `fast` chạy trước N bước. Sau đó cả 2 cùng chạy, khi `fast` chạm đáy thì `slow` ở ngay trước node cần xóa."},
                {"dir": "0143-reorder-list", "title": "Reorder List", "tip": "Chia làm 3 bước: Tìm điểm giữa, Reverse nửa sau, Trộn 2 nửa (Merge alternate)."}
            ]
        },
        "01-Objective-Data-Structures-Python-Java/Month-02/week-07-dsa-binary-tree-and-depth-first-search-dfs": {
            "title": "Binary Tree & DFS",
            "guide": "# Tuần 07: Binary Tree & DFS\n\nHọc cách cây nhị phân lưu trữ và kỹ thuật Đệ quy (Recursion) qua DFS.",
            "theory": "# LÝ THUYẾT: ĐỆ QUY VÀ CALL STACK\n\nKhi hàm gọi chính nó, OS lưu trạng thái vào Call Stack. DFS quét sâu xuống tận cùng nhánh cây (leaf) rồi mới quay lui (backtrack). Pre-order: Node -> Left -> Right.",
            "sample": "# VÍ DỤ MẪU: Maximum Depth\n\n`return 1 + max(maxDepth(root.left), maxDepth(root.right))`.",
            "problems": [
                {"dir": "0226-invert-binary-tree", "title": "Invert Binary Tree", "tip": "Swap `root.left` và `root.right`, sau đó đệ quy xuống cả 2 nhánh."},
                {"dir": "0100-same-tree", "title": "Same Tree", "tip": "So sánh `p.val` và `q.val`, rồi đệ quy `(p.left, q.left)` và `(p.right, q.right)`."},
                {"dir": "0101-symmetric-tree", "title": "Symmetric Tree", "tip": "So sánh 2 node đối xứng: `left.left` với `right.right`, và `left.right` với `right.left`."},
                {"dir": "0112-path-sum", "title": "Path Sum", "tip": "Giảm `target` đi `root.val` mỗi khi xuống 1 level. Trả về True nếu chạm Node lá và `target == 0`."},
                {"dir": "0236-lowest-common-ancestor-of-a-binary-tree", "title": "Lowest Common Ancestor", "tip": "Nếu node hiện tại là `p` hoặc `q`, return chính nó. Tìm trái, tìm phải. Nếu cả 2 cùng trả về -> chính nó là LCA."}
            ]
        },
        "01-Objective-Data-Structures-Python-Java/Month-02/week-08-dsa-binary-search-tree-and-breadth-first-search-bfs": {
            "title": "BST & BFS",
            "guide": "# Tuần 08: BST & BFS\n\nCây tìm kiếm và thuật toán Loang theo tầng (BFS) bằng Queue.",
            "theory": "# LÝ THUYẾT: QUEUE VÀ BFS\n\nBST: Nhánh trái nhỏ hơn Node, nhánh phải lớn hơn Node. Tốc độ tìm kiếm O(logN). BFS dùng Queue (FIFO) để xử lý hết các node ở Tầng 1 rồi mới xuống Tầng 2.",
            "sample": "# VÍ DỤ MẪU: Level Order Traversal\n\nDùng 1 Queue. Loop số lượng phần tử hiện tại trong Queue (chính là size của level đó).",
            "problems": [
                {"dir": "0098-validate-binary-search-tree", "title": "Validate BST", "tip": "Truyền giới hạn `(min, max)` xuống các nhánh. Nhánh trái `max = node.val`, nhánh phải `min = node.val`."},
                {"dir": "0235-lowest-common-ancestor-of-a-binary-search-tree", "title": "LCA of BST", "tip": "Dùng tính chất BST: Nếu cả `p` và `q` đều lớn hơn `root`, đi sang phải. Nhỏ hơn thì đi trái. Nếu rẽ ngang -> đó là LCA."},
                {"dir": "0199-binary-tree-right-side-view", "title": "Binary Tree Right Side View", "tip": "BFS quét từng tầng. Lấy phần tử cuối cùng của Queue trong vòng lặp của tầng đó."},
                {"dir": "0108-convert-sorted-array-to-binary-search-tree", "title": "Convert Sorted Array to BST", "tip": "Lấy điểm chính giữa của Array làm Root để cây luôn cân bằng. Đệ quy trái phải."},
                {"dir": "0103-binary-tree-zigzag-level-order-traversal", "title": "Zigzag Level Order", "tip": "Level order bình thường. Biến `leftToRight`. Nếu false thì `reverse()` cái sublist của level đó trước khi thêm vào kết quả."}
            ]
        },
        "01-Objective-Data-Structures-Python-Java/Month-03/week-09-dsa-dynamic-programming-1d-memoization": {
            "title": "DP 1D",
            "guide": "# Tuần 09: DP 1D & Memoization\n\nQuy hoạch động 1 chiều.",
            "theory": "# LÝ THUYẾT: DP & MEMOIZATION\n\nDP là đệ quy có nhớ (Sổ tay - Memo). Nếu một nhánh đệ quy tính ra kết quả, lưu lại vào Hashmap/Array để lần sau gọi lại O(1).",
            "sample": "# VÍ DỤ MẪU: Climbing Stairs\n\nGiống Fibonacci. Bước(n) = Bước(n-1) + Bước(n-2). Dùng mảng `dp` để lưu kết quả.",
            "problems": [
                {"dir": "0509-fibonacci-number", "title": "Fibonacci Number", "tip": "Có thể tối ưu xuống O(1) Space bằng cách chỉ lưu 2 biến `a` và `b`."},
                {"dir": "0746-min-cost-climbing-stairs", "title": "Min Cost Climbing Stairs", "tip": "Bắt đầu DP từ bậc 2. `dp[i] = cost[i] + min(dp[i-1], dp[i-2])`."},
                {"dir": "0198-house-robber", "title": "House Robber", "tip": "`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`. Ăn nhà hiện tại thì bỏ nhà sát bên."},
                {"dir": "0213-house-robber-ii", "title": "House Robber II", "tip": "Nhà vòng tròn. Chạy DP 2 lần: Bỏ nhà cuối, Bỏ nhà đầu. Lấy Max của 2 kết quả."},
                {"dir": "0322-coin-change", "title": "Coin Change", "tip": "Mảng `dp` kích thước `amount + 1` khởi tạo bằng vô cực. `dp[a] = min(dp[a], 1 + dp[a - coin])`."}
            ]
        },
        "01-Objective-Data-Structures-Python-Java/Month-03/week-10-dsa-dynamic-programming-2d-and-optimization": {
            "title": "DP 2D",
            "guide": "# Tuần 10: DP 2D\n\nQuy hoạch động 2 chiều trên ma trận.",
            "theory": "# LÝ THUYẾT: DP 2D\n\nState là một ma trận `dp[i][j]`. Công thức truy hồi phụ thuộc vào Ô bên trái `dp[i][j-1]` và Ô bên trên `dp[i-1][j]`.",
            "sample": "# VÍ DỤ MẪU: Unique Paths\n\n`dp[i][j] = dp[i-1][j] + dp[i][j-1]`. Ô hiện tại = Tổng cách đi từ Ô trên + Ô trái.",
            "problems": [
                {"dir": "0064-minimum-path-sum", "title": "Minimum Path Sum", "tip": "`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`."},
                {"dir": "0120-triangle", "title": "Triangle", "tip": "Bottom-up DP. Tính từ đáy tam giác ngược lên đỉnh. `dp[i][j] = val + min(dp[i+1][j], dp[i+1][j+1])`."},
                {"dir": "0300-longest-increasing-subsequence", "title": "Longest Increasing Subsequence", "tip": "2 vòng for. `if nums[i] > nums[j]: dp[i] = max(dp[i], 1 + dp[j])`."},
                {"dir": "1143-longest-common-subsequence", "title": "Longest Common Subsequence", "tip": "Nếu `text1[i] == text2[j]`: `dp[i][j] = 1 + dp[i-1][j-1]`. Ngược lại lấy max của ô kề trên và kề trái."},
                {"dir": "0005-longest-palindromic-substring", "title": "Longest Palindromic Substring", "tip": "Không cần DP ma trận tốn bộ nhớ. Dùng Expand Around Center (trượt 1 tâm, trượt 2 tâm)."}
            ]
        }
    }

    for base_path, info in data.items():
        create_file(f"{base_path}/WEEK_MASTER_GUIDE.md", info["guide"])
        create_file(f"{base_path}/THEORY.md", info["theory"])
        create_file(f"{base_path}/00-SAMPLE-TUTORIAL.md", info["sample"])

        for p in info["problems"]:
            p_path = f"{base_path}/{p['dir']}"
            readme = f"# {p['title']}\n\n## 🎯 Nguồn Luyện Tập Đa Nền Tảng\n"
            readme += f"- **LeetCode:** https://leetcode.com/problems/{p['dir'].split('-')[0].lstrip('0')}-" + "-".join(p['dir'].split('-')[1:]) + "/\n"
            readme += "- **HackerRank / Codewars / GeeksForGeeks:** (Tìm kiếm đề bài tương tự)\n"
            readme += f"\n## 💡 Gợi ý (Tip):\n{p['tip']}\n"
            readme += "\n## Phân tích Big O:\n- **Time Complexity:** O(?)\n- **Space Complexity:** O(?)\n"
            
            create_file(f"{p_path}/README.md", readme)
            create_file(f"{p_path}/solution.py", "class Solution:\n    # Code here\n    pass")
            create_file(f"{p_path}/Solution.java", "class Solution {\n    // Code here\n}")

if __name__ == "__main__":
    scaffold_rest()
    print("Scaffolded Phase 1 Rest (Weeks 4-10) successfully!")
