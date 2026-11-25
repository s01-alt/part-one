"use client";

/**
 * Local likes / saves / reposts (ported from the GitHub repo's engagement store).
 * Keeps the social buttons stateful across pages until the backend exists.
 * Backend: PUT|DELETE /v1/products/:id/{like|save|repost}; signed-in users'
 * state then comes from the server and this store is removed.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Kind = "liked" | "saved" | "reposted";

interface EngagementState {
  liked: string[];
  saved: string[];
  reposted: string[];
  toggle: (kind: Kind, productId: string) => void;
}

export const useEngagement = create<EngagementState>()(
  persist(
    (set) => ({
      liked: [],
      saved: [],
      reposted: [],
      toggle: (kind, id) =>
        set((s) => ({ [kind]: s[kind].includes(id) ? s[kind].filter((x) => x !== id) : [...s[kind], id] })),
    }),
    { name: "partone-engagement-v1", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
