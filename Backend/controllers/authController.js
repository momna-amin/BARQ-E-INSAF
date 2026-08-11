'use strict';
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendMail } = require('../utils/mailer');
const { otpEmail, welcomeOtpEmail } = require('../utils/emailTemplates');

// ── In-memory OTP store (replace with Redis/Supabase table before production)
// Vercel serverless = multiple instances, so use Supabase table in prod
const otpStore = new Map();

// ── Token factory ─────────────────────────────────────────────────────────────
function issueTokens(user) {
  const payload = { id: user.id, role: user.role };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' }
  );

  return { accessToken, refreshToken };
}

// ── Register ──────────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, district, sbcNumber, specialty } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    const { data: existing } = await supabase
      .from('users').select('id').eq('email', cleanEmail).single();

    if (existing) return res.status(400).json({ message: 'Aapka email pehle se registered hai. Please Login karein.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email: cleanEmail, password: hashedPassword, role: role || 'citizen', phone, district }])
      .select().single();

    if (error) return res.status(500).json({ message: error.message });

    if (role === 'lawyer') {
      if (!sbcNumber || !specialty) {
        return res.status(400).json({ message: 'SBC number and specialty required' });
      }
      await supabase.from('lawyers').insert([{
        user_id: user.id, sbc_number: sbcNumber, specialty, district,
      }]);
    }

    // Send Welcome Verification OTP Email to user's Gmail!
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanEmail, { otp, expires: Date.now() + 10 * 60 * 1000, attempts: 0 });

    const mailData = welcomeOtpEmail(user.name, otp);
    sendMail({ to: cleanEmail, subject: mailData.subject, html: mailData.html })
      .catch((err) => console.error('Registration OTP mail error:', err.message));

    const tokens = issueTokens(user);
    return res.status(201).json({
      id: user.id, name: user.name, email: user.email, role: user.role,
      otpSent: true,
      token: tokens.accessToken, // keep 'token' for existing frontend compat
      ...tokens,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPw    = (password || '').trim();

    // Super Admin hardcoded fallback
    if (cleanEmail === 'admin@barqeinsaf.pk') {
      const validAdminPws = ['superadmin@barq2026!', 'admin@barq2026!', 'admin@123'];
      if (validAdminPws.includes(cleanPw.toLowerCase())) {
        const fakeAdmin = { id: 'admin-001', role: 'admin' };
        const tokens = issueTokens(fakeAdmin);
        return res.json({
          id: 'admin-001', name: 'Asad Khan (Super Admin)',
          email: 'admin@barqeinsaf.pk', role: 'admin',
          token: tokens.accessToken, ...tokens,
        });
      }
    }

    const { data: user, error } = await supabase
      .from('users').select('*').eq('email', cleanEmail).single();

    if (error || !user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(cleanPw, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const tokens = issueTokens(user);
    return res.json({
      id: user.id, name: user.name, email: user.email, role: user.role,
      token: tokens.accessToken, // backward compat
      ...tokens,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── Get Me ────────────────────────────────────────────────────────────────────
// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
// POST /api/auth/refresh
const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const { data: user, error } = await supabase
      .from('users').select('*').eq('id', payload.id).single();

    if (error || !user) return res.status(401).json({ message: 'Invalid session' });

    const tokens = issueTokens(user);
    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
      token: tokens.accessToken,
    });
  } catch {
    return res.status(401).json({ message: 'Session expire ho gayi — dobara login karein' });
  }
};

// ── Forgot Password — Send OTP ────────────────────────────────────────────────
// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const { data: user } = await supabase
      .from('users').select('id, name').eq('email', email.toLowerCase()).single();

    // Security: don't reveal if email exists
    if (!user) return res.json({ message: 'Agar account maujood hai to OTP bheja ja raha hai' });

    // 6-digit unique OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email.toLowerCase(), {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    const { subject, html } = otpEmail(user.name, otp);
    await sendMail({ to: email, subject, html });

    return res.json({ message: 'OTP aapki email pe bheja gaya hai' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ── Verify OTP ────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email aur OTP dono zaruri hain' });

  const key = email.toLowerCase();
  const record = otpStore.get(key);

  if (!record) return res.status(400).json({ message: 'Pehle OTP request karein' });
  if (Date.now() > record.expires) {
    otpStore.delete(key);
    return res.status(400).json({ message: 'OTP expire ho gaya — naya OTP mangaen' });
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(key);
    return res.status(429).json({ message: 'Zyada galat koshishein — dobara OTP request karein' });
  }

  if (record.otp !== otp.toString()) {
    return res.status(400).json({ message: 'Galat OTP — dobara koshish karein' });
  }

  // OTP correct → issue short-lived reset token
  otpStore.delete(key);
  const resetToken = jwt.sign(
    { email: key },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  return res.json({ message: 'OTP sahi hai', resetToken });
};

// ── Reset Password ────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'resetToken aur newPassword zaruri hain' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password kam az kam 8 characters ka hona chahiye' });
    }

    const { email } = jwt.verify(
      resetToken,
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
    );

    const hashed = await bcrypt.hash(newPassword, 10);
    await supabase.from('users').update({ password: hashed }).eq('email', email);

    return res.json({ message: 'Password update ho gaya — ab login karein' });
  } catch {
    return res.status(400).json({ message: 'Reset link expire ho gaya — dobara start karein' });
  }
};

// ── Google OAuth ──────────────────────────────────────────────────────────────
// POST /api/auth/google
// Body: { idToken: string, role: 'citizen'|'lawyer'|'admin' }
const googleAuth = async (req, res) => {
  try {
    const { idToken, role } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();
    const cleanEmail = email.toLowerCase();

    // Find or create user scoped to the role
    let { data: user } = await supabase
      .from('users').select('*').eq('email', cleanEmail).single();

    if (!user) {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({ email: cleanEmail, name, avatar: picture, role: role || 'citizen', provider: 'google' })
        .select().single();
      if (error) return res.status(500).json({ message: error.message });
      user = newUser;
    }

    const tokens = issueTokens(user);
    return res.json({
      id: user.id, name: user.name, email: user.email, role: user.role,
      token: tokens.accessToken, ...tokens,
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(401).json({ message: 'Google sign-in fail ho gaya — dobara koshish karein' });
  }
};

module.exports = { register, login, getMe, refreshToken, forgotPassword, verifyOtp, resetPassword, googleAuth };
