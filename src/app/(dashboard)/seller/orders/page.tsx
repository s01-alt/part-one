import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, PageHeader } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { requireSeller } from "@/lib/auth/session";
import { listSellerOrders } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export default async function SellerOrdersPage() {
  const user = await requireSeller();
  const orders = await listSellerOrders(user);
  return (
    <>
      <PageHeader title="Orders" description="Only your part of each customer order is shown here." />
      {orders.length ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Your earnings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Link href={`/seller/orders/${o.id}`} className="font-medium hover:underline">
                      #{o.number}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{o.lines.reduce((n, l) => n + l.quantity, 0)}</TableCell>
                  <TableCell>{formatNaira(o.sellerEarnings)}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="No orders yet" />
      )}
    </>
  );
}
