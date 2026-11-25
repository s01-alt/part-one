"use client";

import { createContext, use, useState } from "react";
import { Button } from "@/components/ui/button";
import { MockNotice } from "@/components/app/page-parts";
import { StatusBadge } from "@/components/app/status-badge";
import { StatusTimeline } from "@/components/account/status-timeline";
import type { SellerOrderStatus, StatusEvent } from "@/lib/types";

/**
 * Transitions a seller may make. The backend enforces the same table
 * (docs/backend/orders-and-payments.md). Sellers cannot cancel; marking
 * "returned" flags the order for Part One to refund the customer.
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

interface OrderStatusState {
  history: StatusEvent[];
  status: SellerOrderStatus;
  advance: (to: SellerOrderStatus) => void;
  changed: boolean;
}

const OrderStatusContext = createContext<OrderStatusState | null>(null);

function useOrderStatus(): OrderStatusState {
  const ctx = use(OrderStatusContext);
  if (!ctx) throw new Error("Wrap in <OrderStatusProvider>");
  return ctx;
}

/** Shares one status between the progress timeline and the update buttons. */
export function OrderStatusProvider({ history: initial, children }: { history: StatusEvent[]; children: React.ReactNode }) {
  const [history, setHistory] = useState(initial);
  const [changed, setChanged] = useState(false);
  const status = history[history.length - 1].status;
  const advance = (to: SellerOrderStatus) => {
    setHistory((h) => [...h, { status: to, at: new Date().toISOString() }]);
    setChanged(true);
  };
  return <OrderStatusContext value={{ history, status, advance, changed }}>{children}</OrderStatusContext>;
}

export function LiveStatusTimeline() {
  const { history } = useOrderStatus();
  return <StatusTimeline history={history} />;
}

export function OrderStatusControl() {
  const { status, advance, changed } = useOrderStatus();
  const next = SELLER_TRANSITIONS[status] ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm">
        Current status: <StatusBadge status={status} />
      </div>
      {next.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {next.map((s) => (
            <Button key={s} variant={s === "returned" ? "outline" : "default"} className="h-10" onClick={() => advance(s)}>
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
