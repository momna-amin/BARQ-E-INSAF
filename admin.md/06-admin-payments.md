# 06 — Payments, Transactions, Payouts, Refunds

Depends on: Proposals module. Build order: Step 10. For MVP, no escrow (see main spec §20/§25) — build the read/reporting layer first; wire to a real Pakistan payment gateway only when that provider is chosen (keep gateway code in `/lib/payments` adapter).

## A. `/admin/payments/transactions` (list)

**Filter bar:** Search (transaction ID/case ID/user), Status (Pending/Success/Failed/Refunded), Date range, Payment method.

**Table columns:** Transaction ID, Case ID, Client, Lawyer, Amount, Platform fee, Status badge, Date, Actions.

**Row detail (drawer):** full transaction record, linked receipt (view/download PDF), gateway reference ID, raw gateway response (collapsed JSON, for debugging).

**Buttons:** "Export CSV", "Resend Receipt" (re-triggers email/WhatsApp receipt delivery).

## B. `/admin/payments/payouts`

**Purpose:** Track money owed/paid to lawyers.

**Table columns:** Lawyer, Period, Amount due, Amount paid, Status (Pending/Processing/Paid), Actions.

**Buttons:** "Mark as Paid" (manual, for MVP before automated payout rails exist — requires reference note), "Export CSV".

## C. `/admin/payments/refunds`

**Table columns:** Transaction ID, Case ID, Client, Amount, Reason, Status (Requested/Approved/Rejected/Processed), Date.

**Buttons:** "Approve Refund" → confirm dialog → status `Approved` → (manual processing note for MVP) → "Mark Processed". "Reject Refund" (reason required).

**Backend:**
- `GET /api/v1/admin/payments/transactions?...`, `GET /api/v1/admin/payments/transactions/:id`.
- `POST /api/v1/admin/payments/transactions/:id/resend-receipt`.
- `GET /api/v1/admin/payments/payouts?...`, `POST /api/v1/admin/payments/payouts/:id/mark-paid` `{ reference }`.
- `GET /api/v1/admin/payments/refunds?...`, `POST /api/v1/admin/payments/refunds/:id/approve|reject` `{ reason? }`, `POST /api/v1/admin/payments/refunds/:id/mark-processed`.

**DB:** `payments`, `transactions`, `invoices`, `receipts`, `refunds`, `payouts`, `platform_fees` (main spec §41). All monetary columns integer (smallest unit), `currency` column for future multi-currency.

**RBAC:** FINANCE_ADMIN owns this module entirely; SUPER_ADMIN full access; other roles no access.

**End result:** Seeded transactions/payouts/refunds render with correct totals, refund approve/reject flow works end-to-end and is reflected in Dashboard revenue KPI.
