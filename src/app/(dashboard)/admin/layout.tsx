import { Suspense } from "react";
import { DashboardShell } from "@/components/app/dashboard-shell";
import { SideNav, type NavItem } from "@/components/app/side-nav";
import { can, type Permission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

const NAV: (NavItem & { permission: Permission })[] = [
  { href: "/admin", label: "Overview", exact: true, permission: "admin.dashboard.view" },
  { href: "/admin/sellers", label: "Sellers", permission: "admin.sellers.review" },
  { href: "/admin/products", label: "Products", permission: "admin.products.manage" },
  { href: "/admin/orders", label: "Orders", permission: "admin.orders.manage" },
  { href: "/admin/payments", label: "Payments & payouts", permission: "admin.payments.view" },
  { href: "/admin/moderation", label: "Moderation", permission: "admin.moderation.manage" },
  { href: "/admin/users", label: "Users", permission: "admin.users.manage" },
  { href: "/admin/settings", label: "Settings & roles", permission: "admin.settings.manage" },
  { href: "/admin/system", label: "System", permission: "admin.system.view" },
];

/** Reads the session, so it renders inside <Suspense>. Hides sections the role cannot use. */
async function AdminNav() {
  const user = await getCurrentUser();
  const items: NavItem[] = NAV.filter((n) => can(user, n.permission)).map((n) => ({
    href: n.href,
    label: n.label,
    exact: n.exact,
  }));
  return <SideNav items={items} label="Admin" />;
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <DashboardShell
      area="Admin"
      nav={
        <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-muted" />}>
          <AdminNav />
        </Suspense>
      }
    >
      {children}
    </DashboardShell>
  );
}
