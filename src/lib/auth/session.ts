/**
 * MOCK SESSION — for building the signed-in UI before the backend exists.
 *
 * Stores a demo user id in a plain cookie. This is NOT secure and must be
 * replaced before launch: the backend will issue the session after Google
 * sign-in (see docs/backend/auth-and-rbac.md), and this module will instead
 * call GET /v1/me with the session cookie.
 *
 * Server-only: reads cookies(). With Cache Components, call it inside a
 * <Suspense> boundary, never at the top level of a layout.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { users } from "@/lib/mock/accounts";
import { can, type Permission } from "@/lib/auth/permissions";
import type { User } from "@/lib/types";

export const SESSION_COOKIE = "p1_mock_session";

/** GET /v1/me */
export async function getCurrentUser(): Promise<User | null> {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const user = users.find((u) => u.id === id);
  return user && user.status === "active" ? user : null;
}

export async function requireUser(next = "/account"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireSeller(): Promise<User & { sellerBrandId: string }> {
  const user = await requireUser("/seller");
  if (!user.sellerBrandId) redirect("/sell/apply");
  return user as User & { sellerBrandId: string };
}

export async function requireAdmin(permission: Permission = "admin.dashboard.view"): Promise<User> {
  const user = await requireUser("/admin");
  if (!can(user, permission)) redirect(user.adminRole ? "/admin?denied=1" : "/account");
  return user;
}
