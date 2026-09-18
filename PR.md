# PR: Slide CP5 (6 trang PDF)

> **Task:** T5-06 (#33) · **Issue:** #33 · **Branch:** `docs/cp5-slides`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Nộp slide 6 trang PDF cho CP5 (hạn 13:00 · 18/9) theo `02-guide.md` §5.1: mỗi trang có ≥1 con số / quote có nguồn.

## 2. Truy vết
| Slide | Nguồn số liệu |
|---|---|
| 1 User & Job | `spec.md` §1 (khảo sát n = 82, vlearn-pack, phỏng vấn P02) |
| 2 Vì sao chọn | `spec.md` §2 |
| 3 Giải pháp & demo | `docs/05-ui-flow.md`, golden case G16, G14 |
| 4 Kết quả đo | `eval/run_results.md`, `spec.md` §7 |
| 5 User thật nói gì | Quote P01, P02 (`docs/research/survey-log.md`) + kết quả golden set (validation chưa đủ 5 người) |
| 6 Thêm 1 tuần | Lỗ hổng còn lại + `spec.md` §2 (90% muốn bài test chẩn đoán) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `demo-slides.pdf` | Slide 6 trang (vị trí README đã hẹn) |
| `docs/hackathon/cp5/demo-slides.html` | Bản nguồn để sửa và xuất lại PDF |
| `docs/hackathon/cp5/slide-content.md` | Nội dung 6 slide (tiêu đề, nội dung, nguồn, lời nói) để đưa vào NotebookLM tạo PDF |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Xuất PDF bằng Edge headless: đúng 6 trang, khổ 1280×720; chụp ảnh cả 6 trang kiểm tra bằng mắt, không tràn chữ.
- Đối chiếu từng con số với `spec.md` §1, §2, §7 và `eval/run_results.md`.
- Slide 4 ghi rõ bộ 50 case chỉ chạy baseline luật tĩnh (luật đã chỉnh theo chính các case) nên không dùng làm bằng chứng chất lượng AI; Quality Bar đo trên AI v2 19/20.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- Slide 5 ghi **chưa đủ 5 buổi người ngoài dùng thử** vì `validation/log.md` còn trống. Nếu đã có buổi dùng thử nhưng chưa ghi, cần điền log và sửa slide 5.
- Video demo dự phòng (T5-07, Thành) không nằm trong PR này.
