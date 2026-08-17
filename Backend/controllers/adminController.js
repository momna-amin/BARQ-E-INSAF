const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer');
const { lawyerDecisionEmail, accountStatusEmail } = require('../utils/emailTemplates');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [users, lawyers, cases, flagged, pending] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('lawyers').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      supabase.from('cases').select('id', { count: 'exact', head: true }),
      supabase.from('cases').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
      supabase.from('lawyers').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    ]);

    res.json({
      totalUsers:     users.count ?? 0,
      totalLawyers:   lawyers.count ?? 0,
      totalCases:     cases.count ?? 0,
      flaggedCases:   flagged.count ?? 0,
      pendingLawyers: pending.count ?? 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/pending-lawyers
const getPendingLawyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lawyers')
      .select('*, user:user_id(id, name, email, phone, district, cnic)')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/lawyers/:id/verify
const verifyLawyer = async (req, res) => {
  try {
    const { status, reason } = req.body;

    const { data, error } = await supabase
      .from('lawyers')
      .update({
        verification_status: status,
        is_verified: status === 'approved',
      })
      .eq('id', req.params.id)
      .select('*, user:user_id(id, name, email)')
      .single();

    if (error) return res.status(500).json({ message: error.message });

    // Send decision email to lawyer
    const lawyerEmail = data.user?.email;
    if (lawyerEmail) {
      const { subject, html } = lawyerDecisionEmail(data.user.name, status, reason);
      sendMail({ to: lawyerEmail, subject, html }).catch(e => console.error('lawyer decision mail:', e.message));
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/recent-activity
// Live feed: newest signups + newest consultation requests (any status)
const getRecentActivity = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 15;

    const [recentUsers, recentRequests] = await Promise.all([
      supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('lawyer_requests')
        .select(`
          id, status, reason, created_at, updated_at,
          users:user_id ( id, name, email ),
          lawyers:lawyer_id ( id, lawyer_users:user_id ( name, email ) )
        `)
        .order('created_at', { ascending: false })
        .limit(limit),
    ]);

    const signupEvents = (recentUsers.data || []).map((u) => ({
      type: 'signup',
      id: `signup-${u.id}`,
      title: `${u.role === 'lawyer' ? 'Lawyer' : u.role === 'ngo' ? 'NGO' : 'Citizen'} signed up`,
      detail: `${u.name} (${u.email})`,
      status: null,
      timestamp: u.created_at,
    }));

    const requestEvents = (recentRequests.data || []).map((r) => ({
      type: 'consultation_request',
      id: `req-${r.id}`,
      title:
        r.status === 'pending'
          ? 'New consultation request'
          : `Consultation request ${r.status}`,
      detail: `${r.users?.name || 'User'} → ${r.lawyers?.lawyer_users?.name || 'Advocate'}${r.reason ? ` (${r.reason})` : ''}`,
      status: r.status,
      userId: r.users?.id,
      lawyerId: r.lawyers?.id,
      timestamp: r.updated_at || r.created_at,
    }));

    const feed = [...signupEvents, ...requestEvents]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({ activity: feed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/flagged-cases
const getFlaggedCases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*, citizen:citizen_id(id, name, email)')
      .eq('is_flagged', true);

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body;
    const adminEmail = email || 'admin@barqeinsaf.pk';

    const updates = {};
    if (name) updates.name = name;
    if (avatarUrl) updates.avatar_url = avatarUrl;
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    try {
      await supabase
        .from('users')
        .update(updates)
        .eq('email', adminEmail);
    } catch (sbErr) {
      console.warn('Supabase admin update warning:', sbErr.message);
    }

    res.json({
      message: 'Admin profile updated successfully',
      admin: {
        name: name || 'Super Admin',
        email: adminEmail,
        avatarUrl: avatarUrl || null,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users?role=
const getAllUsers = async (req, res) => {
  try {
    let q = supabase
      .from('users')
      .select('*, lawyers(*)')
      .order('created_at', { ascending: false });
    if (req.query.role) q = q.eq('role', req.query.role);
    const { data, error } = await q;
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/cases
const getAllCases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*, citizen:citizen_id(name, email), lawyer:lawyer_id(*, user:user_id(name, email))')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/suspend
const suspendUser = async (req, res) => {
  try {
    const { suspended, reason } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({
        is_suspended: suspended,
        suspension_reason: suspended ? (reason || null) : null,
        suspended_at: suspended ? new Date().toISOString() : null,
      })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ message: error.message });

    // Send email notification
    if (data.email) {
      const { subject, html } = accountStatusEmail(data.name, data.role, suspended, reason);
      sendMail({ to: data.email, subject, html }).catch(e => console.error('suspend mail:', e.message));
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity,
  getAllUsers, getAllCases, suspendUser
};