# Frontend structure

The app at the repo root is a Next.js 16 App Router app. Next 16 differs from older versions — read
`AGENTS.md` and the bundled docs in `node_modules/next/dist/docs/` before
changing framework-level code.

## Key Next.js 16 rules this codebase follows

- **Cache Components are on** (`cacheComponents: true`). Anything that reads request
  data — `cookies()`, `searchParams`, dynamic `params`, `usePathname()` — must sit
  inside `<Suspense>`, otherwise the build fails. Pattern used everywhere: the page
  shell is static, the request-dependent part is an inner async component inside
  `<Suspense>` (see `app/(public)/shop/page.tsx`, `components/app/side-nav.tsx`).
- `params` and `searchParams` are **Promises**. Pages are typed with the global
  `PageProps<"/route">` / `LayoutProps<"/route">` helpers (run `npx next typegen`
  after adding routes).
- **Middleware is now `proxy.ts`** (`src/proxy.ts`). It only does an optimistic
  "is there a session cookie?" redirect. Real checks happen in server code.

## Folders

```
src/
├── app/
│   ├── (public)/            marketplace with site header/footer
│   │   ├── page.tsx         marketing home
│   │   ├── shop/            search + filters + sort (URL-driven)
│   │   ├── products/[slug]/ product page (gallery, variants, social, reviews, comments)
│   │   ├── brands/          brand list + standard storefront template
│   │   ├── feed/            global repost feed
│   │   ├── cart/ checkout/  multi-seller cart and checkout
│   │   ├── login/           sign-in (Google placeholder + demo accounts)
│   │   ├── sell/ sell/apply seller landing + application
│   │   ├── account/         customer area: orders, saved, following, notifications
│   │   └── privacy/ terms/  DRAFT legal pages
│   ├── (dashboard)/         full-width dashboard shell
│   │   ├── seller/          overview, products (+editor), orders, payouts, store
│   │   └── admin/           overview, sellers, products, orders, payments,
│   │                        moderation, users, settings & roles, system
│   └── not-found.tsx
├── components/              UI by area (ui/ = shadcn primitives)
├── lib/
│   ├── types.ts             domain types — mirror docs/backend/database.md
│   ├── format.ts            money (kobo → ₦), dates, labels, VAT rate
│   ├── data/                ★ DATA ACCESS LAYER — the only place pages get data
│   │   ├── catalog.ts       public catalogue
│   │   ├── account.ts       customer / seller / admin (scoped to the user)
│   │   └── query.ts         shop URL ⇄ ProductQuery
│   ├── auth/                session (MOCK), permissions (RBAC), server actions
│   ├── store/cart.ts        Zustand guest cart + seller-split totals
│   └── mock/                fictional data — delete when the API is live
└── proxy.ts
```

## The mock → API seam

Pages never import `lib/mock/*`. They call functions in `lib/data/*`, each of which
names its future endpoint in a comment (e.g. `/** GET /v1/products */`). To connect
the backend:

1. Generate types from the backend's OpenAPI spec and replace hand-written types in `lib/types.ts`.
2. Add an API client (`lib/api/client.ts`) that forwards the session cookie on the server.
3. Re-implement each `lib/data/*` function as a `fetch` to its endpoint. Public catalogue
   reads can use `"use cache"` + `cacheTag()`; anything user-specific stays uncached.
4. Replace `lib/auth/session.ts` with a call to `GET /v1/me`; delete `mockSignIn`,
   the demo-account list on `/login`, and `lib/mock/`.
5. Client mutations (like, save, follow, cart, status updates) move to TanStack Query
   mutations with optimistic updates. Components marked `MOCK` or using `MockActions`
   / `MockNotice` are the list of places to wire up:
   `grep -rn "MOCK\|MockActions\|MockNotice" src`.
6. Cart: keep Zustand for signed-out users; on sign-in call `POST /v1/cart/merge`
   and switch to the server cart.

## Images

Mock products have no photos; `ProductArt` draws a placeholder silhouette. Real
images: seller uploads go to S3-compatible storage via presigned URLs and are
served through `next/image` (add the storage host to `images.remotePatterns`).

## Security notes for the frontend

- Hiding a button is not authorisation. Every permission in `lib/auth/permissions.ts`
  must be enforced by the API.
- Pages return 404 (not 403) for other users' orders/products so IDs can't be probed —
  the API should do the same.
- `mockSignIn` validates `next` to same-site paths only (no open redirects); keep this
  when the real flow is built.
- With streaming, a `notFound()`/`redirect()` inside a Suspense boundary is delivered in
  the stream with HTTP 200. That is a Next.js behaviour, not a leak — the protected data
  is never rendered — but API endpoints must use real status codes.
