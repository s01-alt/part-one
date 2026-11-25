import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Flag } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGrid } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { RatingStars } from "@/components/product/rating-stars";
import { SocialBar } from "@/components/product/social-bar";
import {
  getBrand,
  getProduct,
  listComments,
  listProductSlugs,
  listRelatedProducts,
  listReviews,
} from "@/lib/data/catalog";
import { STYLE_LABELS, TYPE_LABELS, formatDate } from "@/lib/format";

export async function generateStaticParams() {
  return (await listProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Product not found" };
  return { title: `${product.name} — ${product.brand.name}`, description: product.description };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [brand, reviews, comments, related] = await Promise.all([
    getBrand(product.brand.slug),
    listReviews(product.id),
    listComments(product.id),
    listRelatedProducts(product),
  ]);
  if (!brand) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:underline">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/shop?type=${product.type}`} className="hover:underline">
          {TYPE_LABELS[product.type]}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <ProductGallery images={product.images} type={product.type} tone={product.tone} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href={`/brands/${brand.slug}`}
              className="flex w-fit items-center gap-1 text-sm font-semibold uppercase tracking-wide hover:underline"
            >
              {brand.name}
              <BadgeCheck className="size-4 fill-brand text-ink" aria-label="Approved brand" />
            </Link>
            <h1 className="font-heading text-4xl uppercase leading-none sm:text-5xl">{product.name}</h1>
            <a href="#reviews" className="flex w-fit items-center gap-2 text-sm">
              <RatingStars value={product.ratingAvg} />
              <span className="text-muted-foreground underline-offset-4 hover:underline">
                {product.ratingAvg.toFixed(1)} · {product.ratingCount} reviews
              </span>
            </a>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.styles.map((s) => (
                <Link
                  key={s}
                  href={`/shop?style=${s}`}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium hover:bg-foreground hover:text-background"
                >
                  {STYLE_LABELS[s]}
                </Link>
              ))}
            </div>
          </div>

          <AddToCart product={product} shippingFee={brand.shippingFee} />

          <SocialBar counts={product.counts} productName={product.name} />

          <Accordion type="multiple" defaultValue={["details"]}>
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 text-sm">
                <p>{product.description}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                  <dt className="text-muted-foreground">Material</dt>
                  <dd>{product.material}</dd>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>{TYPE_LABELS[product.type]}</dd>
                  <dt className="text-muted-foreground">Ships from</dt>
                  <dd>{brand.city}</dd>
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Care</AccordionTrigger>
              <AccordionContent className="text-sm">{product.careInstructions}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery & returns</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 text-sm">
                <p>
                  {brand.name} packs and ships this item from {brand.city}. You can follow every status change in your
                  orders.
                </p>
                <p>
                  Returns are handled by the brand. If a refund is approved, Part One refunds the item price and VAT to
                  your original payment method. Delivery fees are not refundable. See our{" "}
                  <Link href="/terms#refunds" className="underline">
                    Terms of Use
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href={`/login?next=/products/${product.slug}`}
            className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            <Flag className="size-3.5" aria-hidden /> Report this product
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="mt-20 scroll-mt-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl uppercase sm:text-4xl">Reviews</h2>
          <p className="text-sm text-muted-foreground">Only customers who received this item can review it.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-6xl">{product.ratingAvg.toFixed(1)}</span>
            <RatingStars value={product.ratingAvg} />
            <span className="text-sm text-muted-foreground">{product.ratingCount} reviews</span>
          </div>
          <ul className="flex flex-col divide-y">
            {reviews.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 py-5 first:pt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <RatingStars value={r.rating} />
                  <span className="text-sm font-medium">{r.authorName}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BadgeCheck className="size-3.5" aria-hidden /> Verified purchase · {r.variantLabel}
                  </span>
                </div>
                <p>{r.body}</p>
                <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comments */}
      <section id="comments" className="mt-16 scroll-mt-24">
        <h2 className="mb-6 font-heading text-3xl uppercase sm:text-4xl">Comments</h2>
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="rounded-md border border-dashed p-4 text-sm">
            <Link href={`/login?next=/products/${product.slug}`} className="font-medium underline underline-offset-4">
              Sign in
            </Link>{" "}
            to join the conversation.
          </div>
          <ul className="flex flex-col gap-5">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold"
                  aria-hidden
                >
                  {c.authorName.slice(0, 1)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {c.authorName} <span className="font-normal text-muted-foreground">· {formatDate(c.createdAt)}</span>
                  </span>
                  <p>{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-heading text-3xl uppercase sm:text-4xl">You might also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
