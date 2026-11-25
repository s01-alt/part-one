"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductArt } from "@/components/product/product-art";
import { formatNaira } from "@/lib/format";
import { computeTotals, useCart, useCartHydrated } from "@/lib/store/cart";

export function CartView() {
  const hydrated = useCartHydrated();
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-lg bg-muted" aria-busy aria-label="Loading cart" />;
  }

  if (!lines.length) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-20 text-center">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Button asChild className="h-11 px-5">
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  const totals = computeTotals(lines);

  return (
    <div className="grid gap-10 pb-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-0">
      <div className="flex flex-col gap-8">
        {totals.groups.length > 1 && (
          <p className="rounded-md bg-secondary p-3 text-sm">
            Your cart has items from <strong>{totals.groups.length} brands</strong>. You pay once, and each brand ships
            its own part of the order.
          </p>
        )}
        {totals.groups.map((g) => (
          <section key={g.brandId} className="rounded-lg border bg-card" aria-labelledby={`seller-${g.brandId}`}>
            <header className="flex items-center justify-between border-b px-4 py-3">
              <h2 id={`seller-${g.brandId}`} className="font-semibold">
                <Link href={`/brands/${g.brandSlug}`} className="hover:underline">
                  {g.brandName}
                </Link>
              </h2>
              <span className="hidden text-xs text-muted-foreground sm:inline">Ships separately</span>
            </header>
            <ul className="divide-y">
              {g.lines.map((l) => (
                <li key={l.variantId} className="flex gap-4 p-4">
                  <Link href={`/products/${l.productSlug}`} className="w-20 shrink-0">
                    <ProductArt type={l.productType} tone={l.tone} className="aspect-[4/5] rounded-md" />
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link href={`/products/${l.productSlug}`} className="font-medium hover:underline">
                      {l.productName}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {l.colorName} / {l.size}
                    </span>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          className="flex size-8 items-center justify-center"
                          onClick={() => setQuantity(l.variantId, l.quantity - 1)}
                          aria-label={`Decrease quantity of ${l.productName}`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">{l.quantity}</span>
                        <button
                          type="button"
                          className="flex size-8 items-center justify-center disabled:opacity-30"
                          onClick={() => setQuantity(l.variantId, l.quantity + 1)}
                          disabled={l.quantity >= l.maxStock}
                          aria-label={`Increase quantity of ${l.productName}`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold">{formatNaira(l.unitPrice * l.quantity)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(l.variantId)}
                    className="self-start rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label={`Remove ${l.productName}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-[1fr_auto] gap-y-1 border-t px-4 py-3 text-sm">
              <dt className="text-muted-foreground">Items</dt>
              <dd>{formatNaira(g.itemsSubtotal)}</dd>
              <dt className="text-muted-foreground">Delivery ({g.brandName})</dt>
              <dd>{formatNaira(g.shippingFee)}</dd>
            </dl>
          </section>
        ))}
      </div>

      <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-24" aria-label="Order summary">
        <h2 className="mb-4 text-lg font-semibold">Summary</h2>
        <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
          <dt className="text-muted-foreground">Items</dt>
          <dd>{formatNaira(totals.itemsSubtotal)}</dd>
          <dt className="text-muted-foreground">
            Delivery ({totals.groups.length} {totals.groups.length === 1 ? "brand" : "brands"})
          </dt>
          <dd>{formatNaira(totals.shipping)}</dd>
          <dt className="text-muted-foreground">VAT (7.5%)</dt>
          <dd>{formatNaira(totals.vat)}</dd>
          <dt className="mt-2 border-t pt-3 text-base font-semibold">Total</dt>
          <dd className="mt-2 border-t pt-3 text-base font-semibold">{formatNaira(totals.total)}</dd>
        </dl>
        <Button asChild variant="brand" className="mt-6 h-12 w-full text-sm">
          <Link href="/checkout">Check out</Link>
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure payment with Paystack. Stock is confirmed when your payment is received.
        </p>
      </aside>

      {/* Phones: keep the total and Check out within reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span className="flex flex-col leading-tight">
            <span className="text-xs text-muted-foreground">Total incl. VAT & delivery</span>
            <span className="font-semibold">{formatNaira(totals.total)}</span>
          </span>
          <Button asChild variant="brand" className="h-11 px-6 text-sm">
            <Link href="/checkout">Check out</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
