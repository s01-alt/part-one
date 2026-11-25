# Part One

The home of Nigerian streetwear — a social marketplace for approved brands.
v1: brands, storefronts and a multi-seller marketplace (NGN, Paystack).
v2: TikTok-style content.

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui (Radix) · Zustand · Vercel Analytics.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint
```

Sign in at `/login` with a **demo account** (customer, seller, or one of the three
admin roles). Demo sign-in is a development mock and must be removed before deployment —
see `docs/backend/auth-and-rbac.md`.

## Where things are

| Path | What |
|---|---|
| `src/` | The app. Pages read data only through `src/lib/data/*` (mock data today) |
| `docs/` | Decision log, frontend structure, backend & database build guide — start at [`docs/README.md`](docs/README.md) |
| `docs/design/homepage-inspo.png` | Brand reference for the visual language |
| `AGENTS.md` | Next.js 16 notes for coding agents |

## Status

- Frontend: home, waitlist, shop, product and brand pages, community feed, cart and
  checkout UI, customer account, seller dashboard, admin dashboard — all on mock data.
- Waitlist: validates but **does not store sign-ups yet** (no backend) — see `docs/decisions.md` D-045.
- Legal pages: **drafts** that need review by a Nigerian lawyer.
- Backend: **not started** — stack proposal awaiting approval (`docs/decisions.md` D-040).
