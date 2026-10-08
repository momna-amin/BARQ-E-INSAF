const { createClient } = require('@supabase/supabase-js');

function createMockSupabase() {
  const chainable = (defaultData = null) => {
    const handler = {
      get(target, prop) {
        if (prop === 'then') {
          return (resolve) => resolve({ data: defaultData, error: { message: 'Database fallback active' }, count: 0 });
        }
        if (prop === 'catch') {
          return (reject) => {};
        }
        return (...args) => new Proxy({}, handler);
      }
    };
    return new Proxy({}, handler);
  };

  return {
    from: () => chainable(),
    rpc: () => Promise.resolve({ data: null, error: { message: 'Database fallback active' } }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Offline' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Offline' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Offline' } })
    }
  };
}

let supabase = null;
const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Connect to real Supabase only if valid non-placeholder URL is configured
if (url && !url.includes('hbdgsziimogmjvfatzdc') && key) {
  try {
    supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  } catch (e) {
    console.warn('Supabase client init warning:', e.message);
    supabase = createMockSupabase();
  }
} else {
  // Ultra-fast in-memory mock client (0ms response, zero network delay)
  supabase = createMockSupabase();
}

module.exports = supabase;