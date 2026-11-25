"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MockNotice } from "@/components/app/page-parts";
import type { Brand } from "@/lib/types";

/**
 * Storefront + payout settings.
 * Backend: PATCH /v1/seller/store; PUT /v1/seller/bank-account (resolved with
 * Paystack's account-resolve API, then saved as a Paystack transfer recipient).
 */
export function StoreSettingsForm({ brand }: { brand: Brand }) {
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
    >
      <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
        <h2 className="font-semibold">Storefront</h2>
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full font-heading text-2xl uppercase" style={{ backgroundColor: brand.tone }} aria-hidden>
            {brand.name.slice(0, 1)}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="h-9">Upload logo</Button>
            <Button type="button" variant="outline" className="h-9">Upload banner</Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <F id="name" label="Brand name" defaultValue={brand.name} />
          <F id="city" label="City" defaultValue={brand.city} />
        </div>
        <F id="tagline" label="Tagline" defaultValue={brand.tagline} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} defaultValue={brand.description} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <F id="instagram" label="Instagram" defaultValue={brand.socials.instagram} required={false} />
          <F id="tiktok" label="TikTok" defaultValue={brand.socials.tiktok} required={false} />
          <F id="x" label="X" defaultValue={brand.socials.x} required={false} />
          <F id="website" label="Website" defaultValue={brand.socials.website} required={false} />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
        <h2 className="font-semibold">Delivery</h2>
        <F
          id="shippingFee"
          label="Delivery fee per order (₦)"
          type="number"
          min={0}
          step={100}
          defaultValue={brand.shippingFee / 100}
        />
        <p className="text-xs text-muted-foreground">
          Charged once per order from your store. Delivery fees are not refunded to customers and stay with you.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
        <h2 className="font-semibold">Payout bank account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="bank">Bank</Label>
            <select id="bank" className="h-10 rounded-md border border-input bg-card px-3 text-sm" defaultValue="GTBank">
              {["Access Bank", "First Bank", "GTBank", "Kuda", "Moniepoint", "OPay", "UBA", "Zenith Bank"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <F id="accountNumber" label="Account number" inputMode="numeric" pattern="[0-9]{10}" placeholder="10 digits" required={false} />
        </div>
        <p className="text-xs text-muted-foreground">
          Current: GTBank ••••4321 · KUNLE DANFO. We confirm the account name with your bank before saving.
        </p>
      </section>

      {saved && <MockNotice />}
      <Button type="submit" className="h-11 w-fit px-6">
        Save settings
      </Button>
    </form>
  );
}

function F({ id, label, required = true, ...rest }: { id: string; label: string; required?: boolean } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required={required} className="h-10" {...rest} />
    </div>
  );
}
