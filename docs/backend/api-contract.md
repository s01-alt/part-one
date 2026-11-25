# API contract — DRAFT

> REST + JSON, versioned under `/v1`. Draft until the stack is approved. Each
> endpoint lists the frontend function in `src/lib/data/*` (or component)
> that will call it, so wiring the frontend is mechanical.

## Conventions

- Base URL: `https://api.<domain>/v1` (frontend reads `NEXT_PUBLIC_API_URL` / `API_URL`).
- Auth: httpOnly `Secure` session cookie (`SameSite=Lax`) for web; `Authorization: Bearer` later for mobile.
- Money in **kobo** integers. Timestamps UTC ISO-8601.
- Lists: `?page=&pageSize=` (max 60) → `{ items, page, pageSize, total, totalPages }`.
- Errors: `{ "error": { "code": "OUT_OF_STOCK", "message": "…", "details": {…} } }` with real HTTP status codes.
- Other users' resources return **404**, not 403.
- Mutations accept an `Idempotency-Key` header (required on checkout, refunds, payouts).
- Rate limits on auth, checkout, comments, reports, uploads (see operations.md).

## Public catalogue

| Method & path | Purpose | Frontend caller |
|---|---|---|
| GET `/products` | Search/filter/sort. Query: `q, brand, style, type, size, color, minPrice, maxPrice, minRating, sort(relevance\|newest\|price_asc\|price_desc\|rating), page` (lists are comma-separated) | `catalog.listProducts` |
| GET `/products/new-drops` | Newest listed | `catalog.listNewDrops` |
| GET `/products/:slug` | Product detail with variants, images, counts, brand | `catalog.getProduct` |
| GET `/products/:id/related` | Related (rules now, recommendations later) | `catalog.listRelatedProducts` |
| GET `/products/:id/reviews` | Reviews | `catalog.listReviews` |
| GET `/products/:id/comments` | Comments | `catalog.listComments` |
| GET `/catalog/facets` | Filter options + counts | `catalog.getFacets` |
| GET `/brands` · GET `/brands/:slug` | Brands, storefront | `catalog.listBrands`, `getBrand` |
| GET `/brands/:slug/products` · `/collections` | Storefront contents | `listBrandProducts`, `listBrandCollections` |
| GET `/feed/reposts` | Global repost feed (cursor pagination) | `account.listRepostFeed` |

## Pre-launch

| Method & path | Purpose | Frontend caller |
|---|---|---|
| POST `/waitlist` `{ name, email, role: "shopper" \| "brand", city? }` | Join waitlist (rate-limited; duplicate email returns 200 without revealing it exists) | `lib/waitlist/actions.ts` → `joinWaitlist` |

## Auth and me

| Method & path | Purpose | Frontend caller |
|---|---|---|
| GET `/auth/google/start?next=` | Redirect to Google | "Continue with Google" button |
| GET `/auth/google/callback` | Create/find user, set session, redirect to `next` | — |
| POST `/auth/logout` | Revoke session | `signOut` |
| GET `/me` | Current user + roles + permissions | `session.getCurrentUser` |
| GET/POST/PATCH `/me/addresses` | Saved addresses | checkout |
| GET `/me/orders` · `/me/orders/:id` | Customer orders | `listMyOrders`, `getMyOrder` |
| POST `/me/seller-orders/:id/cancel` | Customer cancellation (D-017/D-018) | `SellerOrderActions` |
| GET `/me/saves` · `/me/likes` · `/me/follows` | Private lists | `listMySaved`, `listMyFollowedBrands` |
| GET `/me/notifications` · POST `/me/notifications/read` | In-app notifications | `listMyNotifications` |

## Social and reviews (sign-in required)

