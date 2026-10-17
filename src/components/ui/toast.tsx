"use client";

import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: ToastItem[];
  add: (input: {
    title: string;
    description?: string;
    tone?: ToastTone;
  }) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: ({ title, description, tone = "info" }) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `t_${Date.now()}`,
          title,
          description,
          tone,
        },
      ],
    })),
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(input: {
  title: string;
  description?: string;
  tone?: ToastTone;
}) {
  useToastStore.getState().add(input);
}
