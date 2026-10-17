import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { ProductPreview } from "@/components/home/product-preview";
import { BrandStrip } from "@/components/home/brand-strip";
import { CommunityTeaser } from "@/components/home/community-teaser";
import { WaitlistCta } from "@/components/home/waitlist-cta";
import { Marquee, MarqueeItem } from "@/components/ui/marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee className="bg-ink-2">
        <MarqueeItem>Social Marketplace</MarqueeItem>
        <MarqueeItem>Nigerian streetwear</MarqueeItem>
        <MarqueeItem>Verified brands</MarqueeItem>
        <MarqueeItem>Shop the culture</MarqueeItem>
      </Marquee>
      <ValueProps />
      <ProductPreview />
      <BrandStrip />
      <CommunityTeaser />
      <WaitlistCta />
    </>
  );
}
