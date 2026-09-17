# Kế hoạch sửa cấu trúc repo & quy trình nhóm

> Lập 17/9 sau buổi rà soát repo. Phụ trách chung: `@Khoa` (R7 · Quy trình & repo).
> Nguyên tắc: **không làm chậm CP3 (16:00 · 17/9)**. Việc nào đụng tới code đang build cho CP3 thì để sau khi nộp CP3.

**Tiến độ (17/9):**
- Giai đoạn 0: ✅ đã xong, trừ F0-6 (Khoa nhắn nhóm).
- Giai đoạn 1: ✅ đã xong (PR #43), trừ F1-7 (bật sau khi các PR mở trước #43 đã merge).
- Giai đoạn 2, 3: ⏳ chưa làm.

> ⚠️ Sau #43, hook pre-push chạy từ gốc repo. Branch nào tách ra **trước** #43 phải merge `main` vào rồi mới push được, nếu không hook cũ sẽ báo lỗi `Could not read package.json`.

## 1. Hiện trạng — các vấn đề đã xác minh

| # | Vấn đề | Bằng chứng | Hậu quả |
|---|---|---|---|
| V1 | 22/40 issue **không có assignee**, chỉ có label `owner:*` | `gh issue list` — chỉ issue của Khoa được assign | Minh, Đức, Thành không nhận được thông báo việc |
| V2 | 4 issue việc chung (#1, #26, #37, #39) chỉ assign Khoa | như trên | 3 người còn lại không thấy việc của mình |
| V3 | Handle GitHub của Minh, Đức, Thành còn `[TODO]` trong `tasks.md` | `tasks.md` bảng Thành viên | Không tag / không CODEOWNERS được |
| V4 | Workflow nằm ở `codebase/.github/` → **GitHub không chạy** | GitHub chỉ đọc `.github/` ở gốc repo; PR #41 chỉ có 2 check của Vercel | Không có CI verify; README ghi "GitHub Actions — Đang chạy" là sai |
| V5 | Husky pre-push **không được cài** | `git config core.hooksPath` rỗng; `.husky/` nằm trong `codebase/` còn `.git` ở gốc | Quy ước "verify trước khi push" trong AGENTS.md không được ép |
| V6 | `tasks.md` và GitHub Issues lệch nhau | T2-01, T2-02 ✅ trong file nhưng issue #2, #3 còn mở | Hai nguồn sự thật, không biết tin bên nào |
| V7 | Runner eval cần chạy từ thư mục gốc `eval/` | `eval/run-eval.ts` dùng import tương đối vào `codebase/`; `npm run eval` trỏ đúng runner | ✅ Đã giải quyết |
| V8 | `npm run audit` sinh `codebase/docs/reports/` mà không bị ignore | `git status` sau `npm run verify` | Dễ commit nhầm file báo cáo |
| V9 | Code/tài liệu dự án nền chiếm phần lớn repo | 632 file tracked; `docs/legacy/` 255 file; .NET (`backend-core`, `backend-services`, `database`) 55 file | Giám khảo khó tìm lát cắt dự thi |
| V10 | `codebase/CLAUDE.md`, `codebase/AGENTS.md` (bị gitignore, chỉ có trên máy Khoa) còn quy ước của "AIIA Notebook" | trỏ tới `docs/06-AI-PIPELINE.md`, `docs/09-...` không tồn tại | AI agent trên máy Khoa đọc hai bộ quy ước mâu thuẫn |

Đã kiểm tra: `src/` **không** tham chiếu tới .NET (`backend-core`, `backend-services`) → xoá được an toàn. `codebase/data/faqs` **đang được dùng** bởi Chat K.AI (`src/lib/faqs.ts`, `src/lib/prompts/rag-general.ts`) và `scripts/audit-faqs.ts` → chỉ xoá được nếu bỏ luôn Chat.

## 2. Cấu trúc đích

Tên thư mục ở gốc giữ đúng khung BTC (R7 chấm theo tên). Chỉ dọn bên trong.

```
/
├── README.md · spec.md · AGENTS.md · CLAUDE.md · LICENSE · demo-slides.pdf
├── .github/
│   ├── workflows/verify.yml        ← CI: npm run verify trên mọi PR vào main
│   ├── CODEOWNERS                  ← tự gán người review theo thư mục
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/task.md
├── codebase/                       ← chỉ app Next.js
│   ├── src/app/planner · src/app/api/roadmap
│   ├── src/lib/{llm,planner,prompts}
│   ├── src/data/planner-catalog.ts
│   └── scripts/                     ← script vận hành app
├── eval/                           ← CP3: golden-set.json, run-eval.ts, run_results.md
├── validation/ · reflection/
└── docs/                           ← SRS, kiến trúc, API, AI pipeline, UI flow, research/, hackathon/
```

**Nguồn sự thật cho việc cần làm:** GitHub Issues + một Project board (cột: Todo · Doing · Review · Done, lọc theo milestone CP). `tasks.md` rút gọn thành bảng thành viên + quy tắc + link sang board, không còn cột trạng thái.

## 3. Các bước

### Giai đoạn 0 — ngay bây giờ (≈10 phút, không đụng code)

| ID | Việc | Phụ trách | Hoàn thành khi |
|---|---|---|---|
| F0-1 | Xác nhận handle: `minh-tran-2611` = Minh, `dinhngocduc1311` = Đức, `thanhnvhust514` = Thành | `@Khoa` | Ba bạn xác nhận trong nhóm chat |
| F0-2 | Điền handle vào bảng Thành viên trong `tasks.md` | `@Khoa` | Không còn `[TODO]` |
| F0-3 | Assign 22 issue theo label `owner:*` (V1) | `@Khoa` | `gh issue list --search "no:assignee"` rỗng |
| F0-4 | Assign đủ 4 người cho #1, #26, #37, #39 (V2) | `@Khoa` | Mỗi issue có 4 assignee |
| F0-5 | Đóng các issue đã xong nhưng còn mở (#2, #3, #5 nếu đã nộp CP2…) (V6) | `@Khoa` | Trạng thái issue khớp thực tế |
| F0-6 | Nhắn nhóm: "việc của bạn xem ở tab Issues → Assigned to me" | `@Khoa` | Cả 3 bạn đã đọc |

Lệnh tham khảo (chạy sau F0-1):

```bash
for n in 2 9 10 24 32; do gh issue edit $n --add-assignee minh-tran-2611; done
for n in 7 8 11 12 14 21 23 31; do gh issue edit $n --add-assignee dinhngocduc1311; done
for n in 3 4 6 13 15 22 30 34 38; do gh issue edit $n --add-assignee thanhnvhust514; done
for n in 1 26 37 39; do gh issue edit $n --add-assignee minh-tran-2611,dinhngocduc1311,thanhnvhust514; done
```

### Giai đoạn 1 — song song với CP3, chỉ file cấu hình (branch `chore/ci-and-hooks`)

| ID | Việc | Phụ trách | Hỗ trợ | Hoàn thành khi |
|---|---|---|---|---|
| F1-1 | Chuyển runner về `eval/run-eval.ts`, dùng import tương đối vào `codebase/` và cập nhật T3-07 | `@Khoa` | `@Duc` | ✅ Runner chạy được qua `npm run eval` |
| F1-2 | Thêm `codebase/docs/reports/` vào `.gitignore` (V8) | `@Minh` | — | `git status` sạch sau `npm run verify` |
| F1-3 | Tạo `.github/workflows/verify.yml` ở gốc: Node 22, `working-directory: codebase`, `npm ci`, `npm run verify` (V4) | `@Minh` | `@Khoa` | Check "verify" hiện trên PR và xanh |
| F1-4 | Chuyển `keepalive.yml`, `sync-content.yml` lên `.github/workflows/`, sửa `paths`/`working-directory` cho đúng `codebase/`; nếu không cần thì xoá | `@Minh` | — | Không còn `codebase/.github/` |
| F1-5 | Sửa husky cho repo có app trong thư mục con: `"prepare": "cd .. && husky codebase/.husky"`, hook `pre-push` chạy `cd codebase && npm run verify` (V5) | `@Minh` | — | `git config core.hooksPath` = `codebase/.husky/_` và push thử có chạy verify |
| F1-6 | Thêm `.github/CODEOWNERS` (xem mẫu dưới) và `pull_request_template.md` (tóm tắt · issue liên quan · đã chạy verify chưa) | `@Khoa` | — | PR mới tự gán reviewer |
| F1-7 | Bật branch protection cho `main`: bắt buộc check `verify` + 1 review | `@Khoa` | — | Không merge được PR đỏ |

Rủi ro cần thử khi làm F1-3: `npm run build` trên CI không có `.env.local`. Nếu build lỗi vì thiếu biến Supabase thì thêm biến giả trong workflow (không dùng key thật) hoặc cho phần Chat đọc biến lười thay vì lúc build. `npm ci` sẽ gọi `prepare` → làm F1-5 trước hoặc cùng lúc để CI không lỗi vì husky.

Mẫu `CODEOWNERS` (điền sau F0-1):

```
*                                   @Dokhacgiakhoa
/spec.md                            @Dokhacgiakhoa
/docs/research/                     @Dokhacgiakhoa
/validation/                        @Dokhacgiakhoa
/codebase/src/app/api/              @minh-tran-2611
/codebase/src/lib/llm/              @minh-tran-2611
/.github/                           @minh-tran-2611
/codebase/src/lib/prompts/          @dinhngocduc1311
/codebase/src/data/planner-catalog.ts @dinhngocduc1311
/eval/                              @dinhngocduc1311
/eval/run-eval.ts                      @dinhngocduc1311
/codebase/src/components/planner/   @thanhnvhust514
/codebase/src/app/planner/          @thanhnvhust514
/docs/05-ui-flow.md                 @thanhnvhust514
```

### Giai đoạn 2 — sau khi nộp CP3, trước CP4 (21:00 · 17/9)

| ID | Việc | Phụ trách | Hoàn thành khi |
|---|---|---|---|
| F2-1 | Tạo Project board, gắn 40 issue, cột Todo/Doing/Review/Done (V6) | `@Khoa` | Board có đủ issue theo milestone |
| F2-2 | Rút gọn `tasks.md`: giữ bảng thành viên, quy tắc, link board; bỏ cột trạng thái | `@Khoa` | Không còn trạng thái lặp với Issues |
| F2-3 | Sửa README: dòng "GitHub Actions" cho đúng thực tế sau F1; thêm link board | `@Khoa` | README khớp repo |
| F2-4 | Xoá `codebase/CLAUDE.md`, `codebase/AGENTS.md` cũ trên máy Khoa (hoặc thay bằng một dòng trỏ về `AGENTS.md` gốc) (V10) | `@Khoa` | Agent chỉ đọc một bộ quy ước |

### Giai đoạn 3 — dọn dự án nền, trước CP5 (13:00 · 18/9)

Làm trên branch `chore/prune-base-project`, gắn tag trước khi xoá để tra lại được:

```bash
git tag base-project-snapshot main
git push origin base-project-snapshot
```

| ID | Việc | Phụ trách | Hoàn thành khi |
|---|---|---|---|
| F3-1 | Xoá `docs/legacy/` (255 file) — lịch sử git và tag vẫn giữ; sửa link trong `00-muc-luc.md`, `CLAUDE.md`, `AGENTS.md`, README | `@Khoa` | Không còn link chết (`grep -r "legacy/"`) |
| F3-2 | Xoá `codebase/backend-core`, `backend-services`, `database` và `docs/06-backend-dotnet.md`; sửa README, `02-kien-truc.md` | `@Minh` | `npm run verify` xanh |
| F3-3 | **Chờ quyết định D1** rồi mới xử lý Chat K.AI và `codebase/data/` | `@Khoa` | Đã chốt D1 |
| F3-4 | Chạy `npm run verify` + mở `/planner` bằng tay sau khi dọn | `@Minh` | Verify xanh, luồng Planner chạy |

## 4. Quyết định cần chốt

| ID | Câu hỏi | Lựa chọn | Đề xuất |
|---|---|---|---|
| D1 | Giữ Chat K.AI không? | (a) Giữ — giữ `codebase/data/`, `api/chat`, audit FAQ · (b) Bỏ — xoá luôn, repo chỉ còn Planner | (a) nếu còn định nhắc Chat khi pitch; không thì (b) cho repo gọn |
| D2 | Các trang mock (tài khoản, Pro, SFIA, learning…) | Giữ / xoá | Giữ tới sau CP6 — xoá gấp dễ vỡ build lúc sát demo |
| D3 | Branch `MVP` (đứng sau `main` 5 commit, đã có trong `main`) | Xoá / giữ | Xoá |

## 5. Không làm

- Không đổi tên `codebase/`, `eval/`, `validation/`, `reflection/`, `spec.md` — rubric chấm theo tên.
- Không dọn code dự án nền trong ngày 17/9 — ưu tiên CP3, CP4.
- Không sửa chuẩn "đạt" trong `spec.md` §7 sau 21:00 · 17/9 (AGENTS.md bất biến 11).
