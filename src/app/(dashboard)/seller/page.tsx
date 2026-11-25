import Link from "next/link";
import { Panel, PageHeader, StatCard } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { NotificationList } from "@/components/account/notification-list";
import { requireSeller } from "@/lib/auth/session";
import {
  getMyBrand,
  getSellerBalance,
  listMyNotifications,
  listSellerOrders,
  listSellerProducts,
} from "@/lib/data/account";
import { totalStock } from "@/lib/data/catalog";
import { formatDate, formatNaira } from "@/lib/format";

export default async function SellerOverviewPage() {
  const user = await requireSeller();
  const [brand, orders, products, balance, notifications] = await Promise.all([
    getMyBrand(user),
    listSellerOrders(user),
    listSellerProducts(user),
    getSellerBalance(user),
    listMyNotifications(user),
  ]);

  const counted = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded");
  const revenue = counted.reduce((n, o) => n + o.itemsSubtotal, 0);
  const toShip = orders.filter((o) => o.status === "paid" || o.status === "processing");
  const lowStock = products.filter((p) => p.status === "active" && totalStock(p) <= 5);

  return (
    <>
      <PageHeader title={brand?.name ?? "Your store"} description="Sales, orders and payouts at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales (all time)" value={formatNaira(revenue)} hint={`${counted.length} orders`} />
        <StatCard label="To ship" value={toShip.length} hint="Paid or processing" />
        <StatCard label="Available balance" value={formatNaira(balance.available)} hint="From delivered orders" />
        <StatCard label="Pending balance" value={formatNaira(balance.pending)} hint="Released on delivery" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Orders to fulfil"
          actions={
            <Link href="/seller/orders" className="text-sm underline underline-offset-4">
              All orders
            </Link>
          }
        >
          {toShip.length ? (
            <ul className="flex flex-col divide-y">
              {toShip.map((o) => (
                <li key={o.id}>
                  <Link href={`/seller/orders/${o.id}`} className="flex items-center justify-between gap-3 py-3 hover:underline">
                    <span className="flex flex-col">
                      <span className="font-medium">#{o.number}</span>
                      <span className="text-xs text-muted-foreground">
                        {o.customerName} · {formatDate(o.createdAt)}
                      </span>
                    </span>
                    <StatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to ship right now.</p>
          )}
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Low stock">
            {lowStock.length ? (
              <ul className="flex flex-col gap-2 text-sm">
                {lowStock.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <Link href={`/seller/products/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                    <span className="font-medium text-amber-700">{totalStock(p)} left</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">All products have healthy stock.</p>
            )}
          </Panel>
          <div>
            <h2 className="mb-3 font-semibold">Notifications</h2>
            <NotificationList items={notifications} />
          </div>
        </div>
      </div>
    </>
  );
}
