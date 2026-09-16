---
name: design-system-auditor
description: Tự động kiểm toán mã nguồn giao diện để phát hiện các lỗi vi phạm Design System (hardcode mã màu hex, dùng px thay cho rem, thiếu biến CSS :root).
---

# Design System Auditor Skill

Sử dụng skill này khi cần rà soát mã nguồn Frontend/UI components trong `src/` hoặc `frontend/src/` để đảm bảo tuân thủ 100% **Kiến trúc Semantic Design Tokens & CSS Variables**.

## Danh Mục Kiểm Toán Bắt Buộc (4 Tiêu Chí):

1. **Cấm Hardcode Mã Màu Hex / RGB**:
   - ❌ **Lỗi**: `className="text-[#10b981] bg-[#061814]"`, `style={{ color: '#06b6d4' }}`
   - ✅ **Chuẩn**: `className="text-primary bg-background"` hoặc dùng `var(--brand-primary)`

2. **Bắt Buộc Sử Dụng Đơn Vị Tương Đối `rem`**:
   - ❌ **Lỗi**: `padding: 24px`, `borderRadius: 16px`
   - ✅ **Chuẩn**: `p-6` (1.5rem), `rounded-2xl` (1.5rem), `perspective: 87.5rem`

3. **Bảo Toàn Bảng Biến `:root` Tập Trung**:
   - Mọi màu sắc thương hiệu phải được tra cứu từ `:root` trong `src/app/globals.css`:
     - Primary: `--brand-primary` (#10b981)
     - Secondary: `--brand-secondary` (#06b6d4)
     - Accent: `--brand-accent` (#f59e0b)
     - Surfaces: `--brand-surface-white`, `--brand-surface-dark`
     - Borders: `--brand-border-subtle`

4. **Đồng Bộ Với Tailwind Config**:
   - Đảm bảo các token được khai báo đầy đủ trong `tailwind.config.ts` để IDE có IntelliSense gợi ý tự động.
