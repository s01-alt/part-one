import { brands } from "@/lib/mock/brands";
import { products } from "@/lib/mock/products";
import type {
  LedgerEntry,
  MarketplaceOrder,
  Notification,
  OrderLine,
  Payout,
  PlatformSettings,
  Report,
  Repost,
  SellerApplication,
  SellerOrder,
  SellerOrderStatus,
  StatusEvent,
  User,
} from "@/lib/types";

/**
 * MOCK DATA for the signed-in areas (account, seller, admin).
 * Every value here will come from the backend. Fictional people only.
 */

export const platformSettings: PlatformSettings = {
  defaultCommissionRate: 0.1, // placeholder — commission % is TBD in the PRD
  payoutThreshold: 5_000_000, // ₦50,000
  vatRate: 0.075,
};

export const users: User[] = [
  { id: "usr_customer", name: "Adaeze Okafor", email: "adaeze@example.com", avatarUrl: null, sellerBrandId: null, adminRole: null, status: "active", createdAt: "2026-09-01T10:00:00Z" },
  { id: "usr_seller", name: "Kunle Danfo", email: "kunle@danfo.example", avatarUrl: null, sellerBrandId: "brd_danfo", adminRole: null, status: "active", createdAt: "2026-06-01T10:00:00Z" },
  { id: "usr_founder", name: "Founder (demo)", email: "founder@partone.example", avatarUrl: null, sellerBrandId: null, adminRole: "founder", status: "active", createdAt: "2026-05-01T10:00:00Z" },
  { id: "usr_reports", name: "Report Manager (demo)", email: "reports@partone.example", avatarUrl: null, sellerBrandId: null, adminRole: "report_manager", status: "active", createdAt: "2026-05-01T10:00:00Z" },
  { id: "usr_dev", name: "Developer (demo)", email: "dev@partone.example", avatarUrl: null, sellerBrandId: null, adminRole: "developer", status: "active", createdAt: "2026-05-01T10:00:00Z" },
  { id: "usr_tobi", name: "Tobi Adeyemi", email: "tobi@example.com", avatarUrl: null, sellerBrandId: null, adminRole: null, status: "active", createdAt: "2026-10-02T10:00:00Z" },
  { id: "usr_zainab", name: "Zainab Musa", email: "zainab@example.com", avatarUrl: null, sellerBrandId: null, adminRole: null, status: "suspended", createdAt: "2026-10-12T10:00:00Z" },
];

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

const customers = [
  { id: "usr_customer", name: "Adaeze Okafor", address: { fullName: "Adaeze Okafor", phone: "+234 801 000 0001", line1: "12 Admiralty Way", city: "Lekki", state: "Lagos" } },
  { id: "usr_tobi", name: "Tobi Adeyemi", address: { fullName: "Tobi Adeyemi", phone: "+234 802 000 0002", line1: "4 Aminu Kano Crescent", city: "Wuse II", state: "FCT" } },
];

const STATUS_FLOW: SellerOrderStatus[] = ["paid", "processing", "shipped", "delivered"];

function history(final: SellerOrderStatus, start: string): StatusEvent[] {
  const t0 = Date.parse(start);
  const at = (h: number) => new Date(t0 + h * 3_600_000).toISOString();
  if (final === "cancelled") return [{ status: "paid", at: at(0) }, { status: "cancelled", at: at(5), note: "Cancelled by customer" }];
  if (final === "refunded" || final === "returned") {
    return [
      ...STATUS_FLOW.map((s, i) => ({ status: s, at: at(i * 30) })),
      { status: "returned", at: at(130) },
      ...(final === "refunded" ? [{ status: "refunded" as const, at: at(140), note: "Item price + VAT refunded" }] : []),
    ];
  }
  const idx = STATUS_FLOW.indexOf(final);
  return STATUS_FLOW.slice(0, idx + 1).map((s, i) => ({ status: s, at: at(i * 30) }));
}

interface OrderSpec {
  number: string;
  customer: 0 | 1;
  createdAt: string;
  parts: { brandId: string; status: SellerOrderStatus; items: { slug: string; qty: number; v?: number }[] }[];
}

