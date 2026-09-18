# PR: CI chạy test backend .NET (B-11)

> **Task:** B-11 trong [`docs/hackathon/tasks-he-thong-4-vai-tro.md`](docs/hackathon/tasks-he-thong-4-vai-tro.md) · **Issue:** — · **Branch:** `ci/dotnet-test`
> **Người thực hiện:** Đỗ Khắc Gia Khoa (`@Khoa`) với Claude Code · **Hỗ trợ:** —

## 1. Mục tiêu
CI trên GitHub (`verify.yml`) mới chỉ chạy `npm run verify` cho Next.js. 60 test của backend .NET (thêm ở PR #71) chỉ chạy khi ai đó nhớ chạy tay. PR này thêm job `backend-test` để mọi PR vào `main` đều build và chạy lại toàn bộ test backend.

## 2. Truy vết
| Thay đổi | Liên quan |
|---|---|
| Job `backend-test` | Task B-11; bộ test từ PR #71 (B-02) |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `.github/workflows/verify.yml` | Thêm job `backend-test`: cài .NET 10 → `dotnet restore` → `dotnet build -c Release -warnaserror` → `dotnet test` |
| `docs/hackathon/tasks-he-thong-4-vai-tro.md` | Thêm dòng B-11; ghi CI chạy lại test backend trong mục Cách làm việc |
| `PR.md` | Mô tả PR này |

## 4. Kiểm thử
- Chạy đúng các lệnh của job trên máy: build Release với `-warnaserror` 0 cảnh báo 0 lỗi; `dotnet test` 60/60 qua (Domain 6 · Application 41 · tích hợp HTTP 13).
- Kết quả job trên GitHub: xem tab Checks của PR này (ghi lại sau khi chạy xong).

## 5. Tài liệu & changelog
Không ghi `spec.md` §9.

## 6. Rủi ro / việc còn lại
- Job mới **chưa phải check bắt buộc**: luật bảo vệ `main` hiện chỉ bắt buộc check `verify`. Muốn chặn merge khi test backend đỏ thì thêm `backend-test` vào danh sách check bắt buộc (cài đặt repo, PM quyết).
- Job chạy ở mọi PR vào `main`, kể cả PR không đụng backend (thêm khoảng 1–2 phút). Không lọc theo đường dẫn vì check bắt buộc bị lọc sẽ treo ở trạng thái chờ.
