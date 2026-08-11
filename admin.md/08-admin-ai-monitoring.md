# 08 — AI Monitoring

Depends on: Cases module + AI subsystem existing (later phase). Build order: Step 12. This page can be built with mocked/seeded AI session data before the real AI intake system exists — it just needs the schema in place.

## `/admin/ai-monitoring`

**Tabs:**
1. **Sessions** — table of AI intake sessions: session ID, user, case (if created), started/ended, # messages, outcome (Case Created / Abandoned / Escalated to Human). Row detail opens full transcript (read-only).
2. **Classification Accuracy** — table comparing AI-assigned category vs admin/human-corrected category (where corrections exist), simple accuracy % per category.
3. **Flagged Responses** — AI answers that were auto-flagged by the safety layer (main spec §33: unsupported claims, missing sources, excessive certainty) for human review. Admin can mark Reviewed / Needs Prompt Fix.
4. **Usage & Cost** — token usage per day/week, estimated cost (if using paid API), broken down by feature (Intake / Classification / Matching / Summary / Document Analysis).

**Buttons:** Export CSV per tab. On Flagged Responses: "Mark Reviewed", "Add Note".

**Backend:**
- `GET /api/v1/admin/ai/sessions?...`, `GET /api/v1/admin/ai/sessions/:id`.
- `GET /api/v1/admin/ai/classification-accuracy`.
- `GET /api/v1/admin/ai/flagged?...`, `POST /api/v1/admin/ai/flagged/:id/review` `{ note }`.
- `GET /api/v1/admin/ai/usage?range=`.

**DB:** `ai_sessions`, `ai_messages`, `ai_case_analysis` (main spec §41). Add `flagged`, `flag_reason`, `reviewed_by`, `review_note` to `ai_messages` or a dedicated `ai_flags` table.

**RBAC:** ANALYTICS_ADMIN (read) + SUPER_ADMIN (full, can mark reviewed). Other roles: no access.

**End result:** Page renders with seeded/mock session data even before the real AI pipeline exists, so it demos a "we monitor our AI" story; once real AI sessions start writing to these tables, no frontend changes are needed.
