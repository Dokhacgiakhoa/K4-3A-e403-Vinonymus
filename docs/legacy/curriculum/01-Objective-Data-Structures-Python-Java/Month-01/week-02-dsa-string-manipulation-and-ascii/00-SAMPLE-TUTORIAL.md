# VÍ DỤ MẪU: REVERSE STRING (ĐẢO NGƯỢC CHUỖI)

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
