"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MockNotice } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import type { SellerOrderStatus } from "@/lib/types";

/**
 * Transitions a seller may make. The backend enforces the same table
 * (docs/backend/orders.md). Sellers cannot cancel; marking "returned" flags
 * the order for Part One to refund the customer.
 */
export const SELLER_TRANSITIONS: Partial<Record<SellerOrderStatus, SellerOrderStatus[]>> = {
  paid: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: ["returned"],
};

const ACTION_LABEL: Partial<Record<SellerOrderStatus, string>> = {
  processing: "Start processing",
  shipped: "Mark as shipped",
  delivered: "Mark as delivered",
  returned: "Record return",
};

export function OrderStatusControl({ initial }: { initial: SellerOrderStatus }) {
  const [status, setStatus] = useState(initial);
  const [changed, setChanged] = useState(false);
  const next = SELLER_TRANSITIONS[status] ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm">
        Current status: <StatusBadge status={status} />
      </div>
      {next.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {next.map((s) => (
            <Button
              key={s}
              variant={s === "returned" ? "outline" : "default"}
              className="h-10"
              onClick={() => {
                setStatus(s);
                setChanged(true);
              }}
            >
              {ACTION_LABEL[s]}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No further updates for this order.</p>
      )}
      {status === "delivered" && (
        <p className="text-xs text-muted-foreground">Your earnings for this order are now in your available balance.</p>
      )}
      {changed && <MockNotice>Preview only — the customer is notified in the app once the backend is connected.</MockNotice>}
    </div>
  );
}
