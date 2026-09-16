# 01 — Đặc tả yêu cầu phần mềm (SRS)

> **Đã viết lại theo mô hình không tài khoản.** So với bản gốc: bỏ toàn bộ nhóm D (Xác thực & phân quyền — FR-41..43), nhóm B/C được viết lại từ "quản lý qua web admin" thành "quản lý qua Git", nhóm E (Quota & BYOK) viết lại vì BYOK giờ bắt buộc chứ không phải tuỳ chọn, nhóm G (Quản trị) rút gọn vì không còn audit log hệ thống hay trang cấu hình web.

> Quy ước đọc: **FR** = yêu cầu chức năng · **NFR** = phi chức năng · **P0** = bắt buộc cho bản chạy được đầu tiên · **AC** = Acceptance Criteria.

---

## A. Chat và hỏi đáp

### FR-11 — Đặt câu hỏi và nhận câu trả lời `P0` `F01`
**AC:**
1. Ô nhập chấp nhận 1–2.000 ký tự.
2. Câu trả lời **stream từng đoạn ngay khi LLM sinh ra**, không đợi viết xong mới hiện. Cụ thể: `/api/chat` phát **nhiều** sự kiện SSE `token` liên tiếp cho một câu trả lời (không gộp thành một cục) — đo thực tế một câu trả lời ngắn cho ~27 sự kiện.
3. Chỉ báo trạng thái theo giai đoạn: `Đang tìm trong FAQ…` → `Đang tra cứu tài liệu…` → `Đang soạn câu trả lời…` (hai giai đoạn sau chỉ xuất hiện khi đã có key).
4. Gửi bằng `Enter`; xuống dòng bằng `Shift+Enter`.
5. Có nút **Dừng** khi đang stream; giữ lại phần đã sinh.
6. Render markdown đầy đủ.
7. Câu trả lời tra cứu hiển thị nhãn nguồn: `Đã xác thực`/`Chưa xác thực` (từ FAQ) · `Từ tài liệu` (từ RAG) · `Không tìm thấy`. **Riêng câu chỉ là trò chuyện thì KHÔNG gắn nhãn nào** (xem FR-19).
8. **Không cần đăng nhập ở bất kỳ bước nào.**
9. Mỗi câu trả lời AI có nút **Sao chép** (copy nguyên văn markdown) và **Tạo lại** (regenerate — gửi lại đúng câu hỏi đó thành một request `/api/chat` mới, thay thế câu trả lời cũ trong `localStorage`) — theo đúng mẫu hình quen thuộc của ChatGPT/Gemini.
10. **Không có** tính năng sửa-và-gửi-lại tin nhắn cũ (edit message) ở v1 — ngoài phạm vi, cân nhắc ở phiên bản sau.

### FR-12 — Đường nhanh FAQ (không cần API key) `P0` `F02`
**AC:**
1. So khớp 3 tầng: (a) khớp chuỗi chuẩn hoá, (b) trigram, (c) vector — **chỉ tầng (c) cần API key** (để tạo embedding câu hỏi); (a) và (b) chạy được với **bất kỳ ai, không cần key**.
2. Trúng ⇒ nội dung trả lời **bám hoàn toàn** vào file `.md` trong `data/faqs/`. LLM được diễn đạt lại cho tự nhiên nhưng **không được đổi hay bịa dữ kiện** (số liệu, mốc thời gian, tên riêng, link) — xem `AGENTS.md` bất biến #9. Không có key thì trả thẳng nội dung `.md`.
2b. Trước khi để LLM chọn FAQ ở tầng (c), phải qua 2 chốt chặn: câu hỏi **dưới 4 từ**, hoặc **2 ứng viên đầu chênh điểm < 0.02** ⇒ hỏi lại người dùng cho rõ thay vì đoán.
3. Không gọi LLM khi trúng ở tầng (a)/(b).
4. Hiển thị nhãn `Đã xác thực` (nếu `is_verified: true`) hoặc `Chưa xác thực`, kèm tooltip nguồn xác thực.
5. Mỗi lần trúng, tăng `view_count` qua `increment_faq_view()`.