| Method & path | Notes |
|---|---|
| PUT/DELETE `/products/:id/like` · `/save` · `/repost` | Idempotent toggles; body for repost `{ caption? }` |
| POST `/products/:id/shares` `{ channel }` | Also allowed signed-out (analytics) |
| POST `/products/:id/comments` · DELETE `/comments/:id` | Author or moderator can delete |
| POST `/products/:id/reviews` `{ orderLineId, rating, body }` | 422 unless that line's seller order is Delivered |
| PUT/DELETE `/brands/:id/follow` | |
| POST `/reports` `{ targetType, targetId, reason, details }` | |

## Cart and checkout

| Method & path | Notes |
|---|---|
| GET `/cart` · PUT `/cart/items/:variantId` `{ quantity }` · DELETE `/cart/items/:variantId` | Server cart for signed-in users |
| POST `/cart/merge` `{ lines: [{variantId, quantity}] }` | Called once after sign-in with the local Zustand cart |
| POST `/checkout` `{ addressId \| address }` | Re-prices, validates stock, creates pending orders, initialises Paystack → `{ orderId, reference, authorizationUrl, accessCode }` |
| GET `/checkout/:reference/status` | Callback page polls until the webhook has confirmed |
| POST `/webhooks/paystack` | Paystack only. Signature verified. See orders-and-payments.md |

## Seller (role: seller; always scoped to the caller's brand)

| Method & path | Frontend caller |
|---|---|
| POST `/seller-applications` | `SellerApplicationForm` |
| GET/PATCH `/seller/store` | `getMyBrand`, `StoreSettingsForm` |
| PUT `/seller/bank-account` `{ bankCode, accountNumber }` | resolves name via Paystack, creates transfer recipient |
| GET/POST `/seller/products` · GET/PATCH `/seller/products/:id` | `listSellerProducts`, `getSellerProduct`, `ProductEditor` |
| PUT `/seller/products/:id/variants` | full variant matrix with stock |
| POST `/seller/uploads` `{ contentType, size }` → presigned PUT URL | image upload |
| GET `/seller/orders` · `/seller/orders/:id` | `listSellerOrders`, `getSellerOrder` |
| POST `/seller/orders/:id/status` `{ to }` | `OrderStatusControl` (allowed transitions only) |
| GET `/seller/balance` · `/seller/ledger` · `/seller/payouts` | payouts page |
| GET `/seller/stats?from=&to=` | overview (sales, revenue by date) |

## Admin (role: admin; each endpoint checks one permission)

| Method & path | Permission |
|---|---|
| GET `/admin/overview` | `admin.dashboard.view` |
| GET `/admin/seller-applications` · POST `…/:id/review\|approve\|reject` | `admin.sellers.review` |
| GET `/admin/brands` · POST `/admin/brands/:id/suspend\|reinstate` | `admin.sellers.suspend` |
| GET `/admin/products` · POST `/admin/products/:id/remove\|restore` | `admin.products.manage` |
| GET `/admin/orders` · `/admin/orders/:id` | `admin.orders.manage` |
| POST `/admin/seller-orders/:id/refund` `{ amount?, reason }` | `admin.refunds.issue` |
| GET `/admin/payments` · `/admin/payouts` · POST `/admin/payouts/:id/retry` | `admin.payments.view` / `admin.payouts.manage` |
| GET `/admin/reports` · POST `/admin/reports/:id/action\|dismiss` | `admin.moderation.manage` |
| DELETE `/admin/comments/:id` · `/admin/reviews/:id` | `admin.moderation.manage` |
| GET `/admin/users` · POST `/admin/users/:id/suspend\|reinstate` | `admin.users.manage` |
| GET/PATCH `/admin/settings` | `admin.settings.manage` |
| GET/PUT `/admin/users/:id/admin-role` | `admin.roles.manage` |
| GET `/admin/system/webhooks` · `/jobs` · `/audit-log` | `admin.system.view` |

## Documentation

The API publishes `/v1/openapi.json` generated from code, rendered at `/docs`
(non-production only, or behind admin auth). The frontend generates its types
and client from that file in CI.
