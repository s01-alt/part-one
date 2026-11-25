import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { ShopFilterSidebar, ShopToolbar } from "@/components/shop/shop-filters";
import { getFacets, listProducts } from "@/lib/data/catalog";
import { buildShopHref, parseProductQuery, toUrlState } from "@/lib/data/query";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Nigerian streetwear by style, brand, size, colour and price.",
};

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-heading text-4xl uppercase sm:text-5xl">Shop</h1>
      {/* searchParams is request data — read it inside Suspense so the shell can be prerendered. */}
      <Suspense fallback={<ShopSkeleton />}>
        <ShopResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopResults({ searchParams }: { searchParams: PageProps<"/shop">["searchParams"] }) {
  const query = parseProductQuery(await searchParams);
  const [result, facets] = await Promise.all([listProducts(query), getFacets()]);
  const state = toUrlState(query);

  return (
    <div className="flex gap-10">
      <ShopFilterSidebar state={state} facets={facets} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {query.q && (
          <p className="text-lg">
            Results for <span className="font-semibold">“{query.q}”</span>
          </p>
        )}
        <ShopToolbar state={state} facets={facets} total={result.total} />
        {result.items.length ? (
          <ProductGrid products={result.items} />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
            <p className="text-lg font-semibold">No products match these filters.</p>
            <p className="text-muted-foreground">Try removing a filter or searching for something else.</p>
            <Link href="/shop" className="text-sm font-medium underline underline-offset-4">
              Clear everything
            </Link>
          </div>
        )}
        {result.totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={buildShopHref(state, n)}
                aria-current={n === result.page ? "page" : undefined}
                className="flex size-10 items-center justify-center rounded-md border text-sm aria-[current=page]:bg-foreground aria-[current=page]:text-background"
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-busy aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[4/5] animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
}
