import { Panel, PageHeader } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { requireAdmin } from "@/lib/auth/session";

/** MOCK. Backend: GET /v1/admin/system/webhooks, /jobs, /audit-log (docs/backend/operations.md). */
const WEBHOOKS = [
  { id: "evt_1", event: "charge.success", ref: "PSK_1008_20261123", status: "success" as const, at: "2026-11-23 16:31" },
  { id: "evt_2", event: "transfer.success", ref: "TRF_8c1d0f", status: "success" as const, at: "2026-10-30 12:01" },
  { id: "evt_3", event: "refund.processed", ref: "PSK_1005_20261114", status: "success" as const, at: "2026-11-20 09:12" },
  { id: "evt_4", event: "charge.success", ref: "PSK_1007_20261119", status: "failed" as const, at: "2026-11-19 09:25", note: "Duplicate — ignored (idempotent)" },
];
const JOBS = [
  { name: "payouts.run", schedule: "Every hour", last: "2026-11-25 08:00", status: "success" as const },
  { name: "ledger.release-delivered", schedule: "On order delivered", last: "2026-11-24 10:02", status: "success" as const },
  { name: "reconcile.paystack", schedule: "Daily 02:00", last: "2026-11-25 02:00", status: "success" as const },
];
const AUDIT = [
  { at: "2026-11-24 10:15", actor: "Founder (demo)", action: "seller_application.approve", target: "app_0 Danfo Works" },
  { at: "2026-11-20 09:12", actor: "Founder (demo)", action: "refund.create", target: "1005-A ₦17,738" },
  { at: "2026-11-18 10:05", actor: "Report Manager (demo)", action: "comment.remove", target: "com_prd_12_0" },
];

export const metadata = { title: "System" };

export default async function SystemPage() {
  await requireAdmin("admin.system.view");
  return (
    <>
      <PageHeader title="System" description="Webhooks, background jobs and the audit log." />
      <div className="flex flex-col gap-6">
        <Panel title="Paystack webhooks">
          <ul className="flex flex-col divide-y text-sm">
            {WEBHOOKS.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center gap-3 py-2">
                <span className="font-mono text-xs">{w.event}</span>
                <span className="font-mono text-xs text-muted-foreground">{w.ref}</span>
                <StatusBadge status={w.status} />
                {w.note && <span className="text-xs text-muted-foreground">{w.note}</span>}
                <span className="ml-auto text-xs text-muted-foreground">{w.at}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Background jobs">
          <ul className="flex flex-col divide-y text-sm">
            {JOBS.map((j) => (
              <li key={j.name} className="flex flex-wrap items-center gap-3 py-2">
                <span className="font-mono text-xs">{j.name}</span>
                <span className="text-xs text-muted-foreground">{j.schedule}</span>
                <StatusBadge status={j.status} />
                <span className="ml-auto text-xs text-muted-foreground">Last run {j.last}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Audit log">
          <ul className="flex flex-col divide-y text-sm">
            {AUDIT.map((a, i) => (
              <li key={i} className="flex flex-wrap gap-3 py-2">
                <span className="text-xs text-muted-foreground">{a.at}</span>
                <span className="font-medium">{a.actor}</span>
                <span className="font-mono text-xs">{a.action}</span>
                <span className="text-muted-foreground">{a.target}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
