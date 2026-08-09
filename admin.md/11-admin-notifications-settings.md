# 11 — Notifications Center, Notification Settings & System Settings

Build order: Step 15 (last, but the underlying notification event table should exist from Step 1 since Users/Lawyers/Cases modules trigger notifications earlier).

## A. `/admin/notifications-center` (admin's own inbox)

**Purpose:** Not user-facing notifications — this is where the platform notifies *admins* (e.g. "New lawyer verification pending", "New dispute opened", "Payment failed").

**Layout:** Bell icon dropdown (global, top bar) + full page list with tabs: All / Unread / Cases / Payments / Verification / Disputes / System.

**Buttons:** Mark as read, Mark all as read, click-through to relevant entity.

**Backend:** `GET /api/v1/admin/notifications?...`, `POST /api/v1/admin/notifications/:id/read`, `POST /api/v1/admin/notifications/read-all`. Realtime push via Supabase Realtime channel scoped to admin role.

**DB:** `notifications` (recipient_admin_id or recipient_role, type, title, message, entity_type, entity_id, read_at, created_at) — reuse the same `notifications` table structure as the client/lawyer-facing one (main spec §59), just with an admin recipient type.

## B. `/admin/notification-settings` (system-wide, SUPER_ADMIN)

**Purpose:** Configure the notification *templates* and *channel matrix* used platform-wide (main spec §60 table: event → WhatsApp/Email/In-App on/off).

**Table:** Event name (New Proposal, Message, Appointment, Payment, Receipt, Security Alert, etc.) × channel toggles (WhatsApp/Email/In-App), plus "Edit Template" button per row opening a template editor (subject/body with variable placeholders like `{{client_name}}`, 3-language tabs).

**Buttons:** Save, Preview (renders template with sample data), Send Test.

**Backend:** `GET/PUT /api/v1/admin/notification-templates`, `POST /api/v1/admin/notification-templates/:event/test`.

**DB:** `notification_templates` (event, channel, subject_en/ur/sd, body_en/ur/sd, enabled).

**Rule enforced in UI:** Critical/security events (main spec §60) cannot have all channels disabled — at least one must stay on; the Save action validates this before persisting.

## C. `/admin/system-settings`

**Tabs:**
1. **General** — platform name, support email/phone, default language, timezone, maintenance mode toggle.
2. **Integrations** — status/config for Email provider (SMTP host/from-address — secrets stored server-side only, never shown in full in UI), WhatsApp/Baileys service URL + health check, Payment gateway keys (masked), Storage (R2 bucket config).
3. **Fees & Business Rules** — platform commission %, lead credit pricing, featured-listing pricing — plain numeric fields.
4. **Legal Content** — links/versions of Terms of Service, Privacy Policy, Lawyer Agreement, Client Agreement (version history, "Publish new version" button).

**Buttons:** Save per tab, "Test Connection" next to each integration (pings the service, shows green/red status).

**Backend:** `GET/PUT /api/v1/admin/settings/general|fees|legal`, `GET /api/v1/admin/settings/integrations`, `POST /api/v1/admin/settings/integrations/:service/test`.

**DB:** `platform_settings` (key/value, category), `legal_documents` (type, version, body, published_at).

**RBAC:** System Settings = SUPER_ADMIN only. Notification Settings = SUPER_ADMIN only. Notifications Center = every admin role sees their own.

**End result:** Admin can flip a notification channel off/on and send a test notification that actually arrives (email at minimum for demo; WhatsApp once Baileys service is connected); System Settings integration "Test Connection" buttons show real pass/fail against the configured services.
