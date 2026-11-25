import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/cart/order-confirmation";

export const metadata: Metadata = { title: "Order placed" };

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <OrderConfirmation />
    </div>
  );
}
