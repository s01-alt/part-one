import Form from "next/form";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Plain GET form → /shop?q=… Works without JavaScript. */
export function SearchForm({
  className,
  autoFocus,
  tone = "light",
}: {
  className?: string;
  autoFocus?: boolean;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Form action="/shop" role="search" className={cn("relative", className)}>
      <label htmlFor={dark ? "site-search-dark" : "site-search"} className="sr-only">
        Search products, brands and styles
      </label>
      <input
        id={dark ? "site-search-dark" : "site-search"}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search products, brands…"
        className={cn(
          "h-10 w-full rounded-sm border pl-3 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand",
          dark
            ? "border-ink-border bg-ink-2 text-ink-foreground placeholder:text-ink-muted"
            : "border-input bg-card placeholder:text-muted-foreground",
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className={cn(
          "absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm",
          dark ? "text-ink-foreground hover:text-brand" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Search className="size-4" aria-hidden />
      </button>
    </Form>
  );
}
