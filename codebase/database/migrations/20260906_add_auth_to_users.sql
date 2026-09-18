-- =========================================================================
-- MIGRATION: 20260906_ADD_AUTH_TO_USERS.SQL
-- BỔ SUNG CỘT BẢO MẬT & PHÂN QUYỀN VÀO BẢNG USERS
-- =========================================================================

SET search_path TO app, public, extensions;

-- 1. Thêm cột password_hash để lưu chuỗi băm BCrypt
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. Thêm cột role nếu chưa tồn tại
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'Visitor';

-- 3. Đảm bảo email luôn unique và được đánh index tìm kiếm nhanh
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
