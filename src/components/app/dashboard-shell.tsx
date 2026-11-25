import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/site/logo";
import { PageSkeleton } from "@/components/app/page-parts";
import { UserMenu } from "@/components/app/user-menu";

/**
 * Layout for the seller and admin dashboards.
 * The nav is passed in so admins only see sections their role allows.
 * Everything that reads the session sits inside <Suspense>.
 */
export function DashboardShell({
  area,
  nav,
  children,
}: {
  area: string;
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-ink-border bg-ink text-ink-foreground">
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
          <Logo />
          <span className="rounded-sm bg-brand px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-brand-foreground">
            {area}
          </span>
          <Link href="/" className="ml-2 hidden text-sm text-ink-muted hover:text-ink-foreground sm:block">
            View marketplace
          </Link>
          <div className="ml-auto">
            <Suspense fallback={<div className="size-8 animate-pulse rounded-full bg-ink-2" />}>
              <UserMenu tone="dark" />
            </Suspense>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="border-b px-4 py-3 md:w-56 md:shrink-0 md:border-b-0 md:border-r md:px-3 md:py-6">
          {nav}
        </aside>
        <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
