import * as React from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden border-y border-line py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        <MarqueeGroup>{children}</MarqueeGroup>
        <MarqueeGroup aria-hidden>{children}</MarqueeGroup>
      </div>
    </div>
  );
}

function MarqueeGroup({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex shrink-0 items-center" {...props}>
      {children}
    </div>
  );
}

export function MarqueeItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-8 px-8">
      <span className="display text-xl text-paper sm:text-2xl">{children}</span>
      <span className="text-acid" aria-hidden>
        ✳
      </span>
    </span>
  );
}
