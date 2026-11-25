# Authentication, RBAC and data scoping

> Draft. Implements PRD §19 and §25. Frontend counterpart: `src/lib/auth/`.

## Sign-in (Google only in v1)

Built inside the API — no auth vendor (D-001).

1. `GET /v1/auth/google/start?next=/checkout` → API creates `state` + PKCE
   `code_verifier`, stores them in a short-lived signed cookie, redirects to Google
   with scopes `openid email profile`.
2. Google redirects to `/v1/auth/google/callback?code&state`. API checks `state`,
   exchanges the code (with PKCE), **verifies the ID token** (signature, `aud`, `iss`,
   `exp`, `email_verified`).
3. Find `oauth_accounts(provider='google', provider_user_id=sub)` or create the user.
4. Create a session: random 32-byte token → cookie `p1_session`
   (`HttpOnly; Secure; SameSite=Lax; Path=/`), store only its SHA-256 hash in `sessions`.
   Lifetime 30 days sliding; rotate the token on privilege change.
5. Redirect to `next` — **only** if it is a same-site relative path (prevents open redirects).

Logout revokes the session row. Suspending a user revokes all their sessions.
For the future mobile app, the same flow issues a bearer token instead of a cookie.

**CSRF:** cookie is `SameSite=Lax`; state-changing endpoints also require either a
custom header (`X-Requested-With`) or a CSRF token, and the API only accepts
CORS requests from the web origin.

## Roles

A user is always a **customer**. Two optional grants:

| Grant | Column | Meaning |
|---|---|---|
| Seller | `users.seller_brand_id` | This login manages exactly one brand (D-030, D-031) |
| Admin | `users.admin_role` | `founder` · `report_manager` · `developer` |

## Admin permission matrix

Single source of truth in code: `src/lib/auth/permissions.ts` (to be moved to a
shared package used by both web and api). Shown live at `/admin/settings`.

| Permission | Founder | Report Manager | Developer |
|---|:-:|:-:|:-:|
| admin.dashboard.view | ✓ | ✓ | ✓ |
| admin.users.manage | ✓ | | |
| admin.sellers.review | ✓ | | |
| admin.sellers.suspend | ✓ | | |
| admin.products.manage | ✓ | ✓ | |
| admin.orders.manage | ✓ | | ✓ |
| admin.payments.view | ✓ | | ✓ |
| admin.refunds.issue | ✓ | | |
| admin.payouts.manage | ✓ | | |
| admin.moderation.manage | ✓ | ✓ | |
| admin.settings.manage | ✓ | | |
| admin.roles.manage | ✓ | | |
| admin.system.view | ✓ | | ✓ |

The Report Manager and Developer columns are **assumed** (D-033) — confirm.

## Enforcement rules (backend)

1. **Every** admin endpoint declares one permission; a guard rejects without it.
2. **Seller scoping is in the query, not after it.** Seller endpoints never accept a
   `brandId` from the client — it comes from the session:
   `where brand_id = :sessionBrandId and id = :id`. No row → 404.
3. Customer endpoints scope by `customer_id = :sessionUserId` the same way.
4. Sellers see only the customer data needed to ship (name, address, phone) for their
   own seller orders — never email or other orders.
5. Admin role changes require `admin.roles.manage`, can't demote the last founder, and
   revoke the target's sessions.
6. Tests: for each seller/customer endpoint, a test that user A cannot read or modify
   user B's resource (expect 404). These are part of the MVP definition of done.

## Audit log

Written **in the same transaction** as the action, append-only (DB role has no
UPDATE/DELETE on `audit_log`). Required for:

- seller application decisions, suspensions/reinstatements
- product removals, comment/review removals, report decisions
- refunds (who, how much, why), payout retries, manual ledger adjustments
- commission/threshold/VAT changes, admin role changes, user suspensions

Fields: actor, actor role, action, target, before/after JSON, IP, time.

## Replacing the mock

`src/lib/auth/session.ts` currently trusts a plain `p1_mock_session` cookie
containing a user ID. **It is insecure by design and must be deleted before any
deployment** (D-043). Replacement: `getCurrentUser()` calls `GET /v1/me`
forwarding the request's cookie; `proxy.ts` checks for `p1_session` instead.
