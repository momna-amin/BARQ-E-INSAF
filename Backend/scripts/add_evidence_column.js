require('dotenv').config();

const sql = `
ALTER TABLE cases ADD COLUMN IF NOT EXISTS evidence JSONB DEFAULT '[]'::jsonb;
ALTER TABLE lawyer_requests ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL;
`;

async function main() {
  console.log('Adding database columns...');
  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    });
    console.log('Status:', res.status);
    console.log('Response:', await res.text());
  } catch (err) {
    console.error('Error running query:', err.message);
  }
}
main();
