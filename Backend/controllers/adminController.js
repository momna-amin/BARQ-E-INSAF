const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer');
const { lawyerDecisionEmail, accountStatusEmail } = require('../utils/emailTemplates');
const fallbackDb = require('../utils/fallbackDb');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    if (supabase) {
      const [users, lawyers, cases, flagged, pending] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('lawyers').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('cases').select('id', { count: 'exact', head: true }),
        supabase.from('cases').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
        supabase.from('lawyers').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      ]);

      if (!users.error && !lawyers.error) {
        return res.json({
          totalUsers:     users.count ?? 0,
          totalLawyers:   lawyers.count ?? 0,
          totalCases:     cases.count ?? 0,
          flaggedCases:   flagged.count ?? 0,
          pendingLawyers: pending.count ?? 0,
        });
      }
    }
  } catch (error) {
    // Supabase query failed, fall back
  }

  // Graceful fallback from fallbackDb
  return res.json(fallbackDb.getStats());
};

// GET /api/admin/pending-lawyers
const getPendingLawyers = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('lawyers')
        .select('*, user:user_id(id, name, email, phone, district, cnic)')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json(data);
      }
    }
  } catch (error) {
    // Supabase query failed, fall back
  }

  return res.json(fallbackDb.getPendingLawyers());
};

// PUT /api/admin/lawyers/:id/verify
const verifyLawyer = async (req, res) => {
  try {
    const { status, reason } = req.body;
    let data = null;

    if (supabase) {
      try {
        const resDb = await supabase
          .from('lawyers')
          .update({
            verification_status: status,
            is_verified: status === 'approved',
          })
          .eq('id', req.params.id)
          .select('*, user:user_id(id, name, email)')
          .single();
        if (!resDb.error && resDb.data) {
          data = resDb.data;
        }
      } catch (e) { /* ignore */ }
    }

    // Always update fallbackDb
    const fallbackLawyer = fallbackDb.verifyLawyer(req.params.id, status);
    if (!data && fallbackLawyer) {
      data = fallbackLawyer;
    }

    if (!data) {
      return res.status(404).json({ message: 'Lawyer record not found' });
    }

    // Send decision email to lawyer
    const lawyerEmail = data.user?.email || data.email;
    const lawyerName = data.user?.name || data.name || 'Advocate';
    if (lawyerEmail) {
      const { subject, html } = lawyerDecisionEmail(lawyerName, status, reason);
      sendMail({ to: lawyerEmail, subject, html }).catch(e => console.warn('lawyer decision mail:', e.message));
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
    res.json({ activity: [] });
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
  const role = req.query.role;

  try {
    if (supabase) {
      let q = supabase
        .from('users')
        .select('*, lawyers(*)')
        .order('created_at', { ascending: false });
      if (role) q = q.eq('role', role);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return res.json(data);
    }
  } catch (error) {
    // fallback
  }

  if (role === 'lawyer') {
    return res.json(fallbackDb.getAllLawyerUsers());
  }

  const lawyers = fallbackDb.getAllLawyerUsers();
  return res.json([
    { id: '1', name: 'Asad Khan', email: 'itshappyday777@gmail.com', role: 'admin' },
    ...lawyers,
    { id: '6', name: 'Muhammad Usman', email: 'usman@gmail.com', role: 'citizen' },
    { id: '7', name: 'Fatima Zahra', email: 'fatima.z@gmail.com', role: 'citizen' }
  ]);
};

// GET /api/admin/cases
const getAllCases = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('cases')
        .select('*, citizen:citizen_id(name, email), lawyer:lawyer_id(*, user:user_id(name, email))')
        .order('created_at', { ascending: false });
      if (!error && data) return res.json(data);
    }
  } catch (error) {
    // fallback
  }
  return res.json([]);
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