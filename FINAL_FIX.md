# FINAL FIX FILE — apply top to bottom

Note: 3 admin codebases exist (`Frontend/app/(Admin)/*`, `admin-panel/`, `barq-e-insaf-mobile/`). Use ONLY `Frontend/app/(Admin)/*` + `Backend/*`. Delete/ignore `admin-panel/` and `barq-e-insaf-mobile/`.

---

## 0. SQL — run once in Supabase SQL editor

```sql
ALTER TABLE lawyer_requests ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;

ALTER TABLE lawyers ALTER COLUMN verification_status SET DEFAULT 'pending';
ALTER TABLE lawyers ALTER COLUMN is_verified SET DEFAULT false;
```

---

## 1. `Backend/utils/emailTemplates.js`

Replace whole file with uploaded `emailTemplates.js` (already has: `citizenWelcomeEmail`, `lawyerPendingEmail`, `lawyerJoinRequestAdmin`, `lawyerDecisionEmail`, `accountStatusEmail`).

---

## 2. `Backend/controllers/authController.js`

top import — WRONG:
```js
const { otpEmail, welcomeOtpEmail } = require('../utils/emailTemplates');
```
CORRECT:
```js
const { otpEmail, welcomeOtpEmail, citizenWelcomeEmail, lawyerPendingEmail, lawyerJoinRequestAdmin } = require('../utils/emailTemplates');
```

### 2.1 `verifyRegisterOtpAndCreate` — after lawyer insert block, before `otpStore.deleteOtp`

WRONG (current, ends silently):
```js
    if (p.role === 'lawyer') {
      const { error: lawyerError } = await supabase
        .from('lawyers')
        .insert({ ... });
      if (lawyerError) console.error('Lawyer profile creation error:', lawyerError.message);
    }

    await otpStore.deleteOtp(cleanEmail, 'register');
```
CORRECT:
```js
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
          cnic: p.cnic || null,
        });
      if (lawyerError) console.error('Lawyer profile creation error:', lawyerError.message);

      const { subject, html } = lawyerPendingEmail(p.name);
      sendMail({ to: p.email, subject, html }).catch(e => console.error('lawyer pending mail:', e.message));

      const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
      if (adminEmail) {
        const a = lawyerJoinRequestAdmin({ name: p.name, email: p.email, phone: p.phone, sbcNumber: p.sbcNumber, specialty: p.specialty, district: p.district, cnic: p.cnic });
        sendMail({ to: adminEmail, subject: a.subject, html: a.html }).catch(e => console.error('admin notify mail:', e.message));
      }
    } else {
      const { subject, html } = citizenWelcomeEmail(p.name);
      sendMail({ to: p.email, subject, html }).catch(e => console.error('welcome mail:', e.message));
    }

    await otpStore.deleteOtp(cleanEmail, 'register');
```

### 2.2 `login` — add lawyer gate right after password check, before `issueTokens(user)`

WRONG (missing check — jumps straight to):
```js
    // ── Issue tokens
    const tokens = issueTokens(user);
```
CORRECT (insert before that line):
```js
    if (user.role === 'lawyer') {
      const { data: lawyer } = await supabase
        .from('lawyers').select('verification_status').eq('user_id', user.id).single();
      if (!lawyer || lawyer.verification_status === 'pending') {
        return res.status(403).json({ pendingApproval: true, message: 'Aapka account abhi admin approval ka intezaar kar raha hai.' });
      }
      if (lawyer.verification_status === 'rejected') {
        return res.status(403).json({ rejected: true, message: 'Aapki registration reject ho chuki hai.' });
      }
    }
    if (user.is_suspended) {
      return res.status(403).json({ suspended: true, message: `Aapka account suspend hai. Wajah: ${user.suspension_reason || 'N/A'}` });
    }

    // ── Issue tokens
    const tokens = issueTokens(user);
```

### 2.3 `getMe` — auto-create bug

