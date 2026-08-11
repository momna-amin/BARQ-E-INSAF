const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'BARQ_DEFAULT_SECRET', { expiresIn: '30d' });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, district, sbcNumber, specialty } = req.body;

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role, phone, district }])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    // If lawyer, create lawyer profile
    if (role === 'lawyer') {
      if (!sbcNumber || !specialty) {
        return res.status(400).json({ message: 'SBC number and specialty required' });
      }
      await supabase.from('lawyers').insert([{
        user_id: user.id,
        sbc_number: sbcNumber,
        specialty,
        district,
      }]);
    }

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPw    = (password || '').trim();

    // SUPER ADMIN FALLBACK DIRECT CHECK
    if (cleanEmail === 'admin@barqeinsaf.pk') {
      const validAdminPws = ['superadmin@barq2026!', 'admin@barq2026!', 'admin@123'];
      if (validAdminPws.includes(cleanPw.toLowerCase())) {
        return res.json({
          id: 'admin-001',
          name: 'Asad Khan (Super Admin)',
          email: 'admin@barqeinsaf.pk',
          role: 'admin',
          token: generateToken('admin-001'),
        });
      }
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(cleanPw, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
