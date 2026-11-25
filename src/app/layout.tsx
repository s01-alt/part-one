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

export const metadata: Metadata = {
  title: {
    default: "Part One — Nigerian streetwear, in one place",
    template: "%s · Part One",
  },
  description:
    "Shop independent Nigerian streetwear brands. Discover new drops, follow the brands you love, and check out from several brands at once.",
  applicationName: "Part One",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NG"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
