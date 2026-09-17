# Báo cáo hoàn thành Issue #22 (Task T4-04): Bốn đường đi của trải nghiệm

> **Mã công việc:** T4-04 ([GitHub Issue #22](https://github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus/issues/22))  
> **Người phụ trách:** Nguyễn Việt Thành (`@Thanh` - Frontend)  
> **Người hỗ trợ:** Đinh Ngọc Đức (`@Duc` - AI Pipeline)  
> **Tài liệu đặc tả đối chiếu:** [`spec.md`](spec.md) (§6), [`docs/01-SRS.md`](docs/01-SRS.md) (FR-P03 -> FR-P09)  
> **Trạng thái:** ✅ Đã hoàn thành và kiểm chứng trên ứng dụng thực tế

---

## 1. Mục tiêu & Phạm vi Issue #22

Theo phân công checkpoint CP4 trong [`docs/hackathon/tasks.md`](docs/hackathon/tasks.md):
- Hiện thực hóa và kiểm chứng **4 đường đi của trải nghiệm người học** trên giao diện AI Diagnostic Study Planner (`/planner`).
- Cung cấp **ảnh chụp thực tế từ ứng dụng đang chạy thật**, bảo đảm hệ thống xử lý đầy đủ các trường hợp: Luồng thành công chuẩn (`plan`), Luồng hỏi lại khi mơ hồ/thiếu thông tin (`clarify`), Luồng dự phòng khi lỗi hệ thống/thiếu key (`fallback`), và Luồng từ chối bảo vệ phạm vi (`refuse`).
- Cập nhật mục **§6. Bốn đường đi của trải nghiệm** trong [`spec.md`](spec.md) và gỡ bỏ mục việc còn thiếu trước thời hạn CP4 (21:00 · 17/9).

---

## 2. Chi tiết 4 đường đi của trải nghiệm & Minh chứng từ ứng dụng thật

### 2.1. Nhánh `plan` (Happy Path — Luồng chuẩn)
- **Điều kiện kích hoạt:** Học viên nhập thông tin hợp lệ (chọn nền tảng, thời gian rảnh hợp lệ $\ge 30$ phút, bài lab có trong catalog, ghi chú phù hợp hoặc để trống).
- **Hành vi hệ thống:**
  - AI phân tích nền tảng và nhu cầu.
  - Sinh kế hoạch tối đa **3 đầu việc trọng tâm** từ catalog (`planner-catalog.ts`).
  - Mỗi việc có phân bổ thời gian (phút), lý do đề xuất cụ thể và đường link trực tiếp đến tài liệu học chuẩn xác (không sinh link ngoài catalog).
  - Cho phép người học tick chọn, bỏ bớt hoặc sắp xếp lại thứ tự theo nguyên tắc *Human-in-control*.
- **Minh chứng ảnh chụp:**
  
  ![Plan AI](docs/assets/cp4/01-plan-ai.png)

---

### 2.2. Nhánh `clarify` (Low-confidence / Mơ hồ & Mâu thuẫn)
- **Điều kiện kích hoạt:**
  - Quỹ thời gian quá ít ($< 30$ phút) không đủ hoàn thành nhiệm vụ tối thiểu.
  - Hoặc có mâu thuẫn giữa nền tảng tự khai và nội dung ghi chú (ví dụ: khai non-tech nhưng ghi chú kinh nghiệm chuyên sâu AI/RAG production, hoặc chọn AI nhưng ghi chú chưa từng lập trình).
  - Hoặc mã bài lab không tồn tại trong danh mục.
- **Hành vi hệ thống:**
  - Hệ thống áp dụng nguyên tắc *Graceful failure* (biết mình không biết).
  - Trả về đúng **1 câu hỏi làm rõ**, không tự suy đoán mò mẫm hay áp đặt kế hoạch không căn cứ.
- **Minh chứng ảnh chụp:**
  
  ![Clarify](docs/assets/cp4/02-clarify.png)

---

### 2.3. Nhánh `fallback` (Dự phòng lỗi kỹ thuật / Không có AI key)
- **Điều kiện kích hoạt:**
  - Người dùng không cấu hình API key hợp lệ trong header / settings.
  - LLM provider gặp sự cố mạng hoặc phản hồi JSON không đúng schema kiểm duyệt.
- **Hành vi hệ thống:**
  - Kích hoạt bộ sinh kế hoạch baseline theo luật tĩnh (`baseline-planner.ts`).
  - Hiển thị nhãn cảnh báo minh bạch: **"Gợi ý mặc định · chưa cá nhân hoá bằng AI"** để người học nhận biết rõ ràng nguồn gốc đề xuất.
- **Minh chứng ảnh chụp:**
  
  ![Fallback](docs/assets/cp4/03-fallback.png)

---

### 2.4. Nhánh `refuse` (Ngoài phạm vi & Chống Prompt Injection)
- **Điều kiện kích hoạt:**
  - Học viên yêu cầu làm hộ toàn bộ bài lab, xin đáp án/source code hoàn chỉnh.
  - Yêu cầu sửa điểm, xin gia hạn nộp bài quá deadline.
  - Các nỗ lực tấn công Prompt Injection (yêu cầu bỏ qua guardrail hệ thống).
- **Hành vi hệ thống:**
  - Coi mọi nội dung nhập từ học viên là dữ liệu, không phải câu lệnh thực thi.
  - Từ chối lịch sự, nêu rõ giới hạn thẩm quyền của AI Study Planner.
  - Hướng dẫn học viên liên hệ kênh hỗ trợ chính thức (TA / Lab Coach) và cho phép chỉnh sửa lại ghi chú.
- **Minh chứng ảnh chụp:**
  
  ![Refuse](docs/assets/cp4/04-refuse.png)

---

## 3. Đối chiếu Yêu cầu Kỹ thuật (Traceability Matrix)

| Đường đi | Mã FR tương ứng ([`docs/01-SRS.md`](docs/01-SRS.md)) | Mã kịch bản ([`eval/golden-set.json`](eval/golden-set.json)) | Tiêu chí nghiệm thu (AC) | Trạng thái |
|---|---|---|---|---|
| `plan` | FR-P01, FR-P03, FR-P04, FR-P08 | G01–G11, G19–G20 | $\le 3$ việc, 100% URL catalog, tổng phút $\le$ ngân sách | ✅ Đạt 12/13 ở lượt AI v2 — **G02 chưa đạt** (thiếu `ptc-function-calling`, xem `spec.md` §7); 0 link ngoài catalog |
| `clarify` | FR-P02, FR-P05 | G12–G15 | Trả `status: clarify`, kèm đúng 1 câu hỏi làm rõ | ✅ Đạt |
| `fallback` | FR-P09 | Kiểm thử ngắt key / timeout | Nhãn "Gợi ý mặc định", kế hoạch tĩnh từ catalog | ✅ Đạt |
| `refuse` | FR-P06 | G16–G18 | Trả `status: refuse`, từ chối hữu ích, an toàn injection | ✅ Đạt |

---

## 4. Kết quả nghiệm thu & Đóng Issue

- [x] Đầy đủ 4 tài sản ảnh chụp từ app thật tại thư mục [`docs/assets/cp4/`](docs/assets/cp4/).
- [x] Hoàn thiện bảng mô tả 4 nhánh tại mục **§6 trong [`spec.md`](spec.md)**.
- [x] Gỡ bỏ mục tồn đọng về §6 trong phần "Việc còn thiếu trước hạn chốt spec" tại [`spec.md`](spec.md).
- [x] Cập nhật trạng thái công việc **T4-04** thành `✅` trong [`docs/hackathon/tasks.md`](docs/hackathon/tasks.md).
- [x] Đóng issue: **Closes #22**.
