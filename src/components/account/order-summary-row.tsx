import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/app/status-badge";
import { formatDate, formatNaira } from "@/lib/format";
import type { MarketplaceOrder } from "@/lib/types";

export function OrderSummaryRow({ order }: { order: MarketplaceOrder }) {
  const items = order.sellerOrders.reduce((n, s) => n + s.lines.reduce((m, l) => m + l.quantity, 0), 0);
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:border-foreground"
    >
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-semibold">Order #{order.number}</span>
        <span className="text-sm text-muted-foreground">
          {formatDate(order.createdAt)} · {items} items · {order.sellerOrders.length}{" "}
          {order.sellerOrders.length === 1 ? "brand" : "brands"}
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {order.sellerOrders.map((s) => (
            <span key={s.id} className="flex items-center gap-1.5 text-xs">
              {s.brandName} <StatusBadge status={s.status} />
            </span>
          ))}
        </div>
      </div>
      <span className="font-semibold">{formatNaira(order.total)}</span>
      <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
    </Link>
  );
}
