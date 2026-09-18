-- =========================================================================
-- MIGRATION: 20260906_CURRICULUM_TOPICS_AND_ENROLLMENTS.SQL
-- HỆ THỐNG QUẢN LÝ BÀI HỌC, GHI DANH KHÓA HỌC & CHỨNG CHỈ SỐ SFIA
-- =========================================================================

SET search_path TO app, public, extensions;

-- 1. BẢNG CHI TIẾT BÀI HỌC LÝ THUYẾT (CURRICULUM TOPICS)
CREATE TABLE IF NOT EXISTS curriculum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
    topic_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reading_time_minutes INT NOT NULL DEFAULT 45,
    code_snippet TEXT,
    code_language VARCHAR(50),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    CONSTRAINT uq_module_topic UNIQUE (module_id, topic_number)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_topics_module_id ON curriculum_topics(module_id);

-- 2. BẢNG GHI DANH KHÓA HỌC (COURSE ENROLLMENTS)
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    CONSTRAINT uq_user_module_enrollment UNIQUE (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_module_id ON course_enrollments(module_id);

-- 3. BẢNG TIẾN ĐỘ TỪNG BÀI HỌC CỦA HỌC VIÊN (USER TOPIC PROGRESS)
CREATE TABLE IF NOT EXISTS user_topic_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    CONSTRAINT uq_user_topic_progress UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_module ON user_topic_progress(user_id, module_id);

-- 4. BẢNG CHỨNG CHỈ TỐT NGHIỆP SFIA (ISSUED CERTIFICATES)
CREATE TABLE IF NOT EXISTS issued_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_code VARCHAR(100) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
    course_title VARCHAR(255) NOT NULL,
    course_level VARCHAR(10) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    CONSTRAINT uq_user_module_certificate UNIQUE (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_issued_certificates_code ON issued_certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_issued_certificates_user_id ON issued_certificates(user_id);
