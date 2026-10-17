import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Kicker } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import { featuredProducts } from "@/lib/mock/products";
import { brandsById } from "@/lib/mock/brands";

export function ProductPreview() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Kicker>Fresh drops</Kicker>
            <h2 className="display mt-4 text-4xl text-paper sm:text-5xl">
              Just landed.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-smoke">
              The latest from the brands on Part One. Like it, save it, or wait
              for the doors to open.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-acid hover:text-paper"
          >
            Shop everything
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              accent={brandsById[product.brandId]?.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