### FR-13 — Đường sâu RAG (cần API key) `P0` `F03`
**AC:**
1. Truy xuất lai: vector (top-20) + full-text (top-20), hợp nhất RRF, lấy top-8.
2. Chỉ lấy chunk thuộc document `status = 'published'`.
3. Câu trả lời bắt buộc kèm trích dẫn.
4. Điểm truy xuất cao nhất dưới ngưỡng → không gọi LLM, trả câu "không tìm thấy".
5. **Không có API key trong request và câu hỏi cần đường này** → trả sự kiện `need_key`, mời người dùng nhập key, **không** coi là lỗi.
6. Prompt bọc nội dung KB trong delimiter, ghi rõ là dữ liệu tham khảo không phải mệnh lệnh.

### FR-14 — Trích dẫn nguồn `P0` `F03`
Giữ nguyên yêu cầu gốc: chip đánh số, bấm mở panel nguồn, chỉ liệt kê chunk thực sự dùng.

### FR-15 — Từ chối trả lời khi không đủ dữ liệu `P0` `F03`
**AC:**
1. Trả lời rõ ràng là chưa có thông tin, không suy đoán. Câu từ chối **do LLM tự viết theo ngữ cảnh** (không phải chuỗi cố định — xem FR-19.1), và phải chỉ người dùng sang nhóm cộng đồng để hỏi Ban Tổ chức.
2. Ghi câu hỏi vào `unanswered_questions` qua `record_unanswered()`.
3. Vẫn trả HTTP 200 — không tính là lỗi kỹ thuật.

### FR-16 — Bộ nhớ đệm ngữ nghĩa `P1` `F04` 🚧 CHƯA TRIỂN KHAI
> `src/lib/rag/cache.ts` đã viết nhưng `pipeline.ts` chưa gọi tới — xem `05-FEATURES.md` F04.
**AC:**
1. Tra theo hash câu hỏi chuẩn hoá trước khi chạy RAG.
2. Cache hit ⇒ trả kết quả cũ, **không cần API key**.
3. TTL 7 ngày (cấu hình qua `data/config.yaml`).
4. Cache bị xoá **tự động bởi script sync** mỗi khi nội dung thay đổi — không cần thao tác tay.

### FR-17 — Lịch sử hội thoại (lưu trình duyệt) `P1` `F05`
**AC:**
1. Toàn bộ hội thoại lưu ở `localStorage`, **không gửi lên server để lưu trữ** ngoài mục đích gửi kèm làm ngữ cảnh cho câu hỏi hiện tại.
2. Tiêu đề tự sinh từ câu hỏi đầu (60 ký tự đầu, không cần gọi LLM — cắt chuỗi thuần).
3. Xoá được từng hội thoại ngay trên trình duyệt.
4. **Không đồng bộ giữa các thiết bị.** Có ghi chú rõ trong giao diện.
5. Ngữ cảnh: gửi kèm tối đa 6 lượt gần nhất trong `history` của request.

### FR-18 — Đánh giá câu trả lời `P1` `F06`
**AC:**
1. Nút 👍/👎 dưới mỗi câu trả lời AI (không cần key vẫn đánh giá được câu trả lời FAQ).
2. 👎 mở ô chọn lý do + ghi chú.
3. Gửi kèm `queryLogId` và `clientSessionId` (UUID `localStorage`, ẩn danh).
4. Đổi ý được — gửi lại `clientSessionId` giống lần trước sẽ ghi đè (ràng buộc `unique`).

