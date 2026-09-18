# PR: Tài liệu .NET và bản slide NotebookLM

> **Task:** lưu tài liệu · **Issue:** — · **Branch:** `docs/research-and-blueprint`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Đưa lên repo các file PM đã soạn nhưng chưa commit: 2 tài liệu tham khảo .NET và bản slide 9 trang xuất từ NotebookLM.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Tài liệu .NET | Chuẩn kiến trúc backend (PR #71, task B-01) |
| Slide NotebookLM | Kịch bản pitch `docs/hackathon/cp5/slide-content.md` (PR #107) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/research/dotnet-csharp-learning-roadmap.md` | Lộ trình kiến thức .NET/C# |
| `docs/research/dotnet-clean-architecture.md` | Clean Architecture trong ASP.NET Core: tầng, cây thư mục, nhiệm vụ từng project |
| `docs/hackathon/cp5/ai-mentor-blueprint.pdf` | Bản slide 9 trang từ NotebookLM (file gốc `AI_Mentor_Engineering_Blueprint.pdf` ở gốc repo, chuyển vào thư mục CP5) |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Đọc hết 9 trang PDF (dạng ảnh, tách từng trang ra xem): không có dữ liệu cá nhân; số liệu khớp `spec.md` và `eval/` (87%, 93%, 0.13%, 19/20, 74/82…).
- `npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- Trang 1 của PDF có sơ đồ "Lộ trình A/B/C" (Machine Learning, NLP, Computer Vision…) do NotebookLM tự vẽ, **không có trong sản phẩm**. Trang 6 ghi "vượt chuẩn an toàn tuyệt đối" — mạnh hơn số đo (19/20). Nên sửa trước khi dùng để thuyết trình.
- **Không** đưa vào PR này: code phân tích khảo sát (`survey-analytics-view.tsx`, `lib/survey/`, `data-cleaner.test.ts`, sửa `admin-cockpit-dashboard-view.tsx`) vì import `survey-responses-raw.json` (dữ liệu thật, đã gitignore) vào Client Component và file test chứa email/số tài khoản trông như thật.
