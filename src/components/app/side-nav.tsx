"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  /** Match only the exact path (for index pages like /seller). */
  exact?: boolean;
}

/**
 * usePathname() is request data on dynamic routes, so with Cache Components it
 * must sit inside <Suspense>. The fallback renders the same links without the
 * active highlight, so navigation is usable immediately.
 */
export function SideNav(props: { items: NavItem[]; label: string }) {
  return (
    <Suspense fallback={<NavLinks {...props} pathname={null} />}>
      <ActiveSideNav {...props} />
    </Suspense>
  );
}

function ActiveSideNav(props: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return <NavLinks {...props} pathname={pathname} />;
}

function NavLinks({ items, label, pathname }: { items: NavItem[]; label: string; pathname: string | null }) {
  return (
    <nav aria-label={label} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
      {items.map((item) => {
        const active =
          pathname !== null &&
          (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