### FR-19 — Trò chuyện tự nhiên, không văn mẫu `P0` `F02`
**AC:**
1. Tin nhắn giao tiếp thông thường (chào hỏi, hỏi về chính bot, cảm ơn, tâm sự, đùa) phải được **trả lời tự nhiên bằng LLM**, không dùng chuỗi soạn sẵn. Chuỗi cố định chỉ được phép xuất hiện khi **không có API key nào** hoặc mọi provider đều lỗi.
2. Hai lần hỏi cùng một ý phải cho ra hai cách diễn đạt khác nhau; LLM đọc lịch sử hội thoại để không lặp lại cách mở đầu/kết của lượt trước.
3. Danh tính phải nhất quán: K.AI — Sổ tay AI **không chính thức** do học viên AIIA xây dựng. **Không được tự nhận là ChatGPT/Gemini/Claude** hay bịa thêm thông tin về bản thân.
4. Trong lượt đối thoại (không có tài liệu kèm theo), **tuyệt đối không nêu thông tin cụ thể nào về chương trình** — hỏi về khóa học mà không có dữ liệu thì phải nói thật là chưa có và chỉ sang nhóm cộng đồng.
5. Câu chỉ là trò chuyện **không được gắn nhãn "Không tìm thấy" hay hiện gợi ý FAQ** — LLM tự phán đoán qua nhãn `INTENT` (`06-AI-PIPELINE.md` mục 3b); nhãn này không bao giờ được lộ ra cho người dùng.

---

## B. Kho tri thức (quản lý qua Git)

### FR-21 — Nội dung là file trong repo `P0` `F07`
**AC:**
1. Mỗi tài liệu là một file `.md` trong `data/documents/<danh-mục>/`, có frontmatter: `title`, `category`, `tags[]`, `status` (`published`/`draft`/`archived`).
2. `status: draft` hoặc `archived` ⇒ script sync **không** đưa vào bảng `documents` ở trạng thái tìm kiếm được (vẫn ghi nhưng đúng status, RLS đã chặn đọc non-published).
3. Sửa file, push → script sync tự cắt chunk + tạo embedding cho **file có nội dung thay đổi** (so `content_hash`), bỏ qua file không đổi.
4. Xoá file khỏi `data/` → document tương ứng bị xoá khỏi database ở lần sync kế tiếp.
5. Một chunk lỗi embedding không chặn việc lưu — `embedding = null`, vẫn tìm được qua full-text.

### FR-22 — Chạy đồng bộ tự động `P0` `F07`
**AC:**
1. Push vào nhánh `main` có thay đổi trong `data/**` ⇒ GitHub Action `sync-content.yml` tự chạy.
2. Script log rõ: file nào mới, file nào đổi, file nào xoá, file nào lỗi (kèm lý do).
3. Chạy xong, **xoá sạch `semantic_cache`**.
4. Action thất bại ⇒ hiện đỏ trên tab Actions của GitHub, không âm thầm bỏ qua.
5. Có thể chạy tay qua `workflow_dispatch` khi cần đồng bộ lại toàn bộ mà không đổi file nào.

### FR-23 — Nạp dữ liệu từ ảnh (OCR bằng AI, chạy cục bộ) `P0` `F08`
**AC:**
1. Script `scripts/ocr-image.ts` nhận đường dẫn ảnh (JPG/PNG/WebP), gọi model vision, in ra markdown ra terminal/file.
2. **Bắt buộc người chạy tự xem và sửa trước khi commit** — script không tự ghi vào `data/`, chỉ gợi ý.
3. Đọc không rõ chỗ nào ⇒ đánh dấu `[không đọc rõ]`, không đoán.
4. Cần một API key (của bạn) để chạy script này — đọc từ biến môi trường cục bộ, không liên quan tới key của người dùng cuối.

### FR-24 — Danh mục và tag `P1` `F07`
**AC:**
1. Danh mục định nghĩa trong `data/categories.yaml`, script sync đồng bộ vào bảng `categories`.
2. Tag là chuỗi tự do trong frontmatter mỗi document.

---

## C. Quản lý FAQ (qua Git)