WRONG:
```js
          .insert({
            user_id: req.user.id,
            sbc_number: 'SBC-' + Math.floor(1000 + Math.random() * 9000),
            specialty: 'General Practice',
            verification_status: 'approved',
            cnic: req.user.cnic || null,
            is_verified: true,
          })
```
CORRECT:
```js
          .insert({
            user_id: req.user.id,
            sbc_number: 'SBC-' + Math.floor(1000 + Math.random() * 9000),
            specialty: 'General Practice',
            verification_status: 'pending',
            cnic: req.user.cnic || null,
            is_verified: false,
          })
```

---

## 3. `Backend/routes/requests.js` — PATCH `/api/requests/:id`, email section

WRONG:
```js
    // 2) Email to user
    if (userEmail) {
      const { subject, html } = responseToUser(userName, lawyerName, status, reason);
      sendMail({ to: userEmail, subject, html }).catch((err) =>
        console.error('User email failed:', err.message)
      );
    }

    // 3) Email to admin
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminEmail) {
      const { subject, html } = adminNotify(userName, lawyerName, status, reason);
      sendMail({ to: adminEmail, subject, html }).catch((err) =>
        console.error('Admin email failed:', err.message)
      );
    }
```
CORRECT (case id/title now included, both emails):
```js
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
```
also update `.select()` join above to include case title — WRONG:
```js
      .select(`
        *,
        users:user_id ( id, name, email, phone, district ),
        lawyers:lawyer_id ( id, sbc_number, specialty,
          lawyer_users:user_id ( name, email ) )
      `)
```
CORRECT:
```js
      .select(`
        *,
        users:user_id ( id, name, email, phone, district ),
        lawyers:lawyer_id ( id, sbc_number, specialty,
          lawyer_users:user_id ( name, email ) ),
        cases:case_id ( id, title )
      `)
```
top import stays same, no change needed there.

In `Backend/utils/emailTemplates.js` (the file you just replaced in step 1), edit these two functions:

WRONG:
```js
const responseToUser = (userName, lawyerName, status, reason) => {
```
CORRECT:
```js
const responseToUser = (userName, lawyerName, status, reason, caseInfo) => {
```
WRONG (inside same function, right before `${openAppBtn(...)}`):
```js
      ${reason ? `
        <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:14px 18px;
                    border-radius:0 8px 8px 0;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-weight:700;color:#92400e;font-size:13px;">Wajah (Reason):</p>
          <p style="margin:0;color:#78350f;font-size:14px;">${reason}</p>
        </div>` : ''}
      ${openAppBtn(isAccepted ? 'App Mein Dekhen' : 'Doosra Vakeel Dhoondhen')}
```
CORRECT:
```js
      ${reason ? `
        <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:14px 18px;
                    border-radius:0 8px 8px 0;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-weight:700;color:#92400e;font-size:13px;">Wajah (Reason):</p>
          <p style="margin:0;color:#78350f;font-size:14px;">${reason}</p>
        </div>` : ''}
      ${caseInfo ? `
        <div style="background:#f0faf5;border-left:4px solid #0b5d3b;padding:14px 18px;
                    border-radius:0 8px 8px 0;margin-bottom:20px;">
          <p style="margin:0;color:#0b5d3b;font-size:13px;"><strong>Case ID:</strong> ${caseInfo.id}<br/><strong>Case:</strong> ${caseInfo.title}</p>
        </div>` : ''}
      ${openAppBtn(isAccepted ? 'App Mein Dekhen' : 'Doosra Vakeel Dhoondhen')}
```

WRONG:
```js
const adminNotify = (userName, lawyerName, status, reason) => ({
```
CORRECT:
```js
const adminNotify = (userName, lawyerName, status, reason, caseInfo) => ({
```
WRONG (inside same object, inside the `<table>`, right before closing `</table>`):
```js
        ${reason ? `<tr>
          <td style="padding:5px 0;color:#666;font-size:13px;">Reason</td>
          <td style="padding:5px 0;color:#222;font-size:13px;">${reason}</td>
        </tr>` : ''}
      </table>
```
CORRECT:
```js
        ${reason ? `<tr>
          <td style="padding:5px 0;color:#666;font-size:13px;">Reason</td>
          <td style="padding:5px 0;color:#222;font-size:13px;">${reason}</td>
        </tr>` : ''}
        ${caseInfo ? `<tr>
          <td style="padding:5px 0;color:#666;font-size:13px;">Case ID</td>
          <td style="padding:5px 0;color:#222;font-size:13px;">${caseInfo.id} — ${caseInfo.title}</td>
        </tr>` : ''}
      </table>
```