const specs: OrderSpec[] = [
  { number: "1001", customer: 0, createdAt: "2026-11-02T14:10:00Z", parts: [
    { brandId: "brd_danfo", status: "delivered", items: [{ slug: "conductor-heavyweight-tee", qty: 2 }, { slug: "conductor-cap", qty: 1 }] },
    { brandId: "brd_yaba", status: "delivered", items: [{ slug: "poster-boy-tee", qty: 1 }] },
  ] },
  { number: "1007", customer: 0, createdAt: "2026-11-19T09:25:00Z", parts: [
    { brandId: "brd_eko", status: "shipped", items: [{ slug: "low-rise-parachute-cargo", qty: 1 }] },
    { brandId: "brd_harmattan", status: "processing", items: [{ slug: "dune-linen-shirt", qty: 1, v: 2 }] },
    { brandId: "brd_danfo", status: "paid", items: [{ slug: "route-12-hoodie", qty: 1 }] },
  ] },
  { number: "1004", customer: 1, createdAt: "2026-11-10T18:40:00Z", parts: [
    { brandId: "brd_danfo", status: "delivered", items: [{ slug: "danfo-stripe-cargo", qty: 1 }] },
  ] },
  { number: "1005", customer: 1, createdAt: "2026-11-14T11:05:00Z", parts: [
    { brandId: "brd_danfo", status: "refunded", items: [{ slug: "conductor-heavyweight-tee", qty: 1, v: 3 }] },
    { brandId: "brd_ivory", status: "delivered", items: [{ slug: "monogram-heavy-tee", qty: 1 }] },
  ] },
  { number: "1006", customer: 0, createdAt: "2026-11-17T08:00:00Z", parts: [
    { brandId: "brd_okada", status: "cancelled", items: [{ slug: "throttle-joggers", qty: 1 }] },
  ] },
  { number: "1008", customer: 1, createdAt: "2026-11-23T16:30:00Z", parts: [
    { brandId: "brd_danfo", status: "processing", items: [{ slug: "danfo-stripe-cargo", qty: 1, v: 4 }, { slug: "conductor-heavyweight-tee", qty: 3 }] },
  ] },
];

function buildOrder(spec: OrderSpec): MarketplaceOrder {
  const cust = customers[spec.customer];
  const sellerOrders: SellerOrder[] = spec.parts.map((part, i) => {
    const brand = brands.find((b) => b.id === part.brandId)!;
    const lines: OrderLine[] = part.items.map((it, j) => {
      const p = products.find((x) => x.slug === it.slug)!;
      const v = p.variants.filter((x) => x.stock > 0)[it.v ?? 0] ?? p.variants[0];
      return {
        id: `oln_${spec.number}_${i}_${j}`,
        productId: p.id,
        productSlug: p.slug,
        productName: p.name,
        productType: p.type,
        tone: v.color.hex,
        variantId: v.id,
        variantLabel: `${v.color.name} / ${v.size}`,
        unitPrice: v.price ?? p.price,
        quantity: it.qty,
      };
    });
    const itemsSubtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
    const vat = Math.round(itemsSubtotal * platformSettings.vatRate);
    const commission = Math.round(itemsSubtotal * platformSettings.defaultCommissionRate);
    return {
      id: `so_${spec.number}_${String.fromCharCode(65 + i)}`,
      number: `${spec.number}-${String.fromCharCode(65 + i)}`,
      marketplaceOrderId: `ord_${spec.number}`,
      brandId: brand.id,
      brandName: brand.name,
      brandSlug: brand.slug,
      status: part.status,
      lines,
      itemsSubtotal,
      shippingFee: brand.shippingFee,
      vat,
      total: itemsSubtotal + brand.shippingFee + vat,
      commissionRate: platformSettings.defaultCommissionRate,
      commission,
      sellerEarnings: itemsSubtotal - commission + brand.shippingFee,
      history: history(part.status, spec.createdAt),
    };
  });
  const anyRefund = sellerOrders.some((s) => s.status === "refunded" || s.status === "cancelled");
  return {
    id: `ord_${spec.number}`,
    number: spec.number,
    customerId: cust.id,
    customerName: cust.name,
    shippingAddress: cust.address,
    paymentReference: `PSK_${spec.number}_${spec.createdAt.slice(0, 10).replace(/-/g, "")}`,
    paymentStatus: anyRefund ? (sellerOrders.length > 1 ? "partially_refunded" : "refunded") : "success",
    sellerOrders,
    total: sellerOrders.reduce((n, s) => n + s.total, 0),
    createdAt: spec.createdAt,
  };
}

export const orders: MarketplaceOrder[] = specs.map(buildOrder).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

// ---------------------------------------------------------------------------
// Seller ledger and payouts (Danfo Works is the demo seller)
// ---------------------------------------------------------------------------

