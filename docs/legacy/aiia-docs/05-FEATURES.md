# 05 — Đặc tả chi tiết tính năng

> **Đã viết lại theo mô hình không tài khoản.** F07–F10 chuyển từ "web admin" sang "Git-as-CMS". F11 (Auth) bị loại bỏ. F12 (Quota/BYOK) viết lại — BYOK giờ bắt buộc. F14/F15 rút gọn mạnh.

| Mã | Tên | FR liên quan | Ưu tiên |
|---|---|---|---|
| [F01](#f01) | Giao diện chat | FR-11 | P0 |
| [F02](#f02) | Đường nhanh FAQ (không cần key) | FR-12 | P0 |
| [F03](#f03) | Đường sâu RAG + trích dẫn (cần key) | FR-13, 14, 15 | P0 |
| [F04](#f04) | Bộ nhớ đệm ngữ nghĩa | FR-16 | P1 |
| [F05](#f05) | Lịch sử hội thoại (trình duyệt) | FR-17 | P1 |
| [F06](#f06) | Đánh giá câu trả lời | FR-18 | P1 |
| [F07](#f07) | Quản lý kho tri thức qua Git | FR-21, 22, 24 | P0 |
| [F08](#f08) | Nạp dữ liệu từ ảnh (OCR cục bộ) | FR-23 | P0 |
| [F09](#f09) | Quản lý FAQ qua Git | FR-31, 32 | P0 |
| [F10](#f10) | Câu hỏi chưa trả lời được | FR-33 | P1 |
| [F12](#f12) | BYOK bắt buộc | FR-51, 52, 53 | P0 |
| [F13](#f13) | LLM Router (trong số key người dùng) | FR-61, 62 | P0 |
| [F14](#f14) | Thống kê qua SQL | FR-71, 72 | P2 |
| [F15](#f15) | Cấu hình qua file | FR-73 | P1 |

> Không còn F11 (Auth). Đánh số giữ nguyên các mã khác để tài liệu cũ vẫn tham chiếu được.

---

<a id="f01"></a>
## F01 — Giao diện chat

**Actor:** Bất kỳ ai vào web, không phân biệt vai trò.

> **Tham chiếu thiết kế: giao diện kiểu ChatGPT/Gemini.** Sidebar hội thoại thu gọn được + nút "Cuộc trò chuyện mới" nổi bật, bong bóng tin nhắn có hành động khi hover (sao chép, tạo lại), composer dính đáy tự giãn. Wireframe chi tiết ở `07-UI-UX.md` mục 3.

### Luồng chính
1. Mở trang chủ → thấy ô nhập, lời chào, 4–6 câu hỏi gợi ý (từ FAQ `view_count` cao nhất).
2. Gõ câu hỏi, gửi.
3. Chỉ báo trạng thái theo giai đoạn — **nếu câu hỏi chỉ cần đường FAQ thì chỉ có một giai đoạn** `Đang tìm trong FAQ…` rồi ra kết quả ngay, không có giai đoạn "tra cứu"/"soạn câu trả lời" giả vờ.
4. Câu trả lời stream, kèm chip trích dẫn (nếu là RAG), nhãn nguồn, nút 👍👎, **Sao chép**, **Tạo lại**.

### Luồng phụ
- **Bấm Dừng khi đang stream** → hủy, giữ phần đã sinh, lưu vào `localStorage`.
- **Bấm câu hỏi gợi ý** → điền và gửi luôn.
- **Trượt FAQ, chưa có key** → không hiện "đang xử lý" giả — chuyển thẳng sang lời mời nhập key (xem F03).
- **Bấm "Cuộc trò chuyện mới"** → tạo hội thoại rỗng mới trong `localStorage`, không xoá hội thoại cũ, sidebar cập nhật ngay.
- **Bấm Sao chép** → copy nguyên văn markdown của câu trả lời vào clipboard, hiện toast xác nhận ngắn.
- **Bấm Tạo lại** → gửi lại đúng câu hỏi liền trước thành một request `/api/chat` mới (giữ nguyên `history` tính tới trước câu đó), câu trả lời mới **thay thế** câu cũ trong `localStorage` và trên giao diện — không cộng dồn thêm một cặp hỏi-đáp mới.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Ô nhập trống | Nút gửi disabled |
| Câu hỏi > 2.000 ký tự | Chặn gửi |
| Markdown lỗi từ LLM | Renderer chịu lỗi được |
| Người dùng đang cuộn đọc đoạn cũ | Không tự cuộn xuống, hiện nút "Có nội dung mới ↓" |
| Bấm Tạo lại khi câu trả lời cũ đến từ FAQ | Vẫn cho phép — chạy lại pipeline từ đầu, có thể ra kết quả khác nếu nội dung đã đổi từ lần trước |
| Bấm Tạo lại nhưng không còn key (đã xoá ở `/settings`) | Xử lý y hệt một câu hỏi RAG bình thường không có key — nhận `need_key` |
| Sao chép trên trình duyệt không hỗ trợ Clipboard API (hiếm) | Fallback chọn text thủ công, không lỗi vỡ giao diện |

### Nghiệm thu
- [ ] Token đầu tiên hiện ≤ 3s (P95) khi đã có key
- [ ] Nút Dừng cắt được stream, phần dở dang vẫn lưu vào `localStorage`
- [ ] Không có bước đăng nhập nào ở bất kỳ đâu trong luồng
- [ ] Tạo lại một câu trả lời → thay thế đúng vị trí cũ, không tạo thêm cặp hỏi-đáp mới trong lịch sử
- [ ] Sao chép → nội dung trong clipboard khớp nguyên văn (kể cả markdown thô, không phải HTML đã render)

---

<a id="f02"></a>
## F02 — Đường nhanh FAQ (không cần API key)

**Actor:** Hệ thống (tự động)

### Luồng chính

> Đây là **tầng 1 và tầng 2** trong pipeline 5 tầng. Sơ đồ đầy đủ (gồm tầng 0 trò chuyện và tầng 3 RAG, tầng 4 đối thoại) ở `06-AI-PIPELINE.md` mục 1 — đó là nguồn sự thật.

```
Câu hỏi
  → Tầng 0: looksLikeSmallTalk()? — chào hỏi/hỏi về bot ⇒ đối thoại, KHÔNG chạy tìm kiếm
  → normalize_text()
  → Tầng 1: khớp chuỗi chính xác + trigram ≥ 0.75 — KHÔNG CẦN KEY
       trúng ⇒ NHẬN
  → (không có key nào ⇒ sự kiện need_key)
  → Tầng 2: embed câu hỏi (CẦN key Gemini) → lấy ứng viên vector ≥ 0.55
       ⚠️ Chốt chặn 1: câu hỏi < 4 từ            ⇒ hỏi lại cho rõ
       ⚠️ Chốt chặn 2: 2 ứng viên đầu chênh < 0.02 ⇒ hỏi lại cho rõ
       → verifyFaqWithLLM() xác minh đúng ý định
            khớp ⇒ NHẬN · mơ hồ ≥2 ⇒ hỏi lại · không khớp ⇒ xuống tầng 3 (F03)
```

Trúng ⇒ tăng `view_count` qua `increment_faq_view()`, rồi `synthesizeFocusedFaqAnswer()` cho LLM **diễn đạt lại** nội dung file `.md` cho tự nhiên — giữ nguyên tuyệt đối mọi số liệu/mốc thời gian/link, không bịa thêm (xem `AGENTS.md` bất biến #9). Không có key thì trả thẳng nội dung `.md`.

### Vì sao vẫn giữ nguyên tầng 3 dù nó cần key
Người **đã** có key vẫn hưởng lợi từ độ chính xác cao hơn của khớp ngữ nghĩa. Người **chưa** có key vẫn dùng được tầng 1–2 — đây chính là lý do FAQ luôn phải soạn thêm vài **biến thể viết tắt/không dấu** trong frontmatter, để tầng không-cần-key bắt được nhiều trường hợp nhất có thể.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Không có key, câu hỏi chỉ khớp được ở tầng 3 | Người dùng không có key thì tầng 3 không chạy — với họ câu này coi như trượt FAQ, chuyển sang lời mời nhập key |
| FAQ đang `is_active: false` trong frontmatter | Không tham gia so khớp (script sync đã set `is_active = false`) |
| Câu hỏi là lời chào / hỏi về chính bot / cảm ơn | **Tầng 0** — regex `looksLikeSmallTalk()` nhận diện để **bỏ qua bước tìm kiếm tốn quota**, nhưng nội dung câu trả lời do LLM tự viết theo ngữ cảnh hội thoại, **không phải danh sách câu cứng**. Trả `path` rỗng → giao diện không gắn nhãn nguồn. Xem `06-AI-PIPELINE.md` mục 3b |
| Câu trò chuyện mà regex tầng 0 không bắt được (vd *"cậu có biết đùa không"*) | Rơi xuống tầng 2/4, nhưng LLM **tự phán đoán** qua nhãn `INTENT: chat` → vẫn trả lời tự nhiên và **không** bị dán nhãn "Không tìm thấy" |

### Nghiệm thu
- [ ] P95 ≤ 500ms cho câu trúng tầng 1/2
- [ ] Không gửi header key mà vẫn trúng FAQ (tầng 1/2) → thành công bình thường
- [ ] Đổi ngưỡng trong `data/config.yaml`, push → có hiệu lực sau khi sync chạy xong

---

<a id="f03"></a>
## F03 — Đường sâu RAG và trích dẫn (cần API key)

**Actor:** Hệ thống

### Luồng chính
1. Request có header `X-LLM-Provider` + `X-LLM-Key` hợp lệ.
2. Tạo embedding câu hỏi bằng key đó.
3. `search_chunks_hybrid()` → RRF → top-8.
4. Điểm cao nhất < `rag_min_score` → **luồng từ chối** (không gọi LLM sinh câu trả lời).
5. Dựng context đánh số nguồn, gọi LLM (cùng key đó) qua router, stream kết quả.
6. Bóc trích dẫn thực sự dùng.
7. Ghi `query_logs` qua RPC `log_query()` (path='rag', provider, model, latency, citations — **không bao giờ ghi key**), trả `queryLogId` về client trong sự kiện `done` để gắn đánh giá 👍/👎.
8. 🚧 Ghi cache ngữ nghĩa — *chưa triển khai, xem F04*.

### Luồng "chưa có key"
1. Request **không** có header key, câu hỏi đã trượt F02.
2. **Không** thử tạo embedding, **không** báo lỗi.
3. Trả sự kiện `need_key` — client hiện lời mời rõ ràng, thân thiện, kèm nút đi tới Cài đặt và link hướng dẫn lấy key Gemini miễn phí.
4. Ghi `query_logs` với **`path='need_key'`** (không có câu trả lời) — đây chính là dữ liệu để tính "tỉ lệ người dùng bỏ đi ngay khi thấy lời nhắc nhập key", xem F14.

### Xử lý khi embedding lỗi (có key nhưng provider embedding của họ đang lỗi)
`query_embedding = null` → gọi thẳng `search_chunks_fts` — vẫn trả lời được, chỉ kém chính xác hơn. Gửi `status` kèm `degraded: true`.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Key hợp lệ nhưng bị 429 giữa chừng khi đang stream | Không thử lại (tránh trùng nội dung) — báo lỗi kèm gợi ý thử provider khác |
| LLM trả lời không trích dẫn gì | Vẫn hiện, kèm cảnh báo nhẹ |
| Tài liệu bị xoá sau khi câu trả lời đã lưu (trong `localStorage` client) | Chip hiện "Tài liệu đã được gỡ" khi bấm vào (server trả 404 cho `document_id` đó) |
| Nội dung KB chứa câu trông giống mệnh lệnh | Bọc `<knowledge_base>`, bộ test hồi quy |

### Nghiệm thu
- [ ] Không gửi key + câu hỏi cần RAG → nhận `need_key`, không phải lỗi
- [ ] Có key hợp lệ → RAG chạy đầy đủ, có trích dẫn
- [ ] `query_logs` không bao giờ chứa dù chỉ một ký tự của key (kiểm tra bằng grep)
- [ ] Hỏi câu ngoài phạm vi → từ chối rõ ràng, không bịa

---

<a id="f04"></a>
## F04 — Bộ nhớ đệm ngữ nghĩa

> 🚧 **CHƯA TRIỂN KHAI.** `src/lib/rag/cache.ts` đã viết xong (`getSemanticCache()`/`setSemanticCache()`) và bảng `semantic_cache` đã tồn tại, nhưng **`pipeline.ts` chưa bao giờ import/gọi tới**. Vì vậy `path='cache'` không bao giờ xuất hiện, nhãn "Từ bộ nhớ đệm" trong `07-UI-UX.md` không bao giờ hiện, và các cấu hình `cache_ttl_days`/`cache_enabled` chưa có tác dụng.
>
> Nơi duy nhất chạm tới bảng này hiện nay là `/api/health` (xoá bản ghi hết hạn). Toàn bộ đặc tả bên dưới giữ nguyên làm thiết kế tham chiếu nếu sau này nối vào.

**Actor:** Hệ thống

### Luồng chính
1. Trượt FAQ → tính `sha256(normalize_text(question))`.
2. Tra `semantic_cache` — **không cần key** để tra cache.
3. Hit → trả kết quả cũ, ghi `path='cache'`.
4. Miss → chạy F03 (cần key), sau đó ghi cache.

### Vô hiệu hoá cache
**Script `scripts/sync-content.ts` tự xoá sạch `semantic_cache`** ở bước cuối mỗi lần chạy — không cần trigger DB, không cần thao tác tay, vì mọi thay đổi nội dung đều đi qua đúng một cửa (sync pipeline).

### Edge case
| Tình huống | Xử lý |
|---|---|
| Câu hỏi có ngữ cảnh hội thoại phía trước | Chỉ cache câu hỏi **đầu tiên** trong `history` rỗng — câu có ngữ cảnh thì bỏ qua cache |
| Người chưa có key hỏi trúng cache | Vẫn trả được — cache không cần key để đọc |

### Nghiệm thu
- [ ] Hỏi lại đúng câu vừa hỏi → `path='cache'`, < 300ms, **không cần key**
- [ ] Sau khi push nội dung mới và sync chạy xong → cache rỗng

---

<a id="f05"></a>
## F05 — Lịch sử hội thoại (trình duyệt)

**Actor:** Bất kỳ ai

### Luồng chính
1. Mọi tin nhắn lưu vào `localStorage` dưới một key cố định (ví dụ `aiia_conversations`).
2. Thanh bên hiện danh sách hội thoại từ `localStorage`, mới nhất trước.
3. Hỏi tiếp trong hội thoại → client tự lấy 6 lượt gần nhất từ `localStorage`, gửi trong `history` của request.
4. Tiêu đề tự sinh từ 60 ký tự đầu câu hỏi đầu tiên — **cắt chuỗi thuần, không gọi LLM** (khác thiết kế gốc, vì không còn muốn tốn một lời gọi LLM chỉ để đặt tên).

### Edge case
| Tình huống | Xử lý |
|---|---|
| Xoá cache trình duyệt | Mất toàn bộ lịch sử — đã cảnh báo trong giao diện lúc onboarding |
| `localStorage` đầy (hiếm, nhưng có giới hạn ~5–10MB) | Tự xoá hội thoại cũ nhất khi vượt ngưỡng, có cảnh báo |
| Mở 2 tab cùng lúc | Không đồng bộ real-time giữa các tab — chấp nhận được cho v1 |

### Nghiệm thu
- [ ] Hội thoại giữ ngữ cảnh đúng qua nhiều lượt trong cùng phiên trình duyệt
- [ ] Không có bản ghi nào tương ứng trong database server — chỉ có `query_logs` ẩn danh
- [ ] Đóng trình duyệt, mở lại (không xoá cache) → lịch sử vẫn còn

---

<a id="f06"></a>
## F06 — Đánh giá câu trả lời

> `<FeedbackButtons>` render ở góc trái hàng cuối mỗi bong bóng trả lời (`message-bubble.tsx`), chỉ hiện khi đã stream xong **và** có `queryLogId` trả về từ sự kiện `done`. Ghi qua RPC `submit_feedback()` — xem ghi chú RLS ở migration `0014`.

**Actor:** Bất kỳ ai

### Luồng chính
1. Nút 👍/👎 dưới mỗi câu trả lời AI.
2. 👎 → popover chọn lý do + ghi chú.
3. Gửi `POST /api/chat/feedback` kèm `queryLogId` + `clientSessionId` (sinh một lần, lưu `localStorage`, tái sử dụng).
4. Bấm lại → ghi đè (unique theo `query_log_id + client_session_id`).

### Edge case
| Tình huống | Xử lý |
|---|---|
| Đánh giá câu trả lời FAQ | Vẫn cho phép — biết FAQ nào cần sửa nội dung |
| `clientSessionId` chưa tồn tại (lần đầu vào web) | Client tự sinh bằng `crypto.randomUUID()` trước khi gửi |

### Nghiệm thu
- [ ] Đánh giá lưu ngay, không cần tải lại trang
- [ ] Không đánh giá được 2 lần khác nhau cho cùng một câu trả lời từ cùng một trình duyệt

---

<a id="f07"></a>
## F07 — Quản lý kho tri thức qua Git

**Actor:** Bạn (người duy trì nội dung)

### Luồng tạo/sửa tài liệu
1. Tạo file `.md` mới hoặc sửa file có sẵn trong `data/documents/<danh-mục>/`.
2. Frontmatter bắt buộc: `title`, `category` (khớp slug trong `data/categories.yaml`), `status`.
3. Nội dung thân file là markdown, được lưu **nguyên văn** vào `documents.content`.
4. `git add . && git commit -m "..." && git push`.
5. GitHub Action tự chạy `scripts/sync-content.ts`:
   - So `content_hash` — bỏ qua file không đổi.
   - Cắt chunk, tạo embedding (bằng key của bạn trong GitHub Secrets).
   - Upsert vào `documents`/`chunks` theo `source_path`.
   - File đã bị xoá khỏi `data/` nhưng còn trong DB (theo `source_path`) ⇒ xoá bản ghi tương ứng.
   - Xoá `semantic_cache`.
6. Xem kết quả trong tab **Actions** của GitHub — log liệt kê rõ file nào xử lý, file nào lỗi.

### Ví dụ frontmatter

```markdown
---
title: Thời khoá biểu học kỳ 1 - 2026
category: lich-hoc
tags: [hk1, thoi-khoa-bieu]
status: published
---

## Tuần 1
Thứ 2: Nhập môn AI, phòng 301, 8:00–10:00.
...
```

### Edge case
| Tình huống | Xử lý |
|---|---|
| Tài liệu rất dài | Cắt ~60 chunk, embedding theo lô 20 |
| Key ingestion (của bạn) hết quota lúc đang sync | Action fail rõ ràng ở bước đó, chunk chưa embed vẫn lưu với `embedding = null`, tìm được bằng full-text; chạy lại Action (`workflow_dispatch`) sau khi quota hồi phục |
| Hai người cùng sửa file, merge conflict | Xử lý bằng Git bình thường — không phải vấn đề của ứng dụng |
| Đổi `category` của một file | Sync cập nhật `category_id`, không cần thao tác gì thêm |
| `status: draft` | Vẫn ghi vào DB nhưng RLS chặn đọc — dùng để soạn trước, chưa công bố |

### Nghiệm thu
- [ ] Push một file mới → sau khi Action chạy xong (theo dõi tab Actions), hỏi được nội dung đó ngay (kể cả không cần key, nếu trúng FAQ liên quan)
- [ ] Xoá file khỏi repo, push → document biến mất khỏi kết quả tìm kiếm sau lần sync kế
- [ ] Action fail thì thấy ngay trên GitHub, không phải đoán

---

<a id="f08"></a>
## F08 — Nạp dữ liệu từ ảnh (OCR cục bộ)

**Actor:** Bạn

### Luồng chính
1. Có ảnh chụp thông báo/lịch học.
2. Chạy cục bộ: `npm run ocr -- path/to/anh.png`.
3. Script gọi model vision (dùng key của bạn từ `.env.local`), in ra markdown ra **stdout** hoặc ghi ra file `.draft.md`.
4. **Bạn tự đọc, sửa chỗ sai** (đặc biệt số, ngày tháng — AI hay đọc nhầm).
5. Đặt nội dung đã sửa vào đúng vị trí trong `data/documents/`, thêm frontmatter.
6. Commit, push như F07 bình thường.

### Vì sao vẫn giữ nguyên tắc "bắt buộc duyệt trước khi lưu" dù không còn UI riêng
AI đọc sai số/ngày tháng vẫn là rủi ro y hệt thiết kế gốc. Điểm khác duy nhất là **nơi diễn ra bước duyệt đổi từ một trang web sang terminal + editor code của bạn** — bản chất yêu cầu không đổi: **không có đường nào để nội dung OCR vào thẳng database mà không qua mắt người**. Script `ocr-image.ts` cố tình **không** tự ghi vào `data/`, chỉ in ra để bắt buộc bạn phải copy-paste thủ công — đó chính là bước duyệt.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Ảnh không có chữ | Script báo "không phát hiện nội dung văn bản" |
| Ảnh mờ | Vẫn thử, cảnh báo "confidence: low" trong output |
| Ảnh chứa bảng phức tạp | Ra bảng markdown, có thể cần sửa tay nhiều hơn |
| Muốn giữ ảnh gốc tham khảo | Tự commit ảnh vào cùng thư mục, tham chiếu bằng markdown image link — hoàn toàn tuỳ chọn |

### Nghiệm thu
- [ ] Chạy script với một ảnh mẫu → ra markdown hợp lý, đúng cấu trúc bảng nếu ảnh có bảng
- [ ] Không có đường nào (script khác, endpoint khác) đưa ảnh thẳng vào `data/` mà bỏ qua bước xem tay

---

<a id="f09"></a>
## F09 — Quản lý FAQ qua Git

**Actor:** Bạn

### Luồng chính
1. Tạo file `.md` trong `data/faqs/`.
2. Frontmatter: `question`, `variants` (mảng, tối đa 10), `category`, `priority`, `is_active`.
3. Thân file = câu trả lời (markdown), trả về **nguyên văn**.
4. Push → sync tạo embedding cho câu hỏi + từng biến thể.

### Ví dụ

```markdown
---
question: "Deadline nộp Assignment 2 là khi nào?"
variants:
  - "bài 2 nộp khi nào"
  - "hạn chót a2"
  - "assignment 2 deadline"
  - "a2 ddl"
category: bai-tap
priority: 10
is_active: true
---

**Assignment 2** hạn nộp **23:59 ngày 15/09/2026** qua LMS.
```

### Vì sao không còn "AI gợi ý biến thể qua form"
Không có form. Bạn có thể vẫn dùng AI để **gợi ý** biến thể (hỏi ChatGPT/Gemini trực tiếp "gợi ý 6 cách hỏi khác cho câu X" — dùng prompt ở `06-AI-PIPELINE.md` mục 6.4 nếu muốn), nhưng việc **chọn và gõ vào frontmatter là thao tác tay**, không có nút "tự thêm" nào trong hệ thống.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Hai FAQ câu hỏi gần giống nhau | Không có cảnh báo tự động ở v1 (không có UI để hiện) — tự rà bằng mắt khi soạn |
| Vượt 10 biến thể | Script sync cảnh báo trong log, vẫn nạp (không chặn cứng) |
| `is_active: false` | Sync vẫn ghi nhưng set `is_active = false`, không tham gia so khớp |

### Nghiệm thu
- [ ] FAQ mới → hỏi đúng câu đó → trúng tầng 1 ngay
- [ ] Hỏi bằng biến thể cũng trúng
- [ ] `is_active: false` → không còn được trả về sau lần sync kế

---

<a id="f10"></a>
## F10 — Câu hỏi chưa trả lời được

**Actor:** Bạn (xem định kỳ)

### Luồng chính
1. Mỗi lần từ chối trả lời → `record_unanswered()` tự gom nhóm theo chuỗi trùng hoặc vector tương đồng ≥ 0.88.
2. Bạn xem qua SQL:
   ```sql
   select question, asked_count, last_asked_at
     from unanswered_questions
    where state = 'pending'
    order by asked_count desc
    limit 20;
   ```
3. Câu nào đáng làm FAQ → tự tạo file mới trong `data/faqs/` (F09), rồi cập nhật `state = 'resolved'` bằng một câu UPDATE thủ công (hoặc script tiện ích nhỏ, tuỳ bạn).

### Nghiệm thu
- [ ] Câu hỏi ngoài phạm vi được ghi lại đúng, gom nhóm hợp lý
- [ ] Truy vấn SQL mẫu chạy đúng, không lỗi

---

<a id="f12"></a>
## F12 — BYOK bắt buộc

**Actor:** Bất kỳ ai muốn dùng tính năng AI

### Luồng chính
1. Vào `/settings` — có **6 ô nhập**: Gemini (khuyến nghị, dễ lấy nhất), OpenAI, Claude, DeepSeek, Groq, Cerebras. Mỗi ô kèm link lấy key.
2. Lưu vào `localStorage`. **Không gửi lên server để lưu.** 🚧 *Bước validate key bằng một request thử chưa làm — key sai chỉ lộ ra ở lần hỏi đầu tiên, khi badge trạng thái ở header chuyển sang màu hổ phách "Cài đặt Key (Lỗi)".*
3. Khuyến nghị nhập **≥ 2 provider**: free-tier rất chặt (key Gemini đo được chỉ ~20 request/ngày), có provider dự phòng thì router tự chuyển khi một cái hết quota — xem F13.

> ⚠️ **Embedding chỉ chạy được bằng key Gemini.** Chỉ nhập key provider khác thì tầng 2 và tầng 3 (đều cần embed câu hỏi) không chạy được — câu hỏi trượt tầng 1 sẽ rơi thẳng xuống tầng 4 (đối thoại/không tìm thấy).
4. Từ giờ mọi request `/api/chat` tự động đính kèm header key — người dùng không phải nhập lại.
5. Có thể thêm nhiều provider — nếu router gặp lỗi ở provider chính, thử provider phụ.

### Hướng dẫn lấy key (hiển thị ngay trong UI)
```
🔑 Lấy API key Gemini miễn phí (mất khoảng 2 phút)
1. Vào aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google
3. Bấm "Create API Key"
4. Copy key, dán vào ô bên dưới
```

### Edge case
| Tình huống | Xử lý |
|---|---|
| Key sai định dạng | Chặn ngay ở form, không gọi thử |
| Key đúng định dạng nhưng bị provider từ chối | Báo `INVALID_API_KEY` kèm tên provider |
| Người dùng xoá `localStorage` (dọn trình duyệt) | Mất key, phải nhập lại — không có gì để khôi phục vì server không giữ bản sao |
| Người dùng dùng nhiều thiết bị | Phải nhập key ở từng thiết bị — đây là đánh đổi đã chấp nhận (ADR-12) |

### Nghiệm thu
- [ ] Nhập key hợp lệ → dùng được RAG ngay
- [ ] Xoá key → quay về chỉ dùng được đường FAQ không-cần-key
- [ ] Grep toàn bộ log server, xác nhận **không một lần nào** xuất hiện giá trị key thật

---

<a id="f13"></a>
## F13 — LLM Router (trong số key người dùng cung cấp)

**Actor:** Hệ thống

### Luồng chính

Pseudo-code đầy đủ (kèm cơ chế peek chunk đầu và xử lý quota-theo-ngày) ở `06-AI-PIPELINE.md` mục 3 — đó là nguồn sự thật. Tóm tắt:

```
ứngViên = 6 provider [gemini, openai, claude, deepseek, groq, cerebras]
          LỌC những cái người dùng CÓ key
NẾU rỗng: need_key

VỚI MỖI provider:
    Thử tối đa 2 lần trên CÙNG provider:
        peekFirstChunk(...)   ← ép fetch() chạy thật để bắt được lỗi ĐÚNG CHỖ
        thành công ⇒ TRẢ VỀ stream
        lỗi 401/403 ⇒ INVALID_API_KEY ngay, không thử gì thêm
        lỗi 429 tạm thời (KHÔNG phải hết quota ngày) ⇒ đợi 1.5s, thử lại lần 2
        hết quota theo NGÀY (quotaId chứa "PerDay") ⇒ bỏ qua retry, sang provider kế
TRẢ VỀ RATE_LIMITED
```

> ⚠️ **Bẫy đã gặp thật:** adapter là `async function*`, nên gọi `chatStream()` **không** chạy `fetch()` ngay — lỗi HTTP chỉ lộ ra khi stream được duyệt. Bản router đầu tiên bọc `try/catch` quanh đúng lời gọi tạo generator nên **không bao giờ bắt được lỗi**, khiến cơ chế "thử provider khác" không hoạt động suốt một thời gian dài mà không ai biết. `peekFirstChunk()` sinh ra để sửa đúng chỗ này.

Khác biệt lớn nhất so với thiết kế gốc: **không có bảng theo dõi quota trong database, không có circuit breaker sống qua nhiều request**. Mỗi request độc lập hoàn toàn — vì mỗi request có thể đến từ người dùng khác nhau với key khác nhau, không có "ngân sách chung" nào để bảo vệ. Retry 1 lần ở trên vẫn nằm gọn trong phạm vi một request nên không vi phạm nguyên tắc này.

### Khi mọi provider đều hỏng
Đường FAQ vẫn trả lời được bằng nội dung `.md` gốc (chế độ suy giảm), kèm cờ `degraded: true` để giao diện cảnh báo rõ cho người dùng — xem `04-API-SPEC.md` mục A và `07-UI-UX.md` mục 7.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Chỉ 1 provider, bị rate limit | Báo lỗi ngay, gợi ý thử lại sau hoặc thêm provider phụ |
| 2 provider, cả hai đều rate limit | `PROVIDER_RATE_LIMITED`, liệt kê cả hai đã thử |
| Model context không đủ cho 8 chunk | Giảm xuống 3–5 chunk tuỳ context window của model đang gọi |

### Nghiệm thu
- [ ] Chỉ gửi key Gemini → chat hoạt động, không đụng gì tới Groq/Cerebras
- [ ] Gửi key Gemini + Groq, giả lập Gemini 429 → tự chuyển Groq trong cùng request
- [ ] Không gửi key nào → `need_key`, không phải lỗi 500

---

<a id="f14"></a>
## F14 — Thống kê qua SQL

**Actor:** Bạn

Không có dashboard dựng riêng ở v1 — mọi tỉ lệ **tính bằng SQL ngay lúc cần xem**, không lưu sẵn ở đâu. Chỉ lưu sự kiện thô: mỗi lượt hỏi–đáp là 1 dòng `query_logs` (ghi qua RPC `log_query()`), mỗi lần bấm 👍/👎 là 1 dòng `query_feedback` (qua RPC `submit_feedback()`).

```sql
-- Phân bố đường trả lời 7 ngày qua
select path, count(*) from query_logs
 where created_at > now() - interval '7 days'
 group by path order by count(*) desc;

-- Top câu hỏi
select question, count(*) from query_logs
 group by question order by count(*) desc limit 20;

-- CHỈ SỐ: tỉ lệ hài lòng (mục tiêu ≥ 80% — xem 00-TONG-QUAN.md mục 6)
select count(*) filter (where rating = 1) as thumbs_up,
       count(*)                           as tong,
       round(100.0 * count(*) filter (where rating = 1) / nullif(count(*),0), 1) as ti_le_hai_long
  from query_feedback;

-- CHỈ SỐ: tỉ lệ phiên bỏ đi ngay khi thấy lời nhắc nhập key
-- "Bỏ đi" không phải một sự kiện đơn lẻ — phải suy ra ở mức phiên: phiên nào từng nhận need_key
-- mà SAU ĐÓ không có lượt hỏi thành công nào nữa thì tính là bỏ đi.
with phien_thay_nhac as (
  select distinct client_session_id from query_logs
   where path = 'need_key' and client_session_id is not null
),
phien_quay_lai as (
  select distinct l.client_session_id from query_logs l
    join phien_thay_nhac p on p.client_session_id = l.client_session_id
   where l.path in ('faq','rag')
     and l.created_at > (select min(x.created_at) from query_logs x
                          where x.client_session_id = l.client_session_id and x.path = 'need_key')
)
select (select count(*) from phien_thay_nhac) as phien_thay_nhac,
       (select count(*) from phien_quay_lai)  as phien_quay_lai_hoi_tiep,
       coalesce(round(100.0 * ((select count(*) from phien_thay_nhac) - (select count(*) from phien_quay_lai))
              / nullif((select count(*) from phien_thay_nhac),0), 1), 0) as ti_le_bo_di;

-- FAQ nào được trúng nhiều nhất / câu hỏi nào hệ thống chưa trả lời được
select question, view_count from faqs order by view_count desc limit 20;
select question, asked_count from unanswered_questions order by asked_count desc limit 20;
```

> `client_session_id` là UUID ngẫu nhiên sinh ở trình duyệt (`clientStorage.getClientSessionId()`), gửi qua header `x-client-session-id`. Nó **chỉ dùng để gom các lượt hỏi cùng một phiên**, không định danh cá nhân và không liên kết với bất kỳ thông tin nào khác.

### Nghiệm thu
- [x] Các truy vấn mẫu chạy đúng trên Supabase SQL Editor (đã kiểm chứng bằng dữ liệu thật rồi xoá sạch dữ liệu test)

---

<a id="f15"></a>
## F15 — Cấu hình qua file

**Actor:** Bạn

### Luồng chính
Sửa `data/config.yaml`:
```yaml
faq_trigram_threshold: 0.75
faq_vector_threshold: 0.90
rag_min_score: 0.015
rag_top_k: 8
chunk_size_tokens: 800
cache_ttl_days: 7
```
Push → script sync ghi đè `app_settings` → có hiệu lực từ câu hỏi tiếp theo, không cần deploy lại app.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Giá trị ngoài khoảng hợp lệ (vd threshold > 1) | Script sync báo lỗi rõ ràng trong log Action, **giữ nguyên** giá trị cũ trong DB |
| Thiếu một khoá trong file | Giữ giá trị hiện có trong DB cho khoá đó, không reset về mặc định |

### Nghiệm thu
- [ ] Đổi `rag_top_k` từ 8 xuống 5, push → câu trả lời tiếp theo dùng 5 chunk
- [ ] Đặt giá trị sai (vd `-1` cho threshold) → Action báo lỗi, DB không bị ghi giá trị sai

---

<a id="f16"></a>
## F16 — Cài đặt được như app (PWA)

**Actor:** Bất kỳ ai vào web

### Luồng chính
1. Người dùng vào web bằng trình duyệt mobile, hỏi được ít nhất 1 câu (đã thấy giá trị).
2. Xuất hiện banner nhỏ, không chắn nội dung: *"Cài AIIA Notebook vào màn hình chính để mở nhanh hơn"* + nút **Cài đặt**.
3. **Android/Chrome:** bấm nút → trình duyệt tự xử lý (`beforeinstallprompt`), xong thì icon xuất hiện ở màn hình chính.
4. **iOS/Safari:** không có API cài tự động → hiện hướng dẫn 3 bước: *"Bấm nút Share (□↑) → Thêm vào Màn hình chính → Xác nhận"*, kèm ảnh minh hoạ.
5. Mở app từ icon màn hình chính → **full-screen, không thanh địa chỉ trình duyệt**.

### Edge case
| Tình huống | Xử lý |
|---|---|
| Người dùng đã cài rồi | Không hiện banner nữa (kiểm tra `display-mode: standalone` qua CSS media query hoặc cờ đã lưu `localStorage`) |
| Người dùng bấm "Để sau" | Không hỏi lại trong phiên đó; hỏi lại sau N ngày (cấu hình cứng trong code, ví dụ 14 ngày) |
| Trình duyệt không hỗ trợ PWA (trình duyệt cũ) | Không hiện banner, web vẫn hoạt động bình thường ở chế độ tab thường |
| Mất mạng sau khi đã cài app | App mở được (app shell có cache), nhưng gửi câu hỏi thì báo lỗi mất mạng bình thường — **không giả vờ hoạt động offline** |
| Nội dung app đổi (deploy bản mới) | Service Worker tự cập nhật app shell ở lần mở kế tiếp có mạng — không cần gỡ cài lại |

### Nghiệm thu
- [ ] Cài được trên Chrome Android, icon đúng, mở full-screen không thanh địa chỉ
- [ ] Trên iOS Safari, hướng dẫn thủ công hiện đúng, cài theo hướng dẫn đó thành công
- [ ] Devtools → Application → Service Worker: xác nhận **không có** request `/api/*` nào nằm trong cache
- [ ] Lighthouse PWA audit: đạt các tiêu chí installability cơ bản

---

## Ma trận truy vết Feature ↔ FR

| Feature | FR | Ưu tiên |
|---|---|---|
| F01 Giao diện chat | FR-11 | P0 |
| F02 Đường nhanh FAQ | FR-12 | P0 |
| F03 RAG + trích dẫn | FR-13, 14, 15 | P0 |
| F04 Cache ngữ nghĩa | FR-16 | P1 |
| F05 Lịch sử hội thoại | FR-17 | P1 |
| F06 Đánh giá | FR-18 | P1 |
| F07 Kho tri thức (Git) | FR-21, 22, 24 | P0 |
| F08 OCR cục bộ | FR-23 | P0 |
| F09 FAQ (Git) | FR-31, 32 | P0 |
| F10 Câu hỏi chưa trả lời | FR-33 | P1 |
| F12 BYOK bắt buộc | FR-51, 52, 53 | P0 |
| F13 LLM Router | FR-61, 62 | P0 |
| F14 Thống kê SQL | FR-71, 72 | P2 |
| F15 Cấu hình qua file | FR-73 | P1 |
| F16 PWA | NFR-08 | P1 |

---

**Tiếp theo:** [`06-AI-PIPELINE.md`](./06-AI-PIPELINE.md) — pipeline AI và prompt (router đã đơn giản hoá).
