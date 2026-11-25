import Link from "next/link";
import { cn } from "@/lib/utils";

/** PART 1 wordmark — heavy italic, "1" in acid lime (brand inspo). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("font-logo text-2xl font-black uppercase italic leading-none tracking-tight", className)}
      aria-label="Part One — home"
    >
      Part<span className="ml-[0.18em] text-brand">1</span>
    </Link>
  );
}
