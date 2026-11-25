/**
 * Data access for the signed-in customer, seller and admin areas.
 *
 * Every function takes the current user and scopes results to what that user
 * may see — the same rule the backend must enforce server-side
 * (docs/backend/auth-and-rbac.md). Today they read mock data.
 */
import { brands } from "@/lib/mock/brands";
import { products } from "@/lib/mock/products";
import {
  followedBrandIds,
  ledger,
  likedProductSlugs,
  notificationsByUser,
  orders,
  payouts,
  platformSettings,
  reports,
  reposts,
  savedProductSlugs,
  sellerApplications,
  users,
} from "@/lib/mock/accounts";
import { isListed } from "@/lib/data/catalog";
import type {
  Brand,
  LedgerEntry,
  MarketplaceOrder,
  Notification,
  Payout,
  PlatformSettings,
  Product,
  ProductWithBrand,
  Report,
  Repost,
  SellerApplication,
  SellerBalance,
  SellerOrder,
  User,
} from "@/lib/types";

function withBrand(p: Product): ProductWithBrand {
  const b = brands.find((x) => x.id === p.brandId)!;
  return { ...p, brand: { id: b.id, slug: b.slug, name: b.name, city: b.city, tone: b.tone } };
}

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------

/** GET /v1/me/orders */
export async function listMyOrders(user: User): Promise<MarketplaceOrder[]> {
  return orders.filter((o) => o.customerId === user.id);
}

/** GET /v1/me/orders/:id — 404 (not 403) if it belongs to someone else. */
export async function getMyOrder(user: User, id: string): Promise<MarketplaceOrder | null> {
  return orders.find((o) => o.id === id && o.customerId === user.id) ?? null;
}

/** GET /v1/me/saves, /v1/me/likes */
export async function listMySaved(user: User): Promise<{ saved: ProductWithBrand[]; liked: ProductWithBrand[] }> {
  if (user.id !== "usr_customer") return { saved: [], liked: [] };
  const pick = (slugs: string[]) => products.filter((p) => slugs.includes(p.slug)).map(withBrand);
  return { saved: pick(savedProductSlugs), liked: pick(likedProductSlugs) };
}

/** GET /v1/me/follows */
export async function listMyFollowedBrands(user: User): Promise<Brand[]> {
  if (user.id !== "usr_customer") return [];
  return brands.filter((b) => followedBrandIds.includes(b.id));
}

/** GET /v1/me/notifications */
export async function listMyNotifications(user: User): Promise<Notification[]> {
  return notificationsByUser[user.id] ?? [];
}

/** GET /v1/feed/reposts — public community feed. */
export async function listRepostFeed(): Promise<(Repost & { product: ProductWithBrand })[]> {
  return reposts
    .map((r) => {
      const p = products.find((x) => x.id === r.productId);
      return p && isListed(p) ? { ...r, product: withBrand(p) } : null;
    })
    .filter((x): x is Repost & { product: ProductWithBrand } => x !== null);
}

// ---------------------------------------------------------------------------
// Seller — always scoped to user.sellerBrandId
// ---------------------------------------------------------------------------

export interface SellerOrderWithContext extends SellerOrder {
  customerName: string;
  shippingAddress: MarketplaceOrder["shippingAddress"];
  createdAt: string;
}

function sellerOrdersFor(brandId: string): SellerOrderWithContext[] {
  return orders.flatMap((o) =>
    o.sellerOrders
      .filter((so) => so.brandId === brandId)
      .map((so) => ({ ...so, customerName: o.customerName, shippingAddress: o.shippingAddress, createdAt: o.createdAt })),
  );
}

/** GET /v1/seller/store */
export async function getMyBrand(user: User): Promise<Brand | null> {
  return brands.find((b) => b.id === user.sellerBrandId) ?? null;
}

/** GET /v1/seller/orders */
export async function listSellerOrders(user: User): Promise<SellerOrderWithContext[]> {
  if (!user.sellerBrandId) return [];
  return sellerOrdersFor(user.sellerBrandId);
}

/** GET /v1/seller/orders/:id — returns null for another seller's order. */
export async function getSellerOrder(user: User, id: string): Promise<SellerOrderWithContext | null> {
  if (!user.sellerBrandId) return null;
  return sellerOrdersFor(user.sellerBrandId).find((so) => so.id === id) ?? null;
}

/** GET /v1/seller/products — includes inactive and sold-out products. */
export async function listSellerProducts(user: User): Promise<Product[]> {
  return products.filter((p) => p.brandId === user.sellerBrandId);
}

export async function getSellerProduct(user: User, id: string): Promise<Product | null> {
  return products.find((p) => p.id === id && p.brandId === user.sellerBrandId) ?? null;
}

/** GET /v1/seller/balance */
export async function getSellerBalance(user: User): Promise<SellerBalance> {
  const mine = ledger.filter((e) => e.brandId === user.sellerBrandId);
  const sum = (f: (e: LedgerEntry) => boolean) => mine.filter(f).reduce((n, e) => n + e.amount, 0);
  return {
    pending: sum((e) => e.state === "pending"),
    available: sum((e) => e.state === "available"),
    paidOut: -sum((e) => e.type === "payout"),
    payoutThreshold: platformSettings.payoutThreshold,
  };
}

/** GET /v1/seller/ledger */
export async function listSellerLedger(user: User): Promise<LedgerEntry[]> {
  return ledger
    .filter((e) => e.brandId === user.sellerBrandId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** GET /v1/seller/payouts */
export async function listSellerPayouts(user: User): Promise<Payout[]> {
  return payouts.filter((p) => p.brandId === user.sellerBrandId);
}

// ---------------------------------------------------------------------------
// Admin — callers must check permissions first (requireAdmin)
// ---------------------------------------------------------------------------

export async function adminListOrders(): Promise<MarketplaceOrder[]> {
  return orders;
}
export async function adminGetOrder(id: string): Promise<MarketplaceOrder | null> {
  return orders.find((o) => o.id === id) ?? null;
}
export async function adminListUsers(): Promise<User[]> {
  return users;
}
export async function adminListBrands(): Promise<Brand[]> {
  return brands;
}
export async function adminListApplications(): Promise<SellerApplication[]> {
  return sellerApplications;
}
export async function adminListProducts(): Promise<ProductWithBrand[]> {
  return products.map(withBrand);
}
export async function adminListReports(): Promise<Report[]> {
  return reports;
}
export async function adminListPayouts(): Promise<(Payout & { brandName: string })[]> {
  return payouts.map((p) => ({ ...p, brandName: brands.find((b) => b.id === p.brandId)?.name ?? p.brandId }));
}
export async function adminGetSettings(): Promise<PlatformSettings> {
  return platformSettings;
}
