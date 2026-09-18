-- D-03: chunk tài liệu và embedding pgvector cho AI Mentor.
-- A-04 hiện thống nhất với pipeline Gemini cũ: 768 chiều, cosine distance.

SET search_path TO app, public, extensions;

ALTER TABLE app.lecture_documents
    ADD COLUMN IF NOT EXISTS storage_bucket VARCHAR(100),
    ADD COLUMN IF NOT EXISTS embedding_model VARCHAR(100),
    ADD COLUMN IF NOT EXISTS indexed_revision INT,
    ADD COLUMN IF NOT EXISTS indexed_at TIMESTAMPTZ;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'app.lecture_documents'::regclass
          AND conname = 'chk_lecture_documents_indexed_revision'
    ) THEN
        ALTER TABLE app.lecture_documents
            ADD CONSTRAINT chk_lecture_documents_indexed_revision
            CHECK (indexed_revision IS NULL OR indexed_revision BETWEEN 1 AND revision);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_lecture_documents_published_indexed
    ON app.lecture_documents(id, revision)
    WHERE status = 'published' AND deleted_at IS NULL AND indexed_revision = revision;

CREATE TABLE IF NOT EXISTS app.lecture_document_chunks (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES app.lecture_documents(id) ON DELETE CASCADE,
    revision INT NOT NULL,
    ordinal INT NOT NULL,
    content TEXT NOT NULL,
    heading_path TEXT,
    token_count INT,
    embedding public.vector(768) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_lecture_document_chunks_revision CHECK (revision > 0),
    CONSTRAINT chk_lecture_document_chunks_ordinal CHECK (ordinal >= 0),
    CONSTRAINT chk_lecture_document_chunks_content CHECK (length(btrim(content)) > 0),
    CONSTRAINT chk_lecture_document_chunks_token_count CHECK (token_count IS NULL OR token_count >= 0),
    CONSTRAINT uq_lecture_document_chunks_position UNIQUE (document_id, revision, ordinal)
);

CREATE INDEX IF NOT EXISTS idx_lecture_document_chunks_document
    ON app.lecture_document_chunks(document_id, revision, ordinal);
CREATE INDEX IF NOT EXISTS idx_lecture_document_chunks_embedding
    ON app.lecture_document_chunks USING hnsw (embedding public.vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE OR REPLACE FUNCTION app.search_lecture_document_chunks(
    p_embedding public.vector(768),
    p_limit INT DEFAULT 8,
    p_min_similarity DOUBLE PRECISION DEFAULT 0
)
RETURNS TABLE(
    chunk_id UUID,
    document_id UUID,
    title VARCHAR(255),
    content TEXT,
    similarity DOUBLE PRECISION
)
LANGUAGE SQL STABLE SECURITY INVOKER
SET search_path = app, public, extensions
AS $$
    SELECT c.id,
           d.id,
           d.title,
           c.content,
           1 - (c.embedding <=> p_embedding) AS similarity
    FROM app.lecture_document_chunks AS c
    JOIN app.lecture_documents AS d ON d.id = c.document_id
    WHERE d.status = 'published'
      AND d.deleted_at IS NULL
      AND d.indexed_revision = d.revision
      AND c.revision = d.revision
      AND 1 - (c.embedding <=> p_embedding) >= p_min_similarity
    ORDER BY c.embedding <=> p_embedding
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 8), 1), 50);
$$;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON app.lecture_document_chunks TO aiia_backend;
GRANT EXECUTE ON FUNCTION app.search_lecture_document_chunks(public.vector, INT, DOUBLE PRECISION)
    TO aiia_backend;