export const ledger: LedgerEntry[] = orders
  .flatMap((o) => o.sellerOrders.map((so) => ({ so, at: o.createdAt })))
  .flatMap(({ so, at }): LedgerEntry[] => {
    if (so.status === "cancelled") return [];
    const state = so.status === "delivered" ? "available" : so.status === "refunded" ? "settled" : "pending";
    const base = { brandId: so.brandId, sellerOrderNumber: so.number, createdAt: at };
    const entries: LedgerEntry[] = [
      { ...base, id: `led_${so.id}_sale`, type: "sale", amount: so.itemsSubtotal, state, description: `Sale ${so.number}` },
      { ...base, id: `led_${so.id}_com`, type: "commission", amount: -so.commission, state, description: `Commission ${(so.commissionRate * 100).toFixed(0)}%` },
      { ...base, id: `led_${so.id}_ship`, type: "shipping", amount: so.shippingFee, state, description: "Delivery fee" },
    ];
    if (so.status === "refunded") {
      entries.push({
        ...base,
        id: `led_${so.id}_ref`,
        type: "refund",
        amount: -(so.itemsSubtotal - so.commission),
        state: "settled",
        description: "Refund to customer (items; commission reversed; delivery fee kept)",
      });
    }
    return entries;
  })
  .concat([
    { id: "led_po_1", brandId: "brd_danfo", type: "payout", amount: -6_120_000, sellerOrderNumber: null, state: "settled", description: "Payout to GTBank ••••4321", createdAt: "2026-10-30T12:00:00Z" },
    { id: "led_po_1_src", brandId: "brd_danfo", type: "adjustment", amount: 6_120_000, sellerOrderNumber: null, state: "settled", description: "October delivered orders (before ledger import)", createdAt: "2026-10-29T12:00:00Z" },
  ]);

export const payouts: Payout[] = [
  { id: "po_1", brandId: "brd_danfo", amount: 6_120_000, status: "paid", transferReference: "TRF_8c1d0f", bankLabel: "GTBank ••••4321", createdAt: "2026-10-30T12:00:00Z" },
  { id: "po_2", brandId: "brd_yaba", amount: 5_400_000, status: "paid", transferReference: "TRF_77ab21", bankLabel: "Access ••••9012", createdAt: "2026-11-05T12:00:00Z" },
  { id: "po_3", brandId: "brd_eko", amount: 7_850_000, status: "processing", transferReference: "TRF_a90e33", bankLabel: "Kuda ••••5566", createdAt: "2026-11-24T12:00:00Z" },
];

// ---------------------------------------------------------------------------
// Notifications (in-app only — no email in v1)
// ---------------------------------------------------------------------------

export const notificationsByUser: Record<string, Notification[]> = {
  usr_customer: [
    { id: "ntf_1", type: "order_status", title: "Order 1007-A shipped", body: "Eko Static shipped your Low-Rise Parachute Cargo.", href: "/account/orders/ord_1007", readAt: null, createdAt: "2026-11-24T10:00:00Z" },
    { id: "ntf_2", type: "order_status", title: "Order 1007-B is being prepared", body: "Harmattan Studio is processing your order.", href: "/account/orders/ord_1007", readAt: null, createdAt: "2026-11-21T09:00:00Z" },
    { id: "ntf_3", type: "order_paid", title: "Payment received", body: "We received ₦167,700 for order 1007.", href: "/account/orders/ord_1007", readAt: "2026-11-19T10:00:00Z", createdAt: "2026-11-19T09:26:00Z" },
    { id: "ntf_4", type: "refund", title: "Order 1006 cancelled", body: "Your refund has been sent to your card.", href: "/account/orders/ord_1006", readAt: "2026-11-17T14:00:00Z", createdAt: "2026-11-17T13:00:00Z" },
  ],
  usr_seller: [
    { id: "ntf_s1", type: "new_order", title: "New order 1008-A", body: "4 items · Tobi Adeyemi", href: "/seller/orders/so_1008_A", readAt: null, createdAt: "2026-11-23T16:31:00Z" },
    { id: "ntf_s2", type: "new_order", title: "New order 1007-C", body: "1 item · Adaeze Okafor", href: "/seller/orders/so_1007_C", readAt: null, createdAt: "2026-11-19T09:26:00Z" },
    { id: "ntf_s3", type: "payout", title: "Payout sent", body: "₦61,200 sent to GTBank ••••4321.", href: "/seller/payouts", readAt: "2026-10-30T13:00:00Z", createdAt: "2026-10-30T12:00:00Z" },
  ],
};

// ---------------------------------------------------------------------------
// Social: saves, likes, follows, reposts
// ---------------------------------------------------------------------------

