# 07 — Disputes, Reports & Reviews Moderation

Depends on: Users, Lawyers, Cases. Build order: Step 11.

## A. `/admin/disputes`

**Filter bar:** Status (Open/Under Review/Waiting for Info/Resolved/Rejected/Escalated), Category, Date range.

**Table columns:** Dispute ID, Case ID, Raised by (Client/Lawyer), Reason, Status badge, Age (days open), Actions.

**Detail drawer/page:** full dispute description, linked evidence, message history between parties (moderator view), internal admin notes (private), decision history.

**Buttons:** "Assign to me", "Request Info from Party" (message composer), "Resolve" (decision text + resolution type: refund/no action/warning/suspend, required), "Escalate" (to SUPER_ADMIN), "Reject" (reason).

## B. `/admin/reports`

**Purpose:** User-submitted reports (main spec §38: Lawyer, Client, Message, Profile, Document, Proposal, Review, Fraud, Harassment, Spam).

**Filter bar:** Status (New/Investigating/Resolved/Dismissed), Report type, Date range.

**Table columns:** Report ID, Type, Reported entity (link), Reported by, Reason summary, Status badge, Date.

**Detail drawer:** full report text, evidence attached, reported entity's recent history (prior reports against them).

**Buttons:** "Warn" (sends formal warning notification), "Restrict" (limits specific actions), "Suspend" (links into Users/Lawyers suspend flow), "Dismiss" (reason), "Escalate to Dispute".

## C. `/admin/reviews`

**Purpose:** Moderate client→lawyer reviews.

**Filter bar:** Status (Published/Flagged/Removed), Rating, Date range.

**Table columns:** Reviewer, Lawyer, Rating, Snippet, Status badge, Date.

**Buttons:** "Remove Review" (reason required — e.g. fake, abusive, violates guidelines), "Restore".

**Backend:**
- `GET /api/v1/admin/disputes?...`, `GET /api/v1/admin/disputes/:id`, `POST /api/v1/admin/disputes/:id/assign|request-info|resolve|escalate|reject`.
- `GET /api/v1/admin/reports?...`, `GET /api/v1/admin/reports/:id`, `POST /api/v1/admin/reports/:id/warn|restrict|dismiss` and reuse Users/Lawyers `suspend` endpoints for suspend action.
- `GET /api/v1/admin/reviews?...`, `POST /api/v1/admin/reviews/:id/remove|restore`.

**DB:** `disputes`, `reports`, `reviews` (main spec §41). Add to `disputes`: `assigned_admin_id`, `resolution_type`, `resolution_notes`. Add to `reports`: `status`, `resolution`. Add to `reviews`: `status` (Published/Flagged/Removed), `moderated_by`, `moderation_reason`.

**RBAC:** MODERATION_ADMIN owns Reports/Reviews; SUPPORT_ADMIN + MODERATION_ADMIN handle Disputes; SUPER_ADMIN full access everywhere.

**End result:** Seeded disputes/reports/reviews can be opened, assigned, resolved/dismissed/removed with reasons, all producing audit log entries and (for suspend/warn) real notification events.
