# Part One — Documentation

This folder is the build guide for Part One. It grows with the frontend: every
screen built against mock data records here what the backend and database must
provide to make it real.

> **Status (2026-11-25):** Frontend built with mock data. **No backend exists yet.**
> The backend stack is a *proposal awaiting owner approval* — nothing in
> `docs/backend/` is a final decision until it is marked approved in
> [`decisions.md`](decisions.md).

## Read in this order

| Doc | What it covers |
|---|---|
| [decisions.md](decisions.md) | Every product/technical decision: approved, assumed, or open. **Start here.** |
| [frontend/structure.md](frontend/structure.md) | How the frontend is organised and how mock data gets swapped for the API |
| [backend/architecture.md](backend/architecture.md) | Proposed backend stack and module layout (pending approval) |
| [backend/database.md](backend/database.md) | Draft schema: tables, keys, constraints, indexes, money rules |
| [backend/api-contract.md](backend/api-contract.md) | Every endpoint the frontend calls, mapped to the function that calls it |
| [backend/auth-and-rbac.md](backend/auth-and-rbac.md) | Google sign-in, sessions, roles, permissions, data scoping, audit log |
| [backend/orders-and-payments.md](backend/orders-and-payments.md) | Checkout, Paystack, webhooks, stock, order states, refunds, ledger, payouts |
| [backend/operations.md](backend/operations.md) | Jobs, environments, secrets, monitoring, security checklist, testing |
| [recommendations.md](recommendations.md) | Structure for the future recommendation engine and v2 (TikTok-style) content |

## Repository layout

```
Part One/
├── docs/          ← you are here
└── web/           ← Next.js frontend (mock data until the API exists)
    # planned, not created yet:
    # api/         ← backend (after stack approval)
```

## Conventions

- **Money** is always integer **kobo** (₦1 = 100 kobo), in the database, the API and the frontend.
- **Times** are UTC ISO-8601 in storage and APIs; display in `Africa/Lagos`.
- **IDs** are opaque strings with a type prefix (`prd_…`, `ord_…`) — see database.md.
- "Mock" in code comments marks something that only works because there is no backend yet.
