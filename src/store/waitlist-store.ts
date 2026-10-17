"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, WaitlistEntry } from "@/types";

export const BASE_WAITLIST_COUNT = 4218;

interface WaitlistState {
  entries: WaitlistEntry[];
  has: (email: string) => boolean;
  join: (input: {
    name: string;
    email: string;
    role: Role;
    city?: string;
  }) => WaitlistEntry;
  reset: () => void;
}

export const useWaitlistStore = create<WaitlistState>()(
  persist(
    (set, get) => ({
      entries: [],
      has: (email) =>
        get().entries.some(
          (entry) => entry.email.toLowerCase() === email.trim().toLowerCase(),
        ),
      join: ({ name, email, role, city }) => {
        const entry: WaitlistEntry = {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `w_${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          city: city?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [entry, ...state.entries] }));
        return entry;
      },
      reset: () => set({ entries: [] }),
    }),
    { name: "part1.waitlist" },
  ),
);

export function waitlistPosition(entries: number) {
  return BASE_WAITLIST_COUNT + entries + 1;
}
