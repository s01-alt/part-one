import { notFound } from "next/navigation";
import { Panel, PageHeader } from "@/components/app/page-parts";
import { MockActions } from "@/components/app/mock-actions";
import { StatusBadge } from "@/components/app/status-badge";
import { StatusTimeline } from "@/components/account/status-timeline";
import { can } from "@/lib/auth/permissions";
import { requireAdmin } from "@/lib/auth/session";
import { adminGetOrder } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const user = await requireAdmin("admin.orders.manage");
  const order = await adminGetOrder(id);
  if (!order) notFound();
  const canRefund = can(user, "admin.refunds.issue");

  return (
    <>
      <PageHeader
        title={`Order #${order.number}`}
        description={`${order.customerName} · ${formatDate(order.createdAt)} · Paystack ref ${order.paymentReference}`}
      />
      <div className="flex flex-col gap-6">
        {order.sellerOrders.map((so) => {
          const refundable = ["delivered", "returned", "shipped", "processing", "paid"].includes(so.status);
          return (
            <Panel key={so.id} title={`${so.number} · ${so.brandName}`} actions={<StatusBadge status={so.status} />}>
              <div className="flex flex-col gap-4">
                <StatusTimeline history={so.history} />
                <dl className="grid max-w-md grid-cols-[1fr_auto] gap-y-1 text-sm">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd>{formatNaira(so.itemsSubtotal)}</dd>
                  <dt className="text-muted-foreground">VAT</dt>
                  <dd>{formatNaira(so.vat)}</dd>
                  <dt className="text-muted-foreground">Delivery (kept by seller)</dt>
                  <dd>{formatNaira(so.shippingFee)}</dd>
                  <dt className="text-muted-foreground">Commission</dt>
                  <dd>{formatNaira(so.commission)}</dd>
                  <dt className="font-medium">Refundable to customer</dt>
                  <dd className="font-medium">{formatNaira(so.itemsSubtotal + so.vat)}</dd>
                </dl>
                {canRefund && refundable && (
                  <MockActions
                    size="md"
                    actions={[
                      {
                        label: `Refund ${formatNaira(so.itemsSubtotal + so.vat)}`,
                        result: "Refund sent to Paystack",
                        variant: "destructive",
                        confirm: `Refund items + VAT for ${so.number}? The delivery fee stays with the seller.`,
                      },
                    ]}
                  />
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
