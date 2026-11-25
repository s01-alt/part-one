"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";

/**
 * Phone menu. The header stays mounted across navigations, so the sheet must
 * close itself when a link is followed or a search is submitted.
 */
export function MobileMenu({
  nav,
  search,
  className,
}: {
  nav: { href: string; label: string }[];
  search: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={className} aria-label="Open menu">
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 border-ink-border bg-ink text-ink-foreground">
        <SheetHeader>
          <SheetTitle className="text-left text-ink-foreground">
            <span onClick={close}>
              <Logo />
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4">
          <div onSubmitCapture={close}>{search}</div>
          <nav className="flex flex-col gap-1" aria-label="Main">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={close}
                className="rounded-sm px-2 py-2 text-lg font-semibold uppercase tracking-wide hover:bg-ink-2"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
