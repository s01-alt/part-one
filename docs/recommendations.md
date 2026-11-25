# Recommendation engine and v2 content — structure for later

> Not in the MVP (PRD §6, §27). This doc fixes the **seams** now so that adding
> recommendations and the v2 TikTok-style layer later doesn't require reworking
> the frontend or the database.

## 1. Seams that already exist in the frontend

| Surface | Today | Function to swap |
|---|---|---|
| "You might also like" on product pages | same brand / shared style / same type score | `catalog.listRelatedProducts` |
| New drops (home, shop default sort) | newest first | `catalog.listNewDrops` |
| Shop sort "Relevance" | keyword weight | `catalog.listProducts` (`sort=relevance`) |
| Community feed | newest reposts | `account.listRepostFeed` |
| Home "Shop by style" / brand rails | static | add `GET /v1/home` later |

Each surface calls one data function. A recommendation service only needs to
return **ranked product IDs** for that surface; the API hydrates them.

## 2. Data to collect from day one (v1)

The `analytics_events` outbox (database.md) records the PRD §22 events, which are
exactly the training signals:

| Event | Signal strength (initial guess) |
|---|---|
| product_viewed (with dwell time) | 1 |
| product_liked | 3 |
| product_saved | 4 |
| product_reposted | 4 |
| product_shared | 3 |
| product_commented | 2 |
| brand_followed | 3 (applies to brand's products) |
| product_added_to_cart | 5 |
| checkout_started | 5 |
| payment_completed / order_created | 8 |
| review_created (rating) | ± by rating |

Also store `anonymous_id` for signed-out browsing and merge on sign-in.
Keep raw events at least 12 months (mention in privacy policy retention).

## 3. Phased plan

| Phase | When | Method | Infra |
|---|---|---|---|
| 0 (now) | v1 | Rules: same brand/style/type, newest, follows first | Postgres queries |
| 1 | ~1–2k orders | **Popularity + co-occurrence**: "bought/saved together" from events; trending = time-decayed engagement score per product, recomputed hourly | Postgres materialized views + job |
| 2 | enough users | **Personalised**: user × style/brand affinity from weighted events; blend with trending | job writes `user_affinities`, `product_scores` tables |
| 3 | v2 content | Embeddings (product text + images) in `pgvector`; candidate generation → ranking model; feed ranking for videos | pgvector, separate worker; still no separate service until load requires it |

Planned tables (not created in v1):

```sql
product_scores   (product_id, surface, score, computed_at)          -- trending, new-drop boost
product_pairs    (product_id, related_product_id, score)            -- co-occurrence
user_affinities  (user_id, dimension ('style'|'brand'|'type'), value, score)
recommendation_impressions (id, user_id, surface, product_id, position, model_version, created_at)
```

`recommendation_impressions` + click/cart events = evaluation data (CTR, add-to-cart
rate per model version). Every recommendation response returns a `model_version`.

## 4. Guard rails

- Only **listed** products are ever recommended (approved brand, active, in stock).
- Cap any single brand's share of a rail (e.g. ≤ 30%) so small brands get seen.
- Cold start: new products get a decaying "new drop" boost.
- No sensitive inference; affinities are style/brand/type only. Users can clear history (NDPA).

## 5. v2 — TikTok-style content (D-002, D-005)

v2 adds short videos/posts **by brands** (and later users) that tag products.
Prepare in v1 by keeping social tables product-centred but polymorphic-ready:

- Add later: `posts (id, author_type, author_id, media, caption, status)`,
  `post_products (post_id, product_id)`.
- Likes/saves/comments/reports already use `(user_id, product_id)`; v2 generalises to
  `(user_id, target_type, target_id)` via a migration — reports already use this shape.
- Media storage: same S3-compatible bucket; transcoding via a queue job (or a media
  service at that point).
- Feed ranking reuses the Phase 2–3 signals above.
- Moderation queue already supports `target_type`; add `post`.

Out of scope until v2: user profiles, user posts, following users, DMs (PRD §8).
