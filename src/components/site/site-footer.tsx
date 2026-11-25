import Link from "next/link";
import { Crown, Globe, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

const VALUES = [
  { icon: Globe, title: "Built for the culture", body: "Nigerian brands. Nigerian stories." },
  { icon: Crown, title: "Support local brands", body: "Your purchase goes straight to the brand." },
  { icon: Zap, title: "New drops weekly", body: "Fresh pieces from new and favourite labels." },
  { icon: Heart, title: "Join the movement", body: "Like, save and repost what you rate." },
];

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?sort=newest", label: "New drops" },
      { href: "/shop?sort=rating", label: "Top rated" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/brands", label: "Brands" },
      { href: "/feed", label: "Community" },
      { href: "/account/saved", label: "Saved" },
    ],
  },
  {
    title: "Sell",
    links: [
      { href: "/sell", label: "Sell on Part One" },
      { href: "/sell/apply", label: "Apply" },
      { href: "/seller", label: "Seller dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Use" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms#refunds", label: "Returns & refunds" },
    ],
  },
];

// Methods Paystack supports in Nigeria. Text badges, not third-party logos.
const PAYMENT_METHODS = ["Visa", "Mastercard", "Verve", "Bank transfer", "USSD"];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://tiktok.com/" },
  { label: "X", href: "https://x.com/" },
];

/** Dark footer (brand inspo). */
export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-3">
              <Icon className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
              <h2 className="text-sm font-semibold uppercase leading-snug tracking-wide">{title}</h2>
              <p className="text-xs text-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4 border-ink-border lg:border-l lg:pl-10">
          <h2 className="text-lg font-bold uppercase tracking-wide">Stay in the loop</h2>
          <p className="text-sm text-ink-muted">
            Part One opens in Lagos soon. Get early access, then follow your favourite brands and get notified in the app the moment they drop.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="brand" className="h-11 px-6">
              <Link href="/waitlist">Join the waitlist</Link>
            </Button>
            <Button asChild variant="inverse" className="h-11 px-6">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <ul className="flex gap-4 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-brand">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_repeat(4,1fr)_1.4fr]">
          <div className="flex flex-col gap-3">
            <Logo className="text-3xl" />
            <p className="max-w-xs text-sm text-ink-muted">
              The home of Nigerian streetwear. Discover. Shop. Represent.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest">{col.title}</h2>
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
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest">We accept</h2>
            <ul className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <li key={m} className="rounded-sm border border-ink-border bg-ink-2 px-2 py-1 text-xs font-semibold">
                  {m}
                </li>
              ))}
            </ul>
            <p className="text-xs text-ink-muted">Payments secured by Paystack.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ink-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 Part One. Made in Lagos, Nigeria. Prices in NGN.</p>
          <p className="uppercase tracking-widest">The Social Marketplace</p>
        </div>
      </div>
    </footer>
  );
}
