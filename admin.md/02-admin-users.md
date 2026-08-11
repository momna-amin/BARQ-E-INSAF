# 02 — Users (Clients) Management

Depends on: Categories/Locations seed data (for filters). Build order: Step 6.

## A. `/admin/users` (list)

**Purpose:** Manage all client accounts (not lawyers — lawyers live in File 03).

**Filter bar:** Search (name/phone/email), Status (Active/Suspended/Unverified), City, Registered date range.

**Table columns:** Avatar+Name, Phone, Email, City, Registered date, # Cases, Status badge, Actions (⋮ menu).

**Row actions (⋮ menu):** View, Suspend/Reactivate, Reset password/send OTP, Delete (soft-delete, SUPER_ADMIN only).

**Bulk actions:** Suspend selected, Export selected to CSV.

**Buttons:** "Export CSV" (top-right), no "Add user" button — clients self-register; Admin can only view/manage.

## B. `/admin/users/:id` (detail)

**Tabs:**
1. **Profile** — full name, phone, email, city/district, preferred language, profile photo, registered date, last login. Editable fields: name, email, city (Admin can correct data-entry errors); phone number change requires re-verification flag.
2. **Cases** — table of this user's cases (id, category, status, created date) → links to `/admin/cases/:id`.
3. **Payments** — this user's transactions/receipts → links to `/admin/payments/transactions?user=`.
4. **Reviews Given** — reviews this client wrote.
5. **Reports** — any reports filed by or against this user.
6. **Activity Log** — audit entries where this user is the subject.

**Header actions:** Status badge (Active/Suspended), "Suspend User" / "Reactivate User" button (opens confirm dialog with required reason field → written to audit log + triggers notification to user), "Delete Account" (SUPER_ADMIN only, soft delete).

**Frontend:** DetailShell + tab strip. Profile tab uses an editable form (shadcn `Form` + `react-hook-form` + zod validation). Other tabs are read-only DataTables reused from Global Shell.

**Backend:**
- `GET /api/v1/admin/users?search&status&city&page&limit` → paginated list.
- `GET /api/v1/admin/users/:id` → profile + counts.
- `PATCH /api/v1/admin/users/:id` → update editable fields (audit-logged).
- `POST /api/v1/admin/users/:id/suspend` `{ reason }` / `POST /api/v1/admin/users/:id/reactivate`.
- `DELETE /api/v1/admin/users/:id` → soft delete (`deleted_at` timestamp), SUPER_ADMIN only, blocked at API level for other roles.
- `GET /api/v1/admin/users/:id/cases|payments|reviews|reports|activity` → sub-resource lists.

**DB (new/confirmed tables):** `users`, `user_profiles` (see main spec §41) — add `status` enum (`ACTIVE, SUSPENDED, DELETED`), `suspended_reason`, `suspended_at`, `suspended_by` (FK admin_users).

**RBAC:** SUPPORT_ADMIN + SUPER_ADMIN can view/suspend; only SUPER_ADMIN can delete.

**End result:** Admin can search any seeded client, open their profile, suspend them with a reason, see that action reflected instantly in the status badge and in `/admin/audit-logs`.
