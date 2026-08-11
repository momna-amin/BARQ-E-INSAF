const { createClient } = require('@supabase/supabase-js');

<<<<<<< HEAD
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
=======
const supabaseUrl = process.env.SUPABASE_URL || 'https://hbdgsziimogmjvfatzdc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_zJDGL8TTy2SvWonwZPFG5g_AkW2V-6r';

const supabase = createClient(supabaseUrl, supabaseKey);
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169

module.exports = supabase;