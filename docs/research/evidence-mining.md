# Bằng chứng chuẩn B — mining data pack

> Data pack **không nằm trong repo** (quy định bảo mật). Để kiểm lại, đặt `data/` của repo đề bài cạnh repo này và chạy đoạn script ở mục 3. Chỉ trích dẫn mã tham chiếu và tối đa 2 câu mỗi ví dụ.

## 1. Kết quả

| # | Chỉ số | Kết quả | Nguồn |
|---|---|---|---|
| E1 | Tin nhắn của người (không phải bot) có từ khoá `link / slide / zoom / drive / tài liệu` | **52 / 779 = 6.7%** | `discord-pack/k4_messages.csv`, 12–14/09 |
| E2 | Lượt chat VLearn có "tóm tắt" hoặc "trọng tâm" trong câu hỏi | **1.189 / 13.494 = 8.8%** (toàn bộ) · **182 / 3.097 = 5.9%** (K4) | `vlearn-pack/chatlog/tutor_turns.csv` |
| E3 | Lượt tutor dùng nước đi `suggest_next_topic` | **18 / 13.494 = 0.13%** | như trên, cột `move_used` |
| E4 | Bản tin ngày nhắc tới nộp muộn | 2 mục trong bản tin K4-L3-4 ngày 14/09 | `discord-pack/k4_daily_reports.md` |

## 2. Ví dụ nguyên văn

| Mã | Nguồn | Trích |
|---|---|---|
| `M10991` | Discord, 13/09 | "cho e xin slide của thầy [HV] ạ" |
| `M23639` | Discord | "em muốn xin slide nay thầy dạy ở 3a-lec-d301 được ko ạ" |
| `M24139` | Discord | "Cho em xin Sổ Tay Học Viên lv 2 lúc sáng ạ" |
| `T10312` | VLearn, K4, 10/09 | "(Đang học phần 'Chuẩn bị notebook và nơi nộp bài'…) tóm tắt các key" |
| Bản tin 14/09 | Discord | "Học viên hỏi có được gia hạn thời gian nộp Lab2 vì lỡ nộp muộn 1 phút" |

## 3. Phương pháp đếm (chạy lại được)

```python
import csv
from collections import Counter

# E1 — Discord
rows = list(csv.DictReader(open("data/discord-pack/k4_messages.csv", encoding="utf-8")))
human = [r for r in rows if r["is_bot"] == "False"]
kws = ["link", "slide", "zoom", "drive", "tài liệu"]
e1 = [r for r in human if any(k in r["content"].lower() for k in kws)]
print(len(e1), len(human))            # 52 779

# E2, E3 — VLearn
turns = list(csv.DictReader(open("data/vlearn-pack/chatlog/tutor_turns.csv", encoding="utf-8")))
hit = lambda r: "tóm tắt" in r["student_question"].lower() or "trọng tâm" in r["student_question"].lower()
k4 = [r for r in turns if r["cohort_hint"] == "K4"]
print(sum(map(hit, turns)), len(turns))   # 1189 13494
print(sum(map(hit, k4)), len(k4))         # 182 3097
print(Counter(r["move_used"] for r in turns)["suggest_next_topic"])  # 18
```

Dùng `csv.DictReader` (không dùng `wc -l`) vì nội dung tin nhắn có xuống dòng.

## 4. Giới hạn

- E1 đếm theo từ khoá, gồm cả tin **chia sẻ** link chứ không chỉ tin **xin** link. Số tin xin trực tiếp (cụm "xin link / xin slide / cho em xin…") chỉ là **4**. Cần đọc tay 52 tin để tách hai loại trước CP4 `[TODO]`.
- Discord pack chỉ có 3 ngày, tuần onboarding, kênh public.
- E2 gồm cả câu hỏi mẫu bấm sẵn (`is_preset`); chưa tách.
- Mining chứng minh pain **tồn tại**; chưa chứng minh học viên **muốn nó được giải** → cần chuẩn A ([`survey-log.md`](survey-log.md)).
