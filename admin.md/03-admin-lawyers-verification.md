# 03 — Lawyers & Verification Queue

Depends on: Categories/Locations. Build order: Step 7. This is one of the two modules that MUST work end-to-end for the 50% demo.

## A. `/admin/lawyers` (list)

**Filter bar:** Search (name/enrollment #), Status (Pending/Under Review/Verified/Rejected/Suspended/Expired), Practice Area, City, Experience range.

**Table columns:** Photo+Name, Enrollment #, Practice Area(s), City, Experience, Status badge, Rating, Cases handled, Actions.

**Buttons:** "Export CSV". No manual "Add lawyer" — lawyers self-register; admin only manages.

## B. `/admin/lawyers/verification-queue` (the priority screen)

**Purpose:** Dedicated queue of lawyers in `PENDING` / `UNDER_REVIEW` status, processed one by one.

**Layout:** Left list of pending applicants (avatar, name, submitted date, oldest-first) + right-side detail panel showing the selected applicant's full submission.

**Right panel contents:**
- Personal info (name, phone, email, CNIC — masked, photo).
- Professional info: Bar Council, enrollment number, practice level, years of experience, practice areas, courts, cities.
- Uploaded documents viewer (bar license, CNIC, degree, etc.) — inline PDF/image preview, download button.
- Internal notes field (admin-only, not visible to lawyer).

**Buttons (bottom of right panel):**
- **Approve** → confirm dialog → sets status `VERIFIED`, generates verified badge, sends WhatsApp+email notification, writes audit log.
- **Reject** → confirm dialog with required reason (dropdown + free text) → status `REJECTED`, notifies lawyer with reason, audit log.
- **Request More Info** → opens a message composer → sends notification to lawyer asking for specific missing document/info, status → `UNDER_REVIEW`, does not close the case from queue.
- **Move to Under Review** (manual claim) — assigns this applicant to the currently logged-in admin so two admins don't process the same one twice.

**Frontend:** Split-pane layout (list + detail), PDF/image viewer component, all actions via confirm dialogs, optimistic UI removal from queue list on Approve/Reject.

**Backend:**
- `GET /api/v1/admin/lawyers/verification-queue?status=PENDING,UNDER_REVIEW` sorted oldest-first.
- `GET /api/v1/admin/lawyers/:id/verification` → full submission + documents (signed R2 URLs, short-lived).
- `POST /api/v1/admin/lawyers/:id/verify` `{}` → status `VERIFIED`.
- `POST /api/v1/admin/lawyers/:id/reject` `{ reason }`.
- `POST /api/v1/admin/lawyers/:id/request-info` `{ message }`.
- `POST /api/v1/admin/lawyers/:id/claim` → sets `assigned_admin_id`.
- Every transition writes to `audit_logs` and inserts a notification event (see File 11) that fans out to WhatsApp/Email/In-app per the lawyer's notification preferences.

## C. `/admin/lawyers/:id` (approved lawyer detail — after verification)

**Tabs:**
1. **Profile** — public profile fields (bio, fee, availability) editable by admin for corrections.
2. **Verification** — read-only record of the verification decision (who approved, when, documents).
3. **Cases** — this lawyer's active/completed cases.
4. **Proposals** — proposals they've submitted.
5. **Earnings** — payouts, pending balance.
6. **Reviews** — reviews received.
7. **Availability/Calendar** — read-only view of their set availability.

**Header actions:** Status badge, "Suspend Lawyer" (reason required, hides them from search + matching), "Reactivate", "Revoke Verification" (SUPER_ADMIN/VERIFICATION_ADMIN only — severe action, double-confirm).

**DB:** `lawyer_profiles`, `lawyer_verifications`, `lawyer_documents` (main spec §41), add `assigned_admin_id`, `verification_status` enum, `verified_by`, `verified_at`, `rejected_reason`.

**RBAC:** VERIFICATION_ADMIN owns this whole module; SUPER_ADMIN has full access; SUPPORT_ADMIN view-only.

**End result (must work for 50% demo):** Seed 5–10 fake pending lawyer applications → open Verification Queue → click one → view documents → Approve one, Reject one with a reason → both instantly disappear from the queue, badge updates, `/admin/lawyers` list reflects new statuses, and `/admin/audit-logs` shows both actions.
