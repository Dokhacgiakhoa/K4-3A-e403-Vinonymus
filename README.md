# Vinonymus — AI Diagnostic Study Planner

> **Mini Hackathon AI · Batch 04** · Lớp 3A · Phòng E403 · Cụm C2 · **Track E — Làn mở (trong phạm vi AI20k)**
> **SPEC → Prototype → Demo.** Đây không phải cuộc thi code — đây là cuộc thi **tư duy sản phẩm AI**.

## 👥 Thành viên nhóm & Phân công vai trò

**Nhóm:** Vinonymus · **Lớp:** 3A · **Phòng:** E403 · **Cụm:** C2 · **Track:** E — Làn mở (trong phạm vi AI20k)

| Họ và Tên | Mã Học Viên | Vai trò chính | Phần việc đảm nhiệm trong dự án |
|---|---|---|---|
| Đỗ Khắc Gia Khoa (đội trưởng) | 02733 | PM | Chốt Canvas & lát cắt, khảo sát nỗi đau, viết `spec.md`, điều phối checkpoint & nộp form, slide + pitch, validation (R6) |
| Trần Nhật Minh | 02483 | BE | Backend/API cho prototype (`/api/roadmap`), tích hợp lời gọi AI qua LLM router, quản lý biến môi trường (không commit key) |
| Đinh Ngọc Đức | 02935 | AI | Thiết kế prompt/pipeline AI, xây golden set & chạy eval (`eval/`), phân tích lỗi và kịch bản rủi ro |
| Nguyễn Việt Thành | 02924 | FE | Giao diện & luồng người dùng (CP2), mock bấm được, quay video thao tác CP3 và video demo dự phòng CP5 |

---

## 🎯 Sản phẩm

**Vấn đề.** Học viên Khoá 4 tự học trước mỗi buổi lab/workshop phải lục tài liệu rải trên nhiều nền tảng (Discord, Zoom, Drive, VLearn, GitHub), không biết đâu là trọng tâm, nên dễ làm bài sát hạn hoặc nộp muộn. Bằng chứng: [`docs/research/evidence-mining.md`](docs/research/evidence-mining.md).

**Lát cắt dự thi (một câu).** Một học viên Khoá 4 cần lên kế hoạch tự học cho bài lab tiếp theo · được AI chẩn đoán nền tảng (tech/non-tech) và quỹ thời gian rảnh · để đề xuất đúng **3 đầu việc trọng tâm kèm link tài liệu** · giúp học viên hoàn thành bài đúng hạn.

**Mức tự động hoá:** conditional — AI đề xuất và giải thích, học viên tick chọn/sửa trước khi làm; hỏi lại khi thông tin không đủ.

Chi tiết quyết định sản phẩm: [`spec.md`](spec.md) · Yêu cầu hệ thống: [`docs/01-SRS.md`](docs/01-SRS.md)

## 🚦 Trạng thái prototype

| Phần | Trạng thái | Ghi chú |
|---|---|---|
| **AI Diagnostic Study Planner** (lát cắt dự thi) — trang `/planner` | 🔧 CP2: luồng bấm được | Luồng 4 bước + checklist chạy thật, không cần đăng nhập; kết quả hiện từ luật tĩnh (`codebase/src/lib/planner/baseline-planner.ts`). CP3 thay bằng lời gọi LLM thật qua `/api/roadmap`, luật tĩnh giữ làm baseline |
| Chat K.AI (RAG có trích dẫn) | ✅ AI chạy thật | Pipeline 5 tầng, BYOK, có eval (`codebase/tests/eval/`) — tính năng nền, không phải lát cắt chấm |
| Tài khoản, gói Pro, chứng chỉ, cây kỹ năng | 🎭 Mock | Không thuộc phạm vi thi |
| Backend .NET (`codebase/backend-core/`, `codebase/database/`) | ⚠️ Chưa tích hợp | App tự fallback khi .NET không chạy — không cần để demo. Xem [`docs/06-backend-dotnet.md`](docs/06-backend-dotnet.md) |

## 🧰 Tech stack

