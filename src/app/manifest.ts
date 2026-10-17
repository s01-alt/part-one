import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Part One — Nigerian Streetwear, Together",
    short_name: "Part One",
    description:
      "The home of Nigerian streetwear. Discover verified brands, shop the drops, and move with the culture.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
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
