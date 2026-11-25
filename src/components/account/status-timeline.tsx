import { Check } from "lucide-react";
import type { SellerOrderStatus, StatusEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const FLOW: SellerOrderStatus[] = ["paid", "processing", "shipped", "delivered"];
const LABEL: Record<SellerOrderStatus, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

export function StatusTimeline({ history }: { history: StatusEvent[] }) {
  const reached = new Set(history.map((h) => h.status));
  const extra = history.filter((h) => !FLOW.includes(h.status));
  const steps: SellerOrderStatus[] = reached.has("cancelled") ? ["paid", "cancelled"] : [...FLOW, ...extra.map((e) => e.status)];

  return (
    <ol
      className="grid text-[11px] sm:text-xs"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      aria-label="Order progress"
    >
      {steps.map((s, i) => {
        const done = reached.has(s);
        const nextDone = i < steps.length - 1 && reached.has(steps[i + 1]);
        const at = history.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="relative flex flex-col items-center gap-1.5 text-center">
            {/* connector to the next step */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn("absolute left-1/2 top-3 h-px w-full", nextDone ? "bg-foreground" : "bg-border")}
              />
            )}
            <span
              className={cn(
                "relative flex size-6 items-center justify-center rounded-full border bg-card",
                done ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
              )}
              aria-hidden
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("flex flex-col px-0.5 leading-tight", !done && "text-muted-foreground")}>
              <span className="font-medium">{LABEL[s]}</span>
              {at && (
                <span className="text-muted-foreground">
                  {new Date(at).toLocaleDateString("en-NG", { day: "numeric", month: "short", timeZone: "Africa/Lagos" })}
                </span>
              )}
              <span className="sr-only">{done ? "(done)" : "(pending)"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
