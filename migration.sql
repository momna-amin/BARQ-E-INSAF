-- =====================================================
-- BARQ-E-INSAF DATABASE MIGRATION
-- Run this in Supabase SQL Editor (barq-e-insaf project)
-- =====================================================

-- 1. Add suspension fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;

-- 2. Add case_id reference to lawyer_requests (so approved requests link to the case)
ALTER TABLE lawyer_requests ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL;

-- 3. Ensure lawyers table has correct defaults
ALTER TABLE lawyers ALTER COLUMN verification_status SET DEFAULT 'pending';

-- 4. Fix existing lawyers that may have NULL verification_status
UPDATE lawyers SET verification_status = 'pending' WHERE verification_status IS NULL;

-- 5. Add is_verified column if missing
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 6. Sync is_verified with verification_status for existing records
UPDATE lawyers SET is_verified = true WHERE verification_status = 'approved';
UPDATE lawyers SET is_verified = false WHERE verification_status IN ('pending', 'rejected');

-- 7. Add index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_lawyers_verification_status ON lawyers(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_suspended ON users(is_suspended);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_is_flagged ON cases(is_flagged);

-- Done!
SELECT 'Migration completed successfully.' as result;
