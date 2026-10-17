import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { Kicker } from "@/components/ui/card";

const perks = [
  "Early access to drops",
  "Founding member pricing",
  "Vote on which brands launch first",
];

export function WaitlistCta() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-acid text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ink/10"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <Kicker className="text-ink/70">The waitlist</Kicker>
          <h2 className="display mt-4 text-4xl leading-[0.95] sm:text-6xl">
            Be first through the door.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/80">
            Part One opens in Lagos soon. Get on the list for early access,
            founding member perks, and the first drops.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-acid">
                  ✦
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink/20 bg-ink p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-paper">
            Join the Part One waitlist
          </h3>
          <p className="mt-2 text-sm text-smoke">
            Takes 10 seconds. No spam, ever.
          </p>
          <div className="mt-6">
            <WaitlistForm variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
