-- D-04: nhật ký thao tác cho duyệt tài khoản và tài liệu.
-- Bảng bất biến, dùng app.users thay cho Supabase Auth/profiles.

SET search_path TO app, public, extensions;

CREATE TABLE IF NOT EXISTS app.platform_audit (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    actor_id UUID REFERENCES app.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(40) NOT NULL,
    resource_id UUID,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_platform_audit_action CHECK (length(btrim(action)) > 0),
    CONSTRAINT chk_platform_audit_resource_type
        CHECK (resource_type IN ('account', 'document', 'document_version', 'document_review'))
);

-- Truy vấn audit luôn theo thời gian mới nhất; index DESC tránh sort lại log lớn.
CREATE INDEX IF NOT EXISTS idx_platform_audit_created_at
    ON app.platform_audit(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_audit_resource
    ON app.platform_audit(resource_type, resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_audit_actor
    ON app.platform_audit(actor_id, created_at DESC);

-- Audit là append-only đối với role ứng dụng: không cho sửa/xoá bằng API.
GRANT SELECT, INSERT ON app.platform_audit TO aiia_backend;
-- Default privileges của schema app (D-01) tự cấp UPDATE/DELETE cho bảng mới,
-- nên phải thu hồi tường minh thì audit mới thật sự append-only.
REVOKE UPDATE, DELETE, TRUNCATE ON app.platform_audit FROM aiia_backend;
