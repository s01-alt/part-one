"use server";

import type { WaitlistRole } from "@/lib/types";

/**
 * Pre-launch waitlist sign-up.
 *
 * The GitHub repo's version was a front-end placeholder (not in use). This
 * server action validates on the server; it does NOT store anything yet
 * because there is no backend. Wire it to POST /v1/waitlist → `waitlist_entries` table
 * (docs/backend/database.md) before relying on it.
 */

export type WaitlistResult =
  | { ok: true; stored: boolean }
  | { ok: false; field?: "name" | "email" | "role"; error: string };

const ROLES: WaitlistRole[] = ["shopper", "brand", "creator"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function joinWaitlist(input: {
  name: string;
  email: string;
  role: WaitlistRole;
  city?: string;
}): Promise<WaitlistResult> {
  const name = input.name?.trim().slice(0, 80) ?? "";
  const email = input.email?.trim().toLowerCase().slice(0, 254) ?? "";
  const city = input.city?.trim().slice(0, 60) || null;

  if (name.length < 2) return { ok: false, field: "name", error: "Tell us your name so we know who's coming through." };
  if (!EMAIL.test(email)) return { ok: false, field: "email", error: "Enter a valid email address." };
  if (!ROLES.includes(input.role)) return { ok: false, field: "role", error: "Pick how you'll use Part One." };

  // TODO(backend): persist { name, email, role: input.role, city } with a unique email constraint.
  void city;
  return { ok: true, stored: false };
}