### FR-31 — FAQ là file trong repo `P0` `F09`
**AC:**
1. Mỗi FAQ là file `.md` trong `data/faqs/`, frontmatter: `question`, `variants[]` (tối đa 10), `category`, `priority`, `is_active`.
2. Script sync tạo embedding cho câu hỏi gốc và từng biến thể.
3. Nội dung trả lời (phần thân file, markdown) trả về **nguyên văn** cho người dùng — không qua LLM viết lại.

### FR-32 — Giới hạn biến thể `P1` `F09`
**AC:** Vượt quá 10 biến thể trong frontmatter của một file ⇒ script sync **cảnh báo trong log** (không chặn build), khuyến nghị gộp bớt.

### FR-33 — Câu hỏi chưa trả lời được `P1` `F10`
**AC:**
1. Ghi vào `unanswered_questions`, gom nhóm câu tương tự (chuỗi trùng hoặc vector tương đồng ≥ 0.88).
2. Bạn xem qua Supabase SQL Editor hoặc một script CLI đơn giản (`npm run unanswered`), tự quyết định có soạn FAQ mới hay không.

### FR-34 — Chặn FAQ trùng lặp nội dung tự động `P0` `F09`
**AC:**
1. `npm run audit` (`scripts/audit-faqs.ts`) quét toàn bộ `data/faqs/`, so sánh độ tương đồng câu hỏi/variants **và** nội dung thân bài (answer) từng cặp FAQ, đồng thời trích số điện thoại/email xuất hiện trong thân bài để phát hiện dữ kiện tham chiếu bị chép lặp ra nhiều file.
2. Phát hiện dữ kiện tham chiếu (SĐT/email) trùng ở ≥ 2 file ⇒ `CRITICAL`, script thoát với exit code khác 0.
3. `npm run audit` nằm trong chuỗi `npm run verify` — pre-push hook (`husky`) chạy `verify` cho mọi lần push, nên FAQ trùng lặp bị chặn tự động ở cổng push, không phụ thuộc việc người/AI soạn FAQ có nhớ tự kiểm tra hay không.
4. Kết quả chi tiết ghi ra `docs/reports/faq-audit-report.md` mỗi lần chạy.

---

## D. Xác thực và phân quyền — **loại bỏ khỏi phạm vi v1**

> Không có FR nào ở nhóm này. Không đăng nhập, không vai trò, không phân quyền. Nếu một nhu cầu trong tương lai đòi hỏi tài khoản (ví dụ lưu tiến độ học tập riêng từng người), đó là lúc mở lại thiết kế này — xem bản lưu trữ trong lịch sử Git của tài liệu.

---

## E. Ngân sách LLM và BYOK bắt buộc

### FR-51 — Bắt buộc API key cho tính năng AI `P0` `F12`
**AC:**
1. Đường FAQ khớp chuỗi/trigram **luôn** dùng được, không cần key.
2. Đường vector-FAQ và RAG **yêu cầu** header `X-LLM-Provider` + `X-LLM-Key`; thiếu ⇒ sự kiện `need_key`, không phải lỗi.
3. Hỗ trợ: Gemini, OpenAI, Claude, DeepSeek, Groq, Cerebras, OpenRouter — người dùng chọn tối thiểu 1 provider (không cần cả 7). Khuyến nghị ≥ 2 provider (ví dụ Gemini + Groq) để router tự chuyển khi 1 provider hết quota/lỗi.
4. Key sai/hết hạn ⇒ báo rõ `INVALID_API_KEY` kèm tên provider, không rơi vào lỗi chung chung.
5. Khi router đã thử hết mọi provider được cấp key mà vẫn không tạo được câu trả lời qua LLM (quota/rate-limit/lỗi thật), đường FAQ **vẫn phải trả lời** bằng nội dung `.md` gốc (không rỗng, không lỗi cứng) — nhưng phải kèm cờ báo cho giao diện biết đây là câu trả lời rút gọn (xem NFR-04.4), không được im lặng.