| Lớp | Công nghệ | Trạng thái |
|---|---|---|
| Frontend | Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 · lucide-react · GSAP · PWA | Đang chạy |
| AI | LLM router đa nhà cung cấp, người dùng tự mang key (BYOK): Gemini · OpenAI · Claude · DeepSeek · Groq · Cerebras · OpenRouter · embedding Gemini 768 chiều | Chat: chạy thật · Planner: đang build |
| Dữ liệu | Supabase Postgres + pgvector · Row Level Security · migration SQL (`codebase/supabase/migrations/`) | Đang chạy |
| Validate & hiển thị | zod · react-hook-form · react-markdown + rehype-sanitize | Đang chạy |
| Kiểm thử & CI | Vitest · Husky pre-push (`npm run verify`) · GitHub Actions `verify` trên mọi PR vào `main` | Đang chạy |
| Backend phụ | .NET 10 Clean Architecture · EF Core · Postgres + Qdrant (docker-compose) | Chưa tích hợp |

Kiến trúc chi tiết: [`docs/02-kien-truc.md`](docs/02-kien-truc.md)

## 🗂️ Cấu trúc repo

```
K4-3A-e403-Vinonymus/
├── README.md          ← file này (README duy nhất)
├── spec.md            ← AI Spec — rubric chấm R1–R4
├── demo-slides.pdf    ← slide 6 trang (CP5)
├── docs/              ← toàn bộ tài liệu dự án — xem docs/00-muc-luc.md
├── codebase/          ← prototype (Next.js app + backend .NET chưa tích hợp)
├── eval/              ← golden set + kết quả các lượt chạy (R4)
├── validation/        ← nhật ký cho người ngoài dùng thử (R6)
└── reflection/        ← mỗi thành viên 1 file
```

## ▶️ Chạy thử

