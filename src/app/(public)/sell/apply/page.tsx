import type { Metadata } from "next";
import { Suspense } from "react";
import { SellerApplicationForm } from "@/components/seller/application-form";
import { requireUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Apply to sell" };

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-5xl uppercase sm:text-6xl">Apply to sell</h1>
      <p className="mt-2 text-muted-foreground">
        Tell us about your brand. We review every application and reply with an in-app notification.
      </p>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-lg bg-muted" />}>
        <ApplyGate />
      </Suspense>
    </div>
  );
}

async function ApplyGate() {
  const user = await requireUser("/sell/apply");
  if (user.sellerBrandId) redirect("/seller");
  return <SellerApplicationForm contactName={user.name} email={user.email} />;
}
