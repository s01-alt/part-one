/**
 * Domain types shared by the whole frontend.
 *
 * These mirror the planned database tables and API responses described in
 * docs/backend/database.md and docs/backend/api-contract.md. When the backend
 * exists, these types should be generated from the OpenAPI spec instead of
 * being hand-written — keep the shapes in sync until then.
 */

/** All money is stored and passed as integer kobo (₦1 = 100 kobo). */
export type Kobo = number;

/** ISO-8601 timestamp string, e.g. "2026-11-20T10:00:00Z". */
export type ISODate = string;

export const STYLE_TAGS = [
  "baggy",
  "minimalist",
  "y2k",
  "graphic",
  "vintage",
  "utility",
  "athleisure",
  "luxury",
  "grunge",
] as const;
export type StyleTag = (typeof STYLE_TAGS)[number];

export const PRODUCT_TYPES = [
  "t-shirt",
  "shirt",
  "hoodie",
  "sweatshirt",
  "jacket",
  "jeans",
  "cargo-pants",
  "trousers",
  "shorts",
  "joggers",
  "sneakers",
  "cap",
  "beanie",
  "bag",
  "accessory",
  "other",
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export type SellerStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended";

export type ProductStatus = "active" | "inactive";

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  x?: string;
  website?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  /** Logo / banner image URLs. Null in mock data — UI renders a placeholder. */
  logoUrl: string | null;
  bannerUrl: string | null;
  /** Placeholder colour used when no image exists. */
  tone: string;
  socials: SocialLinks;
  status: SellerStatus;
  /** Flat shipping fee per seller order (pending decision — see docs/decisions.md). */
  shippingFee: Kobo;
  followerCount: number;
  /** Derived from the brand's product ratings — there is no separate seller rating. */
  ratingAvg: number;
  ratingCount: number;
  createdAt: ISODate;
}

export interface Color {
  name: string;
  hex: string;
}

export interface ProductImage {
  id: string;
  url: string | null;
  alt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: Color;
  stock: number;
  /** Optional variant-specific price; falls back to Product.price. */
  price: Kobo | null;
}

export interface SocialCounts {
  likes: number;
  saves: number;
  reposts: number;
  shares: number;
  comments: number;
}

export interface Product {
  id: string;
  slug: string;
  brandId: string;
  name: string;
  description: string;
  type: ProductType;
  styles: StyleTag[];
  material: string;
  careInstructions: string;
  /** Base price in kobo, VAT exclusive. */
  price: Kobo;
  /** Up to 5 images. */
  images: ProductImage[];
  variants: ProductVariant[];
  status: ProductStatus;
  /** Placeholder colour used when no image exists. */
  tone: string;
  ratingAvg: number;
  ratingCount: number;
  counts: SocialCounts;
  collectionIds: string[];
  createdAt: ISODate;
}

/** A product plus its brand, as returned by list/detail endpoints. */
export interface ProductWithBrand extends Product {
  brand: Pick<Brand, "id" | "slug" | "name" | "city" | "tone">;
}

export interface Collection {
  id: string;
  brandId: string;
  slug: string;
  name: string;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** Size/colour bought — shown as "Verified purchase". */
  variantLabel: string;
  createdAt: ISODate;
}

export interface ProductComment {
  id: string;
  productId: string;
  authorName: string;
  body: string;
  createdAt: ISODate;
}

// ---------------------------------------------------------------------------
// Catalogue query — mirrors GET /v1/products query parameters.
// ---------------------------------------------------------------------------

export type ProductSort = "relevance" | "newest" | "price_asc" | "price_desc" | "rating";

export interface ProductQuery {
  q?: string;
  brand?: string[];
  style?: StyleTag[];
  type?: ProductType[];
  size?: string[];
  color?: string[];
  minPrice?: Kobo;
  maxPrice?: Kobo;
  minRating?: number;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CatalogFacets {
  brands: { slug: string; name: string; count: number }[];
  styles: { value: StyleTag; count: number }[];
  types: { value: ProductType; count: number }[];
  sizes: string[];
  /** Sizes grouped so ring, waist and shoe sizes are not mixed in one row. */
  sizeGroups: { label: string; sizes: string[] }[];
  colors: Color[];
  priceRange: { min: Kobo; max: Kobo };
}

// ---------------------------------------------------------------------------
// Users, roles and permissions
// ---------------------------------------------------------------------------

/** Admin roles from the PRD. Permissions per role live in lib/auth/permissions.ts. */
export type AdminRole = "founder" | "report_manager" | "developer";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  /** A user is always a customer; these flags add seller/admin access. */
  sellerBrandId: string | null;
  adminRole: AdminRole | null;
  status: "active" | "suspended";
  createdAt: ISODate;
}

