import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Globe, MapPin, Star } from "lucide-react";
import { FollowButton } from "@/components/brand/follow-button";
import { ProductGrid } from "@/components/product/product-card";
import { getBrand, listBrandCollections, listBrandProducts, listBrands } from "@/lib/data/catalog";
import { formatNaira } from "@/lib/format";

export async function generateStaticParams() {
  return (await listBrands()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const brand = await getBrand((await params).slug);
  if (!brand) return { title: "Brand not found" };
  return { title: brand.name, description: brand.tagline };
}

/** Standard storefront template — every approved brand gets the same layout. */
export default async function BrandPage({ params }: PageProps<"/brands/[slug]">) {
  const brand = await getBrand((await params).slug);
  if (!brand) notFound();

  const [products, collections] = await Promise.all([
    listBrandProducts(brand.id),
    listBrandCollections(brand.id),
  ]);

  const socials = [
    brand.socials.instagram && { label: "Instagram", href: `https://instagram.com/${brand.socials.instagram}` },
    brand.socials.tiktok && { label: "TikTok", href: `https://tiktok.com/@${brand.socials.tiktok}` },
    brand.socials.x && { label: "X", href: `https://x.com/${brand.socials.x}` },
    brand.socials.website && { label: "Website", href: `https://${brand.socials.website}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div>
      {/* Banner */}
      <div className="h-40 sm:h-56" style={{ backgroundColor: brand.tone }} aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-12 flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <span
              className="flex size-24 items-center justify-center rounded-full border-4 border-background font-heading text-4xl uppercase"
              style={{ backgroundColor: brand.tone }}
              aria-hidden
            >
              {brand.name.slice(0, 1)}
            </span>
            <div className="flex flex-col gap-1">
              <h1 className="flex items-center gap-2 font-heading text-4xl uppercase sm:text-5xl">
                {brand.name}
                <BadgeCheck className="size-6 fill-brand text-ink" aria-label="Approved brand" />
              </h1>
              <p className="text-muted-foreground">{brand.tagline}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden /> {brand.city}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-current" aria-hidden /> {brand.ratingAvg.toFixed(1)} from{" "}
                  {brand.ratingCount} product reviews
                </span>
              </div>
            </div>
          </div>
          <FollowButton followerCount={brand.followerCount} />
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[260px_1fr]">
          <aside className="flex flex-col gap-6 text-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
              <p>{brand.description}</p>
            </div>
            {socials.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Links</h2>
                <ul className="flex flex-col gap-1">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Globe className="size-3.5" aria-hidden /> {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Delivery</h2>
              <p>
                Ships from {brand.city}. Delivery fee {formatNaira(brand.shippingFee)} per order.
              </p>
            </div>
          </aside>

          <div className="flex flex-col gap-12">
            {collections.map((c) => {
              const items = products.filter((p) => p.collectionIds.includes(c.id));
              if (!items.length) return null;
              return (
                <section key={c.id} id={c.slug} className="scroll-mt-24">
                  <h2 className="font-heading text-3xl uppercase">{c.name}</h2>
                  <p className="mb-5 text-sm text-muted-foreground">{c.description}</p>
                  <ProductGrid products={items} />
                </section>
              );
            })}
            <section>
              <h2 className="mb-5 font-heading text-3xl uppercase">All products ({products.length})</h2>
              {products.length ? (
                <ProductGrid products={products} />
              ) : (
                <p className="text-muted-foreground">
                  No products available right now.{" "}
                  <Link href="/shop" className="underline">
                    Browse the shop
                  </Link>
                  .
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
