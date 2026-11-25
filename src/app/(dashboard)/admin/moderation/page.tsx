import { PageHeader } from "@/components/app/page-parts";
import { MockActions } from "@/components/app/mock-actions";
import { StatusBadge } from "@/components/app/status-badge";
import { requireAdmin } from "@/lib/auth/session";
import { adminListReports } from "@/lib/data/account";
import { formatDate } from "@/lib/format";

const REASON: Record<string, string> = {
  counterfeit: "Counterfeit",
  offensive: "Offensive",
  spam: "Spam",
  misleading: "Misleading",
  other: "Other",
};

export default async function ModerationPage() {
  await requireAdmin("admin.moderation.manage");
  const reports = await adminListReports();
  return (
    <>
      <PageHeader title="Moderation" description="Reports on products, reviews and comments." />
      <ul className="flex flex-col gap-4">
        {reports.map((r) => (
          <li key={r.id} className="flex flex-col gap-3 rounded-lg border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs font-semibold uppercase">{r.targetType}</span>
              <span className="text-xs font-medium">{REASON[r.reason]}</span>
              <StatusBadge status={r.status} />
              <span className="ml-auto text-xs text-muted-foreground">
                Reported by {r.reporterName} · {formatDate(r.createdAt)}
              </span>
            </div>
            <p className="font-medium">{r.targetLabel}</p>
            <p className="text-sm text-muted-foreground">{r.details}</p>
            {r.status === "open" && (
              <MockActions
                actions={[
                  { label: "Remove content", result: "Content removed", variant: "destructive", confirm: "Remove this content?" },
                  { label: "Dismiss", result: "Report dismissed" },
                ]}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
