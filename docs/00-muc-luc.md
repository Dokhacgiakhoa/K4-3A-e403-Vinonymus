# Mục lục tài liệu

Tất cả tài liệu của dự án nằm trong `docs/`. Tài liệu chấm điểm chính (`spec.md`) ở gốc repo theo yêu cầu của đề.

## Tài liệu sản phẩm (phản ánh lát cắt dự thi)

| File | Nội dung | Người phụ trách |
|---|---|---|
| [`../spec.md`](../spec.md) | AI Spec: bằng chứng, impact, lát cắt, kiểu lỗi, kiểm thử, changelog | Khoa |
| [`01-SRS.md`](01-SRS.md) | Đặc tả yêu cầu: FR / NFR / tiêu chí nghiệm thu, truy vết về `spec.md` | Khoa |
| [`02-kien-truc.md`](02-kien-truc.md) | Kiến trúc, tech stack, luồng dữ liệu, ranh giới thật/mock | Minh |
| [`03-api.md`](03-api.md) | Hợp đồng API `/api/roadmap` (mới) và `/api/chat` (có sẵn) | Minh |
| [`04-ai-pipeline.md`](04-ai-pipeline.md) | Prompt, guardrail, LLM router, catalog tài liệu | Đức |
| [`05-ui-flow.md`](05-ui-flow.md) | Luồng người dùng của Planner (CP2) | Thành |
| [`06-backend-dotnet.md`](06-backend-dotnet.md) | Backend .NET — giữ lại, **chưa tích hợp** | Minh |

## Hackathon

| File | Nội dung |
|---|---|
| [`hackathon/checkpoints.md`](hackathon/checkpoints.md) | CP1–CP6: hạn, sản phẩm nộp, trạng thái |
| [`hackathon/tasks.md`](hackathon/tasks.md) | Phân công việc theo từng checkpoint, tag người phụ trách |
| [`hackathon/repo-fix-plan.md`](hackathon/repo-fix-plan.md) | Kế hoạch sửa cấu trúc repo, CI, assign issue |
| [`hackathon/cp1-canvas.md`](hackathon/cp1-canvas.md) | Canvas 4 ô đã nộp ở CP1 |
| [`hackathon/huong-dan-cp1.md`](hackathon/huong-dan-cp1.md) | Ghi chép từ video hướng dẫn CP1 của lớp |

## Nghiên cứu người dùng

| File | Nội dung |
|---|---|
| [`research/evidence-mining.md`](research/evidence-mining.md) | Bằng chứng chuẩn B: phương pháp đếm, số liệu, mã tham chiếu |
| [`research/survey-log.md`](research/survey-log.md) | Bằng chứng chuẩn A: nhật ký phỏng vấn/khảo sát (mã ẩn danh `P01…`) |

## Tài liệu cũ

[`legacy/`](legacy/) — tài liệu của dự án nền **AI Thực Chiến / AIIA Notebook** (SRS chatbot FAQ, báo cáo phase, giáo trình 35 tuần, ảnh review giao diện). **Không phản ánh lát cắt dự thi**, chỉ giữ để tra cứu. Đọc [`legacy/00-luu-y.md`](legacy/00-luu-y.md) trước.

## Quy ước chung

- Nguồn sự thật cho **quyết định sản phẩm**: `spec.md`. Cho **yêu cầu hệ thống**: `docs/01-SRS.md`. Hai file mâu thuẫn → sửa ngay, ghi vào §9 Changelog của `spec.md`.
- Không dán dữ liệu gốc từ data pack — chỉ mã tham chiếu và trích ngắn (≤2 câu).
- Không chép mô tả giữa các file; trỏ link thay vì chép.
