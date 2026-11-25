import Link from "next/link";
import { ArrowRight, Headset, Lock, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductArt } from "@/components/product/product-art";
import { ProductGrid } from "@/components/product/product-card";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { getFacets, listBrands, listNewDrops, listProducts } from "@/lib/data/catalog";
import { STYLE_LABELS } from "@/lib/format";
import { STYLE_TAGS, type ProductType, type StyleTag } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Layout and brand language follow "Nigerian Streetwear Marketplace Homepage inspo.png".
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

// Each fictional brand gets a distinct wordmark treatment in the brand strip.
const WORDMARK_STYLES = [
  "font-logo italic font-black text-2xl",
  "font-heading text-3xl tracking-wide",
  "font-sans text-xl font-light tracking-[0.35em] uppercase",
  "font-logo font-extrabold italic text-xl uppercase",
  "font-heading text-2xl tracking-[0.2em]",
  "font-sans text-2xl font-bold tracking-tight",
  "font-mono text-lg uppercase tracking-widest",
  "font-heading text-3xl",
];

function SectionHeader({ title, href, linkLabel, dark }: { title: string; href: string; linkLabel: string; dark?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-heading text-3xl uppercase leading-none sm:text-4xl">{title}</h2>
      <Link
        href={href}
        className={cn(
          "flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider hover:underline",
          dark ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {linkLabel} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [drops, brands, facets, all] = await Promise.all([
    listNewDrops(8),
    listBrands(),
    getFacets(),
    listProducts({ pageSize: 100 }),
  ]);
  const trending = [...all.items].sort((a, b) => b.counts.likes - a.counts.likes).slice(0, 8);
  const styleCount = new Map(facets.styles.map((s) => [s.value, s.count]));
  const heroPieces = [drops[0], trending[0]].filter(Boolean);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-6 select-none font-logo text-[22rem] font-black italic leading-none text-ink-foreground/[0.04]"
        >
          P1
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-12 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <span className="text-sm font-bold uppercase tracking-wider text-brand">Nigerian streetwear marketplace</span>
            <h1 className="font-heading text-6xl uppercase leading-[0.88] sm:text-7xl lg:text-[5.5rem]">
              Discover Nigerian
              <br />
              <span className="text-brand">Streetwear</span>
            </h1>
            <p className="max-w-md text-lg text-ink-foreground/85">
              Shop the hottest pieces from independent Nigerian brands. Real style. Real culture. Right here.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="brand" className="h-12 px-7 text-sm">
                <Link href="/shop">
                  Shop now <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="inverse" className="h-12 px-7 text-sm">
                <Link href="/brands">Explore brands</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 lg:max-w-none" aria-hidden>
            {heroPieces.map((p, i) => (
              <div key={p.id} className={cn("relative", i === 1 && "translate-y-10")}>
                <ProductArt type={p.type} tone={p.tone} variant={i} className="aspect-[3/4] rounded-sm" />
                <span className="absolute bottom-3 left-3 rounded-sm bg-ink/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {p.brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ul className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 pb-12 pt-4 sm:px-6 md:grid-cols-4 lg:w-full">
          {[
            { icon: ShieldCheck, title: "100% authentic", body: "Direct from approved brands" },
            { icon: Truck, title: "Nationwide delivery", body: "Shipped by each brand" },
            { icon: Lock, title: "Secure payments", body: "Pay safely with Paystack" },
            { icon: Headset, title: "Support", body: "We're here to help" },
          ].map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3">
              <Icon className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs text-ink-muted">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Shop by style ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader title="Shop by style" href="/shop" linkLabel="View all" />
        <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {STYLE_TAGS.map((s) => (
            <li key={s} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-48px)/5)]">
              <Link href={`/shop?style=${s}`} className="group relative block overflow-hidden rounded-sm">
                <ProductArt
                  type={STYLE_ART[s].type}
                  tone={STYLE_ART[s].tone}
                  className="aspect-[4/5] transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                <span className="absolute bottom-3 left-3 flex flex-col text-white">
                  <span className="font-heading text-2xl uppercase leading-none">{STYLE_LABELS[s]}</span>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide">
                    {styleCount.get(s) ?? 0} items
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Trending brands ──────────────────────────────────── */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <SectionHeader title="Trending brands" href="/brands" linkLabel="View all brands" dark />
          <ul className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
            {brands.map((b, i) => (
              <li key={b.id}>
                <Link
                  href={`/brands/${b.slug}`}
                  className={cn(
                    "block whitespace-nowrap leading-none text-ink-foreground/90 transition-colors hover:text-brand",
                    WORDMARK_STYLES[i % WORDMARK_STYLES.length],
                  )}
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Trending pieces ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <SectionHeader title="Trending pieces" href="/shop?sort=rating" linkLabel="View all" />
        <ProductGrid products={trending} />
      </section>

      {/* ── New drops ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <SectionHeader title="New drops" href="/shop?sort=newest" linkLabel="View all" />
        <ProductGrid products={drops} />
      </section>

      {/* ── Waitlist (pre-launch, carried over from the GitHub repo) ── */}
      <section className="mt-16 bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">The waitlist</span>
            <h2 className="mt-3 font-heading text-5xl uppercase leading-[0.95] sm:text-6xl">Be first through the door.</h2>
            <p className="mt-4 max-w-md text-ink-foreground/85">
              Part One opens in Lagos soon. Get on the list for early access, founding member perks and the first drops.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm font-medium">
              {["Early access to drops", "Founding member perks", "Vote on which brands launch first"].map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] text-ink" aria-hidden>
                    ✦
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <WaitlistForm tone="dark" />
        </div>
      </section>

      {/* ── Sell CTA ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-sm bg-brand p-8 text-brand-foreground md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-heading text-4xl uppercase leading-none sm:text-5xl">Run a streetwear brand?</h2>
            <p className="mt-3 max-w-xl font-medium">
              Get a storefront, reach customers across Nigeria, and get paid once orders are delivered.
            </p>
          </div>
          <Button asChild className="h-12 bg-ink px-7 text-sm font-bold uppercase tracking-wide text-ink-foreground hover:bg-ink/85">
            <Link href="/sell">
              Apply to sell <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
