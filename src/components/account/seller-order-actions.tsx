"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MockNotice } from "@/components/app/page-parts";
import type { SellerOrderStatus } from "@/lib/types";

/**
 * Customer actions on one seller order.
 *  - Cancel: only the customer, only before Shipped (pending decision D-013).
 *    Backend: POST /v1/me/seller-orders/:id/cancel → refund via Paystack.
 *  - Review: only after Delivered. Backend: POST /v1/products/:id/reviews.
 */
export function SellerOrderActions({
  status,
  productNames,
}: {
  status: SellerOrderStatus;
  productNames: string[];
}) {
  const [mode, setMode] = useState<"idle" | "cancel" | "review" | "done">("idle");
  const [rating, setRating] = useState(5);
  const canCancel = status === "paid" || status === "processing";
  const canReview = status === "delivered";

  if (mode === "done") return <MockNotice />;

  if (mode === "cancel") {
    return (
      <div className="flex flex-col gap-3 rounded-md border p-4">
        <p className="text-sm">
          Cancel this part of your order? You&apos;ll get a full refund for it to your original payment method.
        </p>
        <div className="flex gap-2">
          <Button variant="destructive" className="h-9" onClick={() => setMode("done")}>
            Yes, cancel
          </Button>
          <Button variant="outline" className="h-9" onClick={() => setMode("idle")}>
            Keep order
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "review") {
    return (
      <form
        className="flex flex-col gap-3 rounded-md border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setMode("done");
        }}
      >
        <p className="text-sm font-medium">Review {productNames[0]}</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} stars`}
              onClick={() => setRating(n)}
              className={n <= rating ? "text-xl text-foreground" : "text-xl text-muted-foreground/40"}
            >
              ★
            </button>
          ))}
        </div>
        <Textarea required rows={3} placeholder="How's the fit, fabric and quality?" aria-label="Review" />
        <Button type="submit" className="h-9 w-fit">
          Post review
        </Button>
      </form>
    );
  }

  if (!canCancel && !canReview) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {canCancel && (
        <Button variant="outline" className="h-9" onClick={() => setMode("cancel")}>
          Cancel this part
        </Button>
      )}
      {canReview && (
        <Button variant="outline" className="h-9" onClick={() => setMode("review")}>
          Write a review
        </Button>
      )}
    </div>
  );
}
