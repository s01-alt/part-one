import Link from "next/link";
import { PageHeader, StatCard } from "@/components/app/page-parts";
import { OrderSummaryRow } from "@/components/account/order-summary-row";
import { requireUser } from "@/lib/auth/session";
import { listMyFollowedBrands, listMyNotifications, listMyOrders, listMySaved } from "@/lib/data/account";

export default async function AccountOverviewPage() {
  const user = await requireUser("/account");
  const [orders, saved, following, notifications] = await Promise.all([
    listMyOrders(user),
    listMySaved(user),
    listMyFollowedBrands(user),
    listMyNotifications(user),
  ]);
  const active = orders.filter((o) => o.sellerOrders.some((s) => ["paid", "processing", "shipped"].includes(s.status)));
  const unread = notifications.filter((n) => !n.readAt).length;

  return (
    <>
      <PageHeader title={`Hi, ${user.name.split(" ")[0]}`} description="Your orders, saved pieces and brands." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Active orders" value={active.length} />
        <StatCard label="Saved" value={saved.saved.length} />
        <StatCard label="Following" value={following.length} />
        <StatCard label="Unread notifications" value={unread} />
      </div>
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm underline underline-offset-4">
            All orders
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {orders.slice(0, 3).map((o) => (
            <OrderSummaryRow key={o.id} order={o} />
          ))}
          {!orders.length && <p className="text-muted-foreground">No orders yet.</p>}
        </div>
      </section>
    </>
  );
}
