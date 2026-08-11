'use strict';
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailer');
const { otpEmail, welcomeOtpEmail } = require('../utils/emailTemplates');

// ── OTP Store (in-memory, works for single serverless instance)
// For multi-instance Vercel: switch to Supabase table
const otpStore = new Map();

// ── Issue JWT Access + Refresh Token pair ────────────────────────────────────
function issueTokens(user) {
  const payload = { id: user.id, role: user.role, email: user.email };
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

// ── Safe user data (no password in response) ─────────────────────────────────
function safeUser(user) {
  const { password: _, ...safe } = user;
  return safe;
}

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, district, cnic, sbcNumber, specialty } = req.body;

    // ── Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password aur role zaroori hain' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole  = role.trim().toLowerCase();

    // ── Check duplicate
    const { data: existing } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', cleanEmail)
      .single();

    if (existing) {
      return res.status(409).json({
        message: `Yeh email (${cleanEmail}) pehle se registered hai. Please Login karein.`
      });
    }

    // ── Lawyer-specific validation
    if (cleanRole === 'lawyer' && (!sbcNumber || !specialty)) {
      return res.status(400).json({ message: 'Lawyer registration ke liye SBC Number aur Specialty zaroori hai' });
    }

    // ── Hash password + create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: cleanRole,
        phone: phone || null,
        district: district || null,
        cnic: cnic || null,
        is_verified: true,
        provider: 'email',
      })
      .select()
      .single();

    if (userError) {
      console.error('Register DB error:', userError);
      return res.status(500).json({
        message: 'Account create nahi ho saka: ' + userError.message
      });
    }

    // ── Create lawyer profile if role is lawyer
    if (cleanRole === 'lawyer') {
      const { error: lawyerError } = await supabase
        .from('lawyers')
        .insert({
          user_id: user.id,
          sbc_number: sbcNumber,
          specialty,
          district: district || null,
          is_verified: false,         // Admin approval needed
          verification_status: 'pending',
        });

      if (lawyerError) {
        console.error('Lawyer profile error:', lawyerError.message);
        // Don't fail — user is created, lawyer profile can be added later
      }
    }

    // ── Send welcome OTP email (fire-and-forget)
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(cleanEmail, { otp, expires: Date.now() + 10 * 60 * 1000, attempts: 0 });
      const mailData = welcomeOtpEmail(user.name, otp);
      sendMail({ to: cleanEmail, subject: mailData.subject, html: mailData.html })
        .then(() => console.log(`✅ Welcome email sent to ${cleanEmail}`))
        .catch(err => console.error('Welcome email failed:', err.message));
    } catch (mailErr) {
      console.error('Mail setup error:', mailErr.message);
    }

    // ── Issue tokens
    const tokens = issueTokens(user);

    return res.status(201).json({
      message: 'Account successfully create ho gaya! Welcome email bhi bheja gaya hai.',
      ...safeUser(user),
      token: tokens.accessToken,
      ...tokens,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email aur password dono darj karein' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPw    = password.trim();

    // ── Super Admin hardcoded fast-path (always works)
    if (cleanEmail === 'admin@barqeinsaf.pk') {
      const validAdminPasswords = [
        'SuperAdmin@barq2026!', 'superadmin@barq2026!', 'Admin@barq2026!', 'admin@barq2026!'
      ];
      if (validAdminPasswords.some(p => p === cleanPw || p.toLowerCase() === cleanPw.toLowerCase())) {
        // Try DB first, fall back to hardcoded
        const { data: adminUser } = await supabase
          .from('users').select('*').eq('email', cleanEmail).single();

        const user = adminUser || {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Asad Khan (Super Admin)',
          email: 'admin@barqeinsaf.pk',
          role: 'admin',
        };

        const tokens = issueTokens(user);
        return res.json({
          message: 'Admin login successful!',
          id: user.id, name: user.name, email: user.email, role: user.role,
          token: tokens.accessToken, ...tokens,
        });
      }
    }

    // ── Fetch user from Supabase
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (fetchError || !user) {
      if (fetchError && fetchError.message?.includes('schema cache')) {
        return res.status(500).json({
          message: '⚠️ Database tables abhi Supabase par create nahi huin! Please Supabase SQL Editor mein schema.sql run karein.'
        });
      }
      return res.status(401).json({
        message: `❌ Yeh email (${cleanEmail}) registered nahi hai. Please pehle Account Create karein.`
      });
    }

    // ── Verify password
    if (!user.password) {
      return res.status(401).json({
        message: 'Yeh account Google se bana tha. Please "Continue with Google" use karein.'
      });
    }

    const isMatch = await bcrypt.compare(cleanPw, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: '❌ Password galat hai. Dobara check karein ya "Forgot Password" use karein.'
      });
    }

    // ── Issue tokens
    const tokens = issueTokens(user);

    return res.json({
      message: 'Login successful!',
      ...safeUser(user),
      token: tokens.accessToken,
      ...tokens,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────────────────────────────────────────
const getMe = (req, res) => {
  res.json(safeUser(req.user));
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// ──────────────────────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users').select('*').eq('id', payload.id).single();

    if (error || !user) return res.status(401).json({ message: 'Session invalid — login karein' });

    const tokens = issueTokens(user);
    return res.json({
      ...safeUser(user),
      ...tokens,
      token: tokens.accessToken,
    });
  } catch {
    return res.status(401).json({ message: 'Session expire ho gayi — dobara login karein' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password  — Step 1: Send OTP
// ──────────────────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email darj karein' });

    const cleanEmail = email.trim().toLowerCase();

    const { data: user } = await supabase
      .from('users').select('id, name').eq('email', cleanEmail).single();

    // Don't reveal if email exists (security)
    if (!user) return res.json({ message: 'Agar account hai toh OTP email pe aa jayega' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanEmail, { otp, expires: Date.now() + 10 * 60 * 1000, attempts: 0 });

    const { subject, html } = otpEmail(user.name, otp);
    await sendMail({ to: cleanEmail, subject, html });

    return res.json({ message: 'OTP aapki email pe bhej diya gaya (10 minute valid)' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp  — Step 2: Verify OTP
// ──────────────────────────────────────────────────────────────────────────────
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email aur OTP dono chahiye' });

  const key = email.trim().toLowerCase();
  const record = otpStore.get(key);

  if (!record)              return res.status(400).json({ message: 'Pehle OTP request karein' });
  if (Date.now() > record.expires) {
    otpStore.delete(key);
    return res.status(400).json({ message: 'OTP expire ho gaya — naya OTP mangaein' });
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(key);
    return res.status(429).json({ message: 'Zyada galat koshishein — dobara OTP mangaein' });
  }

  if (record.otp !== otp.toString()) {
    return res.status(400).json({ message: `Galat OTP (${5 - record.attempts + 1} koshishein baqi)` });
  }

  otpStore.delete(key);
  const resetToken = jwt.sign(
    { email: key },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  return res.json({ message: 'OTP sahi hai', resetToken });
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password  — Step 3: Set new password
// ──────────────────────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'resetToken aur newPassword zaroori hain' });
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
    return res.status(400).json({ message: 'Reset link expire — dobara start karein' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/google  — Google OAuth (disabled until configured)
// ──────────────────────────────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({
      message: 'Google login abhi configure nahi hua. Please email/password se login karein.'
    });
  }

  try {
    const { OAuth2Client } = require('google-auth-library');
    const { idToken, role } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();
    const cleanEmail = email.toLowerCase();

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
    return res.json({ ...safeUser(user), token: tokens.accessToken, ...tokens });
  } catch (err) {
    return res.status(401).json({ message: 'Google sign-in fail: ' + err.message });
  }
};

module.exports = { register, login, getMe, refreshToken, forgotPassword, verifyOtp, resetPassword, googleAuth };
