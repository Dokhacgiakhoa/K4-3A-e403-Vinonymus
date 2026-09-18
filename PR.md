# PR: Kịch bản pitch 15 slide (Mở – Thân – Kết)

> **Task:** T6-01 (#36) kịch bản pitch · **Issue:** #36 · **Branch:** `docs/pitch-deck-script`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
Làm lại slide pitch theo cấu trúc Mở – Thân – Kết, có mục lục, kịch bản nói khoảng 10 phút. Làm đủ yêu cầu đề trước (`02-guide.md` §5.1: 6 mục slide; `04-rubric.md` CP6: case lỗi live, % so với quality bar, mỗi thành viên nói ≥1 phần), rồi mở rộng về dự án. Phần chưa làm xong ghi "Ý tưởng · đang triển khai", không demo.

## 2. Truy vết
| Phần | Slide | Nguồn |
|---|---|---|
| Mở đầu | 1–3 | README mục Sản phẩm, `spec.md` §1 |
| Thân A (6 mục đề yêu cầu) | 4–9 | `spec.md` §1, §2, §4, §6, §7 · `eval/run_results.md` |
| Thân B (mở rộng) | 10–13 | `docs/06-backend-dotnet.md`, `scripts/audit-faqs.ts`, `docs/hackathon/tasks-he-thong-4-vai-tro.md` |
| Kết | 14–15 | `spec.md` §2, `validation/log.md` |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `docs/hackathon/cp5/slide-content.md` | Viết lại theo deck 15 slide: nội dung từng slide, lời nói, người nói, thời lượng; bảng bản đủ / 7 phút / 6 phút |
| `PR.md` | Mô tả PR này |

Slide web (ngoài repo): https://claude.ai/artifact/TB2Lhp6t1rH7eqReAVZWFV

## 4. Kiểm thử
- Thời lượng cộng từ ghi chú từng slide: bản đủ khoảng 9'55", bản 7 phút khoảng 7'15", bản 6 phút khoảng 5'55".
- Kiểm tra trạng thái "Đã chạy" với code thật: nhánh `production` đang ở PR #61; trang chat gọi `/api/chat` thật đã có trên `production`; widget chat nổi và hạn mức khách mới có trên `main` (51 commit chưa lên `production`) → ghi "Code xong · chưa lên web".
- Số liệu giữ nguyên như slide CP5 (đã đối chiếu `spec.md`, `eval/`).
- `npm run verify` chạy qua hook pre-push khi push nhánh này.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- Đề cho E403 **6 phút** ở vòng cụm, **7 phút** trình bày ở chung kết — bản đủ 10 phút dùng để tập; khi thi dùng bản cắt.
- Slide 9 ghi chưa đủ 5 buổi người dùng thử (theo `validation/log.md`); có buổi thật thì sửa lại.
- `demo-slides.pdf` (CP5) vẫn là bản 6 trang cũ, không đổi trong PR này.
