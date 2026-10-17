import Link from "next/link";
import { AtSign, Camera, Music2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CopyrightYear } from "@/components/site/copyright-year";

const columns = [
  {
    title: "Marketplace",
    links: [
      { href: "/shop", label: "Shop all" },
      { href: "/brands", label: "Brands" },
      { href: "/community", label: "Community" },
      { href: "/saved", label: "Saved" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/sell", label: "Sell on Part One" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help centre" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-smoke">
              The home of Nigerian streetwear. Discover verified brands, shop
              the drops, and move with the culture.
            </p>
            <div className="mt-6 flex gap-2">
              <SocialLink label="Instagram" href="https://instagram.com">
                <Camera className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="Twitter" href="https://twitter.com">
                <AtSign className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="TikTok" href="https://tiktok.com">
                <Music2 className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-paper">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-smoke transition-colors hover:text-acid"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-smoke">
            © <CopyrightYear /> Part One. Made in Lagos, Nigeria.
          </p>
          <p className="text-xs uppercase tracking-widest text-smoke">
            The Social Marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-smoke transition-colors hover:border-acid hover:text-acid"
    >
      {children}
    </a>
  );
}
