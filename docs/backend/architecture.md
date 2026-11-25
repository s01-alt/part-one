# Backend architecture — PROPOSAL

> **Status: Proposed — awaiting owner approval (D-040).** Do not start building
> until this is approved. Every row below can be changed.

## Shape

One **modular monolith** — a single API service plus a single background worker
built from the same codebase, one PostgreSQL database. No microservices (PRD §26).

```
             ┌──────────────┐        ┌──────────────────────┐
  Browser ──▶│  web (Next)  │──API──▶│  api (HTTP)          │──┐
             └──────────────┘        │  modules:            │  │   ┌────────────┐
                                     │   auth · catalog ·   │  ├──▶│ PostgreSQL │
  Paystack ──webhook────────────────▶│   cart · checkout ·  │  │   └────────────┘
                                     │   orders · payments ·│  │   ┌────────────┐
                                     │   ledger · payouts · │  ├──▶│ S3-compat. │
                                     │   social · moderation│  │   │ storage    │
                                     │   · notifications ·  │  │   └────────────┘
                                     │   admin · audit      │  │
                                     └──────────────────────┘  │
                                     ┌──────────────────────┐  │
                                     │ worker (same code)   │──┘  jobs: webhooks,
                                     │ pg-boss job queue    │     payouts, reconcile,
                                     └──────────────────────┘     analytics, cleanup
```

## Proposed stack (platform-independent, D-001)

| Area | Proposal | Portability |
|---|---|---|
| Language | TypeScript on Node.js 22/24 LTS | Same language as frontend; shared types |
| Framework | NestJS (modules, guards for RBAC, validation pipes) | Runs anywhere Node runs |
| Database | PostgreSQL 16+ | Any provider or self-hosted |
| ORM / migrations | Prisma (migrations committed as SQL) | Plain SQL migrations |
| API | REST + OpenAPI 3.1; typed client generated for the frontend | — |
| Auth | Built in the API: Google OpenID Connect → server-side sessions in Postgres (httpOnly cookie for web; bearer tokens later for mobile) | No auth vendor |
| Storage | Any S3-compatible bucket (R2, S3, Backblaze, MinIO) via presigned uploads | Switch by config |
| Search | Postgres full-text search + `pg_trgm` | No extra service |
| Queue / cron | `pg-boss` (jobs stored in Postgres) | No Redis |
| Payments | Paystack: Transactions, Refunds, Transfers, Transfer Recipients, webhooks | Behind a `PaymentProvider` interface |
| Notifications | `notifications` table + API (in-app only, D-006) | — |
| Analytics | PostHog (PRD) — server-side events from the worker | — |
| Logs / errors | Structured JSON logs to stdout; Sentry SDK (self-hostable) | — |
| Packaging | Docker image; `docker compose` for local dev (Postgres + MinIO) | Any container host |
| CI | GitHub Actions: lint, typecheck, tests against real Postgres | If repo is on GitHub |

## Module boundaries

Each module owns its tables and exposes a service interface; other modules call the
service, never the tables directly. Money-moving code (`payments`, `ledger`,
`payouts`) is isolated and fully covered by tests.

| Module | Owns |
|---|---|
| auth | users, sessions, oauth_accounts |
| sellers | brands, seller_applications, bank accounts |
| catalog | products, variants, images, collections, categories, search |
| cart | carts, cart_items |
| checkout / orders | marketplace_orders, seller_orders, order_lines, status history |
| payments | payments, refunds, chargebacks, webhook_events |
| ledger / payouts | ledger_entries, payouts |
| social | likes, saves, reposts, shares, comments, brand_follows, counters |
| reviews | reviews |
| moderation | reports, moderation actions |
| notifications | notifications |
| admin / audit | admin roles, platform_settings, audit_log |
| events | analytics outbox (feeds PostHog and, later, recommendations) |

## Why this shape

1. **Speed to MVP** — one deployable, one database, one language with the frontend.
2. **Reliability** — Postgres transactions guard stock and money; the job queue lives in the same DB, so "write order + enqueue job" is atomic.
3. **Security** — RBAC guards and data scoping live in one codebase; audit log in the same transaction as the action.
4. **Cost** — two small containers + one Postgres + one bucket.
5. **Future** — mobile app reuses the API; Shopify and logistics integrations become new modules; recommendations read the events table (recommendations.md).

## Open infrastructure choices (need owner input)

- Hosting provider and region (latency from Nigeria — measure before choosing).
- Where the repo lives (GitHub?) — decides CI.
- Error monitoring: Sentry cloud vs self-hosted.
