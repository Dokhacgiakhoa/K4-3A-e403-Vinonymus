# Đặc tả yêu cầu & Mô tả Pull Request (SRS & PR Description)

> **Task ID:** T2-03 · **Issue:** [#4](https://github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus/issues/4)  
> **Người thực hiện:** Nguyễn Việt Thành (`@Thanh` · `@thanhnvhust514`)  
> **Nhóm:** Vinonymus — Track E (AI Diagnostic Study Planner)  
> **Tài liệu tham chiếu:** [`docs/01-SRS.md`](docs/01-SRS.md), [`docs/05-ui-flow.md`](docs/05-ui-flow.md), [`spec.md`](spec.md)

---

## 1. Mục tiêu của Pull Request

Pull Request này giải quyết và hoàn thiện trọn vẹn **Issue #4 (Task T2-03)** theo kế hoạch Checkpoint CP2/CP3 của đề bài Mini Hackathon AI:
- Thiết kế lại poster sơ đồ luồng người dùng (User Flowchart) của tính năng **AI Diagnostic Study Planner** theo chuẩn kiến trúc hệ thống chuyên nghiệp.
- Kết xuất file đồ họa độ nét cao **2x Retina** (`docs/05-ui-flowchart.png`), khắc phục triệt để các lỗi tràn chữ, tối ưu bố cục và thẩm mỹ trực quan.
- Nhúng sơ đồ vào tài liệu đặc tả [`docs/05-ui-flow.md`](docs/05-ui-flow.md) và cập nhật tiến độ trên bảng task [`docs/hackathon/tasks.md`](docs/hackathon/tasks.md).

---

## 2. Truy vết yêu cầu phần mềm (SRS Mapping)

Sơ đồ luồng người dùng được mô phỏng chính xác và bao quát đầy đủ các yêu cầu chức năng (FR) trong [`docs/01-SRS.md`](docs/01-SRS.md):

| Khối trên sơ đồ | Mô tả chi tiết | Ánh xạ SRS | Tiêu chí nghiệm thu (AC) |
|---|---|---|---|
| **Khối A** | Mở trang `/planner` | SRS §3 | Mở tự do không cần đăng nhập, không yêu cầu gói Pro. |
| **Khối B (Bước 1)** | Chọn nền tảng: `tech` (CNTT) hoặc `non-tech` (Trái ngành) | **FR-P01** | Học viên chọn 1 trong 2 nền tảng xuất phát. |
| **Khối C (Bước 2)** | Quỹ thời gian rảnh hôm nay (phút) + chọn bài lab từ catalog | **FR-P01** | Nhập số phút hợp lệ; bài lab được lấy từ catalog công khai. |
| **Khối D (Bước 3)** | Ghi chú cá nhân hoá ("Bạn đang vướng gì?") | **FR-P01** | Ô nhập tuỳ chọn $\le$ 500 ký tự. |
| **Cổng E** | Kiểm tra cấu hình BYOK API Key | **FR-P03** | Khóa API của học viên chỉ lưu trên trình duyệt, không lưu server. |
| **Khối K** | Nhắc cấu hình key / Gợi ý mặc định (Baseline Rule) | **FR-P09** | Nhánh phương án dự phòng khi chưa có key hoặc LLM lỗi. |
| **Khối F** | Gọi Router AI: `POST /api/roadmap` | **FR-P02** | Gọi router LLM (DeepSeek / OpenAI) với Header Key người dùng. |
| **Cổng S** | Phân loại trạng thái phản hồi của AI (`status`) | **FR-P04** | Nhận 1 trong 3 trạng thái phản hồi có cấu trúc JSON từ server. |
| **Khối G (Bước 4)** | Checklist $\le$ 3 việc (Lý do · Thời lượng · Link catalog) | **FR-P04**, **INV-03** | Checklist không vượt quỹ rảnh; link chỉ lấy từ catalog nội bộ. |
| **Khối H** | Hỏi lại để làm rõ (`status: clarify`) | **FR-P08** | Đặt 1 câu hỏi làm rõ khi quỹ rảnh &lt; 30p hoặc bài lab lạ. |
| **Vòng lặp H $\rightarrow$ C** | Feedback loop nét đứt quay ngược về Bước 2 | **FR-P08** | Cho phép học viên cập nhật lại thông tin để AI chẩn đoán lại. |
| **Khối I** | Rào chắn an toàn (`status: refuse`) | **FR-P10** | Từ chối làm hộ, xin điểm, xin đáp án; trỏ tới kênh Lab Coach. |
| **Khối J** | Tick xong / Bỏ việc / Kéo đổi thứ tự | **FR-P07** | Học viên chủ động điều chỉnh; tự động lưu `localStorage`. |
| **Khối Z** | Vạch đích: Học viên bắt đầu học | SRS §1 | Sẵn sàng bắt đầu buổi thực hành hiệu quả. |

---

## 3. Danh mục các file thay đổi trong PR

| Đường dẫn file | Vai trò | Trạng thái |
|---|---|---|
| [`docs/05-ui-flowchart.png`](docs/05-ui-flowchart.png) | File ảnh sơ đồ PNG độ phân giải 2x Retina (525 KB) | **Thêm mới / Cập nhật** |
| [`codebase/public/images/05-ui-flowchart.png`](codebase/public/images/05-ui-flowchart.png) | File ảnh công khai dùng cho ứng dụng web | **Thêm mới** |
| [`codebase/public/export-flowchart.html`](codebase/public/export-flowchart.html) | Bản vẽ vector SVG độc lập, hỗ trợ xuất PNG/SVG | **Thêm mới** |
| [`docs/05-ui-flow.md`](docs/05-ui-flow.md) | Nhúng ảnh minh hoạ vào tài liệu luồng người dùng | **Cập nhật** |
| [`docs/hackathon/tasks.md`](docs/hackathon/tasks.md) | Đánh dấu hoàn thành `✅` cho Task T2-03 | **Cập nhật** |
| [`srs.md`](srs.md) | File đặc tả SRS và mô tả chi tiết nội dung Pull Request | **Thêm mới** |

---

## 4. Bằng chứng kiểm thử và nghiệm thu (Verification)

1. **Kiểm tra đồ hoạ & độ nét (Visual Quality)**:
   - Kích thước xuất: `1120 x 1260 px` (Scale 2x Canvas).
   - Đã xử lý triệt để hiện tượng tràn chữ tại các khối:
     - Thẻ Bước 1 mở rộng lên 430px, hai chip `tech (CNTT)` (175px) và `non-tech (Trái ngành)` (205px) hiển thị gọn gàng.
     - Thẻ Bước 2 nới rộng 430px với padding thoáng đãng.
     - Hộp chú thích của Feedback Loop (`↺ Hỏi lại → Quay về Bước 2`) được tách riêng trục tọa độ (`X = 825`), không bị đường mũi tên nét đứt đè lên chữ.
2. **Kiểm tra kiểu dữ liệu (TypeScript & Code Quality)**:
   ```bash
   npm run typecheck
   # Output: 0 errors
   ```
3. **Tính tương thích**:
   - Hoàn toàn tuân thủ các bất biến tại [AGENTS.md](AGENTS.md) (Không commit dữ liệu nhạy cảm, không sửa file ngoài phạm vi phân công).

---

## 5. Cú pháp đóng Issue

```text
Closes #4
```
