# Decision log

Status key: **Approved** (owner decided) · **Assumed** (frontend uses a default
until the owner decides — easy to change) · **Open** (needs an answer before the
backend is built) · **Proposed** (engineering proposal awaiting approval).

Sources: MVP Backend Brief, PRD v1.0, and owner answers in chat on 2026-11-25.

## Product and scope

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-001 | Infrastructure must be **platform-independent** (no vendor-locked auth, storage or database). | Approved | Rules out Supabase/Firebase-style bundles. |
| D-002 | **v1 = Shopify + Amazon** (brands, storefronts, multi-seller marketplace). **v2 = TikTok-style** promotions/content, added gradually. | Approved | |
| D-003 | Product **social features stay in v1**: like, save, repost (global feed), share, comment, follow brand. | Approved | No user profiles, user posts, DMs or user-following. |
| D-004 | **No discounts or bundles** in v1. | Approved | Removes discount tables from v1 schema. |
| D-005 | **Promotions/content** move to v2. | Approved | See recommendations.md §v2. |
| D-006 | **In-app notifications only**. No email in v1. | Approved | Sign-in is Google, so no email verification needed. |
| D-007 | **Frontend stack** per PRD: Next.js (16), React (19), TypeScript, Tailwind (4), shadcn/ui, Zustand. TanStack Query is added when the API exists. | Approved (PRD) | |
| D-008 | Product **availability filter**: unavailable products never appear in the marketplace (PRD §5), so "availability" is implemented as *size/colour filters only match in-stock variants*. | Assumed | Confirm or describe the intended filter. |

## Orders, money and fulfilment

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-010 | **Sellers handle shipping** and update status. | Approved | |
| D-011 | Delivery fee model: **one flat fee per seller order**, set by the seller. | Assumed | Alternative: by state/zone. |
| D-012 | **Commission on delivery fee**: none — commission applies to item subtotal only. | Assumed | |
| D-013 | **VAT is added on top** of the price at checkout. | Approved | |
| D-014 | VAT base: **items only** (not delivery fee); collected and remitted by Part One. | Assumed | Needs an accountant's confirmation. |
| D-015 | **Stock is not reserved** in cart/checkout. It is decremented only when payment is confirmed (webhook). | Approved | |
| D-016 | **Oversell** (two people pay for the last unit): the later payment's affected line is **automatically refunded** in full. | Assumed | Terms draft has a placeholder. |
| D-017 | **Only customers can cancel.** | Approved | Sellers who can't fulfil contact Part One (admin refunds). |
| D-018 | Cancellation window: **before the seller marks Shipped**; full refund for that seller order **including delivery fee**. | Assumed | |
| D-019 | **Refunds exclude the delivery fee**; the fee goes back to (stays with) the seller. Customer receives item price + VAT. | Approved | |
| D-020 | On refund, Part One **reverses its commission** on the refunded items. | Assumed | Seller loses items − commission; platform loses commission; VAT returned. |
| D-021 | **Chargebacks** are debited from the seller's balance (negative balance carried forward). | Assumed | In Terms draft. |
| D-022 | Commission is **configurable**, stored per order at the time of sale. Default rate **TBD** (placeholder 10% in mock). | Approved / Open (rate) | |
| D-023 | Seller earnings become payable **after the seller order is Delivered**. | Approved | |
| D-024 | Payouts are **immediate**, with a **₦50,000 minimum** available balance. | Approved | |
| D-025 | Payout trigger: **automatic** when available ≥ ₦50k (hourly job). | Assumed | Alternative: seller presses "Withdraw". |
| D-026 | A **return window** after delivery before earnings are released. | Open | Today earnings release on Delivered — a refund after payout creates a negative balance. Recommend a 3–7 day hold. |

## Accounts and access

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-030 | **One login per brand.** | Approved | |
| D-031 | Brand login method: **Google**, and a brand login is a normal user account linked to the brand (`users.seller_brand_id`), so the same person can also shop. | Assumed | Confirm; alternative is a separate seller account type. |
| D-032 | Reviews only after the order is **Delivered** ("delivered means purchased"). | Approved | |
| D-033 | Admin roles: **Founder** (all), **Report Manager** (moderation + products), **Developer** (system, read payments, orders). | Approved (roles) / Assumed (exact permissions) | Matrix in auth-and-rbac.md. |

## Engineering

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-040 | Backend stack (see backend/architecture.md). | **Proposed** | Not to be built until approved. |
| D-041 | Repo layout: Next.js app at the **repo root** (matches the existing GitHub repo and its Vercel deployment), `docs/` alongside. Backend location (sub-folder vs separate repo) decided with the stack. | Approved (2026-11-25) | |
| D-042 | Commit policy: the assistant commits on a **feature branch** (`marketplace-v1`) and **never pushes** without explicit approval. | Assumed | Owner asked for the merge with GitHub, which required commits. |
| D-044 | GitHub repo `s01-alt/part-one` (`main`) is the source of truth; it appears to deploy `part1.africa` via Vercel (Vercel Analytics, `metadataBase`). Pushing to `main` likely redeploys production. | Observed (2026-11-25) | Confirm hosting. Frontend hosting on Vercel is the owner's existing choice; D-001 applies to backend services. |
| D-045 | Pre-launch **waitlist** (`/waitlist`, header bar, home section) kept from the GitHub repo, where it was a front-end placeholder that was not in use. It now posts to a server action that validates but **does not store** until a backend/table exists. | Open | Needs storage before the site relies on it (see database.md `waitlist_entries`). |
| D-046 | Visual language from `docs/design/homepage-inspo.png`, applied with restraint: ink black + warm off-white, condensed uppercase headings, italic **PART 1** wordmark. **Lime (`#C6F135`) only on the main action button and the "1" in the logo** — not on fills, ticks or badges. | Assumed | |
| D-047 | Design principles (Apple-style): one idea per section, short headlines, generous white space, no eyebrow labels, products/photography carry the page (no slogan or icon rows), few borders and cards, no repeated calls to action. Home = hero → shop by style → new drops → brands → waitlist. | Approved (2026-11-25) | Removed: launching-soon bar, trust row, values row, "Stay in the loop", sell banner, second product grid, mixed-font brand strip. |
| D-048 | **Only brands create content.** There is no creator or user-post role, in v1 or v2. Customers interact only: like, save, repost, share, comment. The waitlist offers Shopper and Brand only; v2 posts belong to a brand (`brand_id`). | Approved (2026-11-25) | Removed the "Creator" option inherited from the GitHub waitlist. |
| D-043 | Mock auth (`p1_mock_session` cookie) is for UI development only and must be removed before any deployment. | Approved (engineering safety) | |
