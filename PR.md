# PR: Nối chatbox AI Helpdesk với /api/chat

> **Task:** AI Helpdesk chạy thật · **Issue:** — · **Branch:** `feat/helpdesk-widget-api`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Chatbox nổi "AI Helpdesk" trước đây là mô phỏng: chờ 0,9 giây rồi trả câu mẫu theo từ khoá. PR này cho chatbox gọi AI thật qua `/api/chat`. AI Helpdesk là AI người dùng trò chuyện để tra cứu tài liệu và lộ trình học.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Chatbox gọi `/api/chat` | `spec.md` phần Phạm vi (vai trò AI Helpdesk); `AGENTS.md` bất biến #5 (mọi lời gọi LLM qua router, component không gọi thẳng provider), #9 (markdown hiển thị qua `react-markdown` + `rehype-sanitize`) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `codebase/src/components/chat/floating-ai-widget.tsx` | Bỏ phần trả lời giả, bộ chọn model không có tác dụng và câu hỏi gợi ý không liên quan. Khi mở thì hiển thị `ChatBox`. Giữ nút nổi và hiệu ứng mở/đóng |
| `codebase/src/components/chat/chat-box.tsx` | Đổi tên hiển thị thành "AI Helpdesk", dòng phụ "Tra cứu tài liệu & lộ trình học", lời chào mới |
| `README.md`, `docs/02-kien-truc.md`, `docs/03-api.md` | Trạng thái chatbox: 🎭 mock → ✅ chạy thật |
| `PR.md` | Mô tả PR này |

`ChatBox` là component có sẵn, trước đây chưa gắn vào trang nào. Nó đã có: đọc luồng trả lời (SSE), trích dẫn nguồn, nút đánh giá 👍/👎, nhắc nhập API key, nút dừng.

## 4. Kiểm thử
- `tsc --noEmit` qua. Lint chỉ còn 1 cảnh báo cũ (`<img>` trong `chat-box.tsx`).
- Trình duyệt (dev server), máy **không có API key**:
  - Mở chatbox → hiện tiêu đề và lời chào AI Helpdesk.
  - Hỏi "Hạn nộp bài lab là khi nào?" → `POST /api/chat` 200, hiện hướng dẫn nhập API key (server trả `need_key`).
  - Hỏi "Sự kiện Venture Arena là gì?" → trả lời từ FAQ, có nhãn "Đã xác thực" và gợi ý câu hỏi tiếp.
- Giao diện điện thoại (375px): chatbox vừa màn hình, không tràn ngang.
- `npm run verify` chạy qua hook pre-push.
- **Chưa kiểm thử:** câu trả lời do LLM sinh ra khi có API key thật.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9: AI Helpdesk không thuộc phần được chấm.

## 6. Rủi ro / việc còn lại
- Chatbox hiện cả với khách chưa đăng nhập. Theo thiết kế, giao diện viewer không có AI; cần quyết định có ẩn chatbox với khách không (giám khảo thường không đăng nhập).
- Dữ liệu FAQ là của dự án nền (chương trình AI in Action), chưa phải tài liệu và lộ trình của Khoá 4.
- Lịch sử chat mất khi tải lại trang.
- Web thật chỉ cập nhật sau khi merge `main` vào `production`.
