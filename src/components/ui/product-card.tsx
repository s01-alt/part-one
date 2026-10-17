"use client";

import Link from "next/link";
import { Bookmark, Heart, Star } from "lucide-react";
import { ProductArt } from "@/components/ui/product-art";
import { Badge } from "@/components/ui/badge";
import { useEngagementStore } from "@/store/engagement-store";
import { useMounted } from "@/lib/use-mounted";
import { cn, formatCompact, formatNaira } from "@/lib/utils";
import type { ProductCardData } from "@/types";

export function ProductCard({
  product,
  accent = "#c6ff00",
  className,
}: {
  product: ProductCardData;
  accent?: string;
  className?: string;
}) {
  const mounted = useMounted();
  const liked = useEngagementStore((s) => s.liked.includes(product.id));
  const saved = useEngagementStore((s) => s.saved.includes(product.id));
  const toggleLike = useEngagementStore((s) => s.toggleLike);
  const toggleSave = useEngagementStore((s) => s.toggleSave);

  const isLiked = mounted && liked;
  const isSaved = mounted && saved;
  const soldOut = product.stock === 0;
  const almostGone = !soldOut && product.stock <= 3;

  return (
    <article className={cn("group relative", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
        <Link
          href={`/product/${product.slug}`}
          className="block aspect-4/5"
          aria-label={`View ${product.name} by ${product.brand}`}
        >
          <div
            className={cn(
              "h-full w-full transition-transform duration-500 group-hover:scale-105",
              soldOut && "opacity-50 grayscale",
            )}
          >
            <ProductArt
              seed={product.id}
              accent={accent}
              label={product.name}
              sub={product.brand}
            />
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {soldOut ? (
              <Badge tone="danger">Sold out</Badge>
            ) : almostGone ? (
              <Badge tone="acid">Almost gone</Badge>
            ) : (
              product.tags.slice(0, 1).map((tag) => (
                <Badge key={tag} tone="paper">
                  {tag}
                </Badge>
              ))
            )}
          </div>
          <div className="pointer-events-auto flex gap-1.5">
            <IconToggle
              label={isLiked ? "Unlike" : "Like"}
              active={isLiked}
              onClick={() => toggleLike(product.id)}
            >
              <Heart
                className="h-4 w-4"
                fill={isLiked ? "currentColor" : "none"}
              />
            </IconToggle>
            <IconToggle
              label={isSaved ? "Remove from saved" : "Save"}
              active={isSaved}
              onClick={() => toggleSave(product.id)}
            >
              <Bookmark
                className="h-4 w-4"
                fill={isSaved ? "currentColor" : "none"}
              />
            </IconToggle>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-smoke">
            {product.brand}
          </p>
          <span className="flex items-center gap-1 text-[11px] text-smoke">
            <Star className="h-3 w-3 fill-acid text-acid" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="text-sm font-medium leading-snug text-paper">
          <Link href={`/product/${product.slug}`} className="hover:text-acid">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <p className="text-sm font-semibold text-paper">
            {formatNaira(product.price)}
            {product.compareAtPrice ? (
              <span className="ml-2 text-xs font-normal text-smoke line-through">
                {formatNaira(product.compareAtPrice)}
              </span>
            ) : null}
          </p>
          <span className="text-[11px] text-smoke">
            {formatCompact(product.likes)} ♥
          </span>
        </div>
      </div>
    </article>
  );
}

function IconToggle({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full border backdrop-blur transition-colors",
        active
          ? "border-acid bg-acid text-ink"
          : "border-line bg-ink/70 text-paper hover:border-acid hover:text-acid",
      )}
    >
      {children}
    </button>
  );
}
