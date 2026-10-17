import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Kicker } from "@/components/ui/card";
import { brands } from "@/lib/mock/brands";
import { formatCompact } from "@/lib/utils";

export function BrandStrip() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Kicker>Featured brands</Kicker>
            <h2 className="display mt-4 text-4xl text-paper sm:text-5xl">
              The labels setting the tone.
            </h2>
          </div>
          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-acid hover:text-paper"
          >
            View all brands
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-ink-2 p-6 transition-colors hover:border-acid/60 sm:w-[46%] lg:w-auto"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: brand.accent }}
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  className="grid h-14 w-14 place-items-center rounded-xl border border-line"
                  style={{ backgroundColor: `${brand.accent}1a` }}
                >
                  <span
                    className="display text-2xl"
                    style={{ color: brand.accent }}
                  >
                    {brand.name
                      .split(" ")
                      .slice(0, 1)
                      .map((w) => w[0])}
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-smoke transition-colors group-hover:text-acid" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-paper">
                {brand.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-smoke">
                {brand.handle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-smoke">
                {brand.tagline}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[11px] uppercase tracking-widest text-smoke">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> {brand.location}
                </span>
                <span>{formatCompact(brand.followers)} followers</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
