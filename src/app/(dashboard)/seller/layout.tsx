import type { Metadata } from "next";
import { DashboardShell } from "@/components/app/dashboard-shell";
import { SideNav } from "@/components/app/side-nav";

export const metadata: Metadata = { title: { default: "Seller dashboard", template: "%s — Part One" } };

const NAV = [
  { href: "/seller", label: "Overview", exact: true },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/payouts", label: "Payouts" },
  { href: "/seller/store", label: "Store settings" },
];

export default function SellerLayout({ children }: LayoutProps<"/seller">) {
  return (
    <DashboardShell area="Seller" nav={<SideNav items={NAV} label="Seller" />}>
      {children}
    </DashboardShell>
  );
}
