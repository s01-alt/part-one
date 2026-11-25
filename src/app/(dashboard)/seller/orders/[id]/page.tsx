import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Panel, PageHeader } from "@/components/app/page-parts";
import { ProductArt } from "@/components/product/product-art";
import { LiveStatusTimeline, OrderStatusControl, OrderStatusProvider } from "@/components/seller/order-status-control";
import { requireSeller } from "@/lib/auth/session";
import { getSellerOrder } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/seller/orders/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id.replace("so_", "").replace("_", "-")}` };
}

export default async function SellerOrderPage({ params }: PageProps<"/seller/orders/[id]">) {
  const { id } = await params;
  const user = await requireSeller();
  const order = await getSellerOrder(user, id);
  if (!order) notFound();
  const a = order.shippingAddress;

  return (
    <>
      <PageHeader title={`Order #${order.number}`} description={`Placed ${formatDate(order.createdAt)}`} />
      <OrderStatusProvider history={order.history}>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <Panel title="Progress">
            <LiveStatusTimeline />
          </Panel>
          <Panel title="Items to pack">
            <ul className="flex flex-col gap-3">
              {order.lines.map((l) => (
                <li key={l.id} className="flex items-center gap-3">
                  <ProductArt type={l.productType} tone={l.tone} className="aspect-[4/5] w-14 rounded-md" />
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium">{l.productName}</span>
                    <span className="text-muted-foreground">{l.variantLabel}</span>
                  </div>
                  <span className="text-sm font-semibold">× {l.quantity}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Money">
            <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-sm">
              <dt className="text-muted-foreground">Items</dt>
              <dd>{formatNaira(order.itemsSubtotal)}</dd>
              <dt className="text-muted-foreground">Part One commission ({(order.commissionRate * 100).toFixed(0)}%)</dt>
              <dd>−{formatNaira(order.commission)}</dd>
              <dt className="text-muted-foreground">Delivery fee</dt>
              <dd>{formatNaira(order.shippingFee)}</dd>
              <dt className="mt-2 border-t pt-2 font-semibold">Your earnings</dt>
              <dd className="mt-2 border-t pt-2 font-semibold">{formatNaira(order.sellerEarnings)}</dd>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              VAT ({formatNaira(order.vat)}) is collected and remitted by Part One. Earnings are released when the order
              is delivered.
            </p>
          </Panel>
        </div>
        <div className="flex flex-col gap-6">
          <Panel title="Update status">
            <OrderStatusControl />
          </Panel>
          <Panel title="Ship to">
            <p className="text-sm">
              {a.fullName}
              <br />
              {a.line1}
              <br />
              {a.city}, {a.state}
              <br />
              {a.phone}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Use these details only to deliver this order.</p>
          </Panel>
        </div>
      </div>
      </OrderStatusProvider>
    </>
  );
}
