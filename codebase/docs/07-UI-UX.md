# 07 — Thiết kế giao diện

> **Đã viết lại theo mô hình không tài khoản.** Toàn bộ khu vực `/admin`, `/login`, `/register` bị loại bỏ. Trang web giờ chỉ còn **2 route có giao diện**: trang chat và trang cài đặt (nhập API key).

**Nguyên tắc chủ đạo: mobile-first.** ~95% lượt truy cập là học viên dùng điện thoại. Thiết kế cho màn hình 375px trước, mở rộng lên desktop sau.

---

## 1. Sitemap

```
/                          Chat — trang duy nhất, ai vào cũng dùng được ngay
└── /settings              Quản lý API key (BYOK) — lưu ở localStorage
```

Không có `/login`, `/register`, `/admin/*`. Quản lý nội dung diễn ra ngoài trình duyệt, qua Git (`05-FEATURES.md` F07–F10).

---

## 2. Design token

> **Đã đổi theo tông "AI in Action"** (04/08/2026) — tham chiếu từ poster chính thức của ban tổ chức (nền navy sâu, điểm nhấn cyan phát sáng, chữ chrome/bạc). Dark mode là theme "signature" ăn khớp trực tiếp với poster; light mode giữ nền sáng dễ đọc nhưng dùng chung màu cyan làm accent để nhất quán thương hiệu ở cả hai chế độ.

```css
:root {
  /* Light mode — nền sáng dễ đọc cho nội dung dài, accent cyan giữ nhận diện thương hiệu */
  --primary:            oklch(0.62 0.17 235);   /* cyan thương hiệu, đủ tối để đọc trên nền trắng */
  --primary-foreground: oklch(0.99 0.005 235);
  --background:         oklch(1 0 0);
  --foreground:         oklch(0.15 0.02 250);
  --muted:              oklch(0.96 0.01 235);
  --muted-foreground:   oklch(0.48 0.02 250);
  --border:             oklch(0.90 0.01 235);

  --faq:      oklch(0.62 0.16 150);   /* xanh lá  — nhãn "Đã xác thực" (giữ nguyên, không đụng brand) */
  --rag:      oklch(0.62 0.17 235);   /* cyan     — Từ tài liệu, khớp --primary */
  --cache:    oklch(0.68 0.10 220);   /* lam nhạt — Từ bộ nhớ đệm (🚧 chưa dùng, xem mục 7) */
  --refused:  oklch(0.60 0.02 255);   /* xám      — thiết kế gốc; thực tế nhãn "Không tìm thấy"
                                         đang dùng tông hổ phách (amber) cho khớp cảnh báo khác */
  --warning:  oklch(0.75 0.15 75);
  --danger:   oklch(0.58 0.20 25);

  --radius: 0.625rem;
  --font-sans: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;   /* TOÀN BỘ nội dung chat, luôn font này */
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-display: "Exo 2", Inter, sans-serif;   /* CHỈ cho tên app/hero — xem cảnh báo dưới */
}

.dark {
  /* Dark mode — theme chính, tông navy sâu + cyan phát sáng, ăn khớp trực tiếp poster gốc */
  --background:       oklch(0.16 0.03 250);    /* ~#0A1428 */
  --foreground:       oklch(0.94 0.01 235);    /* ~#E8ECF2, ánh bạc/chrome */
  --muted:            oklch(0.22 0.04 250);    /* ~#0F2440, bề mặt card */
  --muted-foreground: oklch(0.68 0.03 235);
  --border:           oklch(0.28 0.05 245);
  --primary:          oklch(0.72 0.16 235);    /* ~#3EA8FF, cyan phát sáng */
  --rag:              oklch(0.72 0.16 235);
}
```

**Thang chữ:** 12/14/16/18/20/24/30px. Chữ nội dung chat: **16px**, luôn `--font-sans`. **Khoảng cách:** bội số 4px. Dark mode theo hệ điều hành **và** đổi tay được.

### ⚠️ Về font logo "AI in Action"

Chữ "AI in Action" trong poster ban tổ chức là **font/artwork thương hiệu**, hiện **chưa có file gốc** (PNG/SVG) để dùng làm logo header. Cho tới khi xin được file chính thức:

