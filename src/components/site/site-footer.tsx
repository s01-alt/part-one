import Link from "next/link";
import { Logo } from "@/components/site/logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?sort=newest", label: "New drops" },
      { href: "/brands", label: "Brands" },
      { href: "/feed", label: "Community" },
    ],
  },
  {
    title: "Brands",
    links: [
      { href: "/sell", label: "Sell on Part One" },
      { href: "/seller", label: "Seller dashboard" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/terms#refunds", label: "Returns & refunds" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

/** Quiet footer: wordmark, links, one line of payment info. */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <Logo className="text-3xl" />
          <p className="max-w-xs text-sm text-ink-muted">The home of Nigerian streetwear.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">{col.title}</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-muted hover:text-ink-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 Part One. Made in Lagos. Prices in NGN.</p>
          <p>Card, bank transfer and USSD payments via Paystack.</p>
        </div>
      </div>
    </footer>
  );
}