export const savedProductSlugs = ["archive-denim-jacket", "dispatch-runner", "club-varsity-jacket", "dune-linen-shirt"];
export const likedProductSlugs = ["chrome-baby-tee", "poster-boy-tee", "market-day-chore-jacket", "acid-wash-flannel", "pit-lane-track-jacket"];
export const followedBrandIds = ["brd_danfo", "brd_eko", "brd_yaba"];

export const reposts: Repost[] = [
  { id: "rp_1", userName: "Tobi A.", productId: "prd_12", caption: "Chrome season is back 🔥", createdAt: "2026-11-24T19:00:00Z" },
  { id: "rp_2", userName: "Chiamaka O.", productId: "prd_19", caption: "Aso-oke trims on a chore jacket?? Say less.", createdAt: "2026-11-24T15:20:00Z" },
  { id: "rp_3", userName: "Emeka U.", productId: "prd_1", caption: null, createdAt: "2026-11-24T11:45:00Z" },
  { id: "rp_4", userName: "Bisola F.", productId: "prd_25", caption: "Saving up for this one.", createdAt: "2026-11-23T21:10:00Z" },
  { id: "rp_5", userName: "Seun K.", productId: "prd_16", caption: "Track jacket of the year", createdAt: "2026-11-23T13:30:00Z" },
  { id: "rp_6", userName: "Aisha B.", productId: "prd_8", caption: "Lagos concert poster tee 🎶", createdAt: "2026-11-22T17:00:00Z" },
  { id: "rp_7", userName: "Ifeanyi N.", productId: "prd_22", caption: null, createdAt: "2026-11-22T09:15:00Z" },
];

// ---------------------------------------------------------------------------
// Moderation and seller applications
// ---------------------------------------------------------------------------

export const reports: Report[] = [
  { id: "rpt_1", targetType: "comment", targetId: "com_prd_4_1", targetLabel: "Comment on Conductor Cap: “dm me for cheaper copies”", reason: "spam", details: "Advertising fakes in the comments.", reporterName: "Kunle D.", status: "open", createdAt: "2026-11-24T08:00:00Z" },
  { id: "rpt_2", targetType: "product", targetId: "prd_28", targetLabel: "Signet Ring — Ivory Tower Club", reason: "misleading", details: "Photos look like a different ring.", reporterName: "Tobi A.", status: "open", createdAt: "2026-11-23T12:00:00Z" },
  { id: "rpt_3", targetType: "review", targetId: "rev_prd_9_0", targetLabel: "Review on Reworked Carpenter Jeans (1★)", reason: "offensive", details: "Insulting language toward the brand owner.", reporterName: "Yaba Archive", status: "open", createdAt: "2026-11-22T15:00:00Z" },
  { id: "rpt_4", targetType: "comment", targetId: "com_prd_12_0", targetLabel: "Comment on Chrome Baby Tee", reason: "spam", details: "Link spam.", reporterName: "Aisha B.", status: "actioned", createdAt: "2026-11-18T10:00:00Z" },
];

export const sellerApplications: SellerApplication[] = [
  { id: "app_1", brandName: "Surulere Sound System", contactName: "Femi Ajayi", email: "femi@sss.example", phone: "+234 803 000 1111", city: "Lagos", instagram: "surulere.sound", description: "Music-inspired graphic tees and bucket hats.", styles: ["graphic", "vintage"], status: "pending", submittedAt: "2026-11-24T09:00:00Z" },
  { id: "app_2", brandName: "Kano Indigo", contactName: "Hauwa Bello", email: "hauwa@kanoindigo.example", phone: "+234 805 000 2222", city: "Kano", instagram: "kanoindigo", description: "Hand-dyed indigo denim and workwear from Kofar Mata dye pits.", styles: ["utility", "luxury"], status: "under_review", submittedAt: "2026-11-21T09:00:00Z" },
  { id: "app_3", brandName: "Benin Bronze Athletic", contactName: "Osaro Igbinedion", email: "osaro@bba.example", phone: "+234 806 000 3333", city: "Benin City", instagram: "beninbronze.ath", description: "Athleisure sets with bronze-cast hardware.", styles: ["athleisure"], status: "pending", submittedAt: "2026-11-20T09:00:00Z" },
  { id: "app_4", brandName: "Copy Kings", contactName: "Anon", email: "sales@copykings.example", phone: "+234 807 000 4444", city: "Lagos", instagram: "copykings", description: "Designer inspired pieces.", styles: ["luxury"], status: "rejected", submittedAt: "2026-11-12T09:00:00Z" },
];
