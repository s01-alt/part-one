import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, LayoutDashboard, Store, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sell on Part One",
  description: "Apply to sell your streetwear brand on Part One.",
};

const STEPS = [
  { title: "Apply", body: "Tell us about your brand, show us your products and add your bank details for payouts." },
  { title: "Get reviewed", body: "Our team checks every application. You'll get an in-app notification with the decision." },
  { title: "Set up your store", body: "Add your logo, banner, products, sizes, colours and stock." },
  { title: "Sell and get paid", body: "Ship your orders and mark them delivered. Your earnings are paid out once you reach ₦50,000." },
];

export default function SellPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="font-heading text-6xl uppercase leading-[0.9] sm:text-7xl">
          Sell your brand on <span className="bg-brand px-2 italic">Part One</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A marketplace built only for Nigerian streetwear. Get a storefront, reach customers who are looking for
          exactly what you make, and leave payments to us.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="h-12 px-6 text-base">
            <Link href="/sell/apply">Apply to sell</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6 text-base">
            <Link href="/terms#sellers">Seller terms</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Store, title: "Your own storefront", body: "Logo, banner, description, social links and collections — all on one page." },
          { icon: LayoutDashboard, title: "Simple dashboard", body: "Manage products, sizes, colours and stock. See orders and update their status." },
          { icon: Wallet, title: "Fast payouts", body: "Earnings from delivered orders are paid to your bank account once your balance reaches ₦50,000." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col gap-3 rounded-lg border bg-card p-6">
            <span className="flex size-11 items-center justify-center rounded-sm bg-brand"><Icon className="size-5 text-ink" aria-hidden /></span>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="mb-8 font-heading text-4xl uppercase">How it works</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-2 border-t-2 border-foreground pt-4">
              <span className="w-fit bg-brand px-2 font-heading text-3xl">0{i + 1}</span>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 rounded-lg bg-secondary p-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <BadgeCheck className="size-5 fill-brand text-ink" aria-hidden /> Who can sell
        </h2>
        <ul className="mt-4 grid gap-2 text-muted-foreground md:grid-cols-2">
          <li>• Original streetwear brands based in Nigeria</li>
          <li>• You design or produce the products you list</li>
          <li>• You can ship orders and keep stock up to date</li>
          <li>• You have a Nigerian bank account in the brand&apos;s or owner&apos;s name</li>
        </ul>
      </section>
    </div>
  );
}
