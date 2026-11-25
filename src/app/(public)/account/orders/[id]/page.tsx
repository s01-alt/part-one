import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { SellerOrderActions } from "@/components/account/seller-order-actions";
import { StatusTimeline } from "@/components/account/status-timeline";
import { ProductArt } from "@/components/product/product-art";
import { requireUser } from "@/lib/auth/session";
import { getMyOrder } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export default async function OrderDetailPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/account/orders/${id}`);
  const order = await getMyOrder(user, id);
  if (!order) notFound();

  const a = order.shippingAddress;
  return (
    <>
      <PageHeader
        title={`Order #${order.number}`}
        description={
          <>
            Placed {formatDate(order.createdAt)} · Payment <StatusBadge status={order.paymentStatus} />
          </>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          {order.sellerOrders.map((so) => (
            <section key={so.id} className="rounded-lg border bg-card" aria-labelledby={`so-${so.id}`}>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
                <h2 id={`so-${so.id}`} className="font-semibold">
                  {so.number} ·{" "}
                  <Link href={`/brands/${so.brandSlug}`} className="hover:underline">
                    {so.brandName}
                  </Link>
                </h2>
                <StatusBadge status={so.status} />
              </header>
              <div className="flex flex-col gap-5 p-5">
                <StatusTimeline history={so.history} />
                <ul className="flex flex-col gap-3">
                  {so.lines.map((l) => (
                    <li key={l.id} className="flex items-center gap-3">
                      <ProductArt type={l.productType} tone={l.tone} className="aspect-[4/5] w-14 rounded-md" />
                      <div className="flex flex-1 flex-col text-sm">
                        <Link href={`/products/${l.productSlug}`} className="font-medium hover:underline">
                          {l.productName}
                        </Link>
                        <span className="text-muted-foreground">
                          {l.variantLabel} · Qty {l.quantity}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{formatNaira(l.unitPrice * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="grid grid-cols-[1fr_auto] gap-y-1 border-t pt-3 text-sm">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd>{formatNaira(so.itemsSubtotal)}</dd>
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>{formatNaira(so.shippingFee)}</dd>
                  <dt className="text-muted-foreground">VAT</dt>
                  <dd>{formatNaira(so.vat)}</dd>
                  <dt className="font-medium">Subtotal</dt>
                  <dd className="font-medium">{formatNaira(so.total)}</dd>
                </dl>
                <SellerOrderActions status={so.status} productNames={so.lines.map((l) => l.productName)} />
              </div>
            </section>
          ))}
        </div>

        <aside className="flex h-fit flex-col gap-4">
          <div className="rounded-lg border bg-card p-5 text-sm">
            <h2 className="mb-2 font-semibold">Delivery address</h2>
            <p>
              {a.fullName}
              <br />
              {a.line1}
              {a.line2 && (
                <>
                  <br />
                  {a.line2}
                </>
              )}
              <br />
              {a.city}, {a.state}
              <br />
              {a.phone}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 text-sm">
            <h2 className="mb-2 font-semibold">Payment</h2>
            <dl className="grid grid-cols-[1fr_auto] gap-y-1">
              <dt className="text-muted-foreground">Total paid</dt>
              <dd className="font-semibold">{formatNaira(order.total)}</dd>
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="font-mono text-xs">{order.paymentReference}</dd>
            </dl>
          </div>
        </aside>
      </div>
    </>
  );
}
