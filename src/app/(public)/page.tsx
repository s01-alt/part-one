import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductArt } from "@/components/product/product-art";
import { ProductGrid } from "@/components/product/product-card";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { getFacets, listBrands, listNewDrops } from "@/lib/data/catalog";
import { STYLE_LABELS } from "@/lib/format";
import { STYLE_TAGS, type ProductType, type StyleTag } from "@/lib/types";

/* Brand language: docs/design/homepage-inspo.png, applied with restraint —
   one idea per section, products carry the page, lime only on the main action.
   Photography is placeholder art until real campaign images are supplied. */

const STYLE_ART: Record<StyleTag, { type: ProductType; tone: string }> = {
  baggy: { type: "hoodie", tone: "#2a2a2a" },
  y2k: { type: "t-shirt", tone: "#A9C3E6" },
  minimalist: { type: "sweatshirt", tone: "#C9B48E" },
  graphic: { type: "t-shirt", tone: "#151515" },
  vintage: { type: "jacket", tone: "#1F4D36" },
  utility: { type: "cargo-pants", tone: "#4F5B3A" },
  athleisure: { type: "sneakers", tone: "#E0612F" },
  luxury: { type: "jacket", tone: "#1F2A44" },
  grunge: { type: "shirt", tone: "#3B3B3B" },
};

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <h2 className="font-heading text-3xl uppercase leading-none">{title}</h2>
      <Link href={href} className="flex shrink-0 items-center gap-1.5 text-sm font-medium hover:underline">
        {linkLabel} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [drops, brands, facets] = await Promise.all([listNewDrops(8), listBrands(), getFacets()]);
  const styleCount = new Map(facets.styles.map((s) => [s.value, s.count]));
  const heroPieces = drops.filter((p, i) => drops.findIndex((q) => q.type === p.type) === i).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="flex flex-col gap-7">
            <h1 className="font-heading text-6xl uppercase leading-[0.9] sm:text-7xl">
              Discover Nigerian
              <br />
              streetwear
            </h1>
            <p className="max-w-md text-lg text-ink-foreground/75">
              Independent Nigerian brands, in one place.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Button asChild variant="brand" className="h-12 px-7 text-sm">
                <Link href="/shop">Shop now</Link>
              </Button>
              <Link href="/brands" className="flex items-center gap-1.5 text-sm font-medium hover:underline">
                Explore brands <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4" aria-hidden>
            {heroPieces.map((p, i) => (
              <ProductArt key={p.id} type={p.type} tone={p.tone} variant={i} className="aspect-[3/4] rounded-sm" />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by style */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeader title="Shop by style" href="/shop" linkLabel="View all" />
        <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {STYLE_TAGS.map((s) => (
            <li key={s} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-64px)/5)]">
              <Link href={`/shop?style=${s}`} className="group block">
                <div className="overflow-hidden rounded-sm">
                  <ProductArt
                    type={STYLE_ART[s].type}
                    tone={STYLE_ART[s].tone}
                    className="aspect-[4/5] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-medium">{STYLE_LABELS[s]}</p>
                <p className="text-sm text-muted-foreground">{styleCount.get(s) ?? 0} items</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* New drops — the one product grid on the page */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <SectionHeader title="New drops" href="/shop?sort=newest" linkLabel="View all" />
        <ProductGrid products={drops} />
      </section>

      {/* Brands — one plain row */}
      <section className="border-y">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeader title="Brands" href="/brands" linkLabel="All brands" />
          <ul className="flex flex-wrap gap-x-10 gap-y-4 text-lg font-medium">
            {brands.map((b) => (
              <li key={b.id}>
                <Link href={`/brands/${b.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Waitlist — the single secondary call to action */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-heading text-5xl uppercase leading-[0.95]">Be first through the door</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Part One opens in Lagos soon. Join the waitlist for early access to the first drops.
          </p>
        </div>
        <WaitlistForm />
      </section>
    </>
  );
}
