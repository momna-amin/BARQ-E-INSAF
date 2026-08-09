# 05 — Proposals & Appointments (Admin Oversight)

Depends on: Cases module. Build order: Step 9. Admin's role here is oversight/moderation, not participation — proposals/appointments are created by lawyers and clients in their own apps (later phases); Admin only monitors and intervenes.

## A. `/admin/proposals` (list)

**Filter bar:** Search (case ID/lawyer name), Status (Submitted/Accepted/Rejected/Withdrawn), Category, Date range.

**Table columns:** Case ID, Lawyer, Client, Fee, Status badge, Submitted date, Actions.

**Row detail (drawer, not full page):** service type, professional fee, consultation fee, scope of work, terms, timeline, availability. Read-only — admin does not edit lawyer-submitted commercial terms.

**Buttons:** "Flag Proposal" (e.g. suspicious pricing) → reason → visible in Reports (File 07). No edit/delete — integrity of marketplace terms preserved; only flow is flag → investigate → dispute if needed.

## B. `/admin/appointments` (list)

**Filter bar:** Search, Status (Scheduled/Completed/Cancelled/No-show), Date range, Lawyer, Client.

**Table columns:** Case ID, Client, Lawyer, Date/Time, Type (Online/In-person), Status badge.

**Row detail (drawer):** full booking info, reminder log (was WhatsApp/email reminder sent).

**Buttons:** "Cancel Appointment" (admin override for abuse/fraud cases only, reason required, notifies both parties), Export CSV.

**Backend:**
- `GET /api/v1/admin/proposals?...`, `GET /api/v1/admin/proposals/:id`.
- `POST /api/v1/admin/proposals/:id/flag` `{ reason }`.
- `GET /api/v1/admin/appointments?...`, `GET /api/v1/admin/appointments/:id`.
- `POST /api/v1/admin/appointments/:id/cancel` `{ reason }`.

**DB:** `proposals`, `proposal_terms`, `appointments`, `availability` (main spec §41). Add `flagged`, `flag_reason` to `proposals`.

**RBAC:** SUPPORT_ADMIN + SUPER_ADMIN view/flag; only SUPER_ADMIN cancels an appointment.

**End result:** Seeded proposals/appointments render correctly, filters work, flagging a proposal creates an audit entry and surfaces it under Reports.
