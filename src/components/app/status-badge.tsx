import type { PaymentStatus, Report, SellerOrderStatus, SellerStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type AnyStatus = SellerOrderStatus | SellerStatus | PaymentStatus | Report["status"] | "active" | "inactive" | "queued" | "paid_out" | "processing" | "failed" | "suspended";

const LABELS: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
  pending: "Pending",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  success: "Paid",
  failed: "Failed",
  partially_refunded: "Partly refunded",
  open: "Open",
  actioned: "Actioned",
  dismissed: "Dismissed",
  active: "Active",
  inactive: "Inactive",
  queued: "Queued",
};

const TONE: Record<string, string> = {
  paid: "bg-sky-100 text-sky-900",
  success: "bg-emerald-100 text-emerald-900",
  processing: "bg-amber-100 text-amber-900",
  shipped: "bg-violet-100 text-violet-900",
  delivered: "bg-emerald-100 text-emerald-900",
  approved: "bg-emerald-100 text-emerald-900",
  active: "bg-emerald-100 text-emerald-900",
  actioned: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-neutral-200 text-neutral-700",
  inactive: "bg-neutral-200 text-neutral-700",
  dismissed: "bg-neutral-200 text-neutral-700",
  returned: "bg-orange-100 text-orange-900",
  refunded: "bg-orange-100 text-orange-900",
  partially_refunded: "bg-orange-100 text-orange-900",
  pending: "bg-amber-100 text-amber-900",
  queued: "bg-amber-100 text-amber-900",
  under_review: "bg-sky-100 text-sky-900",
  open: "bg-red-100 text-red-900",
  rejected: "bg-red-100 text-red-900",
  suspended: "bg-red-100 text-red-900",
  failed: "bg-red-100 text-red-900",
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium",
        TONE[status] ?? "bg-muted text-foreground",
        className,
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
