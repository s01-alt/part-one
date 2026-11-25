import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sell on Part One",
  description: "Apply to sell your streetwear brand on Part One.",
};

const POINTS = [
  { title: "Your storefront", body: "Logo, banner, story, links and collections on one page." },
  { title: "A simple dashboard", body: "Products, sizes, colours, stock and orders in one place." },
  { title: "Paid on delivery", body: "Earnings are paid to your bank once your balance reaches ₦50,000." },
];

export default function SellPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <h1 className="font-heading text-6xl uppercase leading-[0.9] sm:text-7xl">Sell on Part One</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        A marketplace for original Nigerian streetwear brands. We review every application.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button asChild variant="brand" className="h-12 px-7 text-sm">
          <Link href="/sell/apply">Apply to sell</Link>
        </Button>
        <Link href="/terms#sellers" className="text-sm font-medium hover:underline">
          Seller terms
        </Link>
      </div>

      <dl className="mt-24 grid gap-10 border-t pt-12 md:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title}>
            <dt className="font-medium">{p.title}</dt>
            <dd className="mt-2 text-muted-foreground">{p.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