---

## 4. `Backend/controllers/adminController.js`

### 4.1 `getStats` — WRONG:
```js
    res.json({
      totalUsers:     users.count || 1420,
      totalLawyers:   lawyers.count || 340,
      totalCases:     cases.count || 890,
      flaggedCases:   flagged.count || 14,
      pendingLawyers: pending.count || 12,
    });
```
CORRECT:
```js
    res.json({
      totalUsers:     users.count ?? 0,
      totalLawyers:   lawyers.count ?? 0,
      totalCases:     cases.count ?? 0,
      flaggedCases:   flagged.count ?? 0,
      pendingLawyers: pending.count ?? 0,
    });
```

### 4.2 `verifyLawyer` — WRONG:
```js
const verifyLawyer = async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('lawyers')
      .update({
        verification_status: status,
        is_verified: status === 'approved',
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
CORRECT:
```js
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

    const lawyerEmail = data.user?.email;
    if (lawyerEmail) {
      const { subject, html } = lawyerDecisionEmail(data.user.name, status, reason);
      sendMail({ to: lawyerEmail, subject, html }).catch(e => console.error(e.message));
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
add imports at top — WRONG:
```js
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
```
CORRECT:
```js
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer');
const { lawyerDecisionEmail, accountStatusEmail } = require('../utils/emailTemplates');
```

### 4.3 add new functions (append before `module.exports`)
```js
// GET /api/admin/users?role=
const getAllUsers = async (req, res) => {
  try {
    let q = supabase.from('users').select('*, lawyers(*)').order('created_at', { ascending: false });
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
      .select('*, citizen:citizen_id(name,email), lawyer:lawyer_id(*, user:user_id(name,email))')
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
    if (data.email) {
      const { subject, html } = accountStatusEmail(data.name, data.role, suspended, reason);
      sendMail({ to: data.email, subject, html }).catch(e => console.error(e.message));
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
update `module.exports` — WRONG:
```js
module.exports = {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity
};
```
CORRECT:
```js
module.exports = {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity,
  getAllUsers, getAllCases, suspendUser
};
```

---

## 5. `Backend/routes/admin.js` — full file

WRONG (whole file, no auth):
```js
const express = require('express');
const router = express.Router();
const {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity
} = require('../controllers/adminController');

router.get('/stats', getStats);
router.get('/pending-lawyers', getPendingLawyers);
router.put('/lawyers/:id/verify', verifyLawyer);
router.get('/flagged-cases', getFlaggedCases);
router.put('/profile', updateAdminProfile);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
```
CORRECT:
```js
const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity,
  getAllUsers, getAllCases, suspendUser
} = require('../controllers/adminController');

router.get('/stats', protect, allowRoles('admin'), getStats);
router.get('/pending-lawyers', protect, allowRoles('admin'), getPendingLawyers);
router.put('/lawyers/:id/verify', protect, allowRoles('admin'), verifyLawyer);
router.get('/flagged-cases', protect, allowRoles('admin'), getFlaggedCases);
router.put('/profile', protect, allowRoles('admin'), updateAdminProfile);
router.get('/recent-activity', protect, allowRoles('admin'), getRecentActivity);
router.get('/users', protect, allowRoles('admin'), getAllUsers);
router.get('/cases', protect, allowRoles('admin'), getAllCases);
router.put('/users/:id/suspend', protect, allowRoles('admin'), suspendUser);

module.exports = router;
```

---

## 6. Frontend — `Frontend/app/LoginScreen.js`, `handleLogin` only (the useEffect session-refresh block and `handleGoogleSuccess` are separate flows, do NOT touch them here)

WRONG:
```js
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Login failed — please check your credentials or register a new account.';
      showAlert('Login Error ⚠️', errorMsg);
    } finally {
      setLoading(false);
    }
