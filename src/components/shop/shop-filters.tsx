"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { STYLE_LABELS, TYPE_LABELS } from "@/lib/format";
import { activeFilterCount, buildShopHref, type ShopUrlState } from "@/lib/data/query";
import type { CatalogFacets, ProductType, StyleTag } from "@/lib/types";
import { cn } from "@/lib/utils";

type ListKey = "brand" | "style" | "type" | "size" | "color";

function useShopNavigation(state: ShopUrlState) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const go = (next: ShopUrlState) =>
    startTransition(() => router.push(buildShopHref(next), { scroll: false }));
  const toggle = (key: ListKey, value: string) => {
    const has = state[key].includes(value);
    go({ ...state, [key]: has ? state[key].filter((v) => v !== value) : [...state[key], value] });
  };
  return { go, toggle, pending };
}

function FilterPanel({
  state,
  facets,
  defaultOpen = ["style", "type", "size", "price"],
}: {
  state: ShopUrlState;
  facets: CatalogFacets;
  defaultOpen?: string[];
}) {
  const { go, toggle } = useShopNavigation(state);

  const priceBands = [
    { label: "Under ₦20,000", min: undefined, max: 20000 },
    { label: "₦20,000 – ₦40,000", min: 20000, max: 40000 },
    { label: "₦40,000 – ₦70,000", min: 40000, max: 70000 },
    { label: "₦70,000 and above", min: 70000, max: undefined },
  ];

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
      <AccordionItem value="style">
        <AccordionTrigger>Style</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {facets.styles.map(({ value, count }) => (
            <CheckRow
              key={value}
              id={`style-${value}`}
              label={STYLE_LABELS[value as StyleTag]}
              count={count}
              checked={state.style.includes(value)}
              onChange={() => toggle("style", value)}
            />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="type">
        <AccordionTrigger>Product type</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {facets.types.map(({ value, count }) => (
            <CheckRow
              key={value}
              id={`type-${value}`}
              label={TYPE_LABELS[value as ProductType]}
              count={count}
              checked={state.type.includes(value)}
              onChange={() => toggle("type", value)}
            />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="brand">
        <AccordionTrigger>Brand</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {facets.brands.map(({ slug, name, count }) => (
            <CheckRow
              key={slug}
              id={`brand-${slug}`}
              label={name}
              count={count}
              checked={state.brand.includes(slug)}
              onChange={() => toggle("brand", slug)}
            />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="size">
        <AccordionTrigger>Size (in stock)</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          {facets.sizeGroups.map((g) => (
            <div key={g.label} role="group" aria-label={`${g.label} sizes`}>
              <p className="mb-2 text-xs text-muted-foreground">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.sizes.map((s) => {
                  const on = state.size.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle("size", s)}
                      className={cn(
                        "min-w-11 rounded-md border px-2 py-1.5 text-sm",
                        on ? "border-foreground bg-foreground text-background" : "hover:border-foreground",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="color">
        <AccordionTrigger>Colour</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((c) => {
              const value = c.name.toLowerCase();
              const on = state.color.includes(value);
              return (
                <button
                  key={c.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle("color", value)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-1 text-xs",
                    on ? "border-foreground ring-1 ring-foreground" : "hover:border-foreground",
                  )}
                >
                  <span className="size-3.5 rounded-full border border-foreground/20" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger>Price</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {priceBands.map((b) => {
            const on = state.min === b.min && state.max === b.max;
            return (
              <CheckRow
                key={b.label}
                id={`price-${b.label}`}
                label={b.label}
                checked={on}
                onChange={() => go({ ...state, min: on ? undefined : b.min, max: on ? undefined : b.max })}
              />
            );
          })}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rating">
        <AccordionTrigger>Rating</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {[4.5, 4, 3.5].map((r) => (
            <CheckRow
              key={r}
              id={`rating-${r}`}
              label={
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-current" aria-hidden /> {r} & up
                </span>
              }
              checked={state.rating === r}
              onChange={() => go({ ...state, rating: state.rating === r ? undefined : r })}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CheckRow({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string;
  label: React.ReactNode;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs text-muted-foreground">{count}</span>}
    </label>
  );
}

/** Desktop sidebar filters. */
export function ShopFilterSidebar(props: { state: ShopUrlState; facets: CatalogFacets }) {
  return (
    <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filters">
      <FilterPanel {...props} />
    </aside>
  );
}

/** Mobile filter sheet + sort + active filter chips. */
export function ShopToolbar({
  state,
  facets,
  total,
}: {
  state: ShopUrlState;
  facets: CatalogFacets;
  total: number;
}) {
  const { go, toggle, pending } = useShopNavigation(state);
  const count = activeFilterCount(state);

  const chips: { key: string; label: string; clear: () => void }[] = [
    ...state.style.map((v) => ({ key: `s-${v}`, label: STYLE_LABELS[v as StyleTag] ?? v, clear: () => toggle("style", v) })),
    ...state.type.map((v) => ({ key: `t-${v}`, label: TYPE_LABELS[v as ProductType] ?? v, clear: () => toggle("type", v) })),
    ...state.brand.map((v) => ({
      key: `b-${v}`,
      label: facets.brands.find((b) => b.slug === v)?.name ?? v,
      clear: () => toggle("brand", v),
    })),
    ...state.size.map((v) => ({ key: `z-${v}`, label: `Size ${v}`, clear: () => toggle("size", v) })),
    ...state.color.map((v) => ({ key: `c-${v}`, label: v, clear: () => toggle("color", v) })),
    ...(state.min != null || state.max != null
      ? [
          {
            key: "price",
            label: `₦${(state.min ?? 0).toLocaleString()} – ${state.max != null ? `₦${state.max.toLocaleString()}` : "up"}`,
            clear: () => go({ ...state, min: undefined, max: undefined }),
          },
        ]
      : []),
    ...(state.rating != null
      ? [{ key: "rating", label: `${state.rating}★ & up`, clear: () => go({ ...state, rating: undefined }) }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {pending ? "Updating…" : `${total} ${total === 1 ? "product" : "products"}`}
        </p>
        <div className="flex items-center gap-2 sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 flex-1 sm:flex-none lg:hidden">
                <SlidersHorizontal data-icon="inline-start" /> Filters{count ? ` (${count})` : ""}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col gap-0">
              <SheetHeader className="border-b">
                <SheetTitle>Filters{count ? ` (${count})` : ""}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <FilterPanel state={state} facets={facets} defaultOpen={["style"]} />
              </div>
              <SheetFooter className="border-t">
                <SheetClose asChild>
                  <Button className="h-11 w-full">
                    {pending ? "Updating…" : `Show ${total} ${total === 1 ? "product" : "products"}`}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Select value={state.sort ?? (state.q ? "relevance" : "newest")} onValueChange={(v) => go({ ...state, sort: v })}>
            <SelectTrigger className="h-10 flex-1 sm:w-44 sm:flex-none" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.q && <SelectItem value="relevance">Relevance</SelectItem>}
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: low to high</SelectItem>
              <SelectItem value="price_desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.clear}
              className="flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs capitalize hover:border-foreground"
            >
              {c.label}
              <X className="size-3" aria-label="Remove filter" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => go({ q: state.q, brand: [], style: [], type: [], size: [], color: [], sort: state.sort })}
            className="text-xs font-medium underline underline-offset-4"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
