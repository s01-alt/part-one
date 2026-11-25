import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Part One — Nigerian Streetwear, Together",
    short_name: "Part One",
    description:
      "The home of Nigerian streetwear. Discover verified brands, shop the drops, and move with the culture.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f2ee",
    theme_color: "#0d0d0d",
    categories: ["shopping", "lifestyle", "social"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
