# 05 — Luồng người dùng · Planner

> Dùng cho **CP2** (hạn 21:00 · 16/9). Người phụ trách: Thành.

## 1. Luồng chính

```mermaid
flowchart TD
    A([Mở trang Planner]) --> B[Bước 1: chọn nền tảng<br/>tech / non-tech]
    B --> C[Bước 2: nhập thời gian rảnh hôm nay<br/>+ chọn bài lab tiếp theo]
    C --> D[Bước 3: ghi chú tuỳ chọn]
    D --> E{Đã có API key?}
    E -- chưa --> K[Nhắc nhập key ở Cài đặt<br/>hoặc xem gợi ý mặc định]
    K --> G
    E -- có --> F[Gọi /api/roadmap]
    F --> S{status}
    S -- plan --> G[Bước 4: checklist ≤3 việc<br/>lý do · thời lượng · link]
    S -- clarify --> H[Hiện 1 câu hỏi lại] --> C
    S -- refuse --> I[Giải thích vì sao từ chối<br/>+ trỏ tới Lab Coach]
    G --> J[Tick / bỏ / đổi thứ tự<br/>lưu trên trình duyệt]
    J --> Z([Học viên bắt đầu học])
```

## 2. Màn hình

| Bước | Hiển thị | Hành động |
|---|---|---|
| 1 · Nền tảng | 2 thẻ lựa chọn có mô tả ngắn | Chọn 1 |
| 2 · Thời gian & bài lab | Ô số phút, danh sách bài lab từ catalog | Nhập, chọn |
| 3 · Ghi chú | Ô text ≤500 ký tự, gợi ý "Bạn đang vướng gì?" | Tuỳ chọn |
| 4 · Kết quả | Dòng chẩn đoán + checklist; nhãn "AI" hoặc "Gợi ý mặc định" | Tick, bỏ, kéo thả, mở link |
| Hỏi lại | Một câu hỏi + nút quay lại bước 2 | Trả lời |
| Từ chối | Lý do + kênh hỗ trợ chính thức | Quay lại |

## 3. Tái sử dụng từ codebase

`codebase/src/components/learning/ai-mentor-wizard.tsx` đã có khung wizard 5 bước. Việc cần làm:
- Đổi nội dung các bước cho khớp bảng trên (bỏ câu hỏi SFIA/CV không thuộc lát cắt).
- Thay `setTimeout` giả lập bằng lời gọi `/api/roadmap`.
- Đổi màn hình kết quả từ "4 sprint 8 tuần" sang checklist ≤3 việc.

**Lưu ý:** trang `/learning?mode=ai_roadmap` hiện yêu cầu đăng nhập và gói Pro. Cần cho Planner chạy không cần tài khoản để demo được (`[TODO]` xác nhận hướng xử lý với Minh).

## 4. Nộp CP2

Chọn một: bản mock bấm được · sơ đồ luồng ở mục 1 · video quay màn hình đi hết một lượt. CP2 chưa yêu cầu AI chạy thật.
