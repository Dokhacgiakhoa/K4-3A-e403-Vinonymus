-- D-02: tài liệu giảng viên, phiên bản và lịch sử duyệt.
-- PostgreSQL thuần trên schema app; không phụ thuộc Supabase Auth.

SET search_path TO app, public, extensions;

CREATE TABLE IF NOT EXISTS app.lecture_documents (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    source_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    file_type VARCHAR(20) NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    extracted_content TEXT,
    content_hash VARCHAR(128) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    review_note TEXT,
    revision INT NOT NULL DEFAULT 1,
    approved_revision INT,
    published_by UUID REFERENCES app.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_lecture_documents_file_type
        CHECK (file_type IN ('pdf', 'text', 'markdown')),
    CONSTRAINT chk_lecture_documents_status
        CHECK (status IN ('draft', 'processing', 'review', 'published', 'archived', 'failed')),
    CONSTRAINT chk_lecture_documents_size CHECK (file_size_bytes >= 0),
    CONSTRAINT chk_lecture_documents_revision CHECK (revision > 0),
    CONSTRAINT chk_lecture_documents_approved_revision
        CHECK (approved_revision IS NULL OR (approved_revision > 0 AND approved_revision <= revision))
);

CREATE INDEX IF NOT EXISTS idx_lecture_documents_owner_id
    ON app.lecture_documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_lecture_documents_status
    ON app.lecture_documents(status);
CREATE INDEX IF NOT EXISTS idx_lecture_documents_updated_at
    ON app.lecture_documents(updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lecture_documents_owner_source_hash
    ON app.lecture_documents(owner_id, source_path, content_hash)
    WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS app.lecture_document_versions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES app.lecture_documents(id) ON DELETE CASCADE,
    revision INT NOT NULL,
    snapshot JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_lecture_document_versions_revision CHECK (revision > 0),
    CONSTRAINT uq_lecture_document_versions_document_revision UNIQUE (document_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_lecture_document_versions_document
    ON app.lecture_document_versions(document_id, revision DESC);

CREATE TABLE IF NOT EXISTS app.lecture_document_reviews (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES app.lecture_documents(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
    revision INT NOT NULL,
    decision VARCHAR(20) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_lecture_document_reviews_revision CHECK (revision > 0),
    CONSTRAINT chk_lecture_document_reviews_decision
        CHECK (decision IN ('approved', 'rejected', 'needs_changes'))
);

CREATE INDEX IF NOT EXISTS idx_lecture_document_reviews_document
    ON app.lecture_document_reviews(document_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lecture_document_reviews_reviewer
    ON app.lecture_document_reviews(reviewer_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE
    ON app.lecture_documents, app.lecture_document_versions, app.lecture_document_reviews
    TO aiia_backend;
