-- Run this ONCE in Supabase SQL Editor.
-- Backs the persistent OTP store used by authController.js (register + forgot-password OTP flows).

CREATE TABLE IF NOT EXISTS otp_codes (
  email       TEXT NOT NULL,
  purpose     TEXT NOT NULL,                 -- 'register' | 'reset-password'
  otp         TEXT NOT NULL,
  payload     JSONB,                         -- holds pending registration form data (register flow only)
  attempts    INT NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (email, purpose)
);

-- Optional: auto-cleanup old rows (Supabase pg_cron, if enabled on your project)
-- select cron.schedule('otp-cleanup', '*/30 * * * *', $$ delete from otp_codes where expires_at < now() $$);