- **Tạm thời:** tên app trong header hiển thị bằng chữ thường, dùng `--font-display` (`Exo 2` — font tech từ Google Fonts, có hỗ trợ dấu tiếng Việt cơ bản, chỉ là **font thay thế tạm**, không phải font thương hiệu thật).
- **Không** tự tải/nhúng bất kỳ font nào rồi gán nhãn là "font chính thức AIIA" — dễ nhầm là brand asset thật trong khi chỉ là hàng gần giống.
- **Khi có file logo thật:** thay hẳn bằng `<img>`/SVG tĩnh trong header, xoá `--font-display` khỏi mọi chỗ đang cố render chữ "AI in Action" bằng text — logo brand luôn là ảnh, không phải text render bằng web font.
- Việc thay thế này chỉ đụng tới `components/chat/app-header.tsx`, không ảnh hưởng phần còn lại của UI.

---

## 3. Màn hình chat `/`

### Mobile (375px)

```
┌─────────────────────────────────┐
│ ☰  AIIA Notebook          🔑 🌙 │  ← header 56px, dính trên
├─────────────────────────────────┤
│                                 │
│   👋 Chào bạn!                  │
│   Mình là sổ tay tra cứu        │
│   khóa học AI in Action.        │
│                                 │
│   Câu FAQ trả lời ngay,         │
│   câu khác cần bạn nhập API     │
│   key miễn phí (xem 🔑 trên).   │
│                                 │
│   Thử hỏi:                      │
│   ┌───────────────────────────┐ │
│   │ Deadline assignment 2?    │ │  ← không cần key
│   └───────────────────────────┘ │
│   ┌───────────────────────────┐ │
│   │ Cách tính điểm cuối kỳ    │ │
│   └───────────────────────────┘ │
│                                 │
│         ┌─────────────────────┐ │
│         │ Deadline a2 là khi  │ │  ← tin nhắn người dùng
│         │ nào?                │ │
│         └─────────────────────┘ │
│                                 │
│  ┌────────────────────────────┐ │
│  │ 🟢 Đã xác thực             │ │
│  │                            │ │
│  │ Assignment 2 hạn nộp       │ │
│  │ **23:59 ngày 15/09/2026**  │ │
│  │ qua LMS.                   │ │
│  │                            │ │
│  │ 👍 👎  📋                  │ │
│  └────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────┐ ▶  │  ← composer, dính dưới
│ │ Hỏi gì đó…              │    │
│ └─────────────────────────┘     │
└─────────────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌────────────┬──────────────────────────────┬─────────────┐
│ Hội thoại  │  AIIA Notebook          🔑 🌙│  Nguồn [2]  │
│ (localStorage)├────────────────────────────┤             │
│ + Mới      │                              │ ┌─────────┐ │
│            │   [danh sách tin nhắn]       │ │ [1]     │ │
│ Deadline…  │                              │ │ Đề cương│ │
│ Cách tính… │                              │ │ môn học │ │
│            │                              │ │ "Hạn    │ │
│            │                              │ │ nộp…"   │ │
│            ├──────────────────────────────┤             │
│            │ [ô nhập]                  ▶  │ Cập nhật:   │
│            │                              │ 01/08/2026  │
└────────────┴──────────────────────────────┴─────────────┘
   260px              linh hoạt                  320px
```

Nút trạng thái key ở header thay cho badge quota cũ — bấm vào đi tới `/settings`. Có **3 trạng thái** (`src/components/settings/api-key-status-button.tsx`, tự cập nhật qua sự kiện `aiia_key_status_changed`):

| Trạng thái | Màu | Nhãn |
|---|---|---|
| `missing` — chưa nhập key nào | 🔴 đỏ + chấm nhấp nháy | `Cài đặt Key` |
| `error` — key lỗi/hết quota (kể cả khi nhận `degraded: true`) | 🟠 hổ phách + icon cảnh báo | `Cài đặt Key (Lỗi)` |
| `ok` — key đang hoạt động | 🟢 xanh lá | `Cài đặt Key` |

