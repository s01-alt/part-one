import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/ui/product-art";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Get early access to Part One — the home of Nigerian streetwear. Founding member perks, first drops, and launch invites.",
};

const steps = [
  {
    icon: BadgeCheck,
    title: "You join the list",
    body: "Drop your details and lock in your founding member spot.",
  },
  {
    icon: Clock,
    title: "We open in phases",
    body: "Invites roll out city by city, starting in Lagos.",
  },
  {
    icon: Gift,
    title: "You shop first",
    body: "Early access to drops and founding member pricing.",
  },
];

export default function WaitlistPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-acid/10 blur-[120px]"
        />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-smoke transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge tone="acid">Waitlist open</Badge>
              <h1 className="display mt-6 text-5xl leading-[0.9] text-paper sm:text-6xl lg:text-7xl">
                Get in
                <br />
                <span className="text-acid">early.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-smoke sm:text-lg">
                Part One is where Nigerian streetwear lives. Join the waitlist for
                early access, founding member perks, and the first drops out of
                Lagos.
              </p>

              <ol className="mt-10 space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-acid">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-smoke">
                        Step {index + 1}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-paper">
                        {step.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-smoke">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:pt-4">
              <WaitlistForm variant="full" />

            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}
