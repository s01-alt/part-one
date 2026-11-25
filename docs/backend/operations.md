# Operations, security and testing

> Draft. Platform-independent by design (D-001).

## Environments

| Env | Purpose | Paystack keys | Data |
|---|---|---|---|
| local | `docker compose up` (Postgres, MinIO, api, worker) + `npm run dev` in web | test | seed from mock data |
| staging | pre-release checks, Paystack test mode | test | seed + anonymised |
| production | live | live | real |

Secrets (env vars, never in git): `DATABASE_URL`, `SESSION_SECRET`,
`GOOGLE_CLIENT_ID/SECRET`, `PAYSTACK_SECRET_KEY`, `S3_ENDPOINT/BUCKET/KEY/SECRET`,
`SENTRY_DSN`, `POSTHOG_KEY`. Production secrets are held by the owner; the
assistant does not access production infrastructure.

## Background jobs (pg-boss)

| Job | Trigger | Notes |
|---|---|---|
| webhook.process | each webhook | retries with backoff |
| orders.expire-pending | every 5 min | pending_payment older than 30 min |
| refunds.auto-oversell | after webhook | D-016 |
| ledger.release | on delivered / hourly | sets availability after hold |
| payouts.run | hourly | §7 of orders-and-payments.md |
| reconcile.paystack | daily 02:00 WAT | compare transactions, transfers, refunds |
| counters.recompute | nightly | likes/saves/reposts/ratings |
| analytics.export | every minute | outbox → PostHog |
| notifications.cleanup | weekly | delete read > 180 days |

## Security checklist (PRD §25)

- [ ] Google ID-token verification, PKCE, `state`, same-site `next` redirects
- [ ] Sessions: hashed tokens, httpOnly/Secure/SameSite cookies, revocation
- [ ] RBAC guard on every admin route; seller/customer scoping in queries; 404 on foreign IDs
- [ ] Input validation on every endpoint (DTO schemas); max lengths on text
- [ ] Rate limits: auth 10/min/IP, checkout 5/min/user, comments 10/min/user, reports 5/min/user, uploads 20/hour/seller
- [ ] Webhooks: HMAC-SHA512 signature, idempotency table, re-verify with Paystack
- [ ] Money: integer kobo, DB transactions + row locks, append-only ledger, refunds ≤ payment
- [ ] Uploads: presigned URLs, content-type allow-list (jpeg/png/webp), size ≤ 5 MB, strip EXIF, max 5 per product
- [ ] Customer data: sellers see only shipping details for their orders; no full bank numbers stored
- [ ] Audit log for financial/admin actions (append-only)
- [ ] Security headers (CSP, HSTS, frame-ancestors) on web and API; CORS limited to web origin
- [ ] Dependency scanning in CI; secrets scanning; least-privilege DB user
- [ ] Backups: daily Postgres backups with point-in-time recovery; restore tested
- [ ] NDPA 2023: privacy policy final, data export/delete endpoints, breach procedure

## Monitoring

- Health: `GET /v1/health` (DB + queue). External uptime check.
- Errors: Sentry for api, worker and web.
- Alerts: webhook failures, payout failures, reconciliation mismatches, job backlog, 5xx rate.
- Logs: JSON with request ID; never log tokens, card data or full bank numbers.

## Testing strategy

| Layer | Tooling (proposed) | Covers |
|---|---|---|
| Unit | Vitest | totals, transitions, permissions, ledger math |
| Integration | Vitest + real Postgres (Testcontainers or CI service) | endpoints, scoping, webhooks, jobs |
| Contract | OpenAPI diff in CI | frontend/backend drift |
| E2E | Playwright against staging (Paystack test mode) | browse → multi-seller cart → pay → seller ships → delivered → payout |

The MVP definition (PRD §32) requires automated tests on critical flows — the
"Tests that must exist" list in orders-and-payments.md is the minimum.
