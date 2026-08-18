'use strict';
const router = require('express').Router();
const supabase = require('../config/supabase');
const { protect, allowRoles } = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');
const { requestToLawyer, responseToUser, adminNotify } = require('../utils/emailTemplates');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/requests
// User sends a consultation request to a lawyer
// → inserts DB record + emails lawyer
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, allowRoles('citizen', 'user'), async (req, res) => {
  try {
    const { lawyerId, reason, caseId } = req.body;
    const user = req.user;

    if (!lawyerId) return res.status(400).json({ message: 'lawyerId is required' });

    // Fetch lawyer + their user record (we need email)
    const { data: lawyerRow, error: le } = await supabase
      .from('lawyers')
      .select('*, users(id, name, email, phone, district)')
      .eq('id', lawyerId)
      .single();

    if (le || !lawyerRow) return res.status(404).json({ message: 'Lawyer not found' });

    // Prevent duplicate pending requests
    const { data: existing } = await supabase
      .from('lawyer_requests')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('lawyer_id', lawyerId)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return res.status(409).json({ message: 'Aapki request pehle se pending hai — dobara bhejne ki zaroorat nahi' });
    }

    // Insert request
    const { data: request, error: re } = await supabase
      .from('lawyer_requests')
      .insert({ user_id: user.id, lawyer_id: lawyerId, status: 'pending', reason: reason || null, case_id: caseId || null })
      .select()
      .single();

    if (re) return res.status(500).json({ message: re.message });

    // Email to lawyer — fire-and-forget (don't delay response)
    const lawyerEmail = lawyerRow.users?.email;
    if (lawyerEmail) {
      const { subject, html } = requestToLawyer(
        lawyerRow.users?.name || 'Advocate',
        user.name,
        user.phone,
        user.district,
        user.email
      );
      sendMail({ to: lawyerEmail, subject, html }).catch((err) =>
        console.error('Lawyer email failed:', err.message)
      );
    }

    return res.status(201).json({ message: 'Request bhej di gayi — lawyer ko email bhi send kar di', request });
  } catch (err) {
    console.error('POST /api/requests error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/requests/:id
// Lawyer accepts or rejects a request
// → updates DB + emails user + emails admin + creates in-app notification
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id', protect, allowRoles('lawyer'), async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { id } = req.params;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status 'accepted' ya 'rejected' hona chahiye" });
    }

    // Update request + fetch joined user/lawyer data in one shot
    const { data: request, error } = await supabase
      .from('lawyer_requests')
      .update({ status, reason: reason || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        users:user_id ( id, name, email, phone, district ),
        lawyers:lawyer_id ( id, sbc_number, specialty,
          lawyer_users:user_id ( name, email ) ),
        cases:case_id ( id, title )
      `)
      .single();

    if (error || !request) return res.status(404).json({ message: 'Request nahi mili' });

    const userName = request.users?.name || 'User';
    const userEmail = request.users?.email;
    const lawyerName = request.lawyers?.lawyer_users?.name || 'Advocate';

    // 1) In-app notification (for bell/badge in app)
    await supabase.from('notifications').insert({
      user_id: request.user_id,
      title: `Request ${status === 'accepted' ? 'Qabool' : 'Reject'} Ho Gayi`,
      body: reason
        ? `Advocate ${lawyerName}: ${reason}`
        : `Advocate ${lawyerName} ne aapki request ${status} kar di hai.`,
      type: 'request_update',
    });

    // 1b) Auto-create or assign case if accepted
    if (status === 'accepted') {
      if (request.case_id) {
        await supabase
          .from('cases')
          .update({ 
            lawyer_id: request.lawyer_id, 
            status: 'active'
          })
          .eq('id', request.case_id);
      } else {
        await supabase.from('cases').insert({
          citizen_id: request.user_id,
          lawyer_id: request.lawyer_id,
          title: `Consultation with Adv. ${lawyerName}`,
          type: 'Consultation',
          description: request.reason || 'Consultation request accepted.',
          status: 'active',
          district: request.users?.district || null,
        });
      }
    }

    const caseInfo = request.case_id ? { id: request.case_id, title: request.cases?.title || 'Case' } : null;

    // 2) Email to user
    if (userEmail) {
      const { subject, html } = responseToUser(userName, lawyerName, status, reason, caseInfo);
      sendMail({ to: userEmail, subject, html }).catch((err) =>
        console.error('User email failed:', err.message)
      );
    }

    // 3) Email to admin
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminEmail) {
      const { subject, html } = adminNotify(userName, lawyerName, status, reason, caseInfo);
      sendMail({ to: adminEmail, subject, html }).catch((err) =>
        console.error('Admin email failed:', err.message)
      );
    }

    return res.json({ message: 'Request update ho gayi', request });
  } catch (err) {
    console.error('PATCH /api/requests/:id error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/requests/incoming
// Lawyer sees all pending requests for them
// ─────────────────────────────────────────────────────────────────────────────
router.get('/incoming', protect, allowRoles('lawyer'), async (req, res) => {
  try {
    // Find lawyer row for current user
    const { data: lawyerRow } = await supabase
      .from('lawyers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!lawyerRow) return res.status(404).json({ message: 'Lawyer profile nahi mila' });

    const { data, error } = await supabase
      .from('lawyer_requests')
      .select('*, users:user_id ( name, email, phone, district ), cases:case_id ( id, title, type, description, district, evidence )')
      .eq('lawyer_id', lawyerRow.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/requests/my
// User sees their own request history
// ─────────────────────────────────────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lawyer_requests')
      .select(`
        *,
        cases:case_id ( id, title, type, description ),
        lawyers:lawyer_id (
          id, sbc_number, specialty,
          lawyer_users:user_id ( name )
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/notifications
// User fetches their in-app notifications
// ─────────────────────────────────────────────────────────────────────────────
router.get('/notifications', protect, async (req, res) => {
  try {
    const unreadOnly = req.query.unread === 'true';
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) query = query.eq('is_read', false);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PATCH /api/requests/notifications/:id/read  — mark one notification as read
router.patch('/notifications/:id/read', protect, async (req, res) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ message: error.message });
  return res.json({ message: 'Notification read mark ho gayi' });
});

module.exports = router;
