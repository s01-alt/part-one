"use client";

import { useState } from "react";
import { ProductArt } from "@/components/product/product-art";
import type { ProductImage, ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  type,
  tone,
}: {
  images: ProductImage[];
  type: ProductType;
  tone: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse">
      <ProductArt
        type={type}
        tone={tone}
        variant={active}
        label={current?.alt}
        className="aspect-[4/5] flex-1 rounded-md"
      />
      {images.length > 1 && (
        <div className="flex gap-2 md:w-20 md:flex-col" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={img.alt}
              onClick={() => setActive(i)}
              className={cn(
                "w-16 overflow-hidden rounded-md border-2 md:w-full",
                i === active ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <ProductArt type={type} tone={tone} variant={i} className="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
