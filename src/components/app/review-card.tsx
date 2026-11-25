"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MockNotice } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";

type Status = React.ComponentProps<typeof StatusBadge>["status"];

export interface ReviewAction {
  label: string;
  /** Status after the action, shown in the card's badge. */
  to: Status;
  variant?: "default" | "outline" | "destructive";
  /** Ask before applying. */
  confirm?: string;
}

/**
 * Admin review card (seller applications, reports). The badge and the action
 * buttons share one status, so the badge updates when an action is taken.
 * MOCK: local state only. Backend: one POST per action, permission-checked
 * and written to the audit log.
 */
export function ReviewCard({
  title,
  initialStatus,
  actionsFor,
  children,
}: {
  title: React.ReactNode;
  initialStatus: Status;
  /** Actions available in each status; none → no buttons. */
  actionsFor: Partial<Record<Status, ReviewAction[]>>;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [pending, setPending] = useState<ReviewAction | null>(null);
  const [changed, setChanged] = useState(false);
  const actions = actionsFor[status] ?? [];

  const apply = (a: ReviewAction) => {
    setStatus(a.to);
    setPending(null);
    setChanged(true);
  };

  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">{title}</div>
        <StatusBadge status={status} />
      </div>
      {children}
      {pending ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">{pending.confirm}</span>
          <Button variant={pending.variant === "destructive" ? "destructive" : "default"} className="h-8" onClick={() => apply(pending)}>
            Confirm
          </Button>
          <Button variant="ghost" className="h-8" onClick={() => setPending(null)}>
            Cancel
          </Button>
        </div>
      ) : (
        actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Button
                key={a.label}
                variant={a.variant ?? "outline"}
                className="h-8"
                onClick={() => (a.confirm ? setPending(a) : apply(a))}
              >
                {a.label}
              </Button>
            ))}
          </div>
        )
      )}
      {changed && <MockNotice />}
    </article>
  );
}
