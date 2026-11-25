# Part One

Nigerian streetwear marketplace with product-based social features.
v1: brands, storefronts and a multi-seller marketplace (NGN, Paystack).
v2: TikTok-style content.

| Folder | What |
|---|---|
| [`web/`](web/) | Next.js frontend — currently runs on **mock data** |
| [`docs/`](docs/README.md) | Decisions, frontend structure, backend & database build guide |

## Run the frontend

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

Sign in at `/login` with a **demo account** (customer, seller, or one of the three
admin roles). Demo sign-in is a development mock and must be removed before deployment —
see `docs/backend/auth-and-rbac.md`.

## Status

- Frontend: public site, shop, product/brand pages, cart, checkout UI, customer
  account, seller dashboard, admin dashboard — all on mock data.
- Legal pages: **drafts** needing review by a Nigerian lawyer.
- Backend: **not started** — stack proposal awaiting approval (`docs/decisions.md` D-040).
