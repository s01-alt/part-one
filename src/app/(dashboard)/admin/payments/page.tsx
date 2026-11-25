import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel, PageHeader } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { requireAdmin } from "@/lib/auth/session";
import { adminListOrders, adminListPayouts } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";

export const metadata = { title: "Payments & payouts" };

export default async function AdminPaymentsPage() {
  await requireAdmin("admin.payments.view");
  const [orders, payouts] = await Promise.all([adminListOrders(), adminListPayouts()]);
  return (
    <>
      <PageHeader title="Payments & payouts" description="Customer payments in, seller payouts out. All amounts reconcile against Paystack." />
      <div className="flex flex-col gap-6">
        <Panel title="Customer payments">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.paymentReference}</TableCell>
                  <TableCell>#{o.number}</TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell>{formatNaira(o.total)}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.paymentStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
        <Panel title="Seller payouts (Paystack Transfers)">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.transferReference}</TableCell>
                  <TableCell>{p.brandName}</TableCell>
                  <TableCell>{p.bankLabel}</TableCell>
                  <TableCell>{formatDate(p.createdAt)}</TableCell>
                  <TableCell>{formatNaira(p.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status === "paid" ? "success" : p.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </>
  );
}
