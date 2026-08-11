'use strict';
/**
 * otpStore.js
 * Supabase-backed OTP store.
 *
 * WHY THIS EXISTS:
 * The old code used `new Map()` in memory to hold OTPs. On Vercel, every
 * request can land on a different serverless instance (cold start), so an
 * OTP saved in one invocation's memory is often gone by the time the next
 * request (verify) arrives — the user gets "Pehle OTP request karein" even
 * though they just received the email. This is the #1 cause of "OTP send
 * button does nothing" / "OTP never verifies" style bugs on Vercel.
 *
 * Fix: persist OTPs in a real Supabase table (`otp_codes`) so they survive
 * across serverless instances. Run sql/otp_codes.sql once in Supabase.
 */
const supabase = require('../config/supabase');

const TABLE = 'otp_codes';

/**
 * Create/replace an OTP for a given email + purpose.
 * purpose: 'register' | 'reset-password'
 * payload: optional JSON of extra data needed later (e.g. registration form fields)
 */
async function setOtp(email, purpose, otp, ttlMs = 10 * 60 * 1000, payload = null) {
  const expires_at = new Date(Date.now() + ttlMs).toISOString();
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { email, purpose, otp, payload, attempts: 0, expires_at },
      { onConflict: 'email,purpose' }
    );
  if (error) throw new Error('OTP save failed: ' + error.message);
}

/** Fetch the current OTP record (or null). */
async function getOtp(email, purpose) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', email)
    .eq('purpose', purpose)
    .single();
  if (error) return null;
  return data;
}

/** Increment attempts counter, returns new count. */
async function incrementAttempts(email, purpose, current) {
  const { error } = await supabase
    .from(TABLE)
    .update({ attempts: current + 1 })
    .eq('email', email)
    .eq('purpose', purpose);
  if (error) throw new Error('OTP attempt update failed: ' + error.message);
  return current + 1;
}

/** Delete an OTP record (after success, expiry, or too many attempts). */
async function deleteOtp(email, purpose) {
  await supabase.from(TABLE).delete().eq('email', email).eq('purpose', purpose);
}

module.exports = { setOtp, getOtp, incrementAttempts, deleteOtp };
