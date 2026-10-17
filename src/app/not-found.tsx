import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/ui/product-art";

export const metadata: Metadata = {
  title: "404 — Not found",
  description: "This page isn't live yet. It might be a future Part One drop.",
};

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-acid/10 blur-[120px]"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <Badge tone="acid">Error 404</Badge>
          <p className="display mt-6 text-[26vw] leading-[0.8] text-paper sm:text-9xl lg:text-[10rem]">
            4<span className="text-acid">0</span>4
          </p>
          <h1 className="display mt-4 text-3xl text-paper sm:text-4xl">
            This drop isn&apos;t live yet.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-smoke sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist — or it&apos;s
            still on the way. Part One is opening soon.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Back home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/waitlist">
                Join the waitlist <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-4/5 -rotate-3 overflow-hidden rounded-2xl border border-line">
              <ProductArt
                seed="404-a"
                accent="#c6ff00"
                label="Lost"
                sub="Part One"
              />
            </div>
            <div className="mt-8 aspect-4/5 rotate-3 overflow-hidden rounded-2xl border border-line">
              <ProductArt
                seed="404-b"
                accent="#ff5f1f"
                label="Soon"
                sub="Lagos"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
