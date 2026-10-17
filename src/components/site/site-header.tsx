"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/community", label: "Community" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden border-b border-line bg-ink-2 py-2 text-center sm:block">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-smoke">
          Launching soon in Lagos ·{" "}
          <Link href="/waitlist" className="text-acid hover:underline">
            Join the waitlist
          </Link>
        </p>
      </div>

      <div className="border-b border-line bg-ink/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-widest text-smoke transition-colors hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="hidden text-xs font-semibold uppercase tracking-widest text-smoke transition-colors hover:text-paper sm:block"
            >
              Sign in
            </Link>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/waitlist">Join waitlist</Link>
            </Button>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-paper lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-[60] flex w-[88%] max-w-sm flex-col border-l border-line bg-ink px-6 py-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="display text-2xl text-paper">
                      Menu
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="grid h-10 w-10 place-items-center rounded-full border border-line text-paper"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav className="mt-10 flex flex-col">
                    {NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between border-b border-line py-5 text-2xl font-semibold uppercase tracking-widest text-paper transition-colors hover:text-acid"
                      >
                        {item.label}
                        <ArrowUpRight className="h-5 w-5 text-smoke" />
                      </Link>
                    ))}
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-line py-5 text-2xl font-semibold uppercase tracking-widest text-paper transition-colors hover:text-acid"
                    >
                      Sign in
                      <ArrowUpRight className="h-5 w-5 text-smoke" />
                    </Link>
                  </nav>

                  <Button asChild size="lg" className="mt-auto">
                    <Link href="/waitlist" onClick={() => setOpen(false)}>
                      Join the waitlist
                    </Link>
                  </Button>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
