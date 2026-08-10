const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://hbdgsziimogmjvfatzdc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_zJDGL8TTy2SvWonwZPFG5g_AkW2V-6r';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;