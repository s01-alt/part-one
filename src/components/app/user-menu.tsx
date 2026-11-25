import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { ADMIN_ROLE_LABELS } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

/** Reads the session — render inside <Suspense>. */
export async function UserMenu({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/login" className="text-sm font-medium underline underline-offset-4">
        Sign in
      </Link>
    );
  }
  const role = user.adminRole ? ADMIN_ROLE_LABELS[user.adminRole] : user.sellerBrandId ? "Seller" : "Customer";
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground"
        aria-hidden
      >
        {user.name.slice(0, 1)}
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-medium">{user.name}</span>
        <span className={dark ? "text-xs text-ink-muted" : "text-xs text-muted-foreground"}>{role}</span>
      </span>
      <form action={signOut}>
        <button
          type="submit"
          className={
            dark
              ? "inline-flex size-9 items-center justify-center rounded-sm text-ink-muted hover:bg-ink-2 hover:text-ink-foreground"
              : "inline-flex size-9 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          }
          aria-label="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}
