"use client";

import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";
import { formatCount } from "@/lib/format";
import type { SocialCounts } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Like / save / repost / share actions.
 *
 * MOCK: toggles are local state only. With the backend:
 *  - like/save/repost → PUT|DELETE /v1/products/:id/{like|save|repost}
 *    (optimistic update via TanStack Query; a 401 response sends the user to /login)
 *  - share → POST /v1/products/:id/shares { channel } for analytics, then the native share sheet
 */
export function SocialBar({ counts, productName }: { counts: SocialCounts; productName: string }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: productName, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled the share sheet
    }
  }

  const items = [
    { label: liked ? "Unlike" : "Like", icon: Heart, on: liked, count: counts.likes + (liked ? 1 : 0), onClick: () => setLiked((v) => !v) },
    { label: saved ? "Unsave" : "Save", icon: Bookmark, on: saved, count: counts.saves + (saved ? 1 : 0), onClick: () => setSaved((v) => !v) },
    { label: reposted ? "Undo repost" : "Repost", icon: Repeat2, on: reposted, count: counts.reposts + (reposted ? 1 : 0), onClick: () => setReposted((v) => !v) },
    { label: copied ? "Link copied" : "Share", icon: Share2, on: false, count: counts.shares, onClick: share },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ label, icon: Icon, on, count, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          aria-pressed={label === "Share" || label === "Link copied" ? undefined : on}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-foreground",
            on && "border-foreground bg-foreground text-background",
          )}
        >
          <Icon className={cn("size-4", on && label.startsWith("Un") && "fill-current")} aria-hidden />
          <span>{label}</span>
          <span className={cn("text-xs", on ? "text-background/70" : "text-muted-foreground")}>{formatCount(count)}</span>
        </button>
      ))}
      <a
        href="#comments"
        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:border-foreground"
      >
        <MessageCircle className="size-4" aria-hidden />
        Comments <span className="text-xs text-muted-foreground">{formatCount(counts.comments)}</span>
      </a>
    </div>
  );
}