### FR-52 — Quản lý API key phía trình duyệt `P0` `F12`
**AC:**
1. Trang Cài đặt cho nhập/xoá key theo từng provider, lưu **chỉ ở `localStorage`**.
2. **Không bao giờ gửi key lên server để lưu trữ** — chỉ gửi kèm mỗi request `/api/chat` trong header, dùng xong bỏ.
3. Trước khi lưu vào `localStorage`, gọi thử một request nhỏ để xác nhận key hoạt động (validate ngay tại client hoặc qua một lần gọi `/api/chat` thử).
4. Có link hướng dẫn lấy key miễn phí cho từng provider (đặc biệt Gemini — dễ lấy nhất).
5. Xoá key ⇒ mất ngay, không có bản sao ở đâu khác.
6. Người dùng cung cấp **nhiều provider** ⇒ router luân phiên **trong số các provider họ đã cho key**, tăng độ ổn định (không phải để né quota hệ thống — quota là của chính họ).

### FR-53 — Chặn spam nhẹ theo IP `P1` `F12` 🚧 CHƯA TRIỂN KHAI
> Chưa có dependency `@upstash/*`, `/api/chat` hiện không giới hạn tần suất — xem `02-KIEN-TRUC.md` ADR-15.
**AC:**
1. Giới hạn tần suất gọi `/api/chat` theo IP (ví dụ 20 request/phút) để chống bot — đây **không phải** quota, chỉ là hàng rào chống lạm dụng ở mức hạ tầng. Ngưỡng cao, hầu như không ai chạm tới trong dùng bình thường.
2. **Bắt buộc dùng store bên ngoài (Upstash Redis)**, không dùng biến toàn cục/`Map` trong RAM — Vercel serverless không giữ bộ nhớ giữa các lần gọi function nên bộ đếm trong RAM sẽ không đếm được gì (`02-KIEN-TRUC.md` ADR-15).
3. Vượt ngưỡng → HTTP 429 `RATE_LIMITED`, không phân biệt được với người dùng thật đang spam hay bot — chấp nhận trải nghiệm cứng ở biên này vì ngưỡng đủ cao.
4. Thiếu cấu hình Upstash (chưa khai báo env) → **không chặn server khởi động**, chỉ tắt tính năng rate-limit và log cảnh báo — đây là lớp phòng thủ phụ, không phải tính năng lõi như BYOK.

---

## F. LLM Router

### FR-61 — Định tuyến trong số key người dùng cung cấp `P0` `F13`
**AC:**
1. Router chỉ xét những provider mà request hiện tại có key.
2. Người dùng chỉ cho 1 provider ⇒ không "xoay vòng" gì cả, gọi thẳng, lỗi thì báo luôn.
3. Người dùng cho ≥ 2 provider ⇒ gặp lỗi rate-limit ở provider A, thử provider B trong cùng request.
4. Thêm provider mới chỉ cần thêm một adapter trong `lib/llm/providers/`.

### FR-62 — Xử lý lỗi rõ ràng, không giả vờ có quota chung `P1` `F13`
**AC:**
1. Provider trả 429 ⇒ nếu là lỗi rate-limit tạm thời (không phải hết quota theo NGÀY), thử lại đúng provider đó **tối đa 1 lần** sau ~1.5s trước khi chuyển provider dự phòng — vẫn trong phạm vi một request, không phải circuit breaker dài hạn (không vi phạm AC2).
2. Không có circuit breaker theo thời gian dài (không có ý nghĩa khi mỗi request là một người dùng khác nhau với key khác nhau) — chỉ xử lý trong phạm vi một request.
3. Lỗi hết quota theo NGÀY (nhận diện qua `quotaId` chứa `PerDay` trong response provider) bỏ qua bước thử lại ở AC1 — thử lại vô ích, chuyển thẳng sang provider dự phòng (nếu có) hoặc báo lỗi ngay.
4. Còn provider dự phòng (người dùng đã cho key) thì thử tiếp; hết thì báo `PROVIDER_RATE_LIMITED` kèm tên provider cụ thể.
5. Log lời gọi (`query_logs`) ghi provider/model đã dùng, **không ghi key**.

