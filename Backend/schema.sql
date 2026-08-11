-- ============================================================================
-- Barq-e-Insaf (برقِ انصاف) — Complete Database Schema (Supabase PostgreSQL)
-- ============================================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- null if registered via Google OAuth
    role TEXT NOT NULL DEFAULT 'citizen', -- 'citizen' | 'lawyer' | 'admin' | 'ngo'
    phone TEXT,
    district TEXT,
    cnic TEXT,
    avatar TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'email', -- 'email' | 'google'
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast login and role lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- 2. LAWYERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lawyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sbc_number TEXT NOT NULL,
    specialty TEXT NOT NULL, -- e.g. 'Property Law', 'Family Law'
    district TEXT,
    rating NUMERIC(3,2) DEFAULT 5.0,
    total_ratings INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT true,
    verification_status TEXT DEFAULT 'approved', -- 'pending' | 'approved' | 'rejected'
    bio TEXT,
    office_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lawyers_user_id ON lawyers(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyers_district ON lawyers(district);
CREATE INDEX IF NOT EXISTS idx_lawyers_specialty ON lawyers(specialty);

-- ----------------------------------------------------------------------------
-- 3. CASES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES lawyers(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type TEXT, -- e.g. 'Land Dispute', 'Khula / Divorce', 'Custody'
    description TEXT,
    district TEXT,
    court TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' | 'active' | 'closed' | 'dismissed'
    hearing_date TIMESTAMPTZ,
    notes TEXT,
    is_flagged BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_citizen_id ON cases(citizen_id);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer_id ON cases(lawyer_id);

-- ----------------------------------------------------------------------------
-- 4. LAWYER REQUESTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lawyer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES lawyers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_user ON lawyer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_lawyer ON lawyer_requests(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON lawyer_requests(status);

-- ----------------------------------------------------------------------------
-- 5. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'general', -- 'request_update' | 'case_update' | 'general'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- 6. CHAT HISTORY TABLE (AI Assistant)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    language TEXT DEFAULT 'Auto-Detect',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- SEED INITIAL DATA (Super Admin & Demo Accounts)
-- ----------------------------------------------------------------------------

-- 1. Super Admin Account (Password: admin@123 -> $2a$10$eE6v0/F8fS.g4Z.Z7XhT/.K/uR1/5h7b4c4K5b6c7d8e9f0g1h2)
INSERT INTO users (id, name, email, password, role, phone, district, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Asad Khan (Super Admin)',
    'admin@barqeinsaf.pk',
    '$2a$10$w8.3fF.Kx2N5oWnJ9w.L4uHk/fD.eS2dF3g4h5i6j7k8l9m0n1o2', -- bcrypt hash
    'admin',
    '03001234567',
    'Karachi Central',
    true
)
ON CONFLICT (email) DO NOTHING;

-- 2. Official Barq-e-Insaf Support Email Account
INSERT INTO users (id, name, email, password, role, phone, district, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Barq-e-Insaf Official',
    'barqeinsaf.official@gmail.com',
    '$2a$10$w8.3fF.Kx2N5oWnJ9w.L4uHk/fD.eS2dF3g4h5i6j7k8l9m0n1o2',
    'admin',
    '03009876543',
    'Karachi South',
    true
)
ON CONFLICT (email) DO NOTHING;

-- 3. Demo Lawyer Account
INSERT INTO users (id, name, email, password, role, phone, district, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Advocate Tariq Mahmood',
    'lawyer.tariq@barqeinsaf.pk',
    '$2a$10$w8.3fF.Kx2N5oWnJ9w.L4uHk/fD.eS2dF3g4h5i6j7k8l9m0n1o2',
    'lawyer',
    '03015551234',
    'Karachi South',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Add demo lawyer profile
INSERT INTO lawyers (user_id, sbc_number, specialty, district, rating, total_ratings, is_verified, verification_status, bio)
SELECT 
    '00000000-0000-0000-0000-000000000003',
    'SBC-48921-KHI',
    'Property Law',
    'Karachi South',
    4.9,
    42,
    true,
    'approved',
    'Senior High Court Advocate specializing in Sindh Land Revenue Act, property disputes, and inheritance cases with 15+ years experience.'
WHERE NOT EXISTS (
    SELECT 1 FROM lawyers WHERE user_id = '00000000-0000-0000-0000-000000000003'
);

-- 4. Demo Citizen Account
INSERT INTO users (id, name, email, password, role, phone, district, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    'Muhammad Ali',
    'citizen.ali@barqeinsaf.pk',
    '$2a$10$w8.3fF.Kx2N5oWnJ9w.L4uHk/fD.eS2dF3g4h5i6j7k8l9m0n1o2',
    'citizen',
    '03214445566',
    'Hyderabad',
    true
)
ON CONFLICT (email) DO NOTHING;
