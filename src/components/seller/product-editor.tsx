"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MockNotice } from "@/components/app/page-parts";
import { ProductArt } from "@/components/product/product-art";
import { STYLE_LABELS, TYPE_LABELS } from "@/lib/format";
import { PRODUCT_TYPES, STYLE_TAGS, type Color, type Product, type ProductType, type StyleTag } from "@/lib/types";

const MAX_IMAGES = 5;

/**
 * Create / edit a product with its size × colour variants and stock.
 * Backend:
 *  - POST /v1/seller/products, PATCH /v1/seller/products/:id
 *  - PUT  /v1/seller/products/:id/variants  (full variant matrix with stock)
 *  - POST /v1/seller/uploads → presigned S3 URL for each image
 */
export function ProductEditor({ product }: { product?: Product }) {
  const [name, setName] = useState(product?.name ?? "");
  const [type, setType] = useState<ProductType>(product?.type ?? "t-shirt");
  const [styles, setStyles] = useState<StyleTag[]>(product?.styles ?? []);
  const [active, setActive] = useState(product ? product.status === "active" : true);
  const [imageCount, setImageCount] = useState(product?.images.length ?? 0);
  const [colors, setColors] = useState<Color[]>(
    product ? [...new Map(product.variants.map((v) => [v.color.name, v.color])).values()] : [{ name: "Black", hex: "#111111" }],
  );
  const [sizes, setSizes] = useState<string[]>(product ? [...new Set(product.variants.map((v) => v.size))] : ["S", "M", "L"]);
  const [stock, setStock] = useState<Record<string, number>>(() =>
    Object.fromEntries((product?.variants ?? []).map((v) => [`${v.color.name}|${v.size}`, v.stock])),
  );
  const [newColor, setNewColor] = useState({ name: "", hex: "#888888" });
  const [newSize, setNewSize] = useState("");
  const [saved, setSaved] = useState(false);

  const total = useMemo(
    () => colors.reduce((n, c) => n + sizes.reduce((m, s) => m + (stock[`${c.name}|${s}`] ?? 0), 0), 0),
    [colors, sizes, stock],
  );

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
    >
      <section className="grid gap-6 rounded-lg border bg-card p-5 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold">Details</h2>
          <Row id="name" label="Product name">
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
          </Row>
          <Row id="description" label="Description">
            <Textarea id="description" required rows={4} defaultValue={product?.description} />
          </Row>
          <div className="grid gap-4 sm:grid-cols-2">
            <Row id="price" label="Price (₦, before VAT)">
              <Input id="price" required type="number" min={0} step={100} defaultValue={product ? product.price / 100 : undefined} className="h-10" />
            </Row>
            <Row id="type" label="Product type">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ProductType)}
                className="h-10 rounded-md border border-input bg-card px-3 text-sm"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Row>
          </div>
          <Row id="material" label="Material">
            <Input id="material" defaultValue={product?.material} className="h-10" />
          </Row>
          <Row id="care" label="Care instructions">
            <Input id="care" defaultValue={product?.careInstructions} className="h-10" />
          </Row>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold">
            Images <span className="text-sm font-normal text-muted-foreground">({imageCount}/{MAX_IMAGES})</span>
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className="relative">
                <ProductArt type={type} tone={colors[0]?.hex ?? "#ccc"} variant={i} className="aspect-[4/5] rounded-md" />
                <button
                  type="button"
                  onClick={() => setImageCount((n) => n - 1)}
                  className="absolute right-1 top-1 rounded-full bg-background p-1"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {imageCount < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => setImageCount((n) => n + 1)}
                className="flex aspect-[4/5] flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground hover:border-foreground"
              >
                <ImagePlus className="size-5" aria-hidden /> Add image
              </button>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Styles</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STYLE_TAGS.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={styles.includes(s)}
                    onCheckedChange={(on) => setStyles((cur) => (on ? [...cur, s] : cur.filter((x) => x !== s)))}
                  />
                  {STYLE_LABELS[s]}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
            <span>
              <span className="font-medium">Active</span>
              <span className="block text-xs text-muted-foreground">Inactive products are hidden from customers.</span>
            </span>
            <Switch checked={active} onCheckedChange={setActive} />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Variants & stock</h2>
          <span className="text-sm text-muted-foreground">
            {colors.length * sizes.length} variants · {total} in stock
          </span>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Colours</span>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <span key={c.name} className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs">
                  <span className="size-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  <button type="button" onClick={() => setColors((cs) => cs.filter((x) => x.name !== c.name))} aria-label={`Remove ${c.name}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor((c) => ({ ...c, hex: e.target.value }))}
                className="h-9 w-10 rounded border"
                aria-label="New colour swatch"
              />
              <Input
                value={newColor.name}
                onChange={(e) => setNewColor((c) => ({ ...c, name: e.target.value }))}
                placeholder="Colour name"
                className="h-9 w-36"
                aria-label="New colour name"
              />
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => {
                  const n = newColor.name.trim();
                  if (n && !colors.some((c) => c.name === n)) setColors((cs) => [...cs, { name: n, hex: newColor.hex }]);
                  setNewColor({ name: "", hex: "#888888" });
                }}
              >
                <Plus data-icon="inline-start" /> Add
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Sizes</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <span key={s} className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs">
                  {s}
                  <button type="button" onClick={() => setSizes((ss) => ss.filter((x) => x !== s))} aria-label={`Remove size ${s}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="e.g. XL or 42" className="h-9 w-36" aria-label="New size" />
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => {
                  const s = newSize.trim();
                  if (s && !sizes.includes(s)) setSizes((ss) => [...ss, s]);
                  setNewSize("");
                }}
              >
                <Plus data-icon="inline-start" /> Add
              </Button>
            </div>
          </div>
        </div>

        {colors.length > 0 && sizes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="text-sm">
              <caption className="sr-only">Stock per colour and size</caption>
              <thead>
                <tr>
                  <th className="p-2 text-left font-medium text-muted-foreground">Colour \ Size</th>
                  {sizes.map((s) => (
                    <th key={s} className="p-2 font-medium">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colors.map((c) => (
                  <tr key={c.name}>
                    <th className="p-2 text-left font-medium">
                      <span className="flex items-center gap-2">
                        <span className="size-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </span>
                    </th>
                    {sizes.map((s) => {
                      const key = `${c.name}|${s}`;
                      return (
                        <td key={s} className="p-1">
                          <Input
                            type="number"
                            min={0}
                            value={stock[key] ?? 0}
                            onChange={(e) => setStock((st) => ({ ...st, [key]: Math.max(0, Number(e.target.value) || 0) }))}
                            className="h-9 w-20"
                            aria-label={`Stock for ${c.name} ${s}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-3">
        {saved && <MockNotice />}
        <Button type="submit" className="h-11 w-fit px-6">
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}

function Row({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
