"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";
import { Kicker } from "@/components/ui/card";
import { ProductArt } from "@/components/ui/product-art";
import { toast } from "@/components/ui/toast";
import { feedPosts } from "@/lib/mock/feed";
import { productsById } from "@/lib/mock/products";
import { brandsById } from "@/lib/mock/brands";
import { useEngagementStore } from "@/store/engagement-store";
import { useMounted } from "@/lib/use-mounted";
import { cn, formatCompact } from "@/lib/utils";

export function CommunityTeaser() {
  return (
    <section className="border-b border-line bg-ink-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Kicker>Community</Kicker>
            <h2 className="display mt-4 text-4xl text-paper sm:text-5xl">
              The feed that sells.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-smoke">
              Follow brands, repost the fits you love, and shop straight from
              the timeline.
            </p>
          </div>
          <Link
            href="/community"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-acid hover:text-paper"
          >
            Open community
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feedPosts.slice(0, 3).map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedCard({ post }: { post: (typeof feedPosts)[number] }) {
  const mounted = useMounted();
  const product = productsById[post.productId];
  const accent = product ? brandsById[product.brandId]?.accent : undefined;
  const liked = useEngagementStore((s) => s.liked.includes(post.id));
  const toggleLike = useEngagementStore((s) => s.toggleLike);
  const isLiked = mounted && liked;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-ink">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accent ?? "#c6ff00" }}
          />
          <span className="text-xs font-semibold text-paper">
            {post.brandHandle}
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-widest text-smoke">
          {post.postedAt}
        </span>
      </div>

      {product ? (
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-square"
        >
          <ProductArt
            seed={product.id}
            accent={accent}
            label={product.name}
            sub={product.brand}
          />
        </Link>
      ) : null}

      <div className="p-4">
        <p className="text-sm leading-relaxed text-paper/90">{post.caption}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-smoke">
          <ActionButton
            active={isLiked}
            label="Like"
            onClick={() => toggleLike(post.id)}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            {formatCompact(post.likes + (isLiked ? 1 : 0))}
          </ActionButton>
          <ActionButton
            label="Repost"
            onClick={() =>
              toast({
                title: "Reposted",
                description: "This drop is now on your community feed.",
                tone: "success",
              })
            }
          >
            <Repeat2 className="h-4 w-4" />
            {formatCompact(post.reposts)}
          </ActionButton>
          <ActionButton
            label="Comment"
            onClick={() =>
              toast({
                title: "Comments opening soon",
                description: "Join the waitlist to be first in.",
              })
            }
          >
            <MessageCircle className="h-4 w-4" />
            {formatCompact(post.comments)}
          </ActionButton>
          <ActionButton
            label="Share"
            onClick={() =>
              toast({
                title: "Link copied",
                description: "Share this drop with your people.",
                tone: "success",
              })
            }
          >
            <Share2 className="h-4 w-4" />
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
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
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors hover:text-paper",
        active && "text-acid",
      )}
    >
      {children}
    </button>
  );
}
