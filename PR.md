# PR: Sửa link demo và tách link trong README

> **Task:** hoàn thiện README · **Issue:** — · **Branch:** `docs/readme-links`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
- Link demo cũ `codebase-mu-eight.vercel.app` trả 404 (`DEPLOYMENT_NOT_FOUND`). Đổi sang domain đang chạy của project Vercel `codebase`.
- Mỗi dòng chỉ còn một link cho dễ đọc. Mục lục chuyển thành danh sách và bổ sung 2 mục còn thiếu (Cấu trúc repo, Bảo mật dữ liệu).

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Link demo đúng | Rubric R5 (prototype chạy được, có demo) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `README.md` | Bảng link đầu trang (demo, tên miền riêng, spec, milestones); các bước của AI Mentor thành danh sách; mục lục dạng danh sách; tách các dòng "Chi tiết" và "Bằng chứng" có nhiều link; sửa link "Bản đã deploy" |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- `curl` `/` và `/planner` trên `k4-3a-e403-vinonymus.vercel.app` và `k4-3a-e403-vinonymus.kailabs.io.vn`: đều 200, tiêu đề trang là "AI Diagnostic Study Planner | K.AI Labs". Link cũ `codebase-mu-eight.vercel.app` trả 404.
- So từng anchor `#...` trong README với id GitHub sinh ra (API render README): 0 lỗi. Mọi link file tương đối đều tồn tại.
- `npm run verify` chạy qua hook pre-push.

## 5. Tài liệu & changelog
Không ghi `spec.md` §9 vì không đổi sản phẩm.

## 6. Rủi ro / việc còn lại
- Tiêu đề trang web vẫn là "AI Diagnostic Study Planner"; chưa đổi sang tên AI Mentor.
- Project Vercel có domain nhánh `production`. Cần kiểm tra Vercel lấy nhánh nào làm production, vì README ghi "Vercel tự deploy khi merge `main`".