### Trạng thái tin nhắn AI

Nhãn nguồn được quyết định bởi trường `path` trong sự kiện SSE `done` (`04-API-SPEC.md` mục A), render ở `src/components/chat/message-bubble.tsx` → `getSourceBadge()`.

| Trạng thái | `path` | Hiển thị **thật** |
|---|---|---|
| Đang tìm FAQ | — | `Đang tìm trong FAQ…` |
| Đang sinh | — | **Text hiện dần từng đoạn** (stream nhiều sự kiện `token`) + nút **Dừng** |
| Xong — FAQ đã xác thực | `faq` | Nhãn 🟢 `Đã xác thực` (tooltip hiện `verification_source`) |
| Xong — FAQ chưa xác thực | `faq` | Nhãn 🟠 `Chưa xác thực` |
| Xong — RAG | `rag` | Nhãn 🔵 `Từ tài liệu` + chip trích dẫn `[1][2][3]` mở được panel nguồn |
| Xong — **trò chuyện** | *rỗng* | **KHÔNG nhãn, KHÔNG gợi ý** — như một tin nhắn bình thường. Dùng cho tầng 0 và cho tầng 4 khi LLM tự phán đoán đây chỉ là trò chuyện (nhãn `INTENT: chat`) |
| Từ chối / chưa đủ rõ | `refused` | Nhãn 🟠 `Không tìm thấy` + danh sách nút gợi ý bấm được |
| **Chế độ rút gọn** (`degraded: true`) | `faq`/`refused` | Dải cảnh báo hổ phách trong bong bóng: *"Đã hết lượt AI miễn phí hôm nay — câu trả lời rút gọn. Thêm API key khác ở Cài đặt để có câu trả lời đầy đủ hơn."* + badge key ở header chuyển sang trạng thái lỗi |
| **Cần key** | — | Sự kiện `need_key` → thẻ nhắc nhập key, **không phải lỗi** |
| Lỗi | `error` | *"❌ {thông báo}"* |

> ⚠️ Nhãn 🩵 `Từ bộ nhớ đệm` (`path='cache'`) trong thiết kế gốc **không bao giờ xuất hiện** — tầng cache chưa được nối vào pipeline (xem `06-AI-PIPELINE.md` mục 1). Biến `--cache` trong bảng design token vì vậy hiện chưa dùng tới.
>
> Gợi ý ("Có thể bạn cũng muốn hỏi:") hiện **cả ở nhánh `faq`** (câu hỏi liên quan cùng chuyên mục) lẫn nhánh `refused` (các ứng viên gần đúng để người dùng chọn lại), không chỉ ở nhánh từ chối như thiết kế gốc.

### Chi tiết composer

- `textarea` tự giãn tối đa 6 dòng.
- `Enter` gửi · `Shift+Enter` xuống dòng (trên mobile: `Enter` xuống dòng, gửi bằng nút).
- Đếm ký tự từ mốc 1.800/2.000.
- Nút gửi → nút Dừng khi đang stream.

---

## 4. Cài đặt `/settings` — màn hình quan trọng thứ hai

Chỉ còn một mục duy nhất: **API key**. Đây là màn hình onboarding cốt lõi của toàn bộ sản phẩm — thiết kế phải cực kỳ rõ ràng, thân thiện với người mới học AI.

```
┌──────────────────────────────────────────────┐
│ 🔑 API key của bạn                           │
│                                              │
│ Web này miễn phí hoàn toàn, nhưng để AI trả  │
│ lời được các câu hỏi phức tạp, bạn cần tự    │
│ lấy một API key miễn phí — chỉ mất ~2 phút.  │
│ Key được lưu NGAY TRÊN TRÌNH DUYỆT của bạn,  │
│ không gửi lên đâu để lưu trữ cả.             │
│                                              │
│ ┌─ Google Gemini (khuyên dùng) ─────────────┐│
│ │ Dễ lấy nhất, miễn phí rộng rãi.           ││
│ │                                          ││
│ │ [_______________________]  [Lưu]        ││
│ │                                          ││
│ │ 📺 Xem hướng dẫn lấy key (2 phút) ↗      ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌─ Thêm provider khác (tuỳ chọn) ▾ ────────┐ │
│ │ OpenAI · Claude · DeepSeek                │ │
│ │ Groq · Cerebras · OpenRouter              │ │
│ │ (7 ô nhập tất cả, mỗi ô có link lấy key)  │ │
│ │ Thêm nhiều hơn 1 để AI tự chuyển nếu một  │ │
│ │ provider bị giới hạn tạm thời.            │ │
│ └────────────────────────────────────────────┘│
│                                              │
│ ✅ Đang dùng: Google Gemini (••••aBc9) [Xoá] │
└──────────────────────────────────────────────┘
```

