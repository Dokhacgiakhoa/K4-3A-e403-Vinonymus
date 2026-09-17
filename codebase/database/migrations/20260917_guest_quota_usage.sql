-- =========================================================================
-- MIGRATION: 20260917_GUEST_QUOTA_USAGE.SQL
-- Đếm số câu khách chưa đăng nhập đã hỏi AI Helpdesk trong ngày.
-- subject_hash là SHA-256 của mã phiên ẩn danh hoặc IP — không lưu IP/mã phiên gốc.
-- =========================================================================

CREATE TABLE IF NOT EXISTS guest_quota_usage (
    usage_day DATE NOT NULL,
    subject_hash VARCHAR(64) NOT NULL,
    used_count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usage_day, subject_hash)
);

CREATE INDEX IF NOT EXISTS idx_guest_quota_usage_day ON guest_quota_usage (usage_day);
