import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/app/page-parts";
import { SideNav } from "@/components/app/side-nav";
import { UserMenu } from "@/components/app/user-menu";

export const metadata: Metadata = { title: { default: "Your account", template: "%s — Part One" } };

const NAV = [
  { href: "/account", label: "Overview", exact: true },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/saved", label: "Saved & liked" },
  { href: "/account/following", label: "Following" },
  { href: "/account/notifications", label: "Notifications" },
];

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <Suspense fallback={<div className="h-8 animate-pulse rounded bg-muted" />}>
          <UserMenu />
        </Suspense>
        <SideNav items={NAV} label="Account" />
      </div>
      <div className="min-w-0">
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </div>
    </div>
  );
}