---

## G. Vận hành

### FR-71 — Xem thống kê `P2` `F14`
**AC:** Không có dashboard dựng riêng ở v1. Thống kê xem trực tiếp bằng SQL qua Supabase Studio (truy vấn mẫu cung cấp trong `08-ROADMAP.md`). Cân nhắc dựng dashboard nhẹ ở phiên bản sau nếu nhu cầu xem thường xuyên.

### FR-72 — Lịch sử thay đổi nội dung `P0` `F07`
**AC:** `git log -- data/` là đủ để biết ai (tác giả commit) sửa gì, khi nào. Không xây bảng audit riêng.

### FR-73 — Cấu hình hệ thống qua file `P1` `F15`
**AC:**
1. Toàn bộ ngưỡng (FAQ threshold, `rag_min_score`, kích thước chunk, TTL cache…) nằm trong `data/config.yaml`.
2. Sửa file, push ⇒ script sync ghi đè bảng `app_settings` ⇒ có hiệu lực **không cần deploy lại app**.
3. Giá trị không hợp lệ (ngoài khoảng cho phép) ⇒ script sync báo lỗi, **giữ nguyên giá trị cũ trong DB**, không ghi đè bằng giá trị sai.

---

## H. Yêu cầu phi chức năng (NFR)

### NFR-01 — Hiệu năng `P0`
| Chỉ số | Mục tiêu |
|---|---|
| Đường FAQ, P95 | ≤ 500ms |
| Đường RAG (đã có key), tới token đầu tiên, P95 | ≤ 3s |
| Đồng bộ nội dung sau khi push | ≤ 5 phút (thời gian chạy GitHub Action) |

