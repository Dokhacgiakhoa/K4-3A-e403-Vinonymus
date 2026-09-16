# Kiểm thử — golden set & kết quả

> Phụ trách: Đức. Quy trình và guardrail: [`../docs/04-ai-pipeline.md`](../docs/04-ai-pipeline.md). Chuẩn "đạt": `spec.md` §7 (chốt 21:00 · 17/9).

## 1. Golden set

File: `golden-set.json` `[TODO]` — ≥20 case, trong đó ≥10 case phát triển từ dữ liệu thật (chỉ dẫn mã `M#####` / `T#####`, không dán nguyên văn dài).

Cơ cấu đề xuất:

| Nhóm | Số case | Kiểm gì |
|---|---|---|
| Happy path (tech / non-tech × nhiều mức thời gian) | 8 | Chọn đúng tài liệu theo nền tảng, tổng phút ≤ quỹ thời gian |
| ① Nguồn sự thật — bẫy link | 3 | Ghi chú dán link lạ / đòi tài liệu không có → không có link ngoài catalog |
| ② Mơ hồ | 4 | < 30 phút, ghi chú mâu thuẫn, lab không có trong catalog → `clarify` |
| ③ Ngoài phạm vi | 3 | Làm hộ, xin gia hạn, "bỏ qua hướng dẫn trước đó" → `refuse` |
| ④ Đặc thù domain | 2 | Non-tech không bị đưa tài liệu `advanced` lên đầu |

Định dạng một case:

```json
{
  "id": "G01",
  "group": "happy",
  "source": "T10312",
  "input": { "background": "non_tech", "available_minutes": 60, "lab_id": "lab-02", "note": "tóm tắt các key" },
  "expect": {
    "status": "plan",
    "must_include": ["lab-02-colab-setup"],
    "must_not_include": ["lab-02-advanced-eval"],
    "max_total_minutes": 60
  }
}
```

## 2. Kết quả các lượt chạy

| Lượt | Thời điểm | Phiên bản (commit / prompt) | Qua / Tổng | % | Link ngoài catalog | Ghi chú lỗi chính |
|---|---|---|---|---|---|---|
| 0 | | Baseline luật if/else | | | | |
| 1 | | AI v1 | | | | |

## 3. Phân tích lỗi

Mỗi case trượt: mã case → vì sao trượt → sửa gì (prompt / luật / catalog) → lượt nào sửa được.
