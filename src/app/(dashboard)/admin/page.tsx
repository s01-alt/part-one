import Link from "next/link";
import { Panel, PageHeader, StatCard } from "@/components/app/page-parts";
import { ADMIN_ROLE_LABELS, can } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { adminListApplications, adminListOrders, adminListReports } from "@/lib/data/account";
import { formatNaira } from "@/lib/format";

export default async function AdminOverviewPage({ searchParams }: PageProps<"/admin">) {
  const user = await requireAdmin();
  const denied = (await searchParams).denied === "1";
  const [orders, apps, reports] = await Promise.all([adminListOrders(), adminListApplications(), adminListReports()]);

  const sellerOrders = orders.flatMap((o) => o.sellerOrders).filter((s) => s.status !== "cancelled" && s.status !== "refunded");
  const gmv = sellerOrders.reduce((n, s) => n + s.itemsSubtotal, 0);
  const commission = sellerOrders.reduce((n, s) => n + s.commission, 0);
  const openReports = reports.filter((r) => r.status === "open").length;
  const pendingApps = apps.filter((a) => a.status === "pending" || a.status === "under_review").length;

  return (
    <>
      <PageHeader title="Admin" description={`Signed in as ${ADMIN_ROLE_LABELS[user.adminRole!]}.`} />
      {denied && (
        <p className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm" role="alert">
          Your role doesn&apos;t have access to that section.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="GMV (items)" value={formatNaira(gmv)} hint={`${orders.length} marketplace orders`} />
        <StatCard label="Commission earned" value={formatNaira(commission)} />
        <StatCard label="Seller applications" value={pendingApps} hint="Pending or under review" />
        <StatCard label="Open reports" value={openReports} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {can(user, "admin.sellers.review") && (
          <Panel title="Needs attention">
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/admin/sellers" className="underline underline-offset-4">
                  {pendingApps} seller applications to review
                </Link>
              </li>
              <li>
                <Link href="/admin/moderation" className="underline underline-offset-4">
                  {openReports} open reports
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="underline underline-offset-4">
                  Returned orders awaiting refund
                </Link>
              </li>
            </ul>
          </Panel>
        )}
        {can(user, "admin.moderation.manage") && !can(user, "admin.sellers.review") && (
          <Panel title="Moderation queue">
            <Link href="/admin/moderation" className="text-sm underline underline-offset-4">
              {openReports} open reports
            </Link>
          </Panel>
        )}
      </div>
    </>
  );
}
