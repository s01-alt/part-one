import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { ProductArt } from "@/components/product/product-art";
import { formatNaira } from "@/lib/format";
import type { ProductWithBrand } from "@/lib/types";

const NEW_DAYS = 14;
// Fixed "now" for mock data so the NEW badge is stable between builds.
// Replace with the server-provided `isNew` flag once the API exists.
const MOCK_NOW = Date.parse("2026-11-25T00:00:00Z");

/** Product tile (brand inspo): white card, heart top-right, BRAND / name / bold price / swatches. */
export function ProductCard({ product }: { product: ProductWithBrand }) {
  const isNew = MOCK_NOW - Date.parse(product.createdAt) < NEW_DAYS * 86_400_000;
  const colors = [...new Map(product.variants.map((v) => [v.color.name, v.color])).values()];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
        <ProductArt
          type={product.type}
          tone={product.tone}
          label={product.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {isNew && (
          <span className="absolute left-2 top-2 rounded-sm bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
            New drop
          </span>
        )}
        <span
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground"
          aria-hidden
        >
          <Heart className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <span className="text-xs text-muted-foreground">{product.brand.name}</span>
        <span className="line-clamp-2 font-medium leading-snug group-hover:underline sm:line-clamp-1">{product.name}</span>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span>{formatNaira(product.price)}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-current" aria-hidden />
            {product.ratingAvg.toFixed(1)}
            <span className="sr-only">out of 5 from {product.ratingCount} reviews</span>
          </span>
        </div>
        <div className="mt-1 flex gap-1.5" aria-label={`${colors.length} colours`}>
          {colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="size-3.5 rounded-full border border-foreground/20"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ProductWithBrand[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
