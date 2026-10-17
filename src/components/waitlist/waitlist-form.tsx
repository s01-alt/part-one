"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useWaitlistStore, waitlistPosition } from "@/store/waitlist-store";
import { cn, isValidEmail, formatCompact } from "@/lib/utils";
import type { Role } from "@/types";

const ROLES: { value: Role; label: string; hint: string }[] = [
  { value: "shopper", label: "Shopper", hint: "I want to buy" },
  { value: "brand", label: "Brand", hint: "I want to sell" },
  { value: "creator", label: "Creator", hint: "I create content" },
];

type Status = "idle" | "submitting" | "success";

export function WaitlistForm({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const entries = useWaitlistStore((s) => s.entries);
  const has = useWaitlistStore((s) => s.has);
  const join = useWaitlistStore((s) => s.join);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<Role>("shopper");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);

  const total = waitlistPosition(entries.length);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (variant === "full" && name.trim().length < 2) {
      setError("Tell us your name so we know who's coming through.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (has(email)) {
      setError("You're already on the list. We'll be in touch.");
      return;
    }

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));

    const entry = join({
      name: name.trim() || email.split("@")[0],
      email,
      role,
      city: variant === "full" ? city : undefined,
    });

    setPosition(waitlistPosition(entries.length));
    setStatus("success");
    toast({
      title: "You're on the list 🎉",
      description: `Position #${formatCompact(waitlistPosition(entries.length))}. We'll email ${entry.email} when doors open.`,
      tone: "success",
    });
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-acid/40 bg-acid/5 p-6 sm:p-8"
      >
        <CheckCircle2 className="h-8 w-8 text-acid" />
        <h3 className="display mt-4 text-3xl text-paper">
          You&apos;re in.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-smoke">
          You&apos;re{" "}
          <span className="font-semibold text-acid">
            #{position ? formatCompact(position) : total}
          </span>{" "}
          on the Part One waitlist. Watch your inbox — early access goes to this
          list first.
        </p>
        {variant === "full" ? (
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setStatus("idle");
              setName("");
              setEmail("");
              setCity("");
              setRole("shopper");
            }}
          >
            Add another
          </Button>
        ) : null}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sm:flex-1"
          />
          <Button
            type="submit"
            size="md"
            disabled={status === "submitting"}
            className="shrink-0"
          >
            {status === "submitting" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Join waitlist <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        {error ? (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {error}
          </p>
        ) : (
          <p className="mt-2 text-xs text-smoke">
            Free to join. No spam — just early access.
          </p>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8"
    >
      <div className="grid gap-5">
        <div>
          <Label htmlFor="waitlist-name">Full name</Label>
          <Input
            id="waitlist-name"
            name="name"
            autoComplete="name"
            placeholder="Ada Obi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="waitlist-email">Email</Label>
          <Input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-smoke">
            I&apos;m here as a
          </span>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((option) => {
              const active = role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRole(option.value)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition-colors",
                    active
                      ? "border-acid bg-acid/10"
                      : "border-line bg-ink hover:border-smoke",
                  )}
                >
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      active ? "text-acid" : "text-paper",
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] uppercase tracking-widest text-smoke">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="waitlist-city">
            City <span className="text-smoke/70">(optional)</span>
          </Label>
          <Input
            id="waitlist-city"
            name="city"
            autoComplete="address-level2"
            placeholder="Lagos"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="w-full"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Joining…
            </>
          ) : (
            <>
              Secure my spot <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-smoke">
          Join <span className="text-paper">{formatCompact(total)}</span> people
          already on the list.
        </p>
      </div>
    </form>
  );
}