// ---------------------------------------------------------------------------
// Orders: one MarketplaceOrder (what the customer paid for) → many SellerOrders
// ---------------------------------------------------------------------------

export type SellerOrderStatus =
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded" | "partially_refunded";

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
}

export interface OrderLine {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productType: ProductType;
  tone: string;
  variantId: string;
  variantLabel: string;
  unitPrice: Kobo;
  quantity: number;
}

export interface StatusEvent {
  status: SellerOrderStatus;
  at: ISODate;
  note?: string;
}

export interface SellerOrder {
  id: string;
  /** e.g. "1001-A" */
  number: string;
  marketplaceOrderId: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  status: SellerOrderStatus;
  lines: OrderLine[];
  itemsSubtotal: Kobo;
  shippingFee: Kobo;
  vat: Kobo;
  total: Kobo;
  /** Commission snapshot at time of order — never recalculated. */
  commissionRate: number;
  commission: Kobo;
  /** itemsSubtotal − commission + shippingFee */
  sellerEarnings: Kobo;
  history: StatusEvent[];
}

export interface MarketplaceOrder {
  id: string;
  /** e.g. "1001" */
  number: string;
  customerId: string;
  customerName: string;
  shippingAddress: Address;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  sellerOrders: SellerOrder[];
  total: Kobo;
  createdAt: ISODate;
}

// ---------------------------------------------------------------------------
// Seller money: ledger, balance, payouts
// ---------------------------------------------------------------------------

export type LedgerEntryType = "sale" | "commission" | "shipping" | "refund" | "chargeback" | "payout" | "adjustment";

export interface LedgerEntry {
  id: string;
  brandId: string;
  type: LedgerEntryType;
  /** Signed: credits positive, debits negative. */
  amount: Kobo;
  sellerOrderNumber: string | null;
  /** "pending" until the seller order is delivered, then "available". */
  state: "pending" | "available" | "settled";
  description: string;
  createdAt: ISODate;
}

export interface Payout {
  id: string;
  brandId: string;
  amount: Kobo;
  status: "queued" | "processing" | "paid" | "failed";
  transferReference: string;
  bankLabel: string;
  createdAt: ISODate;
}

export interface SellerBalance {
  pending: Kobo;
  available: Kobo;
  paidOut: Kobo;
  payoutThreshold: Kobo;
}

// ---------------------------------------------------------------------------
// Social, notifications, moderation, seller applications
// ---------------------------------------------------------------------------

export interface Repost {
  id: string;
  userName: string;
  productId: string;
  caption: string | null;
  createdAt: ISODate;
}

export interface Notification {
  id: string;
  type:
    | "order_paid"
    | "order_status"
    | "refund"
    | "seller_application"
    | "new_order"
    | "payout"
    | "moderation";
  title: string;
  body: string;
  href: string | null;
  readAt: ISODate | null;
  createdAt: ISODate;
}

export type ReportTarget = "product" | "review" | "comment";

export interface Report {
  id: string;
  targetType: ReportTarget;
  targetId: string;
  targetLabel: string;
  reason: "counterfeit" | "offensive" | "spam" | "misleading" | "other";
  details: string;
  reporterName: string;
  status: "open" | "actioned" | "dismissed";
  createdAt: ISODate;
}

export interface SellerApplication {
  id: string;
  brandName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  instagram: string;
  description: string;
  styles: StyleTag[];
  status: SellerStatus;
  submittedAt: ISODate;
}

export interface PlatformSettings {
  /** Default commission for new sellers, e.g. 0.1 = 10%. Placeholder until decided. */
  defaultCommissionRate: number;
  payoutThreshold: Kobo;
  vatRate: number;
}

// ---------------------------------------------------------------------------
// Pre-launch waitlist (carried over from the GitHub repo's /waitlist page)
// ---------------------------------------------------------------------------

/** Only brands create content (D-048) — there is no creator role. */
export type WaitlistRole = "shopper" | "brand";

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  role: WaitlistRole;
  city: string | null;
  createdAt: ISODate;
}
