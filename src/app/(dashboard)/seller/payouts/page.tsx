import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel, PageHeader, StatCard } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { requireSeller } from "@/lib/auth/session";
import { getSellerBalance, listSellerLedger, listSellerPayouts } from "@/lib/data/account";
import { formatDate, formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Payouts" };

export default async function SellerPayoutsPage() {
  const user = await requireSeller();
  const [balance, ledger, payouts] = await Promise.all([
    getSellerBalance(user),
    listSellerLedger(user),
    listSellerPayouts(user),
  ]);
  const progress = Math.min(100, Math.round((Math.max(0, balance.available) / balance.payoutThreshold) * 100));
  const toGo = balance.payoutThreshold - balance.available;

  return (
    <>
      <PageHeader
        title="Payouts"
        description="Earnings from delivered orders are paid to your bank once your available balance reaches ₦50,000."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pending" value={formatNaira(balance.pending)} hint="Orders not yet delivered" />
        <StatCard label="Available" value={formatNaira(balance.available)} hint="Ready for payout" />
        <StatCard label="Paid out" value={formatNaira(balance.paidOut)} hint="All time" />
      </div>

      <Panel title="Next payout" className="mt-6">
        <div className="flex flex-col gap-2">
          <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to payout threshold">
            <div className="h-full bg-foreground" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm">
            {toGo > 0 ? (
              <>
                <strong>{formatNaira(toGo)}</strong> more in delivered orders until your next payout of at least{" "}
                {formatNaira(balance.payoutThreshold)}.
              </>
            ) : (
              <>Your balance has reached the threshold. A payout is sent automatically. [Pending decision D-009]</>
            )}
          </p>
          <p className="text-xs text-muted-foreground">Paid to: GTBank ••••4321 (change in Store settings)</p>
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Payout history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id}>
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
        <Panel title="Ledger">
          <ul className="flex flex-col divide-y text-sm">
            {ledger.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                <span className="flex flex-col">
                  <span>{e.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(e.createdAt)}
                    {e.sellerOrderNumber && ` · #${e.sellerOrderNumber}`} · {e.state}
                  </span>
                </span>
                <span className={cn("font-medium tabular-nums", e.amount < 0 && "text-destructive")}>
                  {e.amount < 0 ? "−" : "+"}
                  {formatNaira(Math.abs(e.amount))}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
