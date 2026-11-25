"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface MockAction {
  label: string;
  /** Shown after the click, e.g. "Approved". */
  result: string;
  variant?: "default" | "outline" | "destructive";
  /** If set, the action asks for confirmation first. */
  confirm?: string;
}

/**
 * Admin/seller action buttons that only change local state.
 * Each real action is a backend call that must check permissions and write an
 * audit-log entry (docs/backend/auth-and-rbac.md#audit-log).
 */
export function MockActions({ actions, size = "sm" }: { actions: MockAction[]; size?: "sm" | "md" }) {
  const [pending, setPending] = useState<MockAction | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const h = size === "sm" ? "h-8" : "h-10";

  if (done) return <span className="text-xs font-medium text-muted-foreground">{done} (preview)</span>;

  if (pending) {
    return (
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-xs">{pending.confirm}</span>
        <Button
          variant={pending.variant === "destructive" ? "destructive" : "default"}
          className={h}
          onClick={() => setDone(pending.result)}
        >
          Confirm
        </Button>
        <Button variant="ghost" className={h} onClick={() => setPending(null)}>
          Cancel
        </Button>
      </span>
    );
  }

  return (
    <span className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Button
          key={a.label}
          variant={a.variant ?? "outline"}
          className={h}
          onClick={() => (a.confirm ? setPending(a) : setDone(a.result))}
        >
          {a.label}
        </Button>
      ))}
    </span>
  );
}