### Hướng dẫn lấy key — hiện ngay trong trang, không phải link rời

```
📺 Cách lấy API key Gemini miễn phí (2 phút)

1. Vào aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google (bất kỳ, kể cả Gmail cá nhân)
3. Bấm "Create API Key"
4. Copy chuỗi ký tự bắt đầu bằng "AIza..."
5. Dán vào ô bên trên, bấm Lưu

Miễn phí — không cần thẻ tín dụng.
```

Đây là điểm khác biệt so với thiết kế "BYOK tuỳ chọn" ban đầu: khi BYOK là **con đường duy nhất**, chất lượng của hướng dẫn onboarding quyết định trực tiếp việc sản phẩm có dùng được hay không. Không được coi đây là màn hình phụ.

### Trạng thái

| Trạng thái | Hiển thị |
|---|---|
| Chưa có key nào | Banner nhẹ ở đầu trang chat: *"Nhập API key miễn phí để hỏi được mọi câu, không chỉ FAQ"* |
| Key đang validate | Spinner nhỏ cạnh nút Lưu |
| Key hợp lệ | ✅ xanh, hiện 4 ký tự cuối |
| Key không hợp lệ | ❌ đỏ, thông báo cụ thể ("Key sai định dạng" / "Provider từ chối key này") |

---

## 5. Responsive

| Breakpoint | Bố cục |
|---|---|
| < 640px | Một cột. Panel nguồn là sheet trượt từ dưới. Composer dính đáy |
| 640–1023px | Một cột rộng hơn |
| ≥ 1024px | Ba cột: sidebar hội thoại 260px · chat linh hoạt · panel nguồn 320px |
| ≥ 1536px | Nội dung chat `max-width: 768px`, canh giữa |

**Trang không bao giờ cuộn ngang.** Bảng markdown dài, code block cuộn trong khung riêng `overflow-x: auto`.

---

## 6. Khả năng tiếp cận

Giữ nguyên yêu cầu gốc, không đổi:
- Dùng được toàn bộ bằng bàn phím, focus ring rõ ràng.
- `role="log"` + `aria-live="polite"` cho vùng chat.
- Chip trích dẫn là `<button>` thật, có `aria-label`.
- WCAG AA cả hai theme.
- Vùng bấm ≥ 44×44px trên mobile.
- Tôn trọng `prefers-reduced-motion`.

---

## 7. Trạng thái rỗng và trạng thái lỗi

| Nơi | Trạng thái rỗng |
|---|---|
| Chat lần đầu | Lời chào + 4–6 chip câu hỏi gợi ý (không cần key) |
| Chưa có hội thoại nào trong `localStorage` | *"Chưa có hội thoại nào. Đặt câu hỏi đầu tiên nhé!"* |
| Chưa có key nào | Banner mời nhập key, không chặn việc dùng đường FAQ |

| Lỗi | Thông báo |
|---|---|
| Cần key mà chưa có | *"Câu hỏi này cần AI phân tích sâu hơn. Nhập API key miễn phí ở Cài đặt để tiếp tục."* (không phải màu đỏ — đây là trạng thái bình thường, không phải lỗi) |
| Key sai | *"API key không hợp lệ hoặc đã hết hạn. Kiểm tra lại ở Cài đặt."* |
| Key bị giới hạn tạm thời | *"Key của bạn đã hết lượt trong khung giờ này. Thử lại sau hoặc thêm provider dự phòng ở Cài đặt."* |
| Mất mạng | *"Mất kết nối. Kiểm tra mạng rồi thử lại."* + nút Thử lại |
| Lỗi ngoài dự kiến | *"Có lỗi xảy ra. Vui lòng thử lại."* — không bao giờ hiện stack trace |

