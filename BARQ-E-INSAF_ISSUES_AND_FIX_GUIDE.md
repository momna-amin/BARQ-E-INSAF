# BARQ-E-INSAF — Issue Report & Fix Guide
Repo analyzed: `https://github.com/momna-amin/BARQ-E-INSAF` (branch `main`)

This file is written so that even a small/weak coding AI agent (or a junior dev)
can read one section at a time and fix it without needing to understand the
whole project. Every issue has: **Where**, **Why it's broken (proof)**,
**What "done" looks like**, and **Fix strategy (hints, not full code)**.

Work top-to-bottom. Section 0 is critical context — read it first, it explains
*why* so many things look broken (it's not one bug, it's three separate
codebases pretending to be one project).

---

## 0. CRITICAL CONTEXT — This repo actually contains 3 different apps

Before touching anything, understand the repo layout, because your requirement
#3 and #6 both point at "admin panel" — but **there are three different admin
panels in this repo**, and only one of them is real:

| Folder | What it is | Connected to real Backend? |
|---|---|---|
| `Frontend/app/(Admin)/*` | The **real** admin section, inside the actual Expo/React Native app users install (drawer/sidebar is `Frontend/app/(Admin)/AdminSidebar.js`). This is the one your requirement #6 ("side panel wala app drawer") is talking about. | **NO** — `Frontend/app/(Admin)/AdminStore.js` is 165 lines of hardcoded fake numbers and fake lawyer records (`totalUsers: 1420`, `activeCases: 890`, fake lawyer names like "Advocate Tariq Mahmood" with fake CNICs). Most Admin screens read from this file, not from `Backend/controllers/adminController.js`. |
| `admin-panel/` | A **separate, standalone Next.js web app** (its own `package.json`, own login page, own `lib/mock-data.ts` + `lib/store.tsx`). It is not linked to `Frontend/` or `Backend/` at all. | **NO** — 100% mock, in-memory React state (`useState(MOCK_USERS)` etc.). Refreshing the page resets all "changes". |
| `barq-e-insaf-mobile/` | A **third**, older/parallel Expo project with its own `lib/mock-data.ts` and `lib/store.tsx`. | **NO** — same pattern, also mock. |

**Decision you must make before coding:** pick ONE admin implementation to be
"the real one" going forward. Given your requirements (real data, real
Supabase, suspend with reason, drawer cleanup), the correct choice is
**`Frontend/app/(Admin)/*`** because that's the one embedded in the actual
citizen/lawyer/admin app that talks to `Backend/`. Recommendation:
- Keep and fix `Frontend/app/(Admin)/*`.
- Delete or archive `admin-panel/` and `barq-e-insaf-mobile/` (or clearly mark
  them `DEPRECATED — do not use` in their README) so nobody edits the wrong
  one again. This single decision is what your point #3 calls **"double
  information remove krni hn"** — the duplication isn't duplicate *data*,
  it's duplicate *codebases*, and it's why fixing one admin panel never seems
  to change what you see when you re-open the app.

There are also two loose folders `backend fixes/` and `frontend fixes/` and
`barq-e-insaf-fixes/` sitting at the repo root — these look like previous
partial-fix attempts that were never merged into `Backend/`/`Frontend/`. Check
whether any of your previous AI/dev sessions already wrote fixes there and
never applied them — diff them against `Backend/controllers/adminController.js`
and `Backend/routes/admin.js` before you start, you may already have partial
work to reuse.

---

## 1. Citizen signup → no "welcome" email is ever sent

**Where:** `Backend/controllers/authController.js`, functions `sendRegisterOtp`
(line ~130) and `verifyRegisterOtpAndCreate` (line ~215).

**Proof / why it's broken:**
- Signup is 2-step: `sendRegisterOtp` sends an email using template
  `welcomeOtpEmail(name, otp)` from `Backend/utils/emailTemplates.js`. Despite
  the name "welcome", read the template (line 95) — it is 100% an OTP-code
  email ("your code is XXXXXX"), not a welcome/congratulations message.
- `verifyRegisterOtpAndCreate` is the function that actually creates the row
  in `users` (and `lawyers` if role=lawyer) after the OTP is confirmed. **It
  ends immediately after `otpStore.deleteOtp(...)` and returns JSON — it never
  calls `sendMail` again.** So no email is sent at the moment the account
  actually becomes real.

**What "done" looks like:** After OTP verification succeeds and the account
row is inserted, a second email fires: "Welcome to Barq-e-Insaf, your account
is ready" (for citizens — goes out immediately). For lawyers, see Section 5
instead — they get a *different* "pending approval" message, not this one.

