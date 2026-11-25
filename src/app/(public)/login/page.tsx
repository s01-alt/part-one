import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { mockSignIn } from "@/lib/auth/actions";
import { ADMIN_ROLE_LABELS } from "@/lib/auth/permissions";
import { users } from "@/lib/mock/accounts";

export const metadata: Metadata = { title: "Sign in" };

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.8l4-3z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <h1 className="font-heading text-5xl uppercase">Sign in</h1>
        <p className="mt-2 text-muted-foreground">Sign in to check out, track orders, and like, save and comment.</p>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
        <LoginOptions searchParams={searchParams} />
      </Suspense>
      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

async function LoginOptions({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const raw = (await searchParams).next;
  const next = typeof raw === "string" ? raw : "";

  return (
    <>
      {/* MOCK: real button will link to the backend's Google OAuth start URL. */}
      <form action={mockSignIn}>
        <input type="hidden" name="userId" value="usr_customer" />
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-md border bg-card font-medium hover:border-foreground"
        >
          <GoogleIcon /> Continue with Google
        </button>
      </form>

      <section className="rounded-lg border border-dashed bg-muted p-4" aria-labelledby="demo-heading">
        <h2 id="demo-heading" className="text-sm font-semibold">
          Demo mode
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Google sign-in isn&apos;t connected yet. Pick a demo account to preview each role.
        </p>
        <ul className="flex flex-col gap-2">
          {users
            .filter((u) => u.status === "active" && u.id !== "usr_tobi")
            .map((u) => (
              <li key={u.id}>
                <form action={mockSignIn}>
                  <input type="hidden" name="userId" value={u.id} />
                  <input type="hidden" name="next" value={next} />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left text-sm hover:border-foreground"
                  >
                    <span className="font-medium">{u.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {u.adminRole ? `Admin · ${ADMIN_ROLE_LABELS[u.adminRole]}` : u.sellerBrandId ? "Seller · Danfo Works" : "Customer"}
                    </span>
                  </button>
                </form>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
