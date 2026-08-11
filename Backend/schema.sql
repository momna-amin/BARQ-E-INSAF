-- ============================================================================
-- Barq-e-Insaf — Complete Database Schema (Supabase PostgreSQL)
-- RUN THIS IN: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE: users
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'citizen',
    phone TEXT,
    district TEXT,
    cnic TEXT,
    gender TEXT,
    avatar TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'email',
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ============================================================================
-- TABLE: lawyers
-- ============================================================================
CREATE TABLE IF NOT EXISTS lawyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sbc_number TEXT NOT NULL,
    specialty TEXT NOT NULL,
    district TEXT,
    gender TEXT,
    father_name TEXT,
    rating NUMERIC(3,2) DEFAULT 5.0,
    total_ratings INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT true,
    verification_status TEXT DEFAULT 'approved',
    bio TEXT,
    office_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lawyers DISABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers DROP CONSTRAINT IF EXISTS lawyers_user_id_key;
ALTER TABLE lawyers ADD CONSTRAINT lawyers_user_id_key UNIQUE (user_id);
CREATE INDEX IF NOT EXISTS idx_lawyers_user_id  ON lawyers(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyers_district ON lawyers(district);
CREATE INDEX IF NOT EXISTS idx_lawyers_specialty ON lawyers(specialty);

-- ============================================================================
-- TABLE: cases
-- ============================================================================
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES lawyers(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type TEXT,
    description TEXT,
    district TEXT,
    court TEXT,
    status TEXT DEFAULT 'pending',
    hearing_date TIMESTAMPTZ,
    notes TEXT,
    is_flagged BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_cases_citizen_id ON cases(citizen_id);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer_id  ON cases(lawyer_id);

-- ============================================================================
-- TABLE: lawyer_requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS lawyer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES lawyers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lawyer_requests DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_requests_user   ON lawyer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_lawyer ON lawyer_requests(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON lawyer_requests(status);

-- ============================================================================
-- TABLE: notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

-- ============================================================================
-- TABLE: chat_history
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    language TEXT DEFAULT 'Auto-Detect',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE chat_history DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SEED DATA — All passwords are pre-hashed using bcrypt (cost 10)
-- Plain passwords shown in comments — will be inserted via seed.js script
-- ============================================================================
-- NOTE: Run Backend/scripts/seed.js to insert all seeded accounts properly
-- The script will bcrypt-hash each password and insert into users + lawyers tables
