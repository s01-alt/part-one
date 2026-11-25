import type { Metadata } from "next";
import Link from "next/link";
import { Repeat2 } from "lucide-react";
import { ProductArt } from "@/components/product/product-art";
import { listRepostFeed } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export const metadata: Metadata = {
  title: "Community",
  description: "Products the Part One community is reposting right now.",
};

/** Global repost feed (PRD §8). Ordered newest first; ranking can come from the recommendation engine later. */
export default async function FeedPage() {
  const feed = await listRepostFeed();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl uppercase sm:text-5xl">Community</h1>
      <p className="mt-2 text-muted-foreground">What people are reposting across Part One.</p>
      <ol className="mt-10 flex flex-col gap-6">
        {feed.map((r) => (
          <li key={r.id} className="rounded-lg border bg-card">
            <div className="flex items-center gap-2 px-4 pt-4 text-sm">
              <Repeat2 className="size-4 text-foreground" aria-hidden />
              <span className="font-medium">{r.userName}</span>
              <span className="text-muted-foreground">reposted · {formatDate(r.createdAt)}</span>
            </div>
            {r.caption && <p className="px-4 pt-2">{r.caption}</p>}
            <Link href={`/products/${r.product.slug}`} className="m-4 flex gap-4 rounded-md border p-3 hover:border-foreground">
              <ProductArt type={r.product.type} tone={r.product.tone} className="aspect-[4/5] w-24 shrink-0 rounded-md" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{r.product.brand.name}</span>
                <span className="font-medium">{r.product.name}</span>
                <span className="font-semibold">{formatNaira(r.product.price)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