### NFR-02 — Bảo mật `P0`
1. Mọi bảng bật RLS. `anon` chỉ đọc nội dung published + ghi vào 4 bảng nhật ký/vận hành (`03-DATA-MODEL.md` mục 0009).
2. **API key người dùng không bao giờ lưu ở server dưới bất kỳ hình thức nào**, kể cả mã hoá, kể cả tạm thời ngoài phạm vi một request.
3. Không log API key trong bất kỳ trường hợp nào, kể cả log lỗi.
4. `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng trong `scripts/sync-content.ts` (GitHub Action) và route handler ghi log — không bao giờ vào bundle client.
5. Input validate bằng Zod ở client và server.
6. Chống prompt injection: nội dung KB bọc delimiter, giữ nguyên bộ test hồi quy.
7. Chặn tần suất gọi `/api/chat` theo IP (FR-53).

### NFR-03 — Chi phí `P0`
1. Chạy được ở 0 đồng cho hạ tầng (Vercel + Supabase + GitHub Actions).
2. Chi phí LLM ở thời điểm hỏi đáp **không thuộc về hệ thống** — thuộc về người dùng, dùng key của họ. Chi phí LLM duy nhất hệ thống phải chịu là của bạn khi chạy sync (rất nhỏ, chỉ khi sửa nội dung).

### NFR-04 — Khả dụng `P1`
1. Đường FAQ (tầng chuỗi/trigram) **không bao giờ phụ thuộc** vào bất kỳ nhà cung cấp LLM nào — luôn hoạt động kể cả khi mọi provider đều sập.
2. Cron chống Supabase pause giữ nguyên.
3. Lỗi hệ thống hiện thông báo tiếng Việt dễ hiểu.
4. Khi câu trả lời FAQ phải dùng bản rút gọn do LLM lỗi/hết quota (xem FR-51.5): badge trạng thái key ở header chuyển sang trạng thái lỗi, **và** bong bóng chat hiện thêm ghi chú ngắn giải thích lý do + gợi ý thêm provider khác — không được để người dùng nhận câu trả lời khác thường mà không biết vì sao.

### NFR-05 — Khả năng bảo trì `P1`
1. TypeScript strict, cấm `any`.
2. `lib/rag/chunk.ts` và `lib/rag/embed.ts` dùng chung giữa app và `scripts/sync-content.ts` — không viết hai bản logic khác nhau.
3. Migration chỉ thêm mới, không sửa file đã chạy.

### NFR-06 — Trải nghiệm và tiếp cận `P1`
Giữ nguyên yêu cầu gốc: mobile-first, WCAG AA, dark mode, điều hướng bàn phím. Thêm: **trang Cài đặt và lời nhắc nhập key phải rất dễ hiểu cho người mới học AI** — đây là nhóm người dùng mục tiêu, không phải dân kỹ thuật.

### NFR-07 — Dữ liệu `P1`
1. Kho tri thức < 500MB, embedding 768 chiều.
2. Ảnh gốc (nếu giữ) nằm trong Git, không dùng Supabase Storage.
3. Backup: chính repo Git **là** bản backup của nội dung — không cần script export riêng.

### NFR-08 — PWA (cài đặt được) `P1`
1. Có `manifest.json` hợp lệ, đủ icon 192/512 (kể cả bản `maskable`) — Chrome/Edge Android tự hiện được gợi ý cài đặt.
2. Cài vào màn hình chính → mở **full-screen, không thanh địa chỉ** (`display: standalone`). Tên app hiện dưới icon là `AIIA` (khớp `short_name`), tiêu đề tab/hộp thoại cài đặt là `AIIA Notebook` (khớp `name`). Favicon xuất từ `design/icons/favicon-source.svg`.
3. Service Worker **chỉ cache app shell** (JS/CSS/font/icon) — **không cache bất kỳ response nào từ `/api/*`** (xem `02-KIEN-TRUC.md` ADR-14). Vi phạm điều này là lỗi nghiêm trọng, có thể khiến người dùng thấy dữ liệu/câu trả lời không phải của họ.
4. Không yêu cầu offline chat thật — mất mạng thì báo lỗi bình thường như web thường, không giả vờ hoạt động được.
5. iOS Safari: có hướng dẫn cài đặt thủ công riêng (không có `beforeinstallprompt`).

### NFR-09 — Duy trì hạ tầng không bị gián đoạn `P0`
1. Vercel serverless không có trạng thái "ngủ" cần đánh thức — chỉ có độ trễ cold start, không tính là downtime, không cần biện pháp riêng.
2. Rủi ro thật duy nhất là **Supabase project pause sau 7 ngày không hoạt động** — giảm thiểu bằng cron GitHub Actions ping `/api/health` mỗi 3 ngày (đã có trong `02-KIEN-TRUC.md` mục 7).
3. Cron này phải được xác nhận **chạy thành công ít nhất một lần** trước khi coi hệ thống sẵn sàng production (đã có trong `08-ROADMAP.md` DoD Phase 4).

---

## I. Bảng truy vết yêu cầu

| Nhóm | FR | Feature | Ưu tiên |
|---|---|---|---|
| Chat | FR-11 … FR-19 | F01–F06 | P0–P1 |
| Kho tri thức (Git) | FR-21 … FR-24 | F07, F08 | P0–P1 |
| FAQ (Git) | FR-31 … FR-34 | F09, F10 | P0–P1 |
| BYOK bắt buộc | FR-51 … FR-53 | F12 | P0–P1 |
| LLM Router | FR-61, FR-62 | F13 | P0–P1 |
| Vận hành | FR-71 … FR-73 | F14, F15 | P0–P2 |

**Phạm vi tối thiểu để chạy được (P0):** FR-11, 12, 13, 14, 15, 21, 22, 23, 31, 34, 51, 52, 61, 72 + NFR-01, 02, 03, 09.

---

**Tiếp theo:** [`02-KIEN-TRUC.md`](./02-KIEN-TRUC.md) — kiến trúc kỹ thuật.