**Fix strategy:**
1. In `Backend/utils/emailTemplates.js`, add a new template function, e.g.
   `accountWelcomeEmail(name)` — copy the structure of `otpEmail`/`welcomeOtpEmail`
   (they already show you the `base(...)` HTML wrapper pattern and
   `openAppBtn()` helper), just change the copy to a welcome message. Export
   it in the `module.exports` line at the bottom of that file.
2. In `verifyRegisterOtpAndCreate`, right after the `user` insert succeeds
   (after the `if (userError) {...}` block, and only for `p.role === 'citizen'`
   — lawyers get the pending-approval email from Section 5 instead, don't send
   both), call:
   ```js
   if (p.role === 'citizen') {
     const { subject, html } = accountWelcomeEmail(p.name);
     sendMail({ to: p.email, subject, html }).catch(err => console.error('Welcome email failed:', err.message));
   }
   ```
   Use fire-and-forget (`.catch()`, no `await`) exactly like `requests.js`
   already does for other emails — don't make the HTTP response wait on SMTP.
3. Also patch the legacy `register` function (line ~40, used for
   "backward compat") the same way, or it'll silently skip the welcome email
   if that path is ever hit.

---

## 2. Citizen → Lawyer request → accept flow: emails exist but are incomplete, and one will crash

**Where:** `Backend/routes/requests.js` (the whole file), plus
`Backend/utils/emailTemplates.js` (`responseToUser`, `adminNotify`), plus
`Backend/schema.sql`.

**Good news:** most of the plumbing for requirement #2 already exists —
`POST /api/requests` emails the lawyer, `PATCH /api/requests/:id` emails the
citizen AND emails admin (via `process.env.ADMIN_NOTIFY_EMAIL`) when a lawyer
accepts/rejects, and it even auto-creates a `cases` row on accept. **It is not
"not built", it is "half built and has a live bug."**

