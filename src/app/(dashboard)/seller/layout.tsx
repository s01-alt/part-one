import { DashboardShell } from "@/components/app/dashboard-shell";
import { SideNav } from "@/components/app/side-nav";

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
