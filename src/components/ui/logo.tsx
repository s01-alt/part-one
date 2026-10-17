import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Part One — home"
      className={cn("group flex items-center gap-2", className)}
    >
      <span className="display text-2xl leading-none tracking-tight text-paper">
        PART
      </span>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-acid text-base font-bold">
        <span className="display text-lg leading-none text-ink">1</span>
      </span>
    </Link>
  );
}
