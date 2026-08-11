'use strict';
/**
 * otpStore.js
 * Dual-mode OTP store: Uses Supabase `otp_codes` table if present,
 * with an in-memory Map fallback so it never fails even if DB table is pending.
 */
const supabase = require('../config/supabase');

const TABLE = 'otp_codes';
const memoryStore = new Map();

/** Create/replace an OTP for a given email + purpose. */
async function setOtp(email, purpose, otp, ttlMs = 10 * 60 * 1000, payload = null) {
  const expires_at = new Date(Date.now() + ttlMs).toISOString();
  const key = `${email}:${purpose}`;
  
  memoryStore.set(key, { email, purpose, otp, payload, attempts: 0, expires_at: new Date(Date.now() + ttlMs) });

  try {
    await supabase.from(TABLE).upsert(
      { email, purpose, otp, payload, attempts: 0, expires_at },
      { onConflict: 'email,purpose' }
    );
  } catch (e) {
    console.warn('Supabase otp_codes fallback to memory:', e.message);
  }
}

/** Fetch the current OTP record (or null). */
async function getOtp(email, purpose) {
  const key = `${email}:${purpose}`;
  
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .eq('purpose', purpose)
      .single();
    if (!error && data) return data;
  } catch {
    /* fallback */
  }

  const mem = memoryStore.get(key);
  if (!mem) return null;
  return {
    ...mem,
    expires_at: typeof mem.expires_at === 'string' ? mem.expires_at : mem.expires_at.toISOString()
  };
}

/** Increment attempts counter, returns new count. */
async function incrementAttempts(email, purpose, current) {
  const key = `${email}:${purpose}`;
  const mem = memoryStore.get(key);
  if (mem) mem.attempts = current + 1;

  try {
    await supabase.from(TABLE).update({ attempts: current + 1 }).eq('email', email).eq('purpose', purpose);
  } catch { /* noop */ }
  
  return current + 1;
}

/** Delete an OTP record. */
async function deleteOtp(email, purpose) {
  const key = `${email}:${purpose}`;
  memoryStore.delete(key);

  try {
    await supabase.from(TABLE).delete().eq('email', email).eq('purpose', purpose);
  } catch { /* noop */ }
}

module.exports = { setOtp, getOtp, incrementAttempts, deleteOtp };
