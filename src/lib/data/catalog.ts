/**
 * Catalogue data access.
 *
 * Every page reads catalogue data through these functions — never from
 * `@/lib/mock` directly. Today they filter in-memory mock data. When the
 * backend exists, each function becomes a call to the endpoint named in its
 * comment (see docs/backend/api-contract.md) and the pages do not change.
 */
import { brands, collections } from "@/lib/mock/brands";
import { comments, products, reviews } from "@/lib/mock/products";
import type {
  Brand,
  CatalogFacets,
  Collection,
  Color,
  Paginated,
  Product,
  ProductComment,
  ProductQuery,
  ProductWithBrand,
  Review,
} from "@/lib/types";

const DEFAULT_PAGE_SIZE = 24;

// ---------------------------------------------------------------------------
// Availability rules (mirror the backend rules in docs/backend/database.md)
// ---------------------------------------------------------------------------

export function totalStock(p: Product): number {
  return p.variants.reduce((sum, v) => sum + v.stock, 0);
}

/** A product is listed only if active, from an approved brand, and in stock. */
export function isListed(p: Product): boolean {
  const brand = brands.find((b) => b.id === p.brandId);
  return p.status === "active" && brand?.status === "approved" && totalStock(p) > 0;
}

function withBrand(p: Product): ProductWithBrand {
  const b = brands.find((x) => x.id === p.brandId)!;
  return {
    ...p,
    brand: { id: b.id, slug: b.slug, name: b.name, city: b.city, tone: b.tone },
  };
}

function textScore(p: ProductWithBrand, q: string): number {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const fields = [
    [p.name, 4],
    [p.brand.name, 3],
    [p.styles.join(" "), 2],
    [p.type.replace("-", " "), 2],
    [p.description, 1],
  ] as const;
  let score = 0;
  for (const term of terms) {
    let matched = false;
    for (const [value, weight] of fields) {
      if (value.toLowerCase().includes(term)) {
        score += weight;
        matched = true;
      }
    }
    if (!matched) return 0; // every term must match somewhere
  }
  return score;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/** GET /v1/products */
export async function listProducts(query: ProductQuery = {}): Promise<Paginated<ProductWithBrand>> {
  let items = products.filter(isListed).map(withBrand);
  const scores = new Map<string, number>();

  if (query.q?.trim()) {
    for (const p of items) scores.set(p.id, textScore(p, query.q));
    items = items.filter((p) => (scores.get(p.id) ?? 0) > 0);
  }
  if (query.brand?.length) items = items.filter((p) => query.brand!.includes(p.brand.slug));
  if (query.style?.length) items = items.filter((p) => p.styles.some((s) => query.style!.includes(s)));
  if (query.type?.length) items = items.filter((p) => query.type!.includes(p.type));
  // Size and colour filters only match variants that are in stock.
  if (query.size?.length)
    items = items.filter((p) => p.variants.some((v) => v.stock > 0 && query.size!.includes(v.size)));
  if (query.color?.length)
    items = items.filter((p) =>
      p.variants.some((v) => v.stock > 0 && query.color!.includes(v.color.name.toLowerCase())),
    );
  if (query.minPrice != null) items = items.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice != null) items = items.filter((p) => p.price <= query.maxPrice!);
  if (query.minRating != null) items = items.filter((p) => p.ratingAvg >= query.minRating!);

  const sort = query.sort ?? (query.q ? "relevance" : "newest");
  items.sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount;
      case "relevance":
        return (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || b.createdAt.localeCompare(a.createdAt);
      case "newest":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });

  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}

/** GET /v1/products/new-drops — newest listed products. */
export async function listNewDrops(limit = 8): Promise<ProductWithBrand[]> {
  const res = await listProducts({ sort: "newest", pageSize: limit });
  return res.items;
}

/** GET /v1/products/:slug — returns inactive/out-of-stock products too, so links never 404. */
export async function getProduct(slug: string): Promise<ProductWithBrand | null> {
  const p = products.find((x) => x.slug === slug);
  if (!p) return null;
  const brand = brands.find((b) => b.id === p.brandId);
  if (brand?.status !== "approved") return null;
  return withBrand(p);
}

export async function listProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}

/** GET /v1/products/:id/related — same brand or shared style. Placeholder for the recommendation engine. */
export async function listRelatedProducts(product: Product, limit = 4): Promise<ProductWithBrand[]> {
  return products
    .filter((p) => p.id !== product.id && isListed(p))
    .map((p) => ({
      p,
      score:
        (p.brandId === product.brandId ? 2 : 0) +
        p.styles.filter((s) => product.styles.includes(s)).length +
        (p.type === product.type ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => withBrand(x.p));
}

/** GET /v1/products/:id/reviews */
export async function listReviews(productId: string): Promise<Review[]> {
  return reviews.filter((r) => r.productId === productId);
}

/** GET /v1/products/:id/comments */
export async function listComments(productId: string): Promise<ProductComment[]> {
  return comments.filter((c) => c.productId === productId);
}

/** GET /v1/catalog/facets — filter options with counts. */
export async function getFacets(): Promise<CatalogFacets> {
  const listed = products.filter(isListed);
  const count = <T extends string>(values: T[]) => {
    const m = new Map<T, number>();
    for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  };
  const styleCounts = count(listed.flatMap((p) => p.styles));
  const typeCounts = count(listed.map((p) => p.type));
  const brandCounts = count(listed.map((p) => p.brandId));

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizes = [...new Set(listed.flatMap((p) => p.variants.map((v) => v.size)))].sort((a, b) => {
    const ia = sizeOrder.indexOf(a);
    const ib = sizeOrder.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return Number(a) - Number(b) || a.localeCompare(b);
  });

  const colorMap = new Map<string, Color>();
  for (const p of listed) for (const v of p.variants) colorMap.set(v.color.name, v.color);

  const prices = listed.map((p) => p.price);
  return {
    brands: brands
      .filter((b) => brandCounts.has(b.id))
      .map((b) => ({ slug: b.slug, name: b.name, count: brandCounts.get(b.id)! })),
    styles: [...styleCounts].map(([value, n]) => ({ value, count: n })),
    types: [...typeCounts].map(([value, n]) => ({ value, count: n })),
    sizes,
    colors: [...colorMap.values()],
    priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
  };
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

/** GET /v1/brands */
export async function listBrands(): Promise<Brand[]> {
  return brands.filter((b) => b.status === "approved");
}

/** GET /v1/brands/:slug */
export async function getBrand(slug: string): Promise<Brand | null> {
  return brands.find((b) => b.slug === slug && b.status === "approved") ?? null;
}

/** GET /v1/brands/:slug/products */
export async function listBrandProducts(brandId: string): Promise<ProductWithBrand[]> {
  return products
    .filter((p) => p.brandId === brandId && isListed(p))
    .map(withBrand)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** GET /v1/brands/:slug/collections */
export async function listBrandCollections(brandId: string): Promise<Collection[]> {
  return collections.filter((c) => c.brandId === brandId);
}
