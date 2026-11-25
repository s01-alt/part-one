import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Condensed display face for headings — streetwear poster feel.
const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

// Heavy italic for the PART 1 wordmark (brand inspo).
const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["800", "900"],
  style: ["italic"],
  subsets: ["latin"],
});

// Metadata carried over from the GitHub repo (part1.africa).
export const metadata: Metadata = {
  metadataBase: new URL("https://part1.africa"),
  title: {
    default: "Part One — Nigerian Streetwear, Together",
    template: "%s — Part One",
  },
  description:
    "Part One is the home of Nigerian streetwear. Discover verified brands, shop the drops, and move with the culture. The Social Marketplace.",
  applicationName: "Part One",
  keywords: ["Nigerian streetwear", "African fashion", "marketplace", "streetwear brands", "Lagos fashion", "Part One"],
  openGraph: {
    title: "Part One — Nigerian Streetwear, Together",
    description: "Discover verified Nigerian streetwear brands. Shop the drops and move with the culture.",
    type: "website",
    locale: "en_NG",
    siteName: "Part One",
  },
  twitter: {
    card: "summary_large_image",
    title: "Part One — Nigerian Streetwear, Together",
    description: "Discover verified Nigerian streetwear brands. Shop the drops and move with the culture.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NG"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
