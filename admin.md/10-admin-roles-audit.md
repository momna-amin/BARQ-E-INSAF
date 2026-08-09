# 10 — Admin Users, Roles & Permissions, Audit Logs

Build order: Step 14. SUPER_ADMIN only for the management screens; Audit Logs viewable more broadly (read-only).

## A. `/admin/admin-users`

**Table columns:** Name, Email, Role, Status (Active/Suspended), Last login, 2FA enabled, Actions.

**Buttons:** "Invite Admin" (modal: email, role dropdown → sends invite email with setup link), Edit Role, Suspend/Reactivate, Force 2FA reset, Remove.

**Backend:** `GET/POST /api/v1/admin/admin-users`, `PATCH/DELETE /api/v1/admin/admin-users/:id`, `POST /api/v1/admin/admin-users/:id/suspend|reactivate|force-2fa-reset`.

**DB:** `admin_users` (name, email, password_hash, role, status, totp_secret, last_login_at).

## B. `/admin/roles-permissions`

**Purpose:** View/edit the permission matrix per role (as defined in Overview §5).

**Layout:** Table — rows = resources (Users, Lawyers, Cases, Payments, Disputes, Reports, Reviews, CMS, Categories, Admin Users, System Settings...), columns = roles, cells = checkboxes for `view/create/update/delete/approve/suspend/export` (expandable per cell or a permissions-editor modal per resource).

**Buttons:** "Save Changes" (batch update), "Reset to Default" per role.

**Backend:** `GET /api/v1/admin/roles-permissions`, `PUT /api/v1/admin/roles-permissions` (batch upsert).

**DB:** `roles` (name), `permissions` (role_id, resource, action) — composite unique key.

**Important:** SUPER_ADMIN role itself is hardcoded to always have all permissions and cannot be edited away (prevent lockout).

## C. `/admin/audit-logs`

**Filter bar:** Search (actor/entity), Action type, Entity type (User/Lawyer/Case/Payment/...), Date range.

**Table columns:** Timestamp, Actor (admin name), Action, Entity type + ID (link to the entity's detail page), IP address, Details (expand to see before/after diff JSON).

**Buttons:** Export CSV. No edit/delete — audit logs are append-only, immutable (main spec §40).

**Backend:** `GET /api/v1/admin/audit-logs?...`. Every write endpoint across the entire admin panel calls a shared `logAudit()` helper — this is the one piece of backend infrastructure every other module depends on, so it should exist from Step 2 onward even though its own UI page is built at Step 14.

**DB:** `audit_logs` (actor_admin_id, action, entity_type, entity_id, before_json, after_json, ip_address, created_at) — table itself should be created in Step 1 migration since every module writes to it.

**RBAC:** Admin Users + Roles&Permissions management = SUPER_ADMIN only. Audit Logs = viewable by all admin roles (each sees all logs — transparency), export = SUPER_ADMIN only.

**End result:** SUPER_ADMIN can invite a new admin with a specific role, that admin logs in and is correctly restricted by the permission matrix (test: a SUPPORT_ADMIN attempting `/admin/payments` gets blocked with a clear "not authorized" screen, not a crash). Every action performed anywhere in the whole demo session up to this point is visible and correctly attributed in Audit Logs.
