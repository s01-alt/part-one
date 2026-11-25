import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { requireAdmin } from "@/lib/auth/session";
import { adminListOrders } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  await requireAdmin("admin.orders.manage");
  const orders = await adminListOrders();
  return (
    <>
      <PageHeader title="Orders" description="Every marketplace order and its seller orders." />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Seller orders</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                    #{o.number}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(o.createdAt)}</TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>
                  <span className="flex flex-wrap gap-1.5">
                    {o.sellerOrders.map((s) => (
                      <span key={s.id} className="flex items-center gap-1 text-xs">
                        {s.number.split("-")[1]} <StatusBadge status={s.status} />
                      </span>
                    ))}
                  </span>
                </TableCell>
                <TableCell>{formatNaira(o.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={o.paymentStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
