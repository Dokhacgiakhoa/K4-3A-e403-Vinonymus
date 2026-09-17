# PR: README ghi đúng trạng thái AI Helpdesk và AI Mentor 4 sprint

> **Task:** CP4 · trung thực trạng thái prototype · **Issue:** — · **Branch:** `docs/helpdesk-status`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
README đang ghi "AI Helpdesk ✅ AI chạy thật". Câu này chỉ đúng với API `/api/chat`; phần người dùng nhìn thấy thì không. PR này sửa README cho khớp code:
- Widget nổi "AI Helpdesk 24/7" (`components/chat/floating-ai-widget.tsx`) là **mô phỏng**: sau 900 ms trả câu mẫu theo từ khoá, không gọi API.
- Component chat gọi `/api/chat` thật (`chat-box.tsx`, `chat-container.tsx`) chưa được import ở trang nào.
- AI Mentor 4 sprint tại `/learning?mode=ai_roadmap` chạy quy tắc trên trình duyệt, không gọi LLM. AI Mentor được chấm là trang `/planner`.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Bảng Trạng thái prototype | Luật đề: "ghi rõ phần nào mock"; `AGENTS.md` bất biến #10 |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `README.md` | Bảng giới thiệu 2 AI, dòng công nghệ AI, bảng Trạng thái: tách AI Helpdesk thành API (thật) và widget (mock); thêm dòng AI Mentor 4 sprint (mock) |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Đã đọc code: `floating-ai-widget.tsx` dùng `setTimeout` và câu trả lời theo từ khoá. `git grep` không thấy chỗ nào import `ChatBox` hay `ChatContainer`.
- `npm run verify` chạy qua hook pre-push.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì `spec.md` chỉ chấm AI Mentor `/planner`, không đổi.

## 6. Rủi ro / việc còn lại
- Nối widget với `/api/chat`, hoặc gắn `ChatBox` vào một trang, nếu muốn demo AI Helpdesk thật.
- Mô tả `layout.tsx` (metadata trang) vẫn quảng cáo "AI Helpdesk 24/7 đồng hành giải đáp kỹ thuật".
