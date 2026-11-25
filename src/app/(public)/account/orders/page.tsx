import { EmptyState, PageHeader } from "@/components/app/page-parts";
import { OrderSummaryRow } from "@/components/account/order-summary-row";
import { requireUser } from "@/lib/auth/session";
import { listMyOrders } from "@/lib/data/account";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await listMyOrders(user);
  return (
    <>
      <PageHeader
        title="Orders"
        description="One order can include several brands. Each brand ships and updates its part separately."
      />
      {orders.length ? (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <OrderSummaryRow key={o.id} order={o} />
          ))}
        </div>
      ) : (
        <EmptyState title="No orders yet" />
      )}
    </>
  );
}
