"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore, type ToastTone } from "@/components/ui/toast";

const toneIcon: Record<ToastTone, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-acid" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  info: <Info className="h-5 w-5 text-paper" />,
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
      {toasts.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          open
          onOpenChange={(open) => {
            if (!open) dismiss(item.id);
          }}
          className="animate-toast-in relative flex w-full items-start gap-3 rounded-xl border border-line bg-ink-2 p-4 shadow-xl"
        >
          <span className="mt-0.5 shrink-0">{toneIcon[item.tone]}</span>
          <div className="pr-6">
            <ToastPrimitive.Title className="text-sm font-semibold text-paper">
              {item.title}
            </ToastPrimitive.Title>
            {item.description ? (
              <ToastPrimitive.Description className="mt-1 text-xs leading-relaxed text-smoke">
                {item.description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss"
            className="absolute right-3 top-3 text-smoke transition-colors hover:text-paper"
          >
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 outline-none" />
    </ToastPrimitive.Provider>
  );
}
