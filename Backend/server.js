const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/lawyers', require('./routes/lawyers'));
app.use('/api/cases',   require('./routes/cases'));
app.use('/api/admin',   require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: 'Barq-e-Insaf API running with Supabase' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));