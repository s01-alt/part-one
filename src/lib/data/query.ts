import { nairaToKobo } from "@/lib/format";
import {
  PRODUCT_TYPES,
  STYLE_TAGS,
  type ProductQuery,
  type ProductSort,
  type ProductType,
  type StyleTag,
} from "@/lib/types";

/**
 * Converts between the shop URL (?q=&style=&size=…) and a ProductQuery.
 * URL prices are whole naira for readability; the query uses kobo.
 * The same parameter names are planned for GET /v1/products.
 */

type RawParams = Record<string, string | string[] | undefined>;

const SORTS: ProductSort[] = ["relevance", "newest", "price_asc", "price_desc", "rating"];

function list(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return (Array.isArray(v) ? v : v.split(",")).map((s) => s.trim()).filter(Boolean);
}

function num(v: string | string[] | undefined): number | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseProductQuery(raw: RawParams): ProductQuery {
  const sortRaw = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q)?.slice(0, 100);
  const minNaira = num(raw.min);
  const maxNaira = num(raw.max);
  return {
    q: q || undefined,
    brand: list(raw.brand),
    style: list(raw.style).filter((s): s is StyleTag => (STYLE_TAGS as readonly string[]).includes(s)),
    type: list(raw.type).filter((t): t is ProductType => (PRODUCT_TYPES as readonly string[]).includes(t)),
    size: list(raw.size),
    color: list(raw.color).map((c) => c.toLowerCase()),
    minPrice: minNaira != null ? nairaToKobo(minNaira) : undefined,
    maxPrice: maxNaira != null ? nairaToKobo(maxNaira) : undefined,
    minRating: num(raw.rating),
    sort: SORTS.includes(sortRaw as ProductSort) ? (sortRaw as ProductSort) : undefined,
    page: num(raw.page),
  };
}

/** Serialisable subset used by client filter components. */
export interface ShopUrlState {
  q?: string;
  brand: string[];
  style: string[];
  type: string[];
  size: string[];
  color: string[];
  min?: number;
  max?: number;
  rating?: number;
  sort?: string;
}

export function toUrlState(q: ProductQuery): ShopUrlState {
  return {
    q: q.q,
    brand: q.brand ?? [],
    style: q.style ?? [],
    type: q.type ?? [],
    size: q.size ?? [],
    color: q.color ?? [],
    min: q.minPrice != null ? q.minPrice / 100 : undefined,
    max: q.maxPrice != null ? q.maxPrice / 100 : undefined,
    rating: q.minRating,
    sort: q.sort,
  };
}

export function buildShopHref(state: ShopUrlState, page?: number): string {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  for (const key of ["brand", "style", "type", "size", "color"] as const) {
    if (state[key].length) p.set(key, state[key].join(","));
  }
  if (state.min != null) p.set("min", String(state.min));
  if (state.max != null) p.set("max", String(state.max));
  if (state.rating != null) p.set("rating", String(state.rating));
  if (state.sort) p.set("sort", state.sort);
  if (page && page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/shop?${s}` : "/shop";
}

export function activeFilterCount(s: ShopUrlState): number {
  return (
    s.brand.length +
    s.style.length +
    s.type.length +
    s.size.length +
    s.color.length +
    (s.min != null ? 1 : 0) +
    (s.max != null ? 1 : 0) +
    (s.rating != null ? 1 : 0)
  );
}
