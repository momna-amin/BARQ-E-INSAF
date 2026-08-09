# 01 — Admin Dashboard & Analytics

Depends on: Global Admin Shell (Overview §4). Build order: Step 4.

## A. `/admin/dashboard`

**Purpose:** One-glance health of the whole platform for any admin role (read-only for ANALYTICS_ADMIN, others see it too on login).

**Tabs:** none — single scrollable page with sections.

**Sections (top to bottom):**
1. **KPI cards row** (6 cards): Total Users, Total Lawyers, Verified Lawyers, Active Cases, Completed Cases (this month), Revenue (this month). Each card: current value, % change vs previous period, small sparkline.
2. **Cases by Status** — horizontal bar/funnel chart (Draft → Submitted → Matched → Active → Completed).
3. **Cases by Category** — pie/donut chart (Property, Family, Civil, etc.).
4. **Cases by District** — bar chart, top 10 districts.
5. **Lawyer Verification Funnel** — Pending / Under Review / Verified / Rejected counts as a small stacked bar.
6. **Recent Activity feed** — last 15 audit log entries, plain list, "View all" → `/audit-logs`.
7. **Pending Actions widget** — count + link for: Lawyers awaiting verification, Open disputes, Unread reports, Pending refunds.

**Buttons/Actions:**
- Date-range picker (Today / 7d / 30d / Custom) — re-fetches all sections.
- "Export summary PDF" button (top-right).

**Frontend:** Server Component fetches aggregate data on load; date-range switch re-fetches via a client-side query hook. Recharts for all charts. Cards use shadcn `Card`.

**Backend:**
- `GET /api/v1/admin/dashboard/summary?range=` → `{ kpis, casesByStatus, casesByCategory, casesByDistrict, verificationFunnel }`. Implemented as aggregate SQL queries (COUNT/GROUP BY) against `cases`, `users`, `lawyer_profiles`, `payments` — no need for a separate analytics warehouse at this stage.
- `GET /api/v1/admin/dashboard/recent-activity` → last N `audit_logs` rows joined with `admin_users` for actor name.
- `GET /api/v1/admin/dashboard/export` → generates PDF (use a lightweight server-side PDF lib) of the current KPI snapshot.

**End result:** Opening `/admin/dashboard` with seed data shows real, non-placeholder numbers and charts that change when the date range changes.

---

## B. `/admin/analytics` (deeper version of the dashboard, ANALYTICS_ADMIN focus)

**Tabs:**
- **Platform Growth** — new users/lawyers/cases over time (line chart), selectable metric.
- **Conversion Funnel** — Case Created → Matched → Proposal Sent → Proposal Accepted → Payment Completed, with % drop-off at each stage.
- **Lawyer Performance** — table: lawyer name, response time, cases handled, rating, conversion %; sortable, exportable.
- **Financial** — revenue over time, platform fee revenue vs lawyer payouts, by category/district.
- **Geo (District-level heat)** — table/bar view of case volume per district (no exact addresses — aggregated counts only, per privacy rule in main spec).

**Buttons:** date range, "Export CSV" per tab, "Export full report PDF".

**Backend:** each tab = one aggregate endpoint, e.g. `GET /api/v1/admin/analytics/growth`, `.../funnel`, `.../lawyer-performance`, `.../financial`, `.../geo`. All read-only, all built on existing tables (no new tables needed for v1 — do NOT build a separate analytics warehouse yet).

**RBAC:** ANALYTICS_ADMIN and SUPER_ADMIN get full access; other roles get view-only on Dashboard, no access to `/analytics`.

**End result:** Every chart/table on this page is driven by real query results (seed data acceptable pre-launch), CSV export actually downloads a file with the visible rows.
