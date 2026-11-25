import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description: "Get early access to Part One — the home of Nigerian streetwear.",
};

export default function WaitlistPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-start">
      <div>
        <h1 className="font-heading text-6xl uppercase leading-[0.9] sm:text-7xl">Get in early</h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          Part One opens in Lagos first, in phases. Join the list and we&apos;ll invite you as doors open.
        </p>
      </div>
      <WaitlistForm />
    </section>
  );
}
