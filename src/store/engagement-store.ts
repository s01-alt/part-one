"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EngagementState {
  liked: string[];
  saved: string[];
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  isLiked: (id: string) => boolean;
  isSaved: (id: string) => boolean;
}

export const useEngagementStore = create<EngagementState>()(
  persist(
    (set, get) => ({
      liked: [],
      saved: [],
      toggleLike: (id) =>
        set((state) => ({
          liked: state.liked.includes(id)
            ? state.liked.filter((item) => item !== id)
            : [...state.liked, id],
        })),
      toggleSave: (id) =>
        set((state) => ({
          saved: state.saved.includes(id)
            ? state.saved.filter((item) => item !== id)
            : [...state.saved, id],
        })),
      isLiked: (id) => get().liked.includes(id),
      isSaved: (id) => get().saved.includes(id),
    }),
    { name: "part1.engagement" },
  ),
);
