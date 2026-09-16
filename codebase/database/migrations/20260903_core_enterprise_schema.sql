-- =========================================================================
-- MIGRATION: 20260903_CORE_ENTERPRISE_SCHEMA.SQL
-- HỆ THỐNG CƠ SỞ DỮ LIỆU .NET 10 CLEAN ARCHITECTURE & SAAS HUB
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. BẢNG NGƯỜI DÙNG & HẠN MỨC (USERS & QUOTAS)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    tier VARCHAR(50) NOT NULL DEFAULT 'Free',
    current_level VARCHAR(10) NOT NULL DEFAULT 'L1',
    total_study_hours INT NOT NULL DEFAULT 0,
    ai_token_quota INT NOT NULL DEFAULT 100000,
    ai_token_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 2. BẢNG GIÁO TRÌNH SFIA 8 (CURRICULUM MODULES)
CREATE TABLE IF NOT EXISTS curriculum_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    target_level VARCHAR(10) NOT NULL DEFAULT 'L1',
    bloom_level VARCHAR(50) NOT NULL DEFAULT 'Remember',
    estimated_hours INT NOT NULL DEFAULT 20,
    human_ai_ratio VARCHAR(100) NOT NULL DEFAULT '20% AI - 80% Human',
    code_snippet TEXT,
    code_language VARCHAR(50),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 3. BẢNG NGÂN HÀNG CÂU HỎI MÔ PHỎNG (MOCK EXAM QUESTIONS - NDA COMPLIANT)
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES curriculum_modules(id) ON DELETE SET NULL,
    level VARCHAR(10) NOT NULL DEFAULT 'L1',
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(5) NOT NULL,
    explanation TEXT NOT NULL,
    is_simulation_mock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 4. BẢNG LỊCH SỬ NỘP BÀI THI (QUIZ SUBMISSIONS)
CREATE TABLE IF NOT EXISTS quiz_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    module_id UUID,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score_percentage NUMERIC(5,2) NOT NULL,
    is_passed BOOLEAN NOT NULL,
    study_minutes_credited INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 5. BẢNG CHUỖI NGÀY HỌC (USER STREAKS)
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    current_streak_days INT NOT NULL DEFAULT 1,
    longest_streak_days INT NOT NULL DEFAULT 1,
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 6. BẢNG SỔ CÁI NẠP TIỀN VIETQR (PAYMENT LEDGERS)
CREATE TABLE IF NOT EXISTS payment_ledgers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount_vnd NUMERIC(12,2) NOT NULL,
    order_code VARCHAR(100) NOT NULL UNIQUE,
    viet_qr_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    gateway_transaction_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
