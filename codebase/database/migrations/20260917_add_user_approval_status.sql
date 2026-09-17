-- =========================================================================
-- MIGRATION: 20260917_ADD_USER_APPROVAL_STATUS.SQL
-- Tài khoản đăng ký mới phải chờ quản trị viên duyệt trước khi đăng nhập.
-- Tài khoản đã tồn tại trước migration này coi như đã được duyệt.
-- =========================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) NOT NULL DEFAULT 'Approved';

-- Từ nay mặc định là chờ duyệt; code .NET vẫn gán giá trị tường minh khi tạo user.
ALTER TABLE users ALTER COLUMN approval_status SET DEFAULT 'Pending';

ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_approval_status;
ALTER TABLE users ADD CONSTRAINT chk_users_approval_status
    CHECK (approval_status IN ('Pending', 'Approved', 'Rejected'));

CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users (approval_status);
