# Barq-e-Insaf — Admin Panel (Master Admin) — Build Specification

> Scope of this document set: **Master Admin module only.** Public site, Client app, and Lawyer app are separate phases and are documented later. This is the file the AI coding agent (Antigravity) should read first before opening any of the per-module `.md` files listed below.

---

## 1. Why Admin First

The Admin panel is the control room for every other module (Users, Lawyers, Cases, Payments, etc.). Building it first gives us:

- A working RBAC + auth foundation reused later by Client/Lawyer apps.
- All core database tables + API endpoints created early (Admin CRUDs almost everything).
- A demo-able, visual product early — investors/judges can see real data, real screens, real actions, even before Client/Lawyer UI exists.

## 2. Tech Stack (Admin Module)

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State/data fetching | React Server Components + TanStack Query for client-side tables |
| Backend | Next.js API routes (or NestJS if agent prefers a separate service) |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (email/password) + custom RBAC table, Admin 2FA (TOTP) |
| File storage | Cloudflare R2 (signed URLs) |
| Realtime | Supabase Realtime (for live dashboard counters, notification bell) |
| Charts | Recharts |
| Tables | TanStack Table (server-side pagination, filters, sort) |

All of this must stay provider-agnostic where reasonably possible (see cost doc) — no vendor-specific code inside business logic, only inside an adapter layer (`/lib/storage`, `/lib/email`, `/lib/whatsapp`).

## 3. Admin Sitemap (full)

```
/admin
├── /login                      (email+password, then 2FA code)
├── /dashboard                  → File 01
├── /users                      → File 02
│   └── /users/:id
├── /lawyers                    → File 03
│   ├── /lawyers/:id
│   └── /lawyers/verification-queue
├── /cases                      → File 04
│   ├── /cases/:id
│   └── /evidence-moderation
├── /proposals                  → File 05
├── /appointments                → File 05
├── /payments                   → File 06
│   ├── /payments/transactions
│   ├── /payments/payouts
│   └── /payments/refunds
├── /disputes                   → File 07
├── /reports                    → File 07
├── /reviews                    → File 07
├── /ai-monitoring              → File 08
├── /cms                        → File 09
│   ├── /cms/pages
│   ├── /cms/faqs
│   └── /cms/legal-resources
├── /categories                 → File 09  (practice areas)
├── /locations                  → File 09  (cities/districts/courts)
├── /admin-users                → File 10
├── /roles-permissions          → File 10
├── /audit-logs                 → File 10
├── /notifications-center       → File 11 (admin's own inbox)
├── /notification-settings      → File 11 (system-wide templates & channels)
└── /system-settings            → File 11
```

Every page above is documented in its own file with: **purpose → tabs → buttons/actions → sub-pages → frontend spec → backend spec (API + DB) → states → RBAC → "done" criteria.**

## 4. Global Admin Shell (applies to every page)

**Layout:**
- Left sidebar: collapsible, grouped nav matching sitemap above, active-state highlight, badge counts on Verification Queue / Disputes / Reports (pending counts, live via Realtime).
- Top bar: global search (users/lawyers/cases by ID or name), notification bell (unread count), admin profile menu (Profile, Change Password, 2FA, Logout).
- Every list page shares one **DataTable component**: server-side pagination, column sort, filter bar, bulk-select, export-to-CSV button, "Columns" visibility toggle.
- Every detail page shares one **DetailShell component**: header with entity name + status badge + primary actions (top-right), left tab strip, right-side "Activity/Audit" panel (collapsible).
- Every destructive/state-changing action shows a **confirm dialog** with reason field where relevant (suspend, reject, refund) — the reason is stored in audit log.
- Global toast notifications for success/error on every action.

**Backend cross-cutting rules:**
- Every Admin API route checks `admin_users.role` against `roles_permissions` before executing.
- Every state-changing route writes one row to `audit_logs` (actor, action, entity_type, entity_id, before/after diff, ip, timestamp).
- All list endpoints support `?page&limit&sort&filter[...]` query params, return `{ data, total, page, limit }`.
- All money fields stored as integer (smallest currency unit) to avoid float errors.

## 5. Admin Roles (RBAC) used throughout

```
SUPER_ADMIN         — full access, only role that can manage Admin Users/Roles
VERIFICATION_ADMIN   — Lawyers, Verification Queue, Categories/Locations
SUPPORT_ADMIN        — Users, Cases, Disputes, Reports, Reviews, Notifications
FINANCE_ADMIN        — Payments, Transactions, Payouts, Refunds
CONTENT_ADMIN        — CMS, Categories, Locations
MODERATION_ADMIN     — Evidence Moderation, Reports, Disputes, Reviews
ANALYTICS_ADMIN      — Dashboard, Analytics, AI Monitoring (read-only)
```
Each permission stored as `(role, resource, action)` triplet — `action` ∈ `view, create, update, delete, approve, reject, suspend, export`. Full schema in File 10.

## 6. Work Partition — build order for the AI agent

Work strictly in this order. Each step should end in a working, demo-able increment — do not jump ahead.

| Step | Deliverable | Depends on |
|---|---|---|
| 1 | DB schema migration for all Admin-related tables (see each file's "DB" section) | — |
| 2 | Admin auth: login, 2FA, session, RBAC middleware | 1 |
| 3 | Global Admin Shell (sidebar, topbar, DataTable, DetailShell, confirm dialog, toast) | 2 |
| 4 | Dashboard + Analytics (File 01) — read-only, uses seed/demo data | 3 |
| 5 | Categories + Locations (File 09) — needed by everything else as dropdown data | 3 |
| 6 | Users module (File 02) | 5 |
| 7 | Lawyers + Verification Queue (File 03) | 5 |
| 8 | Cases + Evidence Moderation (File 04) | 6, 7 |
| 9 | Proposals + Appointments (File 05) | 8 |
| 10 | Payments/Transactions/Payouts/Refunds (File 06) | 9 |
| 11 | Disputes + Reports + Reviews (File 07) | 6, 7, 8 |
| 12 | AI Monitoring (File 08, read-only dashboards) | 8 |
| 13 | CMS (File 09) | 3 |
| 14 | Admin Users + Roles & Permissions + Audit Logs (File 10) | 2 |
| 15 | Notifications Center + Notification Settings + System Settings (File 11) | 3 |

## 7. 50% Demo Checkpoint

At the midpoint of the Admin build, the following must be clickable and populated with realistic **seed data** (fake users/lawyers/cases via a seed script) so it demos well:

- Login + 2FA ✔
- Full sidebar navigation, no dead links ✔
- Dashboard with real charts (from seed data) ✔
- Users list + detail view ✔
- Lawyers list + detail view + Verification Queue with Approve/Reject working end-to-end ✔
- Cases list + detail view showing timeline, evidence, documents (view-only is fine) ✔
- Categories/Locations CRUD fully working ✔
- Audit log showing real entries generated by the actions above ✔

Everything past that (Payments, Disputes, AI Monitoring, CMS, Roles editor, System Settings) can still be in progress at the 50% mark — the six items above are what get demoed to investors/judges.

## 8. "Done" definition for the whole Admin module

Admin module is complete when: every page in the sitemap is reachable, every button performs its real backend action (no dead buttons), every list is paginated/filterable against the real DB, every state-changing action produces an audit log entry, and RBAC actually blocks unauthorized roles (tested by logging in as two different admin roles).

---
**Read next:** open the per-module file for whichever step you are on. Each file is self-contained enough for the agent to build that module without re-reading the others, but assumes this overview and the Global Admin Shell (§4) already exist.
