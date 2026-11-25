"use client";

/**
 * Guest cart (Zustand, persisted to localStorage).
 *
 * The cart lives on the device until the backend exists. Later:
 *  - signed-out: this local cart stays as is;
 *  - on sign-in: POST /v1/cart/merge sends these lines to the server cart;
 *  - signed-in: the server cart is the source of truth (TanStack Query).
 * Prices and stock stored here are a snapshot for display only. The backend
 * re-prices and re-checks stock at checkout.
 */
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { VAT_RATE } from "@/lib/format";
import type { Kobo, ProductType } from "@/lib/types";

export interface CartLine {
  variantId: string;
  productSlug: string;
  productName: string;
  productType: ProductType;
  tone: string;
  brandId: string;
  brandSlug: string;
  brandName: string;
  brandShippingFee: Kobo;
  size: string;
  colorName: string;
  unitPrice: Kobo;
  maxStock: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, quantity = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variantId === line.variantId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, quantity: Math.min(l.quantity + quantity, line.maxStock) }
                  : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, quantity: Math.min(quantity, line.maxStock) }] };
        }),
      setQuantity: (variantId, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.variantId === variantId
                ? { ...l, quantity: Math.max(0, Math.min(quantity, l.maxStock)) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        })),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "partone-cart-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

/** True once the persisted cart has loaded on the client (avoids hydration mismatch). */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

export function useCartCount(): number {
  const hydrated = useCartHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  return hydrated ? count : 0;
}

// ---------------------------------------------------------------------------
// Totals — mirrors how the backend will split one checkout into seller orders.
// ---------------------------------------------------------------------------

export interface SellerGroup {
  brandId: string;
  brandSlug: string;
  brandName: string;
  lines: CartLine[];
  itemsSubtotal: Kobo;
  shippingFee: Kobo;
  vat: Kobo;
  total: Kobo;
}

export interface CartTotals {
  groups: SellerGroup[];
  itemsSubtotal: Kobo;
  shipping: Kobo;
  vat: Kobo;
  total: Kobo;
}

/**
 * Groups lines by seller. Each group becomes one Seller Order at checkout.
 * VAT: 7.5% added on items only (pending confirmation — docs/decisions.md D-011).
 */
export function computeTotals(lines: CartLine[]): CartTotals {
  const map = new Map<string, SellerGroup>();
  for (const l of lines) {
    let g = map.get(l.brandId);
    if (!g) {
      g = {
        brandId: l.brandId,
        brandSlug: l.brandSlug,
        brandName: l.brandName,
        lines: [],
        itemsSubtotal: 0,
        shippingFee: l.brandShippingFee,
        vat: 0,
        total: 0,
      };
      map.set(l.brandId, g);
    }
    g.lines.push(l);
    g.itemsSubtotal += l.unitPrice * l.quantity;
  }
  const groups = [...map.values()].map((g) => {
    const vat = Math.round(g.itemsSubtotal * VAT_RATE);
    return { ...g, vat, total: g.itemsSubtotal + g.shippingFee + vat };
  });
  return {
    groups,
    itemsSubtotal: groups.reduce((n, g) => n + g.itemsSubtotal, 0),
    shipping: groups.reduce((n, g) => n + g.shippingFee, 0),
    vat: groups.reduce((n, g) => n + g.vat, 0),
    total: groups.reduce((n, g) => n + g.total, 0),
  };
}
