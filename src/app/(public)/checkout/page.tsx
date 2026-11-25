import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-heading text-4xl uppercase sm:text-5xl">Checkout</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <CheckoutGate />
      </Suspense>
    </div>
  );
}

async function CheckoutGate() {
  const user = await requireUser("/checkout");
  return <CheckoutForm defaultName={user.name} />;
}
