# 04 — Cases & Evidence Moderation

Depends on: Users, Lawyers modules. Build order: Step 8.

## A. `/admin/cases` (list)

**Filter bar:** Search (Case ID/client name), Status (Draft/Submitted/Matching/Proposals Received/Active/On Hold/Completed/Cancelled/Disputed), Category, District, Date range.

**Table columns:** Case ID (e.g. `BI-2026-000123`), Client, Category, District, Lawyer (if assigned), Status badge, Created date, Actions.

**Buttons:** Export CSV.

## B. `/admin/cases/:id` (detail — read-mostly, admin rarely edits case content directly)

**Tabs:**
1. **Overview** — category, subcategory, description, AI classification result, urgency, budget, client info, assigned lawyer.
2. **Timeline** — full event log (case_timeline table) rendered as a vertical timeline — same event types listed in main spec §23.
3. **Evidence** — list of uploaded evidence files with metadata (uploader, type, size, upload date, SHA-256 hash, access history). Admin can preview but should not casually download client evidence — every **view/download by admin is itself audit-logged** (see main spec §56, admin access must be permission-based and logged).
4. **Documents** — case documents (contracts, agreements) similar list.
5. **Proposals** — proposals submitted for this case (read-only here, full management in File 05).
6. **Messages** — read-only transcript, only accessible with explicit justification (moderation reason required) — used for dispute investigation, not casual browsing.
7. **Payments** — transactions tied to this case.

**Header actions:** Status badge, "Change Status" dropdown (Admin override, e.g. force to `ARCHIVED` or `CANCELLED` with reason — restricted, audit-logged), "Open Dispute" shortcut if not already disputed.

**Buttons inside Evidence tab:**
- **Preview** (opens viewer, logs `evidence.viewed` audit event with admin id).
- **Download** (requires typed justification in a dialog, logs `evidence.downloaded`).
- **Flag for Moderation** → sends item to `/admin/evidence-moderation`.
- **Remove** (SUPER_ADMIN/MODERATION_ADMIN only, e.g. malware/inappropriate content — reason required).

## C. `/admin/evidence-moderation`

**Purpose:** Queue of evidence items that were auto-flagged (failed malware scan, reported by user, or manually flagged from a case) awaiting a moderation decision.

**List:** flagged item, case link, flag reason, flagged by (system/user/admin), date.

**Actions:** Approve (unflag, keep visible), Remove (delete from storage + mark `removed` with reason, notify uploader), Escalate to Dispute.

**Backend:**
- `GET /api/v1/admin/cases?...` paginated list.
- `GET /api/v1/admin/cases/:id` → full case + counts per tab.
- `GET /api/v1/admin/cases/:id/timeline|evidence|documents|proposals|messages|payments`.
- `POST /api/v1/admin/cases/:id/status` `{ status, reason }`.
- `POST /api/v1/admin/evidence/:id/view` (logs only, returns signed URL), `POST /api/v1/admin/evidence/:id/download` `{ justification }`.
- `GET /api/v1/admin/evidence-moderation` queue, `POST /api/v1/admin/evidence/:id/approve|remove|escalate`.

**DB:** `cases`, `case_timeline`, `case_evidence`, `case_documents` (main spec §41), add to `case_evidence`: `flagged`, `flag_reason`, `flagged_by`, `moderation_status`.

**RBAC:** SUPPORT_ADMIN + MODERATION_ADMIN view cases; only MODERATION_ADMIN/SUPER_ADMIN can remove evidence or moderate.

**End result:** With seeded cases + fake evidence files, admin can open a case, view its full timeline and evidence list, flag an item, then process it from the Evidence Moderation queue — every view/download/removal appears in Audit Logs.
