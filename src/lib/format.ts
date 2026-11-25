import type { Kobo, ProductType, StyleTag } from "./types";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** Formats integer kobo as naira, e.g. 2500000 → "₦25,000". */
export function formatNaira(kobo: Kobo): string {
  return nairaFormatter.format(Math.round(kobo) / 100);
}

export function nairaToKobo(naira: number): Kobo {
  return Math.round(naira * 100);
}

const compact = new Intl.NumberFormat("en", { notation: "compact" });
export function formatCount(n: number): string {
  return compact.format(n);
}

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export const STYLE_LABELS: Record<StyleTag, string> = {
  baggy: "Baggy",
  minimalist: "Minimalist",
  y2k: "Y2K",
  graphic: "Graphic",
  vintage: "Vintage",
  utility: "Utility",
  athleisure: "Athleisure",
  luxury: "Luxury",
  grunge: "Grunge",
};

export const TYPE_LABELS: Record<ProductType, string> = {
  "t-shirt": "T-shirts",
  shirt: "Shirts",
  hoodie: "Hoodies",
  sweatshirt: "Sweatshirts",
  jacket: "Jackets",
  jeans: "Jeans",
  "cargo-pants": "Cargo pants",
  trousers: "Trousers",
  shorts: "Shorts",
  joggers: "Joggers",
  sneakers: "Sneakers",
  cap: "Caps",
  beanie: "Beanies",
  bag: "Bags",
  accessory: "Accessories",
  other: "Other",
};

/** VAT is added on top of the item price (decision 2026-11-25). */
export const VAT_RATE = 0.075;
