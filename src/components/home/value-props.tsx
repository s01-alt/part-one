import { Heart, ShieldCheck, Truck, Zap } from "lucide-react";
import { Kicker } from "@/components/ui/card";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified brands only",
    body: "Every seller on Part One is vetted. No fakes, no fillers.",
  },
  {
    icon: Zap,
    title: "Drops in real time",
    body: "Collections land the moment they drop. Follow a brand and never miss a release.",
  },
  {
    icon: Heart,
    title: "Built-in community",
    body: "Like, save, repost and comment. Shop the feed and move with the people who set the tone.",
  },
];

export function ValueProps() {
  return (
    <section className="border-b border-line bg-ink-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="display mt-4 text-4xl text-paper sm:text-5xl lg:text-6xl">
            A marketplace that moves like a feed.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-smoke">
            Part One pairs a serious storefront with the energy of social. Buy
            with confidence, discover through culture.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-1 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-ink-2 p-6 transition-colors hover:bg-ink-3 sm:p-8"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-line text-acid transition-colors group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-paper">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-smoke">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
