"use client";

import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist } from "@/lib/waitlist/actions";
import type { WaitlistRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: { value: WaitlistRole; label: string; hint: string }[] = [
  { value: "shopper", label: "Shopper", hint: "I want to buy" },
  { value: "brand", label: "Brand", hint: "I want to sell" },
  { value: "creator", label: "Creator", hint: "I create content" },
];

/** Waitlist form, adapted from the GitHub repo into the current design system. */
export function WaitlistForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [role, setRole] = useState<WaitlistRole>("shopper");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ stored: boolean } | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div role="status" className={cn("rounded-sm border p-6", dark ? "border-ink-border bg-ink-2" : "bg-card")}>
        <CheckCircle2 className="size-8" aria-hidden />
        <h3 className="mt-4 font-heading text-3xl uppercase">You&apos;re in.</h3>
        <p className={cn("mt-2 text-sm", dark ? "text-ink-muted" : "text-muted-foreground")}>
          Thanks for joining. Early access goes to this list first.
        </p>
        {!done.stored && (
          <p className={cn("mt-3 text-xs", dark ? "text-ink-muted" : "text-muted-foreground")}>
            Preview build: sign-ups are not stored until the backend is connected.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      noValidate
      className={cn("grid gap-5", dark && "text-ink-foreground")}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          const res = await joinWaitlist({
            name: String(fd.get("name") ?? ""),
            email: String(fd.get("email") ?? ""),
            city: String(fd.get("city") ?? ""),
            role,
          });
          if (res.ok) setDone({ stored: res.stored });
          else setError(res.error);
        });
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="waitlist-name">Full name</Label>
        <Input id="waitlist-name" name="name" autoComplete="name" placeholder="Ada Obi" className="h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="waitlist-email">Email</Label>
        <Input id="waitlist-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" className="h-11" />
      </div>
      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-widest">I&apos;m here as a</legend>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((r) => {
            const on = role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                aria-pressed={on}
                onClick={() => setRole(r.value)}
                className={cn(
                  "rounded-sm border px-3 py-3 text-left transition-colors",
                  on ? "border-foreground bg-foreground text-background" : "hover:border-foreground",
                )}
              >
                <span className="block text-sm font-bold">{r.label}</span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-widest opacity-70">{r.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="flex flex-col gap-2">
        <Label htmlFor="waitlist-city">
          City <span className="font-normal opacity-60">(optional)</span>
        </Label>
        <Input id="waitlist-city" name="city" autoComplete="address-level2" placeholder="Lagos" className="h-11" />
      </div>
      {error && (
        <p role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" variant="brand" disabled={pending} className="h-12 w-full text-sm">
        {pending ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" /> Joining…
          </>
        ) : (
          <>
            Secure my spot <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>
      <p className="text-center text-xs opacity-70">
        Free to join. By joining you agree to our{" "}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
