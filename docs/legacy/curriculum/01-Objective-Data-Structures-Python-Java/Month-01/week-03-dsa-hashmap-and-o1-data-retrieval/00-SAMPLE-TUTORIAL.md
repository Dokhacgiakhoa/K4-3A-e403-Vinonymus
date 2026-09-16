# VÍ DỤ MẪU: TWO SUM (TÌM 2 SỐ CÓ TỔNG BẰNG TARGET)

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
