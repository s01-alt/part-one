"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/format";
import { computeTotals, useCart, useCartHydrated } from "@/lib/store/cart";

export const PREVIEW_ORDER_KEY = "partone-preview-order";

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

/**
 * Checkout. Real flow (docs/backend/payments.md):
 *  1. POST /v1/checkout { cartId, address } → backend re-prices, creates a
 *     pending MarketplaceOrder + SellerOrders, initialises a Paystack
 *     transaction and returns { authorizationUrl, reference }.
 *  2. Browser goes to Paystack (or opens Paystack Inline).
 *  3. Paystack calls our webhook; the backend verifies, decrements stock and
 *     marks the order Paid. The callback page polls GET /v1/me/orders/:id.
 */
export function CheckoutForm({ defaultName }: { defaultName: string }) {
  const hydrated = useCartHydrated();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const router = useRouter();

  if (!hydrated) return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  if (!lines.length) {
    return (
      <p>
        Your cart is empty.{" "}
        <Link href="/shop" className="underline">
          Go shopping
        </Link>
        .
      </p>
    );
  }
  const totals = computeTotals(lines);

  return (
    <form
      className="grid gap-10 lg:grid-cols-[1fr_380px]"
      onSubmit={(e) => {
        e.preventDefault();
        // PREVIEW: real flow redirects to Paystack and confirms via webhook.
        const fd = new FormData(e.currentTarget);
        try {
          sessionStorage.setItem(
            PREVIEW_ORDER_KEY,
            JSON.stringify({
              totals,
              address: { name: fd.get("fullName"), line1: fd.get("line1"), city: fd.get("city"), state: fd.get("state") },
            }),
          );
        } catch {
          // storage unavailable — confirmation page shows a generic message
        }
        clear();
        router.push("/checkout/confirmation");
      }}
    >
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 text-lg font-semibold">Delivery details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="fullName" label="Full name" defaultValue={defaultName} autoComplete="name" />
          <Field id="phone" label="Phone number" type="tel" placeholder="+234…" autoComplete="tel" />
        </div>
        <Field id="line1" label="Street address" autoComplete="address-line1" />
        <Field id="line2" label="Apartment, landmark (optional)" required={false} autoComplete="address-line2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="city" label="City / area" autoComplete="address-level2" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              name="state"
              required
              defaultValue="Lagos"
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Each brand ships its own items to this address and updates the status in your orders.
        </p>
      </fieldset>

      <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-semibold">Your order</h2>
        <ul className="flex flex-col gap-4 text-sm">
          {totals.groups.map((g) => (
            <li key={g.brandId} className="flex flex-col gap-1 border-b pb-3">
              <span className="font-medium">{g.brandName}</span>
              {g.lines.map((l) => (
                <span key={l.variantId} className="flex justify-between text-muted-foreground">
                  <span>
                    {l.quantity} × {l.productName} ({l.size})
                  </span>
                  <span>{formatNaira(l.unitPrice * l.quantity)}</span>
                </span>
              ))}
              <span className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{formatNaira(g.shippingFee)}</span>
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-1 text-sm">
          <dt className="text-muted-foreground">VAT (7.5%)</dt>
          <dd>{formatNaira(totals.vat)}</dd>
          <dt className="mt-2 text-base font-semibold">Total</dt>
          <dd className="mt-2 text-base font-semibold">{formatNaira(totals.total)}</dd>
        </dl>
        <Button type="submit" variant="brand" className="mt-5 h-12 w-full text-sm">
          <Lock data-icon="inline-start" /> Pay {formatNaira(totals.total)} with Paystack
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Preview: Paystack isn&apos;t connected, so no payment is taken.
        </p>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  required = true,
  ...rest
}: { id: string; label: string; required?: boolean } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required={required} className="h-10" {...rest} />
    </div>
  );
}