Yêu cầu: Node.js 22+, một API key LLM miễn phí (khuyên dùng Gemini — [Google AI Studio](https://aistudio.google.com/apikey)).

```bash
cd codebase
npm install
cp .env.example .env.local   # điền Supabase nếu cần dùng Chat; không commit file này
npm run dev                  # http://localhost:3000/planner
```

- API key nhập ở trang **Cài đặt** trong app, chỉ lưu trên trình duyệt (`localStorage`), không lưu ở server.
- Không cần chạy backend .NET và không cần deploy — luật thi chỉ yêu cầu chạy local và quay màn hình.
- Kiểm tra toàn bộ: `npm run verify` (lint + typecheck + test + audit + build).

**Deploy Vercel:** Import repo → **Root Directory = `codebase`** → Framework Next.js (tự nhận) → Deploy. Trang Planner không cần biến môi trường; Chat K.AI cần `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (đặt trong Vercel, không commit).

## 📚 Bản đồ tài liệu

| Muốn biết | Đọc |
|---|---|
| Vì sao chọn bài toán này, bằng chứng, chuẩn "đạt" | [`spec.md`](spec.md) |
| Hệ thống phải làm được gì (FR/NFR/AC) | [`docs/01-SRS.md`](docs/01-SRS.md) |
| Kiến trúc, luồng dữ liệu | [`docs/02-kien-truc.md`](docs/02-kien-truc.md) |
| API | [`docs/03-api.md`](docs/03-api.md) |
| Prompt, guardrail, LLM router | [`docs/04-ai-pipeline.md`](docs/04-ai-pipeline.md) |
| Luồng người dùng (CP2) | [`docs/05-ui-flow.md`](docs/05-ui-flow.md) |
| Ai làm gì, hạn nào | [`docs/hackathon/tasks.md`](docs/hackathon/tasks.md) |
| Tiến độ checkpoint, canvas CP1 | [`docs/hackathon/`](docs/hackathon/) |
| Bằng chứng mining, nhật ký khảo sát | [`docs/research/`](docs/research/) |
| Quy ước code cho người và AI agent | [`AGENTS.md`](AGENTS.md) |
| Tài liệu cũ của dự án nền (không phản ánh lát cắt thi) | [`docs/legacy/`](docs/legacy/) |

## 📅 Tiến độ checkpoint

| Mốc | Hạn | Trạng thái |
|---|---|---|
| CP1 · Canvas + repo | 19:30 · 16/9 | ✅ Đã nộp |
| CP2 · Luồng hoạt động | 21:00 · 16/9 | 🔄 Trang `/planner` đã xong, chờ nộp |
| CP3 · Video thao tác + số đo | 16:00 · 17/9 | ⏳ |
| CP4 · Chốt `spec.md` | 21:00 · 17/9 | ⏳ |
| CP5 · Slide PDF + video dự phòng | 13:00 · 18/9 | ⏳ |
| CP6 · Thuyết trình | 17:30 · 18/9 | ⏳ |

Chi tiết từng mốc: [`docs/hackathon/checkpoints.md`](docs/hackathon/checkpoints.md) · Phân công: [`docs/hackathon/tasks.md`](docs/hackathon/tasks.md)

## 🔒 Bảo mật dữ liệu

Repo **không chứa** data pack của chương trình (`data/` bị chặn trong `.gitignore`), không chứa câu trả lời khảo sát gốc, không chứa API key. Bằng chứng chỉ dẫn mã tham chiếu (`M#####`, `T#####`) và trích ngắn.

---

<details>
<summary><strong>📋 Đề bài & luật thi — bản gốc từ BTC (bấm để mở)</strong></summary>

> Nhóm copy nguyên file README này về repo của mình, rồi điền bảng trên. Cột **Phần việc đảm nhiệm** ghi càng cụ thể càng tốt.

- Thời lượng: **47,5 giờ** từ phát đề đến thuyết trình (ca 3A) — LAB 5 (phát đề + build) · LEC 6 (tiếp tục build theo ca) · LAB 6 (vòng thi)
- Nhóm: **3-4 người** · thi theo phòng (E403 / E402), chia cụm rồi chung kết phòng — xem *Thể thức thi*
- **Chia cụm theo bàn**, không cần chung đề tài. Chủ đề tự chọn trong khuôn khổ đề bài
- Nhóm nhỏ thì **chọn lát cắt nhỏ**, và phải có **khảo sát nỗi đau thật** — đây là chỗ ăn điểm nặng nhất

## Bắt đầu từ đâu?

1. Đọc **`01-challenge-brief.md`** để hiểu khung chung và 5 tiêu chí, rồi **`tracks/README.md`** để chọn track và đề.
2. Mở **`02-guide.md`** — hướng dẫn từng giai đoạn, đứng ở đâu đọc mục đó.
3. Viết spec theo **`03-ai-spec-template.md`** — deliverable trung tâm của cả sự kiện.
4. Đọc **`04-rubric.md`** ngay từ đầu — biết trước bài được chấm theo tiêu chí nào.

| File / thư mục | Nội dung |
|---|---|
| `01-challenge-brief.md` | Đề bài: bảng 5 track · lát cắt · ràng buộc chung · 5 tiêu chí nghiệm thu |
| `02-guide.md` | Hướng dẫn 5 giai đoạn: khám phá → spec → build → đo & validate → demo |
| `03-ai-spec-template.md` | Template AI Spec (nộp tại **hạn chốt spec** — xem Lịch) |
| `04-rubric.md` | Rubric 100 điểm (25 nộp checkpoint + 67 chấm bài + 8 điểm R6) + checklist xác minh 6 mốc |
| `tracks/` | **5 track**, mỗi đề cùng một khung mục: A VLearn Tutor · B Trợ lý Discord · C Lesson Studio · D Học tập thích ứng & tương tác · E Làn mở (trong phạm vi AI20k) — bắt đầu từ `tracks/README.md` |
| `data/` | Dữ liệu thật đã ẩn danh: `vlearn-pack/` (chatlog VLearn tutor + 6 transcript bài giảng + 2 bộ slide bản hackathon) và **`discord-pack/` (tin nhắn Discord khoá 4 + bản tin bot)** — dùng để tìm bằng chứng và xây golden set. **Đọc `data/README.md` trước** |
| `further-reading/` | Tài liệu tham khảo có tóm lược tiếng Việt: **Mom Test** (phỏng vấn), **PAIR Guidebook** (Google, 6 chương), **HAX Toolkit** (Microsoft, 18 nguyên tắc), **JTBD Playbook** + worksheet — bắt đầu từ `further-reading/README.md` |

## Lịch — 6 checkpoint (ca 3A · 47,5 giờ)

| Mốc | Cần hoàn thành | Hạn (ca 3A) |
|---|---|---|
| — | Khai mạc 17:30 · phát đề 18:00 | 16/9 |
| **CP1** | Canvas 4 ô + đội trưởng + **link repo GitHub công khai** | **19:30** · 16/9 |
| **CP2** | Cho thấy **luồng hoạt động** — bấm thử được, hoặc sơ đồ luồng | **21:00** · 16/9 |
| **CP3** | **Video thao tác** 30 giây + **số đo** (thử bao nhiêu, đúng bao nhiêu) | **16:00** · 17/9 |
| **CP4** | Chốt `spec.md` — **khoá chuẩn "đạt"** · tự khai phần chưa xong | **21:00** · 17/9 |
| **CP5** | Slide PDF + **video demo dự phòng cho buổi pitch** — nộp cuối | **13:00** · 18/9 |
| **CP6** | Thuyết trình · không nộp thêm | **17:30** · 18/9 |

**CP1 đến CP5 mỗi mốc 5 điểm.** Nộp đúng hạn được đủ, nộp muộn là **0 điểm mốc đó** — không bù được bằng mốc khác.

## Làm bài lúc nào

| | |
|---|---|
| **Thời gian tự làm** | Ngoài giờ học, và trong buổi **LEC ngày 17/9** |
| **Coach hỗ trợ** | Trên lớp và trên Discord |
| **Buổi LAB 18/9 · 17:30–21:00** | Đây là **vòng thi**, không phải giờ làm bài |

Hai phòng cùng ca dùng chung lịch mốc. Năm link form phát đủ từ đầu — xong mốc nào nộp mốc đó, không phải chờ.

## Giải thích từng mốc

### CP1 · Chốt Canvas + repo

**Để làm gì:** chốt rõ **làm cho ai và giải vấn đề gì** trước khi bắt tay vào code. Bỏ qua bước này thì hay gặp cảnh làm xong mới nhận ra không ai cần đến.

**Nộp:**
- Canvas điền đủ 4 ô theo mẫu trong `01-challenge-brief.md`
- Họ tên và **mã học viên của đội trưởng**
- **Link repo GitHub** đã để công khai
- **Khai báo willing user** — người sẵn sàng cho nhóm thử sản phẩm ở CP5. Cần ít nhất 2 người, khai từ đây

> **Khai willing user ngay từ CP1, đừng để đến CP5.** Khối R6 ở CP5 yêu cầu có ít nhất 2 willing user đã khai ở mốc này. Đến lúc cần mới đi tìm người thì không kịp.

---

### CP2 · Cho thấy luồng hoạt động

**Để làm gì:** nhìn được cả luồng từ đầu đến cuối — người dùng bấm gì trước, thấy gì sau, kết thúc ở đâu. Vẽ ra giấy thì phát hiện chỗ hổng trong mười phút; code xong mới thấy thì mất cả buổi sửa.

**Nộp một trong ba thứ, thứ nào cũng được:**
- **Bản mock bấm được** — Figma, trang tĩnh, Canva, bất cứ thứ gì click qua lại được
- **Sơ đồ luồng** vẽ tay hay vẽ máy, miễn thấy rõ các bước
- **Video quay màn hình** đi hết một lượt

**Chưa cần AI chạy thật** — cái đó để CP3. Mốc này để nhẹ, chỉ cần cho thấy nhóm đang đi hướng nào.

---

### CP3 · Video thao tác + số đo

**Để làm gì:** biết sản phẩm của mình **đang đúng đến đâu**. Có con số thì mới biết nên sửa chỗ nào tiếp, và lúc pitch cũng có cái để nói thay vì nói suông.

**Nộp hai thứ:**

**1 · Video thao tác — 30 giây, quay màn hình.** Bấm thật trên sản phẩm, thấy AI trả kết quả thật. Không cần dựng, không cần lồng tiếng.

**2 · Số đo — thử bao nhiêu lần, đúng được bao nhiêu.**

Đây là con số cho biết sản phẩm tốt đến đâu. Cách làm:

```
1. Chuẩn bị một bộ câu thử  — ví dụ 20 câu hỏi người dùng hay hỏi
2. Cho sản phẩm chạy hết 20 câu đó
3. Đếm bao nhiêu câu ra kết quả đạt chuẩn nhóm tự đặt
```

| Chưa đạt | Đạt |
|---|---|
| *"Sản phẩm chạy tốt"* | *"Thử 21 câu, 13 câu trả đúng có dẫn nguồn, 8 câu sai hoặc bịa"* |
| *"Độ chính xác cao"* | *"Thử 30 file, 24 file tóm tắt đúng ý chính, 6 file bỏ sót"* |

**Số xấu vẫn được đủ điểm** — miễn là số thật. 13 trên 21 mà phân tích được vì sao 8 câu kia sai thì ăn điểm cao hơn "chạy tốt" không có gì chứng minh.

---

### CP4 · Chốt `spec.md`

**Để làm gì:** chốt **"thế nào là đạt"** trước khi biết kết quả. Đặt chuẩn sau khi đã thấy kết quả thì con số không nói lên điều gì — và người nghe cũng biết vậy.

**Nộp:**
- Link `spec.md` đã chốt — trong đó nhóm **tự chốt "thế nào là đạt"** cho sản phẩm mình
- **Tự khai phần nào chưa làm xong**

Sau 21:00 hôm đó **không sửa chuẩn "đạt" được nữa**.

**Khai thiếu không bị trừ điểm.** Giấu mới bị.

---

### CP5 · Slide + video dự phòng

**Để làm gì:** đảm bảo buổi pitch chạy được **dù mạng hỏng hay máy chết**. Đây cũng là hạn nộp cuối — sau mốc này không nộp thêm gì.

**Nộp:**
- **Slide 6 trang, xuất ra PDF** theo `02-guide.md` §5.1. Nộp PDF chứ không nộp link — link hay hỏng quyền đúng lúc cần
- **Video demo dự phòng** — quay sẵn phần demo. Nếu hôm pitch mạng chết thì BTC chiếu video này và **không trừ điểm**

> **CP3 và CP5 là hai video khác nhau:**
> **CP3** chứng minh sản phẩm chạy — quay ngắn, quay thô cũng được.
> **CP5** là bản sao lưu để buổi pitch không chết vì mạng — quay đúng phần định demo trên sân khấu.

---

### CP6 · Thuyết trình

**Không nộp gì.** Ngày này chỉ để trình bày.

Giám khảo có thể hỏi **bất kỳ thành viên nào** về phần có tên người đó trong bảng phân công.

## Link nộp

| Mốc | Form nộp |
|---|---|
| CP1 | *(cập nhật lúc khai mạc)* |
| CP2 | *(cập nhật lúc khai mạc)* |
| CP3 | *(cập nhật lúc khai mạc)* |
| CP4 | *(cập nhật lúc khai mạc)* |
| CP5 | *(cập nhật lúc khai mạc)* |

> **Đội trưởng nộp form thay cả nhóm** — một phiếu cho cả nhóm ở mỗi mốc, không phải mỗi thành viên tự nộp.
> **25 điểm nộp là điểm chung của nhóm**: mọi thành viên cùng được hoặc cùng mất.

> ⚠️ **Cả 5 mốc phải nộp bằng cùng một mã học viên của đội trưởng.**
> BTC ghép 5 phiếu của nhóm lại với nhau **dựa trên mã học viên người nộp**. Mốc này người A nộp, mốc kia người B nộp thì hệ thống hiểu là hai nhóm khác nhau, và nhóm mất điểm ở những mốc lệch.
>
> Chọn đội trưởng là người **chắc chắn có mặt và theo được cả năm mốc**. Nếu bất khả kháng phải đổi người nộp, báo coach ngay trong buổi.

Link được công bố tại khai mạc, **ghim trên Discord và đăng trên VLearn** — hai nơi, cùng một bộ link.

## Thể thức thi

- 2 ca × 2 phòng = **4 cuộc thi độc lập**, chấm và trao giải riêng từng phòng; mỗi phòng một tổ giám khảo. **Không thi liên phòng, liên khoá.**
- **E403** (~230 người): 6 cụm thi, mỗi nhóm **6 phút** ở vòng cụm → 6 đội vào chung kết phòng → **Top 3**.
- **E402** (~120 người): 5 cụm thi, mỗi nhóm **7 phút** ở vòng cụm → 5 đội vào chung kết phòng → **Top 2**.
- Giám khảo có thể hỏi **bất kỳ thành viên** — ai cũng phải hiểu bài (vibe-coding rule).
- Số nhóm mỗi cụm là ước tính; thể lệ chi tiết vòng cụm và chung kết công bố lúc khai mạc.

### Vòng cụm — game đầu tư

Mỗi đội có **100 điểm vốn**, đội trưởng đại diện xem và đầu tư. Đội nhận nhiều vốn nhất cụm đi tiếp vào chung kết phòng.

**Hai luật:** không được đầu tư vào đội mình · **tổng phải đúng 100**, thừa hoặc thiếu là phiếu không được tính.

Chia cho mấy đội là tuỳ — dồn hết vào một đội cũng được. Mẹo: trong lúc xem thì ghi số dự định ra giấy nháp, xem xong cả cụm mới cân đối lại rồi điền form.

### Chung kết phòng

Sau khi chốt danh sách, các đội có **10–15 phút chuẩn bị**. Thứ tự trình bày quay ngẫu nhiên tại chỗ.

Mỗi đội **10 phút**: 7 phút trình bày + 3 phút hỏi đáp.

Cả phòng bình chọn — mỗi người đánh giá từng đội một cách độc lập, không giới hạn số đội được bầu.

## Giải thưởng

**Giải theo phòng — mỗi lớp 5 đội, hai lớp 10 đội:**

| Lớp | E403 | E402 | Tổng |
|---|---|---|---|
| 3A | Top 3 | Top 2 | 5 đội |
| 3B | Top 3 | Top 2 | 5 đội |

**Điểm thưởng cộng vào bài lab ngày 5 và ngày 6, cho mỗi thành viên:**

| Ai được | Cộng |
|---|---|
| Giải Nhất của phòng | **+10** |
| Giải Nhì của phòng | **+5** |
| Giải Ba — chỉ E403 | **+3** |
| Vào chung kết nhưng không có giải | **+2** |
| Đội **đầu tư nhiều điểm nhất và sớm nhất** vào đội giải Nhất | **+2** |

Mỗi phòng E403 có **7 đội** được cộng điểm, E402 có **6 đội** — không chỉ riêng đội vô địch.

Dòng cuối chỉ có **một đội mỗi phòng**: xét điểm đầu tư cao nhất trước, bằng nhau thì lấy đội nộp phiếu sớm hơn theo dấu thời gian của form.

**Giải theo track — 4 giải, chấm chung cả hai lớp:**

- **Track A · VLearn Tutor và Track D · Học tập thích ứng & tương tác:** 2 giải, do team VLearn chọn.
- **Track C · Lesson Studio:** 2 giải, do team Studio chọn.

Hai team chấm **ngay tại buổi trình bày**. Một đội có thể vừa vào Top phòng vừa nhận giải track. Phần thưởng cụ thể sẽ được công bố sau.

Mỗi mốc cần show gì và được xác minh thế nào: xem bảng trong `04-rubric.md`.

## Nộp bài

### Tạo repo mới — không fork repo đề bài

Nhóm tạo một repo **hoàn toàn mới và trống**. Không fork, không clone repo này rồi push lên.

Lý do: fork mang theo cả thư mục `data/`, mà repo nộp bài bắt buộc phải **công khai** — nghĩa là dữ liệu thật của khoá học sẽ lên mạng. Vi phạm thẳng điều 2 và điều 3 của quy định bảo mật bên dưới.

Nhóm chỉ cần lấy **đúng một file** từ repo này: `03-ai-spec-template.md`, copy vào repo mình và đặt tên `spec.md`. Mọi thứ còn lại là tài liệu đọc, mở tại đây là đủ.

### Cách đặt tên repo

```
K4-<mã lớp>-<phòng>-<tên nhóm>
```

| Ví dụ | Của nhóm nào |
|---|---|
| `K4-3A-E403-StudyPulse` | Lớp 3A · phòng E403 · nhóm StudyPulse |
| `K4-3A-E402-LearnLoop` | Lớp 3A · phòng E402 · nhóm LearnLoop |

**Ba phần đầu bắt buộc đúng.** Phòng là phòng nhóm đang ngồi thi.

**Tên nhóm ở cuối đặt gì cũng được** — viết liền, không dấu, không khoảng trắng.

**Repo phải để công khai.** Thử mở bằng cửa sổ ẩn danh — mở được thì mới đúng. Để riêng tư là giám khảo không chấm được bài.

### Cấu trúc repo

Spec chốt tại hạn chốt spec (xem Lịch); bản hoàn chỉnh trước CP6.

```
repo/
├── README.md          ← copy file này, điền bảng thành viên ở đầu
├── spec.md            ← AI Spec theo 03-ai-spec-template.md
├── demo-slides.pdf    ← slide 6 trang theo 02-guide.md §5.1
├── codebase/          ← prototype (ghi rõ phần nào mock)
├── eval/              ← golden set + bảng kết quả các lượt chạy
├── validation/        ← nhật ký cho người ngoài dùng thử (R6 — không làm thì trần điểm 92)
└── reflection/        ← mỗi người 1 file
```

### README.md của nhóm

Copy nguyên file README này về repo của mình, rồi **điền bảng thành viên ở đầu file**. Không cần viết thêm gì khác.

Mã học viên phải đúng — đây là căn cứ đối chiếu điểm.

## Chấm điểm

Tổng **100 điểm = 25 điểm nộp checkpoint + 67 điểm chấm bài nộp + 8 điểm R6** (cho người ngoài dùng thử). Chi tiết từng ý điểm: `04-rubric.md`.

**25 điểm nộp — mỗi checkpoint 5 điểm (CP1-CP5):** nộp đúng hạn → 5 điểm · nộp muộn → 0 điểm cho mốc đó. **Đội trưởng nộp thay cả nhóm — đây là điểm chung của nhóm, không phải điểm cá nhân.**

**67 điểm chấm + 8 điểm R6 — trên file trong repo, mỗi con điểm trỏ về một chỗ:**

| Khối | Điểm | Chấm trên file nào |
|---|---|---|
| R1 · Bằng chứng & impact | 15 | `spec.md` §1-§2 + log khảo sát |
| R2 · Lát cắt & thiết kế | 15 | `spec.md` §4 |
| R3 · Chỗ khó & kịch bản rủi ro | 11 | `spec.md` §5-§6 |
| R4 · Kiểm thử | 15 | `spec.md` §7 + `eval/` |
| R5 · Prototype chạy được | 8 | `codebase/` + demo |
| **R6 · Cho người ngoài dùng thử** | **8** | `validation/` |
| R7 · Quy trình & repo | 3 | cấu trúc repo |

Ba khối nặng nhất — **R1, R2, R4** — đều nằm trong `spec.md`. Viết spec tử tế là ăn 45 trên 67 điểm.

### R6 · Cho người ngoài dùng thử — 8 điểm

**Không làm thì trần điểm là 92.** Vì 25 + 67 = 92, cộng R6 mới đủ 100.

Làm ở **CP5**, lưu trong thư mục `validation/`.

**Người dùng chê cũng được tính đủ điểm.** Mục đích là xem giải pháp có ăn thua không — ra kết quả nào cũng ghi nhận, miễn là bằng chứng thật. Phát hiện sản phẩm chưa ổn rồi sửa còn dễ ăn điểm hơn, vì có chỗ cụ thể để nói.

**Hai ví dụ thật từ kỳ trước:**

**Nhóm MeaterBeat** phát hiện học viên non-IT lúng túng không biết bấm nút nào, AI trả lời chậm — tức là **giải pháp chưa ổn**. Họ thêm tooltip hướng dẫn, thêm loading spinner, và giải trình phần độ trễ không sửa được vì phụ thuộc API. **Đủ điểm.**

**Nhóm VLearn Recall** phát hiện đúng như giả định: người ta nhớ chủ đề nhưng không nhớ nằm ở slide hay bài giảng — tức là **giải pháp đi đúng hướng**. Họ giữ nguyên thiết kế source-first và bổ sung thêm câu thử. **Cũng đủ điểm.**

**Phải có đủ bốn thứ:**

| | |
|---|---|
| **5 người ngoài nhóm** dùng thử | trong đó **2 người đã khai từ CP1** |
| **Quote nguyên văn** | chép đúng lời họ nói, kể cả viết sai chính tả |
| **Bảng nhật ký** | ai thử · giao task gì · kẹt ở đâu · quote · quyết định |
| **Ít nhất 1 thay đổi** | ghi vào **§9 Changelog** trong `spec.md`. Giữ nguyên thì nói rõ vì sao |

**Cuối bảng viết 4 dòng:** chủ đề lặp nhiều nhất · sẽ sửa gì trước demo · giữ nguyên gì và vì sao · gì để dành sau.

**Quote thế nào mới ăn điểm:**

| Chưa đạt | Đạt |
|---|---|
| *"Demo này ok rồi đấy"* | *"Mình muốn tìm thông tin về code cho ReAct"* |

Bên trái là lời khen xã giao. Bên phải là lời người dùng nói **lúc đang cố làm việc** — nhìn vào biết ngay họ vướng ở đâu.

Muốn có quote như vậy: **giao task rồi ngồi im xem họ làm**, đừng hỏi "sản phẩm này hay không".

Ba điều nên biết trước khi làm:

- Điểm dựa trên **chuỗi quyết định và bằng chứng**, không dựa trên mức độ hoành tráng của sản phẩm.
- Kết quả đo **ghi nhận trung thực** — kể cả khi không đạt mục tiêu nhóm tự đặt — vẫn được tính đủ điểm. Số liệu bị chỉnh sửa hoặc che giấu sẽ không được tính.
- Reflection cá nhân chấm riêng theo rubric của khoá. Điểm vòng demo, chấm chéo trong cụm và thưởng thêm (nếu có) theo thể lệ công bố lúc khai mạc.

## Luật chung

1. Prototype có 3 mức **Sketch / Mock / Working** — mức nào cũng bắt buộc **≥1 lời gọi AI chạy thật**. Đây là thứ phải thấy được trong **video thao tác ở CP3**.
2. **Vibe-coding rule:** dùng AI để build thoải mái, nhưng không giải thích được phần có tên mình thì phần đó 0 điểm (giám khảo hỏi bất kỳ thành viên khi thuyết trình).
3. **Quality bar** chốt tại hạn chốt spec (21:00 17/9, tại CP4) và giữ nguyên sau đó.
4. Chỉ dùng dữ liệu trong `data/` hoặc dữ liệu giả tự sinh — không dùng dữ liệu thật của người thật. Không commit API key.
5. Tuân thủ **quy định bảo mật dữ liệu** bên dưới — đây là điều kiện để được cấp data.

## Bảo mật dữ liệu được cung cấp

Dữ liệu trong `data/` là dữ liệu thật của khoá học (đã ẩn danh), cấp riêng cho hackathon này. Khi nhận data, nhóm cam kết:

1. **Chỉ dùng trong phạm vi hackathon** — cho việc tìm bằng chứng, xây golden set và build prototype. Không dùng cho mục đích khác.
2. **Không chia sẻ ra ngoài khoá học** — không đăng lên mạng xã hội, không gửi cho người ngoài, không đưa vào bất kỳ dataset hay repo công khai nào.
3. **Không commit data pack vào repo nộp bài** — repo nhóm chỉ chứa trích dẫn ngắn để minh hoạ (vài dòng); golden set trích từ data ghi rõ mã đoạn/mã hội thoại thay vì dán nguyên văn dài.
4. **Cẩn trọng khi đưa data vào công cụ ngoài** — chỉ đưa phần tối thiểu cần cho việc đang làm; lưu ý API/công cụ free tier có thể dùng dữ liệu để huấn luyện (xem `02-guide.md` §3.4).
5. **Không cố suy ngược danh tính** từ dữ liệu đã ẩn danh (`S####`, `T#####`, `D####`, `[HV]`, [học viên]). Riêng `discord-pack/`: người trong đó là **bạn cùng khoá** — tuyệt đối không đoán/hỏi "tin này của ai"; trích dẫn tối đa 2 câu mỗi ví dụ (xem `data/discord-pack/README.md`).
6. Sau sự kiện, **xoá các bản sao data pack** khỏi máy cá nhân và các công cụ đã upload nếu ban tổ chức yêu cầu.

Vi phạm được xử lý theo quy định của khoá và có thể ảnh hưởng trực tiếp đến điểm của nhóm.

</details>
