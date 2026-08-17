const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Database self-migration (runs automatically on Vercel start)
const supabase = require('./config/supabase');
const runDbMigration = async () => {
  try {
    const sql = `
      ALTER TABLE cases ADD COLUMN IF NOT EXISTS evidence JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE lawyer_requests ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL;
      UPDATE lawyers SET is_verified = true;
      NOTIFY pgrst, 'reload schema';
    `;
    const { error } = await supabase.rpc('exec_sql', { query: sql });
    if (error) {
      console.log('Migration RPC log (can be ignored if already ran):', error.message);
    } else {
      console.log('Database migration successfully ran (added evidence and case_id columns).');
    }
  } catch (err) {
    console.error('Migration failed to execute:', err.message);
  }
};
runDbMigration();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/lawyers',  require('./routes/lawyers'));
app.use('/api/cases',    require('./routes/cases'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/requests', require('./routes/requests')); // Lawyer request flow + notifications
app.use('/api/evidence', require('./routes/evidence'));
app.use('/api/schedules',require('./routes/schedules'));

app.get('/', (req, res) => {
  res.json({ message: 'Barq-e-Insaf API running with Supabase & Live Vercel' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;