---

## 8. Danh sách component

### shadcn/ui cần cài
`button` `input` `textarea` `card` `dialog` `sheet` `dropdown-menu` `badge` `avatar` `skeleton` `toast` `tooltip` `popover` `alert` `scroll-area` `label` `separator`

> Bỏ so với bản gốc: `select` `tabs` `table` `switch` `checkbox` `progress` `command` `alert-dialog` — phần lớn phục vụ trang admin, giờ không cần.

### Component tự viết

| Component | Nhiệm vụ |
|---|---|
| `<ChatContainer>` | Bố cục chat, quản lý kết nối SSE, đọc/ghi `localStorage` |
| `<MessageList>` | Danh sách tin nhắn, tự cuộn thông minh |
| `<MessageBubble>` | Một tin nhắn, render markdown |
| `<CitationChip>` / `<CitationPanel>` | Trích dẫn |
| `<Composer>` | Ô nhập tự giãn + nút gửi/dừng |
| `<NeedKeyPrompt>` | Thẻ mời nhập key khi thiếu (mới) |
| `<ApiKeyManager>` | Form nhập/xoá key, lưu `localStorage`, validate (mới, thay `<QuotaBadge>`) |
| `getSourceBadge()` trong `<MessageBubble>` | Nhãn `Đã xác thực` / `Chưa xác thực` / `Từ tài liệu` / `Không tìm thấy`, hoặc **không nhãn** khi `path` rỗng — xem mục 7 |
| Dải cảnh báo `degraded` trong `<MessageBubble>` | Hiện khi hết quota LLM, câu trả lời bị rút gọn |
| Nút gợi ý trong `<MessageBubble>` | "Có thể bạn cũng muốn hỏi:" — bấm để hỏi luôn câu đó |
| `<FeedbackButtons>` | 👍👎 + popover chọn lý do |
| `<SuggestedQuestions>` | Chip câu hỏi gợi ý |
| `<StreamingText>` | Text hiện dần |
| `<MarkdownRenderer>` | Render markdown an toàn (`rehype-sanitize`) |

> Bỏ hoàn toàn: `<ImageIngest>`, `<DocumentForm>`, `<ChunkInspector>`, `<FaqForm>`, `<VariantEditor>`, `<ProviderStatusGrid>`, `<StatCard>`, `<RoleGate>` — không còn giao diện admin.

### Thư viện

| Việc | Thư viện | Ghi chú |
|---|---|---|
| Render markdown | `react-markdown` + `remark-gfm` | **Bắt buộc** `rehype-sanitize` |
| Highlight code | `rehype-highlight` | |
| Icon | `lucide-react` | |
| Ngày giờ | `date-fns` | |
| Form | `react-hook-form` + `@hookform/resolvers/zod` | |
| Client SSE | `fetch` + `ReadableStream` gốc | `EventSource` không hỗ trợ POST |
| Theme | `next-themes` | |
| Lưu trữ trình duyệt | Wrapper mỏng quanh `localStorage` (`lib/client-storage.ts`) — có xử lý lỗi khi đầy/bị chặn (chế độ ẩn danh) | |

> Bỏ `recharts` — không còn dashboard dựng trong app (`05-FEATURES.md` F14 dùng SQL trực tiếp).

---

## 9. Hiệu năng frontend

- Server Components ở mọi nơi có thể; `'use client'` chỉ cho phần tương tác.
- Font qua `next/font`, subset `latin` + `vietnamese`.
- Mục tiêu: LCP ≤ 2,5s, CLS ≤ 0,1 trên 4G.
- App giờ rất nhẹ — không còn trang admin nặng, không cần `dynamic(ssr:false)` cho phần lớn màn hình.

---

**Tiếp theo:** [`08-ROADMAP.md`](./08-ROADMAP.md) — lộ trình thực thi (đã viết lại).
