"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/lib/store/cart";
import type { Brand, ProductWithBrand } from "@/lib/types";
import { cn } from "@/lib/utils";

const LOW_STOCK = 3;

export function AddToCart({
  product,
  shippingFee,
}: {
  product: ProductWithBrand;
  shippingFee: Brand["shippingFee"];
}) {
  const add = useCart((s) => s.add);
  const colors = useMemo(
    () => [...new Map(product.variants.map((v) => [v.color.name, v.color])).values()],
    [product.variants],
  );
  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size))], [product.variants]);

  const firstInStock = product.variants.find((v) => v.stock > 0);
  const [color, setColor] = useState(firstInStock?.color.name ?? colors[0]?.name);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.color.name === color && v.size === size);
  const stockFor = (s: string) => product.variants.find((v) => v.color.name === color && v.size === s)?.stock ?? 0;
  const price = variant?.price ?? product.price;
  const soldOut = product.variants.every((v) => v.stock === 0) || product.status !== "active";

  function handleAdd() {
    if (!variant || variant.stock === 0) return;
    add(
      {
        variantId: variant.id,
        productSlug: product.slug,
        productName: product.name,
        productType: product.type,
        tone: variant.color.hex,
        brandId: product.brand.id,
        brandSlug: product.brand.slug,
        brandName: product.brand.name,
        brandShippingFee: shippingFee,
        size: variant.size,
        colorName: variant.color.name,
        unitPrice: price,
        maxStock: variant.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-3xl font-semibold">{formatNaira(price)}</p>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">
          Colour: <span className="text-muted-foreground">{color}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const any = product.variants.some((v) => v.color.name === c.name && v.stock > 0);
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={c.name === color}
                aria-label={`${c.name}${any ? "" : " (sold out)"}`}
                onClick={() => {
                  setColor(c.name);
                  setQty(1);
                }}
                className={cn(
                  "size-10 rounded-full border-2 p-0.5",
                  c.name === color ? "border-foreground" : "border-transparent",
                  !any && "opacity-40",
                )}
              >
                <span className="block size-full rounded-full border border-foreground/15" style={{ backgroundColor: c.hex }} />
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const stock = stockFor(s);
            return (
              <button
                key={s}
                type="button"
                disabled={stock === 0}
                aria-pressed={s === size}
                onClick={() => {
                  setSize(s);
                  setQty(1);
                }}
                className={cn(
                  "min-w-14 rounded-md border px-3 py-2.5 text-sm font-medium",
                  s === size ? "border-foreground bg-foreground text-background" : "hover:border-foreground",
                  stock === 0 && "cursor-not-allowed text-muted-foreground line-through",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="min-h-5 text-sm" aria-live="polite">
          {variant && variant.stock > 0 && variant.stock <= LOW_STOCK && (
            <span className="font-semibold text-amber-700">Only {variant.stock} left</span>
          )}
          {!size && !soldOut && <span className="text-muted-foreground">Pick a size</span>}
        </p>
      </fieldset>

      <div className="flex gap-3">
        <div className="flex items-center rounded-md border" aria-label="Quantity">
          <button
            type="button"
            className="flex size-12 items-center justify-center disabled:opacity-30"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-medium" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="flex size-12 items-center justify-center disabled:opacity-30"
            onClick={() => setQty((q) => Math.min(variant?.stock ?? 1, q + 1))}
            disabled={!variant || qty >= variant.stock}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          variant="brand"
          className="h-12 flex-1 text-sm"
          onClick={handleAdd}
          disabled={soldOut || !variant || variant.stock === 0}
        >
          {soldOut ? "Sold out" : added ? (
            <>
              <Check data-icon="inline-start" /> Added to cart
            </>
          ) : (
            "Add to cart"
          )}
        </Button>
      </div>
      {added && (
        <Link href="/cart" className="-mt-3 text-sm font-medium underline underline-offset-4">
          View cart and check out
        </Link>
      )}
      <p className="text-xs text-muted-foreground">
        VAT (7.5%) and {product.brand.name}&apos;s delivery fee of {formatNaira(shippingFee)} are added at checkout.
      </p>
    </div>
  );
}