```
CORRECT:
```js
    } catch (error) {
      const d = error?.response?.data || {};
      if (d.pendingApproval) {
        router.replace('/(lawyer)/VerificationPending');
        return;
      }
      const errorMsg = d.message || 'Login failed — please check your credentials or register a new account.';
      showAlert('Login Error ⚠️', errorMsg);
    } finally {
      setLoading(false);
    }
```
(`d.rejected` / `d.suspended` already fall into the generic `errorMsg` branch above and show the backend message as-is — no extra code needed for those two.)

---

## 7. `Frontend/app/(Admin)/AdminStore.js`

WRONG: hardcoded fake KPI/lawyer arrays exported and imported everywhere in `Frontend/app/(Admin)/*`.
CORRECT: delete file. Each screen fetches real data:
```js
import api from '../../services/api'; // NOT constants/api — that one has no auth token attached
import { useEffect, useState } from 'react';

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get('/admin/stats').then(r => setData(r.data)).finally(() => setLoading(false));
}, []);
```
apply same pattern per screen:
- `AdminDashboard.js` → `GET /admin/stats` + `GET /admin/recent-activity`
- `UserManagement.js` → `GET /admin/users?role=citizen`
- `LawyerManagement.js` → `GET /admin/users?role=lawyer`
- `VerificationQueue.js` → `GET /admin/pending-lawyers`, accept/reject → `PUT /admin/lawyers/:id/verify` body `{status, reason}`
- suspend button (User/Lawyer directory) → `PUT /admin/users/:id/suspend` body `{suspended, reason}`

---

## 8. `Frontend/app/(Admin)/AdminSidebar.js`

top import — WRONG (no auth header, will 401 once step 5 protects `/admin/*`):
```js
import api from '../../constants/api';
```
CORRECT:
```js
import api from '../../services/api';
```


WRONG:
```js
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', route: '/(Admin)/AdminDashboard' },
  { id: 'appointments', label: 'Appointments', icon: '📅', route: '/(Admin)/AppointmentsPage', badge: '4' },
  { id: 'queue', label: 'Verification Queue', icon: '⏳', route: '/(Admin)/VerificationQueue', badge: '12' },
  { id: 'users', label: 'User Directory', icon: '👥', route: '/(Admin)/UserManagement' },
  { id: 'lawyers', label: 'Lawyer Directory', icon: '⚖️', route: '/(Admin)/LawyerManagement' },
  { id: 'cases', label: 'Cases & Disputes', icon: '📁', route: '/(Admin)/CasesDisputes', badge: '14' },
```
CORRECT:
```js
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', route: '/(Admin)/AdminDashboard' },
  { id: 'queue', label: 'Verification Queue', icon: '⏳', route: '/(Admin)/VerificationQueue', badge: '12' },
  { id: 'users', label: 'User Directory', icon: '👥', route: '/(Admin)/UserManagement' },
  { id: 'lawyers', label: 'Lawyer Directory', icon: '⚖️', route: '/(Admin)/LawyerManagement' },
  { id: 'cases', label: 'Cases', icon: '📁', route: '/(Admin)/CasesPage' },
```

## 9. remove dispute code

- delete `Frontend/app/(Admin)/AppointmentsPage.js`
- rename `Frontend/app/(Admin)/CasesDisputes.js` → `CasesPage.js`, remove `disputesList`, "Open Disputes" tab/button block, `badgeDisputed` style, `Resolve Dispute`/`Investigation Started` buttons — keep only the cases table.
- `Frontend/app/(Admin)/_layout.js`: remove `<Stack.Screen name="AppointmentsPage" .../>`, rename `CasesDisputes` screen entry to `CasesPage`.
- `Frontend/app/(Admin)/AdminDashboard.js`: remove `openDisputesList`, "Open Disputes" KPI card + section (lines using `state.disputes`).
- `Frontend/app/(Admin)/AnalyticsPage.js`: remove `Resolved Disputes` stat row.
- `Frontend/app/(Admin)/AuditLogs.js`: remove dispute-type log row example.
- run `grep -ril dispute "Frontend/app/(Admin)/"` after, must return nothing.

---

## Order
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
Apply 5 and 7/8 together — step 5 requires admin JWT auth; step 7/8 is what actually sends it. Doing 5 without 7/8 breaks the admin panel until 7/8 is done.