**Bug A — will throw a DB error:** `POST /api/requests` inserts
`case_id: caseId || null` (see `requests.js` line ~40) into table
`lawyer_requests`. Open `Backend/schema.sql` and search for the
`lawyer_requests` table definition (~line 82) — **there is no `case_id`
column defined anywhere in that table.** If your Supabase project was created
from `schema.sql` as-is, every request with `case_id` sent will error, and
even `case_id: null` may fail depending on how strict your Supabase schema
cache is (Supabase returns "column case_id does not exist" style errors,
which you've likely already seen show up as generic 500s in the app).

**Fix strategy for Bug A:**
Add this to `Backend/schema.sql` (and run it directly in the Supabase SQL
editor against your live project, since `schema.sql` alone won't touch an
already-created table):
```sql
ALTER TABLE lawyer_requests ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id) ON DELETE SET NULL;
```

**Bug B — emails don't say WHICH case:** Requirement #2 explicitly says the
citizen should see confirmation of "case id for example accept ho chuki hai."
Look at `responseToUser(userName, lawyerName, status, reason)` in
`emailTemplates.js` (line ~153) and `adminNotify(userName, lawyerName, status, reason)`
(line ~188) — **neither function receives or displays a case ID, a case
title, or a date**, even though `requests.js` has `request.case_id` and
`request.cases` available right there in the same handler after the
`.select(...)` join.

**Fix strategy for Bug B:**
1. Change both template function signatures to accept one more argument, e.g.
   `responseToUser(userName, lawyerName, status, reason, caseInfo)` and
   `adminNotify(userName, lawyerName, status, reason, caseInfo)`, where
   `caseInfo = { id, title }`. Add a table row inside the existing HTML
   `<table>` blocks (both templates already render a table — copy the
   existing `<tr>` pattern for "Reason" and duplicate it for "Case ID" /
   "Case Title").
2. In `requests.js` `PATCH /api/requests/:id`, the `.select(...)` join
   already needs to include the case relation — add
   `cases:case_id ( id, title )` to the existing select string (right next
   to the existing `users:user_id(...)` and `lawyers:lawyer_id(...)` joins),
   then pass `request.cases` into the two template calls.
3. `created_at`/`updated_at` are already selected via `*` — pass
   `request.updated_at` (or `new Date()`) into the templates for the "Date"
   the user asked for.

**Missing piece — admin needs "which lawyer accepted which user's case, date,
reason" as a structured record, not just an email.** An email is easy to lose;
requirement #2 wants the admin to also *see* this in the app. This connects
directly to Section 3 — the admin Cases screen must read real
`lawyer_requests`/`cases` rows (it currently doesn't, see below), so once
Section 3 is fixed, this data will already be visible there for free — no
extra backend work needed beyond what's above.

**Sanity check before shipping:** `process.env.ADMIN_NOTIFY_EMAIL` must
actually be set in your `.env` / Vercel environment variables, or the admin
email silently never sends (the `if (adminEmail)` guard means no error is
thrown — it just quietly does nothing). Verify it's set in your deployment
env, not just locally.

---

## 3. Admin dashboard shows demo/fake data instead of real Supabase data

This is the big one (your point #3). It has 4 separate causes — fix all 4 or
you'll fix one and still see fake numbers from another.

### 3.1 Frontend reads from a hardcoded file, not the API
**Where:** `Frontend/app/(Admin)/AdminStore.js`
**Proof:** Lines 3-10 literally are:
```js
export const initialAdminKPI = {
  totalUsers: 1420, totalLawyers: 340, verifiedLawyers: 258,
  pendingLawyers: 12, activeCases: 890, ...
};
```
followed by ~150 more lines of fake lawyer applications with invented names,
CNICs, and phone numbers. Every Admin screen (`AdminDashboard.js`,
`UserManagement.js`, `LawyerManagement.js`, `VerificationQueue.js`, etc.)
imports from this file.
**Fix strategy:** This is the single most important fix in the whole request.
Go screen by screen inside `Frontend/app/(Admin)/`. For each screen:
1. Find where it imports from `AdminStore.js` (e.g.
   `import { initialAdminKPI } from './AdminStore'`).
2. Replace with a real call using the existing `Frontend/services/api.js` /
   `Frontend/constants/api.js` axios instance (already used correctly
   elsewhere in the app, e.g. `AdminSidebar.js` already does
   `import api from '../../constants/api'` and `api.put('/admin/profile', ...)`
   — copy that exact pattern).
3. Wrap the fetch in `useEffect` + `useState` + loading/error state (standard
   React Native data-fetching pattern — if you're unsure, look at
   `Frontend/app/(lawyer)/IncomingRequests.js` for an existing real
   API-fetching screen in this same repo to copy the pattern from).
4. Once every screen is migrated, delete `AdminStore.js` entirely (or rename
   to `AdminStore.deprecated.js`) so nobody imports fake data again by
   accident.

### 3.2 Backend itself falls back to fake numbers when real data is zero
**Where:** `Backend/controllers/adminController.js`, function `getStats`
(line ~5).
**Proof:**
```js
res.json({
  totalUsers:     users.count || 1420,
  totalLawyers:   lawyers.count || 340,
  ...
});
```
This looks like a "just in case" fallback, but in JavaScript `0 || 1420`
evaluates to `1420`. **The moment your real user count is genuinely 0 (fresh
database) or any count is falsy, the API itself returns fake numbers as if
they were real ones.** This is likely why the admin dashboard "always" shows
demo numbers even after you registered real test users — if the query itself
also silently errors (e.g. due to missing RLS policy or wrong table name) and
`.count` comes back `null`/`undefined`, you'd never notice, because you'd
still see plausible-looking numbers.
**Fix strategy:** Delete every `|| <number>` fallback in `getStats`. Return
the real (possibly zero) counts, and if `error` exists on any of the 5
Supabase calls, return a 500 with the actual Supabase error message so
problems are visible instead of silently masked. Example shape:
```js
totalUsers: users.count ?? 0,
```
(use `??`, not `||`, so `0` is respected).

### 3.3 Admin API routes have zero authentication
**Where:** `Backend/routes/admin.js` (the whole file).
**Proof:** Every route (`/stats`, `/pending-lawyers`, `/lawyers/:id/verify`,
`/flagged-cases`, `/profile`, `/recent-activity`) is registered with no
`protect` or `allowRoles('admin')` middleware — compare to `Backend/routes/requests.js`
which correctly uses `protect, allowRoles('citizen','user')` and
`protect, allowRoles('lawyer')`. Right now anyone who knows the URL (no login
needed at all) can view stats, view every pending lawyer's personal data, and
even approve/reject lawyers.
**Fix strategy:** Add the same middleware pattern already used in
`requests.js`/`cases.js`:
```js
const { protect, allowRoles } = require('../middleware/auth');
router.get('/stats', protect, allowRoles('admin'), getStats);
// ...repeat for every route in this file
```
Do this **before** or **alongside** 3.1/3.2 — it's a one-line-per-route change
and is a real security hole, not just a "professionalism" nice-to-have. Note
the frontend's admin login must therefore actually store and send the JWT
`Authorization: Bearer <token>` header on every admin API call — check that
`AdminSidebar.js`'s working `api.put('/admin/profile', ...)` call is proof the
axios instance already attaches auth headers automatically (check
`Frontend/services/api.js` interceptor setup) — if so, the other Admin
screens just need to switch from `AdminStore.js` to that same `api` instance
and auth "just works".

### 3.4 No backend endpoints exist yet for full user/case management
**Where:** `Backend/routes/admin.js` + `Backend/controllers/adminController.js`
**Proof:** The only admin endpoints that exist are: stats, pending-lawyers,
verify-lawyer, flagged-cases, profile, recent-activity. There is **no**
`GET /api/admin/users` (list all citizens/lawyers/ngos), **no**
`GET /api/admin/cases` (list all cases with full detail), and **no** suspend
endpoint at all (see Section 5 for suspend). Your requirement #3
("real me user show ho jo register hue... jo cases details hn chal rhi show
ho") needs these to exist before the frontend can show anything real.
**Fix strategy:** Add new controller functions in `adminController.js`
following the exact same pattern already used by `getPendingLawyers`
(simple `supabase.from(...).select(...)` + error check + `res.json(data)`):
- `getAllUsers` — `supabase.from('users').select('*, lawyers(*)').order('created_at', {ascending:false})`, optionally filtered by `?role=` query param.
- `getAllCases` — `supabase.from('cases').select('*, citizen:citizen_id(name,email), lawyer:lawyer_id(*, user:user_id(name,email))').order('created_at', {ascending:false})`.
Register both in `admin.js` with the same `protect, allowRoles('admin')`
guard from 3.3.

---

## 4. Lawyer logs in before approval — "your request is pending" page is built but never used

**Where:** `Frontend/app/(lawyer)/VerificationPending.js` exists and is
registered in `Frontend/app/(lawyer)/_layout.js` — but nothing ever navigates
to it.

**Proof:** Search `Frontend/app/LoginScreen.js` for how it routes after
login (lines ~244-247, ~299-301, ~324-326) — in all three places, the code is:
```js
sessionUser.role === 'lawyer' ? '/(lawyer)/LawyerHome' : ...
```
It routes straight to `LawyerHome` purely based on `role === 'lawyer'`. There
is no check anywhere in `LoginScreen.js` for `verification_status`. Also,
`Backend/controllers/authController.js`'s `login` function (line ~275-360)
never even fetches or checks the lawyer's `verification_status` before
issuing tokens — a `pending` lawyer gets a fully valid JWT and full app
access. Worse: `getMe()` (line ~370) **auto-creates** a lawyer profile with
`verification_status: 'approved'` if one is missing — meaning if the lawyer
row creation ever silently failed during signup, the very next `/auth/me`
call auto-approves them by accident.

**Fix strategy (2 layers — do both, frontend alone is not secure):**

*Backend (the real gate — do this first):*
In `authController.js`'s `login` function, right after the password check
succeeds and before `issueTokens(user)` is called, add:
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
```
Also fix the `getMe()` auto-create bug: change
`verification_status: 'approved'` to `verification_status: 'pending'` in that
fallback block (line ~385) — auto-approving is clearly not intended.

*Frontend (UX — makes the block friendly instead of just an error):*
In `LoginScreen.js`, wherever it currently handles the login API response for
role `lawyer`, check for `err.response.data.pendingApproval` (or whatever
shape you choose above) and route to `/(lawyer)/VerificationPending` instead
of showing a generic error. `VerificationPending.js` already exists and looks
fine as-is — you don't need to rebuild it, just wire the navigation to it.

*Also fix `schema.sql`:* the `lawyers` table default is
`verification_status TEXT DEFAULT 'approved'` (line ~46) — this is backwards.
Change the default to `'pending'`:
```sql
ALTER TABLE lawyers ALTER COLUMN verification_status SET DEFAULT 'pending';
ALTER TABLE lawyers ALTER COLUMN is_verified SET DEFAULT false;
```
Run this directly against your live Supabase DB (schema.sql changes alone
don't retroactively alter an already-created table).

---

## 5. Lawyer signup approval workflow (admin notify, accept/reject with reason, suspend)

This combines your points #4 and #5. Break it into 4 independent pieces:

### 5.1 Admin should get an email the moment a lawyer signs up
**Where:** `Backend/controllers/authController.js`, `verifyRegisterOtpAndCreate`,
right after the `if (p.role === 'lawyer') { ...lawyers insert... }` block.
**Currently:** nothing is sent — the function just deletes the OTP and
returns. Nobody is told a new lawyer is waiting.
**Fix strategy:**
1. Add a new template in `emailTemplates.js`, e.g.
   `lawyerSignupNotifyAdmin(lawyerName, lawyerEmail, sbcNumber, specialty, phone, district)`
   — copy the `adminNotify` table-row pattern already in that file, just with
   lawyer fields instead of request fields.
2. After the lawyer row insert succeeds:
   ```js
   if (p.role === 'lawyer') {
     // ...existing lawyer insert...
     const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
     if (adminEmail) {
       const { subject, html } = lawyerSignupNotifyAdmin(p.name, p.email, p.sbcNumber, p.specialty, p.phone, p.district);
       sendMail({ to: adminEmail, subject, html }).catch(err => console.error('Admin lawyer-signup email failed:', err.message));
     }
   }
   ```
3. Also send the lawyer their own "we received your application, pending
   review" email at the same point, using a new template similar to
   `welcomeOtpEmail` but without an OTP — this covers the "lawyer ko bhi pata
   chale" half of your requirement, separate from the citizen welcome email
   in Section 1.

### 5.2 Admin panel must actually show lawyer join requests with accept/reject + optional reason
**Where:** Backend already has `getPendingLawyers` and `verifyLawyer` in
`adminController.js` — the data layer is there. What's missing:
- `verifyLawyer` (line ~35) accepts `{ status }` in the body but **completely
  ignores any `reason` field** — it's not read, not stored, not emailed.
- No email is sent to the lawyer at all when approved/rejected — the lawyer
  currently has no way to know except by trying to log in again.
- Frontend's `VerificationQueue.js` (check `Frontend/app/(Admin)/VerificationQueue.js`)
  likely reads from `AdminStore.js` fake data per Section 3.1 — must be
  migrated to call `GET /api/admin/pending-lawyers` and
  `PUT /api/admin/lawyers/:id/verify` for real.

**Fix strategy for `verifyLawyer`:**
```js
const verifyLawyer = async (req, res) => {
  const { status, reason } = req.body; // add reason
  const { data, error } = await supabase
    .from('lawyers')
    .update({ verification_status: status, is_verified: status === 'approved' })
    .eq('id', req.params.id)
    .select('*, user:user_id(id, name, email)')
    .single();
  if (error) return res.status(500).json({ message: error.message });

  const lawyerEmail = data.user?.email;
  if (lawyerEmail) {
    const { subject, html } = lawyerVerificationResult(data.user.name, status, reason); // new template
    sendMail({ to: lawyerEmail, subject, html }).catch(err => console.error(err.message));
  }
  res.json(data);
};
```
Add `lawyerVerificationResult(name, status, reason)` to `emailTemplates.js` —
copy `responseToUser`'s accepted/rejected color-coded card pattern, it's
almost exactly the shape you need already.

### 5.3 Lawyer's own screen must reflect the new status (ties back to Section 4)
Once 5.2 sends the real-time DB update + email, Section 4's login-gate logic
will automatically stop blocking the lawyer on their next login attempt — no
extra work needed here beyond what Section 4 already describes.

### 5.4 Suspend a citizen / lawyer / ngo, with a reason, and email them
**This endpoint does not exist anywhere in the backend today** — grep
confirms `Backend/routes/admin.js` has no suspend route, and `schema.sql` has
no `is_suspended` / `is_active` / `suspension_reason` column on `users` at
all. This needs to be built from scratch (small, but from scratch):

1. **DB migration** (run in Supabase SQL editor):
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
   ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
   ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;
   ```
2. **New controller function** in `adminController.js`:
   ```js
   const suspendUser = async (req, res) => {
     const { suspended, reason } = req.body; // suspended: true/false
     const { data, error } = await supabase
       .from('users')
       .update({ is_suspended: suspended, suspension_reason: suspended ? (reason || null) : null,
                 suspended_at: suspended ? new Date().toISOString() : null })
       .eq('id', req.params.id)
       .select()
       .single();
     if (error) return res.status(500).json({ message: error.message });
     if (data.email) {
       const { subject, html } = accountStatusEmail(data.name, suspended, reason); // new template
       sendMail({ to: data.email, subject, html }).catch(err => console.error(err.message));
     }
     res.json(data);
   };
   ```
3. **New route** in `admin.js`:
   `router.put('/users/:id/suspend', protect, allowRoles('admin'), suspendUser);`
4. **Enforce it at login** — in `authController.js`'s `login`, right after
   fetching `user`, add:
   ```js
   if (user.is_suspended) {
     return res.status(403).json({ message: `Aapka account suspend hai. Wajah: ${user.suspension_reason || 'N/A'}` });
   }
   ```
5. **Frontend:** add a Suspend/Unsuspend button + reason text input on the
   User Directory / Lawyer Directory admin screens, calling this new
   endpoint. This is generic — works identically for citizen, lawyer, and ngo
   rows since they're all in the same `users` table with a `role` column.

---

## 6. Remove "Disputes & Appointments" from the admin side drawer

**Where:** `Frontend/app/(Admin)/AdminSidebar.js`, the `MENU_ITEMS` array
(top of file).

**Proof:** Two relevant entries currently exist:
```js
{ id: 'appointments', label: 'Appointments', icon: '📅', route: '/(Admin)/AppointmentsPage', badge: '4' },
...
{ id: 'cases', label: 'Cases & Disputes', icon: '📁', route: '/(Admin)/CasesDisputes', badge: '14' },
```
Note the badge counts (`'4'`, `'14'`) are hardcoded strings, not live data —
another small instance of the Section 3 demo-data problem, moot once removed.

**Fix strategy:**
1. In `AdminSidebar.js`, delete the `appointments` object from `MENU_ITEMS`.
   Decide whether "Cases & Disputes" should become plain "Cases" (keep case
   management, drop dispute-handling) or be removed entirely — your message
   says "dispute & appointment function remove karna hai", so the safest
   interpretation is: remove `appointments` entirely, and for the cases entry
   either rename the label to just `'Cases'` and repoint its route to a
   cases-only screen, or remove it too if you don't want case management in
   the drawer at all. Re-read your own requirement #3 though — you explicitly
   *do* want "jo cases details hn chal rhi show ho" (case details visible),
   so keep a **Cases** entry, just drop the word "Disputes" and the
   standalone Appointments entry.
2. Delete (or leave orphaned but unlinked) the screen files
   `Frontend/app/(Admin)/AppointmentsPage.js` and
   `Frontend/app/(Admin)/CasesDisputes.js` — if you keep a cases-only screen,
   rename `CasesDisputes.js` to something like `CasesPage.js` and strip out
   any dispute-specific UI/state inside it (check the file for a `disputes`
   state array or dispute-status filters and remove them).
3. Also remove the matching `<Stack.Screen name="AppointmentsPage" .../>` (and
   `CasesDisputes` if fully removed) line from
   `Frontend/app/(Admin)/_layout.js` so Expo Router doesn't keep a dead route
   registered.
4. Check `Frontend/app/(Admin)/AdminDashboard.js` and `AdminStore.js` for any
   `openDisputes` / `activeCases` KPI tiles that reference the removed
   feature and clean those up too (you'll already be touching
   `AdminStore.js` in Section 3.1 — do this in the same pass).
5. Do the search-and-remove for the word "dispute" across the whole
   `Frontend/app/(Admin)/` folder once (`grep -ril dispute Frontend/app/\(Admin\)/`)
   to make sure no button/link elsewhere still points at the removed screen.

---

## Suggested order of work (so nothing you fix gets re-broken by a later step)

1. **Section 0** — decide on one admin codebase, note it in your own README so future-you/future-AI doesn't edit the wrong folder again.
2. **Section 3.3** (admin auth) + **Section 5.4 DB migration** + **Section 2 Bug A DB migration** + **Section 4 schema default fix** — do all SQL/schema changes together in one Supabase session.
3. **Section 3.2 + 3.4** — fix backend `getStats`, add `getAllUsers`/`getAllCases`, add `suspendUser`.
4. **Section 4 + 5.1 + 5.2** — lawyer approval gate, admin notify on signup, accept/reject with reason + email.
5. **Section 1 + 2 Bug B** — welcome email, case-id-aware request emails.
6. **Section 3.1** — migrate every `Frontend/app/(Admin)/*` screen off `AdminStore.js` onto the now-complete real API.
7. **Section 6** — drawer cleanup (do this last since Section 3.1 already touches the same files, avoid merge conflicts with yourself).

Every section above is independently testable — after each one, sign up a
real test citizen and a real test lawyer through the actual app and confirm
in Supabase + your inbox that the described behavior now happens, before
moving to the next section.
