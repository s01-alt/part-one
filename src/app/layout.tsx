import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://part1.africa"),
  title: {
    default: "Part One — Nigerian Streetwear, Together",
    template: "%s — Part One",
  },
  description:
    "Part One is the home of Nigerian streetwear. Discover verified brands, shop the drops, and move with the culture. The Social Marketplace.",
  applicationName: "Part One",
  keywords: [
    "Nigerian streetwear",
    "African fashion",
    "marketplace",
    "streetwear brands",
    "Lagos fashion",
    "Part One",
  ],
  openGraph: {
    title: "Part One — Nigerian Streetwear, Together",
    description:
      "Discover verified Nigerian streetwear brands. Shop the drops and move with the culture.",
    type: "website",
    locale: "en_NG",
    siteName: "Part One",
  },
  twitter: {
    card: "summary_large_image",
    title: "Part One — Nigerian Streetwear, Together",
    description:
      "Discover verified Nigerian streetwear brands. Shop the drops and move with the culture.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink text-paper">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
