const { createClient } = require('@supabase/supabase-js');

let supabase;
const url = process.env.SUPABASE_URL || 'https://hbdgsziimogmjvfatzdc.supabase.co';
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_zJDGL8TTy2SvWonwZPFG5g_AkW2V-6r';

try {
  supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
} catch (e) {
  console.warn('Supabase client init warning:', e.message);
  supabase = null;
}

module.exports = supabase;