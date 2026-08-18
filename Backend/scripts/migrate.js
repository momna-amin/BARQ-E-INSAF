const supabase = require('../config/supabase');

async function runManualMigration() {
  console.log('Running one-off database migration...');
  const sql = `
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;
    ALTER TABLE cases ADD COLUMN IF NOT EXISTS evidence JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE lawyer_requests ADD COLUMN IF NOT EXISTS case_id UUID;
    ALTER TABLE lawyer_requests DROP CONSTRAINT IF EXISTS fk_lawyer_requests_case;
    ALTER TABLE lawyer_requests ADD CONSTRAINT fk_lawyer_requests_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL;
    ALTER TABLE lawyers ALTER COLUMN verification_status SET DEFAULT 'pending';
    ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    NOTIFY pgrst, 'reload schema';
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { query: sql });
    if (error) {
      console.error('Migration error:', error.message);
    } else {
      console.log('✅ Manual schema migration completed successfully.');
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

runManualMigration();
