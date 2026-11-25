import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { listBrands } from "@/lib/data/catalog";
import { formatCount } from "@/lib/format";

export const metadata: Metadata = {
  title: "Brands",
  description: "Every approved streetwear brand on Part One.",
};

export default async function BrandsPage() {
  const brands = await listBrands();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-5xl uppercase sm:text-6xl">Brands</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Every brand on Part One is reviewed and approved before it can sell.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <li key={b.id}>
            <Link
              href={`/brands/${b.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground"
            >
              <div className="h-24" style={{ backgroundColor: b.tone }} aria-hidden />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="flex items-center gap-1 text-lg font-semibold">
                  {b.name}
                  <BadgeCheck className="size-4 fill-brand text-ink" aria-label="Approved brand" />
                </span>
                <p className="text-sm text-muted-foreground">{b.tagline}</p>
                <div className="mt-auto flex gap-4 pt-3 text-xs text-muted-foreground">
                  <span>{b.city}</span>
                  <span>{formatCount(b.followerCount)} followers</span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-current" aria-hidden /> {b.ratingAvg.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
