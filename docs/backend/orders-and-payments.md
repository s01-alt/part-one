# Orders, payments, refunds and payouts

> Draft. The most safety-critical part of the backend. Every rule here needs
> automated tests before launch. Decision IDs refer to `docs/decisions.md`.

## 1. Order model

```
MarketplaceOrder #1001   (what the customer pays for — one Paystack transaction)
├── SellerOrder 1001-A   Brand A: lines, delivery fee, VAT, commission, status
└── SellerOrder 1001-B   Brand B: …
```

Per seller order (all kobo):

```
items_subtotal  = Σ unit_price × quantity
shipping_fee    = brand.shipping_fee                       (D-011)
vat             = round(items_subtotal × vat_rate)         (D-013, D-014: items only)
total           = items_subtotal + shipping_fee + vat
commission      = round(items_subtotal × commission_rate)  (D-012: not on shipping)
seller_earnings = items_subtotal − commission + shipping_fee
```

`commission_rate` = `brands.commission_rate ?? platform_settings.default_commission_rate`,
**copied onto the seller order** at checkout. Rounding: half-up to the kobo, per seller order.

## 2. Status machine (seller order)

```
pending_payment ──webhook ok──▶ paid ──seller──▶ processing ──seller──▶ shipped ──seller──▶ delivered
       │                          │                  │                                         │
       └─ expires (no payment)    └──── customer cancel (D-017/18) ──▶ cancelled ──▶ refund    └─ seller records return ─▶ returned ─▶ admin refund ─▶ refunded
```

| From → To | Who | Side effects |
|---|---|---|
| pending_payment → paid | system (webhook) | decrement stock, ledger **pending** entries, notify customer + seller |
| paid → processing → shipped | seller | notify customer |
| shipped → delivered | seller (later: courier/customer confirm) | set `delivered_at`; ledger entries become **available** (after hold, D-026); review unlocked |
| paid/processing → cancelled | customer only | full refund of that seller order incl. delivery fee (D-018); restock; reverse ledger |
| delivered → returned | seller | flags for admin refund |
| returned/any paid state → refunded | admin (`admin.refunds.issue`) | refund items + VAT (not delivery fee, D-019); ledger debit; restock if returned |

Any other transition → `409 INVALID_TRANSITION`. Every change writes `order_status_events`
and a notification. The frontend mirrors seller transitions in
`web/src/components/seller/order-status-control.tsx`.

## 3. Checkout and Paystack

1. `POST /v1/checkout` (Idempotency-Key required):
   - load cart; re-read prices, brand status, variant stock (**no reservation**, D-015 —
     but reject immediately if a variant already shows 0);
   - group by brand → seller orders; compute totals as §1;
   - insert `marketplace_orders`, `seller_orders`, `order_lines` as `pending_payment`;
   - create `payments` row with our `reference`;
   - call Paystack **Initialize Transaction** with `amount` (kobo), `email`, `reference`,
     `callback_url`, `metadata.orderId`;
   - return `authorization_url` / `access_code`.
2. Customer pays on Paystack (card, bank transfer, USSD).
3. Paystack sends `charge.success` to `POST /v1/webhooks/paystack`.
4. The callback page polls `GET /v1/checkout/:reference/status`. **Never** mark an order paid
   from the browser redirect.

Pending orders that are not paid within 30 minutes → `expired` (job).

## 4. Webhook handling (reliable and secure)

```
POST /v1/webhooks/paystack
 1. Read the raw body. Verify header x-paystack-signature == HMAC-SHA512(raw body, secret key).
    Invalid → 401, store nothing else.
 2. INSERT webhook_events (provider_event_key unique). Duplicate → 200 and stop (idempotent).
 3. Enqueue job "webhook.process" in the SAME transaction. Respond 200 fast.
Worker:
 4. Re-verify with Paystack "Verify Transaction" API (amount, currency, status, reference).
 5. Amount must equal marketplace_orders.total exactly; else flag for admin, do not fulfil.
 6. In ONE DB transaction, locking the variants (SELECT … FOR UPDATE, ordered by id):
      for each line: if stock >= qty → decrement; else mark line unfulfilled (oversell).
      Mark payment success, orders paid, write ledger pending entries.
 7. If any line was unfulfilled → enqueue automatic refund for those lines (D-016) and notify.
 8. Mark webhook_event processed. Failures retry with backoff; after N failures alert.
```

Optionally restrict the webhook route to Paystack's published IPs as an extra layer.
A daily **reconciliation** job lists Paystack transactions for the day and compares
them with `payments` to catch missed webhooks.

Other events to handle: `refund.processed` / `refund.failed`, `transfer.success` /
`transfer.failed` / `transfer.reversed`, `charge.dispute.create` / `.resolve`.

## 5. Refunds

- Always tied to the original `payment` and a `seller_order` (PRD §14).
- Amount = `items_subtotal + vat` of the affected lines (D-019); cancellation before
  shipping = full seller order total including delivery (D-018).
- Paystack **Create Refund** with `transaction` reference and partial `amount`.
- Status follows `refund.*` webhooks. Customer notified on processed.
- Ledger (D-020): `refund` entry = −(items − commission) for those lines. The platform
  absorbs the reversed commission; VAT is returned to the customer.
- Sum of refunds per payment can never exceed the payment amount (checked in a transaction).

## 6. Chargebacks

On `charge.dispute.create`: record `chargebacks`, notify admin, freeze the affected
seller order's earnings. If lost: ledger `chargeback` debit on the seller (D-021);
negative balances are recovered from future earnings before any payout.

## 7. Ledger and payouts

Ledger entries for a paid seller order (all with `available_at = null` → pending):

| type | amount |
|---|---|
| sale | +items_subtotal |
| commission | −commission |
| shipping | +shipping_fee |

On **delivered**: set `available_at = delivered_at + payout_hold_days` (D-023, D-026).

**Payout job** (`payouts.run`, hourly, D-025):

```
for each brand with an active bank account, not suspended, no open payout:
  BEGIN; lock brand row
  available = Σ amount where available_at <= now()
  if available >= payout_threshold (₦50,000, D-024):
      insert payouts(status='queued', amount=available, transfer_reference=new)
      insert ledger_entries(type='payout', amount=-available, available_at=now())
  COMMIT
  → call Paystack "Initiate Transfer" (recipient_code, amount, reference)  [Idempotent on reference]
on transfer.success  → payout paid
on transfer.failed/reversed → payout failed + ledger 'payout_reversal' (+amount), alert admin
```

Requirements: Paystack Transfers enabled on the business account, OTP for transfers
disabled for automation (owner action in the Paystack dashboard), sufficient balance.
Holding sellers' funds until delivery may have regulatory implications —
**confirm with Paystack/legal** (raised 2026-11-25).

## 8. Tests that must exist

- Totals: multi-seller cart → correct per-seller VAT/commission/earnings; rounding.
- Webhook: bad signature rejected; duplicate ignored; amount mismatch flagged; replay safe.
- Oversell: two concurrent payments for the last unit → one fulfilled, one auto-refunded.
- Transitions: every allowed and forbidden transition per actor.
- Refund: cannot exceed payment; excludes delivery fee except pre-ship cancellation.
- Ledger: balance = Σ entries; payout only ≥ threshold; one in-flight payout; failure reversal.
- Scoping: seller A cannot read/update seller B's orders, products, ledger (404).
