import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "acid" | "paper" | "outline" | "danger";

const tones: Record<Tone, string> = {
  acid: "bg-acid text-ink border-acid",
  paper: "bg-paper text-ink border-paper",
  outline: "bg-transparent text-paper border-line",
  danger: "bg-transparent text-red-400 border-red-500/40",
};

export function Badge({
  tone = "outline",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
