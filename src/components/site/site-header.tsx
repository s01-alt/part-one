import Link from "next/link";
import { Heart, Menu, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartButton, CartHydrator } from "@/components/site/cart-button";
import { Logo } from "@/components/site/logo";
import { SearchForm } from "@/components/site/search-form";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?sort=newest", label: "New drops" },
  { href: "/brands", label: "Brands" },
  { href: "/feed", label: "Community" },
  { href: "/sell", label: "Sell" },
];

const iconLink =
  "inline-flex size-10 items-center justify-center rounded-sm text-ink-foreground transition-colors hover:bg-ink-2";

/** Dark header (brand inspo): wordmark, nav, dark search field, account / saved / cart icons. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink text-ink-foreground">
      <CartHydrator />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger className={`${iconLink} md:hidden`} aria-label="Open menu">
            <Menu className="size-5" aria-hidden />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-ink-border bg-ink text-ink-foreground">
            <SheetHeader>
              <SheetTitle className="text-left text-ink-foreground">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-4">
              <SearchForm tone="dark" />
              <nav className="flex flex-col gap-1" aria-label="Main">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="rounded-sm px-2 py-2 text-lg font-semibold uppercase tracking-wide hover:bg-ink-2"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <Logo className="text-[1.7rem]" />

        <nav className="ml-6 hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink-foreground/80 transition-colors hover:text-ink-foreground">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchForm tone="dark" className="mr-3 hidden w-72 lg:block" />
          <Link href="/account" className={iconLink} aria-label="Your account">
            <UserRound className="size-5" aria-hidden />
          </Link>
          <Link href="/account/saved" className={`${iconLink} hidden sm:inline-flex`} aria-label="Saved items">
            <Heart className="size-5" aria-hidden />
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
