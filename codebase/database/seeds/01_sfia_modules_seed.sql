-- SEED DATA: 4 CHUYÊN ĐỀ MẪU SFIA
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio)
VALUES 
('11111111-1111-1111-1111-111111111101', 1, 'Mảng, Quản lý Bộ nhớ Python/Java & Git', 'mang-bo-nho-git', 'Hiểu sâu cấu trúc Array và Memory Management giữa Python và Java.', 'L1', 'Remember', 20, '20% AI - 80% Human'),
('11111111-1111-1111-1111-111111111102', 2, 'Two Pointers, Sliding Window & String Manipulation', 'two-pointers-sliding-window', 'Tối ưu hóa độ phức tạp thời gian từ O(N²) xuống O(N).', 'L1', 'Understand', 20, '20% AI - 80% Human'),
('11111111-1111-1111-1111-111111111103', 3, 'Stack, Queue, Monotonic Stack & Cơ chế Đệ quy', 'stack-queue-monotonic', 'Khám phá cấu trúc Stack/Queue và ứng dụng Next Greater Element.', 'L2', 'Apply', 20, '30% AI - 70% Human'),
('11111111-1111-1111-1111-111111111104', 4, 'HashMap, HashSet, Kỹ thuật Băm & Tránh Va Chạm', 'hashmap-hashset-collision', 'Bản chất hàm băm hashCode(), equals() và Treeification.', 'L2', 'Apply', 20, '30% AI - 70% Human')
ON CONFLICT (slug) DO NOTHING;
