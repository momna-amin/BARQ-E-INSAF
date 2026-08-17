'use strict';
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailer');
const { otpEmail, welcomeOtpEmail } = require('../utils/emailTemplates');
const otpStore = require('../utils/otpStore');

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

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register  (direct register, no OTP — kept for backward compat)
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
          bar_council: 'Sindh Bar Council',
          experience_years: 1,
          verification_status: 'pending',
          cnic: cnic || null,
        });

      if (lawyerError) {
        console.error('Lawyer profile creation error:', lawyerError.message);
      }
    }

    // ── Issue tokens
    const tokens = issueTokens(user);

    return res.status(201).json({
      message: 'Account successfully create ho gaya!',
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
// POST /api/auth/send-register-otp  — Step 1 of signup: email OTP
// Body: { name, email, password, role, phone, district, cnic, sbcNumber?, specialty? }
// ──────────────────────────────────────────────────────────────────────────────
const sendRegisterOtp = async (req, res) => {
  try {
    const { name, email, password, role, phone, district, cnic, sbcNumber, specialty, resend } = req.body;

    if (!email) return res.status(400).json({ message: 'Email zaroori hai' });
    const cleanEmail = email.trim().toLowerCase();

    if (resend) {
      const existingRecord = await otpStore.getOtp(cleanEmail, 'register');
      if (!existingRecord) {
        return res.status(400).json({ message: 'Session expire ho gayi — please form dobara submit karein.' });
      }
      const otp = generateOtp();
      await otpStore.setOtp(cleanEmail, 'register', otp, 10 * 60 * 1000, existingRecord.payload);
      const { subject, html } = welcomeOtpEmail(existingRecord.payload.name, otp);
      await sendMail({ to: cleanEmail, subject, html });
      return res.json({ message: 'OTP dobara bhej diya gaya' });
    }

    if (!name || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password aur role zaroori hain' });
    }

    const cleanRole = role.trim().toLowerCase();

    if (cleanRole === 'lawyer' && (!sbcNumber || !specialty)) {
      return res.status(400).json({ message: 'Lawyer registration ke liye SBC Number aur Specialty zaroori hai' });
    }

    const { data: existing } = await supabase
      .from('users').select('id').eq('email', cleanEmail).single();
    if (existing) {
      return res.status(409).json({
        message: `Yeh email (${cleanEmail}) pehle se registered hai. Please Login karein.`
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await otpStore.setOtp(cleanEmail, 'register', otp, 10 * 60 * 1000, {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: cleanRole,
      phone: phone || null,
      district: district || null,
      cnic: cnic || null,
      sbcNumber: sbcNumber || null,
      specialty: specialty || null,
    });

    const { subject, html } = welcomeOtpEmail(name.trim(), otp);
    await sendMail({ to: cleanEmail, subject, html });

    return res.json({ message: 'OTP aapki email pe bhej diya gaya hai (10 minute valid)' });
  } catch (err) {
    console.error('sendRegisterOtp error:', err);
    return res.status(500).json({ message: err.message || 'OTP bhejte waqt masla hua' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-register-otp — Step 2 of signup: verify + create account
// Body: { email, otp }
// ──────────────────────────────────────────────────────────────────────────────
const verifyRegisterOtpAndCreate = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email aur OTP dono chahiye' });

    const cleanEmail = email.trim().toLowerCase();
    const record = await otpStore.getOtp(cleanEmail, 'register');

    if (!record) {
      return res.status(400).json({ message: 'Pehle OTP request karein' });
    }
    if (new Date(record.expires_at).getTime() < Date.now()) {
      await otpStore.deleteOtp(cleanEmail, 'register');
      return res.status(400).json({ message: 'OTP expire ho gaya — naya OTP mangaein' });
    }
    if (record.attempts >= 5) {
      await otpStore.deleteOtp(cleanEmail, 'register');
      return res.status(429).json({ message: 'Zyada galat koshishein — dobara OTP mangaein' });
    }
    if (record.otp !== otp.toString().trim()) {
      const attempts = await otpStore.incrementAttempts(cleanEmail, 'register', record.attempts);
      return res.status(400).json({ message: `Galat OTP (${Math.max(0, 5 - attempts)} koshishein baqi)` });
    }

    const p = record.payload;

    const { data: existing } = await supabase
      .from('users').select('id').eq('email', cleanEmail).single();
    if (existing) {
      await otpStore.deleteOtp(cleanEmail, 'register');
      return res.status(409).json({ message: 'Yeh email pehle se registered hai. Please Login karein.' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: p.name,
        email: p.email,
        password: p.password,
        role: p.role,
        phone: p.phone,
        district: p.district,
        cnic: p.cnic,
        is_verified: true,
        provider: 'email',
      })
      .select()
      .single();

    if (userError) {
      console.error('verifyRegisterOtpAndCreate DB error:', userError);
      return res.status(500).json({ message: 'Account create nahi ho saka: ' + userError.message });
    }

    if (p.role === 'lawyer') {
      const { error: lawyerError } = await supabase
        .from('lawyers')
        .insert({
          user_id: user.id,
          sbc_number: p.sbcNumber,
          specialty: p.specialty,
          bar_council: 'Sindh Bar Council',
          experience_years: 1,
          verification_status: 'pending',
        });
      if (lawyerError) console.error('Lawyer profile creation error:', lawyerError.message);
    }

    await otpStore.deleteOtp(cleanEmail, 'register');

    return res.status(201).json({
      message: 'Account successfully create ho gaya!',
      ...safeUser(user),
    });
  } catch (err) {
    console.error('verifyRegisterOtpAndCreate error:', err);
    return res.status(500).json({ message: err.message || 'OTP verification fail ho gaya' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email aur password dono darj karein' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPw    = password.trim();

    // ── Super Admin hardcoded fast-path (always works)
    if (['itshappyday777@gmail.com', 'admin@barqeinsaf.pk'].includes(cleanEmail)) {
      const validAdminPasswords = [
        'SuperAdmin@barq2026!', 'superadmin@barq2026!', 'Admin@barq2026!', 'admin@barq2026!'
      ];
      if (validAdminPasswords.some(p => p === cleanPw || p.toLowerCase() === cleanPw.toLowerCase())) {
        const { data: adminUser } = await supabase
          .from('users').select('*').eq('email', cleanEmail).single();

        const user = adminUser || {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Asad Khan (Super Admin)',
          email: cleanEmail,
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

    // ── Reject if this account's real role doesn't match the portal used to log in
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `❌ Yeh account "${user.role}" hai. Barah-e-karam "${user.role}" portal se login karein.`
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
const getMe = async (req, res) => {
  try {
    const user = safeUser(req.user);
    if (req.user.role === 'lawyer') {
      let { data: lawyer, error } = await supabase
        .from('lawyers')
        .select('*')
        .eq('user_id', req.user.id)
        .single();

      if (error || !lawyer) {
        // Auto-create lawyer profile if missing in database
        const { data: newLawyer, error: createError } = await supabase
          .from('lawyers')
          .insert({
            user_id: req.user.id,
            sbc_number: 'SBC-' + Math.floor(1000 + Math.random() * 9000),
            specialty: 'General Practice',
            verification_status: 'approved',
            cnic: req.user.cnic || null,
          })
          .select()
          .single();

        if (!createError && newLawyer) {
          lawyer = newLawyer;
        } else {
          console.error('Failed to auto-create lawyer profile:', createError?.message);
        }
      }
      return res.json({ ...user, lawyer_profile: lawyer });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

    if (!user) {
      return res.json({ message: 'Agar account hai toh OTP email pe aa jayega' });
    }

    const otp = generateOtp();
    await otpStore.setOtp(cleanEmail, 'reset-password', otp, 10 * 60 * 1000);

    const { subject, html } = otpEmail(user.name, otp);
    await sendMail({ to: cleanEmail, subject, html });

    return res.json({ message: 'OTP aapki email pe bhej diya gaya (10 minute valid)' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: err.message || 'OTP bhejte waqt masla hua' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp  — Step 2: Verify OTP
// ──────────────────────────────────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email aur OTP dono chahiye' });

    const key = email.trim().toLowerCase();
    const record = await otpStore.getOtp(key, 'reset-password');

    if (!record) return res.status(400).json({ message: 'Pehle OTP request karein' });
    if (new Date(record.expires_at).getTime() < Date.now()) {
      await otpStore.deleteOtp(key, 'reset-password');
      return res.status(400).json({ message: 'OTP expire ho gaya — naya OTP mangaein' });
    }
    if (record.attempts >= 5) {
      await otpStore.deleteOtp(key, 'reset-password');
      return res.status(429).json({ message: 'Zyada galat koshishein — dobara OTP mangaein' });
    }
    if (record.otp !== otp.toString().trim()) {
      const attempts = await otpStore.incrementAttempts(key, 'reset-password', record.attempts);
      return res.status(400).json({ message: `Galat OTP (${Math.max(0, 5 - attempts)} koshishein baqi)` });
    }

    await otpStore.deleteOtp(key, 'reset-password');
    const resetToken = jwt.sign(
      { email: key },
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    return res.json({ message: 'OTP sahi hai', resetToken });
  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ message: err.message || 'OTP verify karte waqt masla hua' });
  }
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
    const { error } = await supabase.from('users').update({ password: hashed }).eq('email', email);
    if (error) {
      console.error('resetPassword DB error:', error);
      return res.status(500).json({ message: 'Password update nahi ho saka: ' + error.message });
    }

    return res.json({ message: 'Password update ho gaya — ab login karein' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(400).json({ message: 'Reset link expire — dobara start karein' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/change-password  — logged-in user changes their own password
// (req.user comes from the `protect` middleware — this route must be protected)
// ──────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Purana aur naya password dono zaroori hain' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Naya password kam az kam 8 characters ka hona chahiye' });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users').select('id, password').eq('id', req.user.id).single();

    if (fetchError || !user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'Yeh account Google se bana hai — is mein password change nahi ho sakta' });
    }

    const isMatch = await bcrypt.compare(oldPassword.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Purana password galat hai' });
    }

    const hashed = await bcrypt.hash(newPassword.trim(), 10);
    const { error: updateError } = await supabase
      .from('users').update({ password: hashed }).eq('id', req.user.id);

    if (updateError) {
      return res.status(500).json({ message: 'Password update nahi ho saka: ' + updateError.message });
    }

    return res.json({ message: 'Password successfully update ho gaya' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ message: err.message || 'Password change karte waqt masla hua' });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/google  — Google OAuth (disabled until GOOGLE_CLIENT_ID is set)
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
        .insert({ email: cleanEmail, name, avatar: picture, role: role || 'citizen', provider: 'google', is_verified: true })
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

const updateProfile = async (req, res) => {
  try {
    const { name, phone, district, specialty, office_address, bio, is_available } = req.body;

    const { data: user, error: userErr } = await supabase
      .from('users')
      .update({ name, phone, district })
      .eq('id', req.user.id)
      .select()
      .single();

    if (userErr) return res.status(500).json({ message: userErr.message });

    if (req.user.role === 'lawyer') {
      const updateData = { specialty, office_address, bio, district };
      if (is_available !== undefined) {
        updateData.is_available = is_available;
      }

      const { data: lawyer, error: lawyerErr } = await supabase
        .from('lawyers')
        .update(updateData)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (lawyerErr) return res.status(500).json({ message: lawyerErr.message });
      return res.json({ ...safeUser(user), lawyer_profile: lawyer });
    }

    return res.json(safeUser(user));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  sendRegisterOtp,
  verifyRegisterOtpAndCreate,
  login,
  getMe,
  refreshToken,
  forgotPassword,
  verifyOtp,
  resetPassword,
  googleAuth,
  changePassword,
  updateProfile,
};
