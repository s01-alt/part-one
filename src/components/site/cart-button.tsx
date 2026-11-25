"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart, useCartCount } from "@/lib/store/cart";

/** Loads the persisted cart once on the client. Render once, in the site header. */
export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}

export function CartButton() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      className="relative inline-flex size-10 items-center justify-center rounded-sm text-ink-foreground transition-colors hover:bg-ink-2"
      aria-label={count ? `Cart, ${count} items` : "Cart"}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-[18px] text-brand-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
