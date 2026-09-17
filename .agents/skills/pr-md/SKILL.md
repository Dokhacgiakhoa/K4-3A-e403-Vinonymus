---
name: pr-md
description: Viết hoặc cập nhật file PR.md ở gốc repo Vinonymus để mô tả Pull Request hiện tại. Dùng mỗi khi tạo branch để mở PR, chuẩn bị commit cuối trước khi push, mở PR, hoặc review/merge PR của thành viên khác.
---

# Quy ước PR.md — repo Vinonymus

Mỗi Pull Request **bắt buộc** có file `PR.md` ở **gốc repo**, mô tả đúng PR đó. Mục đích: đọc một file là biết PR làm gì, không nhầm giữa các PR.

## Không nhầm với SRS

- `PR.md` = mô tả **một PR**. Mỗi PR ghi đè nội dung của PR trước.
- `docs/01-SRS.md` = đặc tả yêu cầu **chính thức** của hệ thống. Không dùng tên `srs.md` cho mô tả PR.
- Không xoá `PR.md` khi review — đây là file bắt buộc, không phải file thừa.

## Khi nào viết

1. Ngay khi bắt đầu branch: tạo `PR.md` với mục tiêu và issue.
2. Trước khi push lần cuối: cập nhật danh sách file, kết quả kiểm thử thật.
3. Khi mở PR: dán nội dung `PR.md` (hoặc tóm tắt) vào mô tả PR trên GitHub.

## Mẫu

```markdown
# PR: <tiêu đề ngắn, giống tiêu đề PR>

> **Task:** T?-?? · **Issue:** #<số> · **Branch:** `<tên-branch>`
> **Người thực hiện:** <tên> (`@tag`) · **Hỗ trợ:** <tên hoặc —>

## 1. Mục tiêu
<Thay đổi gì, vì sao. 2–5 dòng.>

## 2. Truy vết
| Thay đổi | Yêu cầu liên quan |
|---|---|
| <...> | FR-P?? trong `docs/01-SRS.md` / `spec.md` §? |

## 3. File thay đổi
| File | Thay đổi |
|---|---|
| `path/to/file` | <thêm/sửa/xoá gì> |

## 4. Kiểm thử
- Lệnh đã chạy thật và kết quả thật (ví dụ `npm run verify` → pass).
- Nếu đổi prompt/catalog: lượt eval mới, số `x/20`, ghi ở `eval/run_results.md`.
- Phần **chưa** kiểm thử: ghi rõ.

## 5. Tài liệu & changelog
<Tài liệu nào đã cập nhật; có ghi `spec.md` §9 không.>

## 6. Rủi ro / việc còn lại
<Hoặc "Không có".>

Closes #<số>
```

## Luật bắt buộc

- **Số liệu phải khớp nguồn.** Kết quả eval lấy từ `eval/latest-*-results.json` / `eval/run_results.md`; không ghi "✅ Đạt" cho nhóm case có case trượt. Không claim đã chạy lệnh nếu chưa chạy (AGENTS.md bất biến #10).
- **Không đưa vào PR.md:** API key, `.env`, tên thật người được phỏng vấn, email/số tài khoản, nội dung data pack.
- Viết tiếng Việt, câu ngắn; tên file/lệnh/mã để trong backtick.
- Chỉ mô tả PR hiện tại — xoá nội dung của PR trước khi viết.

## Khi merge / gặp conflict

- Hai PR cùng sửa `PR.md` sẽ conflict. Giữ bản của **PR đang được merge** (bản mô tả PR đó), bỏ bản cũ.
- Merge xong, `PR.md` trên `main` mô tả PR được merge gần nhất — đó là trạng thái đúng.
- Khi review PR của người khác: đối chiếu `PR.md` với diff thật và số eval; sửa chỗ sai (kèm ghi chú trong commit), không xoá file.
