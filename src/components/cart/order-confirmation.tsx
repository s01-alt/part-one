"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockNotice } from "@/components/app/page-parts";
import { PREVIEW_ORDER_KEY } from "@/components/cart/checkout-form";
import { formatNaira } from "@/lib/format";
import type { CartTotals } from "@/lib/store/cart";

interface PreviewOrder {
  totals: CartTotals;
  address: { name: string; line1: string; city: string; state: string };
}

function readPreview(): string | null {
  try {
    return sessionStorage.getItem(PREVIEW_ORDER_KEY);
  } catch {
    return null;
  }
}

/**
 * PREVIEW confirmation. Real flow: Paystack redirects back with a reference,
 * this page polls GET /v1/checkout/:reference/status until the webhook marks
 * the order paid, then shows the real order number.
 */
export function OrderConfirmation() {
  const raw = useSyncExternalStore(
    () => () => {},
    readPreview,
    () => null,
  );
  const order: PreviewOrder | null = raw ? JSON.parse(raw) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <CheckCircle2 className="size-10" aria-hidden />
        <h1 className="font-heading text-5xl uppercase leading-none">Order placed</h1>
        <p className="text-muted-foreground">
          {order
            ? `Each brand ships its part to ${order.address.line1}, ${order.address.city}. You can follow every update in your orders.`
            : "You can follow every update in your orders."}
        </p>
      </div>

      {order && (
        <section className="rounded-sm border bg-card p-5" aria-label="Order summary">
          <ul className="flex flex-col divide-y">
            {order.totals.groups.map((g) => (
              <li key={g.brandId} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <span className="flex flex-col">
                  <span className="font-medium">{g.brandName}</span>
                  <span className="text-sm text-muted-foreground">
                    {(() => {
                      const n = g.lines.reduce((m, l) => m + l.quantity, 0);
                      return `${n} ${n === 1 ? "item" : "items"} · ships separately`;
                    })()}
                  </span>
                </span>
                <span>{formatNaira(g.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
            <span>Total</span>
            <span>{formatNaira(order.totals.total)}</span>
          </div>
        </section>
      )}

      <MockNotice>Preview only — no payment was taken and no order was created.</MockNotice>

      <div className="flex flex-wrap items-center gap-6">
        <Button asChild variant="brand" className="h-12 px-7 text-sm">
          <Link href="/account/orders">View your orders</Link>
        </Button>
        <Link href="/shop" className="text-sm font-medium hover:underline">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
