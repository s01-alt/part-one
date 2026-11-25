import type { Metadata } from "next";
import { BadgeCheck, Clock, Gift } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Get early access to Part One — the home of Nigerian streetwear. Founding member perks, first drops, and launch invites.",
};

// Copy carried over from the GitHub repo's /waitlist page.
const STEPS = [
  { icon: BadgeCheck, title: "You join the list", body: "Drop your details and lock in your founding member spot." },
  { icon: Clock, title: "We open in phases", body: "Invites roll out city by city, starting in Lagos." },
  { icon: Gift, title: "You shop first", body: "Early access to drops and founding member perks." },
];

export default function WaitlistPage() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <span className="rounded-sm bg-brand px-2 py-1 text-xs font-bold uppercase tracking-widest text-brand-foreground">
            Waitlist open
          </span>
          <h1 className="mt-6 font-heading text-6xl uppercase leading-[0.9] sm:text-7xl">
            Get in
            <br />
            <span className="text-brand">early.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-foreground/85">
            Part One is where Nigerian streetwear lives. Join the waitlist for early access, founding member perks, and
            the first drops out of Lagos.
          </p>
          <ol className="mt-10 flex flex-col gap-6">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ink-border text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Step {i + 1}</p>
                  <h2 className="mt-1 text-lg font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-ink-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:pt-4">
          <WaitlistForm tone="dark" />
        </div>
      </div>
    </section>
  );
}
