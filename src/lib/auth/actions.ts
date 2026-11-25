"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { users } from "@/lib/mock/accounts";
import { SESSION_COOKIE } from "@/lib/auth/session";

/** Only allow same-site relative redirects (prevents open redirects). */
function safeNext(next: FormDataEntryValue | null, fallback: string): string {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : fallback;
}

/**
 * MOCK sign-in. Real flow: the "Continue with Google" button links to
 * GET {API}/v1/auth/google/start?next=… and the backend sets the session cookie.
 */
export async function mockSignIn(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("Unknown demo user");

  (await cookies()).set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const fallback = user.adminRole ? "/admin" : user.sellerBrandId ? "/seller" : "/account";
  redirect(safeNext(formData.get("next"), fallback));
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
