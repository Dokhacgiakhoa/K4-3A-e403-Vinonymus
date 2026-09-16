---
name: sfia-curriculum-auditor
description: Kiểm toán tự động tính chuẩn xác của các công thức toán học, thuật ngữ và mã nguồn mẫu trong 7 chuyên đề giáo trình SFIA.
---

# SFIA Curriculum Auditor Skill

Sử dụng skill này khi cần rà soát, thêm mới hoặc cập nhật các chuyên đề giáo trình trong `src/data/sfia-community-data.ts` hoặc `frontend/src/data/`.

## Quy Trình Kiểm Toán 4 Bước:

1. **Kiểm tra Tính Chuẩn Xác Toán Học**:
   - Scaled Dot-Product Attention: Bắt buộc đúng dạng $Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$.
   - Cosine Distance: $1 - \frac{u \cdot v}{\|u\|_2 \|v\|_2}$.
   - RRF Score: $\sum \frac{1}{k + r(d)}$ với $k=60$.
   - LoRA Decomposition: $\Delta W = \frac{\alpha}{r}(B \times A)$ với $B \in \mathbb{R}^{d \times r}, A \in \mathbb{R}^{r \times k}$.

2. **Kiểm tra Mã Nguồn Mẫu (Executable Code Blocks)**:
   - Toàn bộ code Python phải có Type Hints rõ ràng, cú pháp chuẩn Python 3.10+.
   - Import đầy đủ các thư viện phụ thuộc (`numpy`, `pydantic`, `qdrant_client`, `langgraph`, `vllm`).
   - Không chứa hardcoded API keys hay đường dẫn máy local cá nhân.

3. **Kiểm tra Độ Phù Hợp với Bloom's Taxonomy**:
   - L1-L2: Remember & Understand (Định nghĩa, cú pháp, ví dụ mẫu).
   - L3-L4: Apply & Analyze (Thực hành RAG, HNSW, ReAct, LoRA).
   - L5-L7: Evaluate & Create (vLLM serving, Guardrails, ISO 42001).

4. **Bảo Toàn Không Khớp Dữ Liệu**:
   - Đồng bộ giữa `shared/types/saas.ts` và `src/data/sfia-community-data.ts`.
