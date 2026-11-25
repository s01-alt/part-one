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
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 text-xs" aria-label="Order progress">
      {steps.map((s, i) => {
        const done = reached.has(s);
        const at = history.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border",
                done ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
              )}
              aria-hidden
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("flex flex-col leading-tight", !done && "text-muted-foreground")}>
              <span className="font-medium">{LABEL[s]}</span>
              {at && <span className="text-muted-foreground">{new Date(at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>}
            </span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
