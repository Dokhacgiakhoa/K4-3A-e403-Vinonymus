# TIÊU CHUẨN KỸ THUẬT PHÒNG CHỐNG ẢO GIÁC CHO HỆ THỐNG AI (ANTI-HALLUCINATION & RAG TRIAD)

> **Bộ Quy Chuẩn Kỹ Thuật Đảm Bảo Độ Chính Xác & Chống Ảo Giác Tuyệt Đối**  
> Dự án: **AI SFIA Engineering & Community Hub**

---

## 🛡️ 1. NGUYÊN TẮC "GROUND TRUTH FIRST"

Mọi câu trả lời của AI Assistant và mọi đoạn code do AI sinh ra phải được kiểm chứng dựa trên 3 tiêu chí:

1. **Context Precision (Độ chuẩn ngữ cảnh)**: Thông tin trích xuất từ Vector DB phải thực sự liên quan mật thiết đến câu hỏi.
2. **Context Recall (Độ đầy đủ ngữ cảnh)**: Chứa toàn bộ các mảnh dữ kiện cần thiết để trả lời câu hỏi mà không cần LLM tự suy đoán.
3. **Faithfulness (Độ trung thực chống ảo giác)**: 100% các luận điểm và con số trong câu trả lời phải có bằng chứng đối chiếu từ tài liệu gốc.

---

## 📊 2. CÔNG THỨC ĐO LƯỜNG ĐỊNH LƯỢNG (RAGAS METRICS)

$$\text{Faithfulness} = \frac{|\text{Các luận điểm được chứng minh bởi Ngữ cảnh}|}{|\text{Tổng số luận điểm trong Câu trả lời}|}$$

- **Ngưỡng chấp nhận (Threshold)**: $\text{Faithfulness} \ge 0.95$.
- Nếu câu hỏi vượt ra ngoài phạm vi dữ liệu có sẵn: AI **bắt buộc phải trả lời thật là chưa có tài liệu xác thực**, tuyệt đối không tự bịa ra thông tin.

---

## 🔒 3. QUY TRÌNH BẢO VỆ ĐOẠN CHAT & BẢO TOÀN NGỮ CẢNH

```
[User Query] ──► [Guardrails / Filter PII] ──► [Hybrid Retrieval: Dense + Sparse] ──► [Cross-Encoder Re-ranker] ──► [Synthesize with Citations] ──► [Stream Filter Output]
```

- Mọi câu trả lời bắt buộc đính kèm trích dẫn nguồn (`👉 Nguồn: Khung năng lực SFIA L3 - Qdrant Vector DB`).
- Tự động lọc bỏ các thẻ hình ảnh hoặc dữ liệu không hợp lệ trước khi stream về giao diện người dùng.
