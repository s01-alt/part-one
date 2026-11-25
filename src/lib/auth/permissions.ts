import type { AdminRole, User } from "@/lib/types";

/**
 * Role-based access control (RBAC) model.
 *
 * The SAME table must be enforced by the backend on every API call — the
 * frontend only uses it to hide navigation and buttons. Hiding a button is not
 * security. See docs/backend/auth-and-rbac.md.
 */
export const PERMISSIONS = [
  // Admin
  "admin.dashboard.view",
  "admin.users.manage",
  "admin.sellers.review", // approve / reject applications
  "admin.sellers.suspend",
  "admin.products.manage",
  "admin.orders.manage",
  "admin.payments.view",
  "admin.refunds.issue",
  "admin.payouts.manage",
  "admin.moderation.manage", // reports, reviews, comments
  "admin.settings.manage", // commission, thresholds
  "admin.roles.manage",
  "admin.system.view", // logs, webhooks, jobs
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, readonly Permission[]> = {
  founder: PERMISSIONS, // full access
  report_manager: ["admin.dashboard.view", "admin.moderation.manage", "admin.products.manage"],
  developer: ["admin.dashboard.view", "admin.system.view", "admin.payments.view", "admin.orders.manage"],
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  founder: "Founder",
  report_manager: "Report Manager",
  developer: "Developer",
};

export function can(user: Pick<User, "adminRole"> | null, permission: Permission): boolean {
  if (!user?.adminRole) return false;
  return ADMIN_ROLE_PERMISSIONS[user.adminRole].includes(permission);
}

export function isSeller(user: Pick<User, "sellerBrandId"> | null): boolean {
  return Boolean(user?.sellerBrandId);
}

export function isAdmin(user: Pick<User, "adminRole"> | null): boolean {
  return Boolean(user?.adminRole);
}
