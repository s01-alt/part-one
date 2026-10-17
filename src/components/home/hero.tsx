import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/ui/product-art";

const stats = [
  { value: "-", label: "Verified brands" },
  { value: "-", label: "On the waitlist" },
  { value: "-", label: "Drops / month" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-acid/10 blur-[120px]"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24 lg:px-8">
        <div className="relative z-10">

          <h1 className="display mt-6 text-[17vw] leading-[0.86] text-paper sm:text-7xl lg:text-8xl xl:text-[7rem]">
            Wear the
            <br />
            <span className="text-acid">culture.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-smoke sm:text-lg">
            Part One is where Nigerian streetwear lives. Verified brands, real
            drops, and the people who move the culture —{" "}
            <span className="text-paper">The Social Marketplace</span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/waitlist">
                Join the waitlist <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/brands">Explore brands</Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="display text-3xl text-paper sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-[11px] uppercase tracking-widest text-smoke">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 aspect-16/10 overflow-hidden rounded-2xl border border-line">
              <ProductArt
                seed="hero-1"
                variant="hero"
                accent="#c6ff00"
                label="Part One"
                sub="Lagos"
              />
            </div>
            <div className="aspect-4/5 -rotate-2 overflow-hidden rounded-2xl border border-line">
              <ProductArt
                seed="p1"
                accent="#c6ff00"
                label="Eko Suede"
                sub="Ronin Lagos"
              />
            </div>
            <div className="aspect-4/5 rotate-2 overflow-hidden rounded-2xl border border-line">
              <ProductArt
                seed="p3"
                accent="#ff5f1f"
                label="Adire Parka"
                sub="ÀWÚRE"
              />
            </div>
          </div>

          <div className="absolute -bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-ink/90 px-4 py-3 backdrop-blur sm:left-8 sm:right-8">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
              </span>
              <span className="text-xs font-medium text-paper">
                New drop going live
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-widest text-smoke">
              Eko Suede Low
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
