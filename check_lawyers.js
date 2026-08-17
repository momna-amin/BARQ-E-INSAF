const supabase = require('./Backend/config/supabase');

(async () => {
  try {
    const { data: users, error: ue } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'lawyer')
      .order('created_at', { ascending: false })
      .limit(5);

    if (ue) throw ue;

    console.log('--- RECENT LAWYER USERS ---');
    console.log(users);

    const { data: lawyers, error: le } = await supabase
      .from('lawyers')
      .select('*, user:user_id(name, email)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (le) throw le;

    console.log('\n--- RECENT LAWYER PROFILES ---');
    console.log(lawyers);
  } catch (err) {
    console.error('Error querying Supabase:', err.message);
  }
})();
