import { cn } from "@/lib/utils";
import type { ProductType } from "@/lib/types";

/**
 * Placeholder artwork for products without photos (all mock data).
 * Renders a garment silhouette on the product's tone colour. When real images
 * exist, ProductImage swaps this for next/image.
 */

type Shape = "tee" | "long" | "hoodie" | "pants" | "shorts" | "sneaker" | "cap" | "beanie" | "bag" | "ring";

const SHAPE_BY_TYPE: Record<ProductType, Shape> = {
  "t-shirt": "tee",
  shirt: "long",
  hoodie: "hoodie",
  sweatshirt: "long",
  jacket: "long",
  jeans: "pants",
  "cargo-pants": "pants",
  trousers: "pants",
  joggers: "pants",
  shorts: "shorts",
  sneakers: "sneaker",
  cap: "cap",
  beanie: "beanie",
  bag: "bag",
  accessory: "ring",
  other: "tee",
};

const LONG = "M28 24 L40 18 Q50 24 60 18 L72 24 L86 70 L76 72 L68 44 L68 86 L32 86 L32 44 L24 72 L14 70 Z";

const PATHS: Record<Shape, string[]> = {
  tee: ["M30 22 L42 16 Q50 23 58 16 L70 22 L84 36 L74 44 L68 39 L68 86 L32 86 L32 39 L26 44 L16 36 Z"],
  long: [LONG],
  hoodie: [LONG, "M40 19 Q50 2 60 19 Q50 28 40 19 Z"],
  pants: ["M32 12 L68 12 L75 88 L56 88 L50 38 L44 88 L25 88 Z"],
  shorts: ["M29 28 L71 28 L77 68 L54 68 L50 46 L46 68 L23 68 Z"],
  sneaker: ["M12 64 L13 48 Q30 47 39 36 L52 40 Q62 50 86 55 L89 64 Z", "M11 64 L90 64 L90 71 L11 71 Z"],
  cap: ["M24 60 Q26 30 50 30 Q74 30 76 60 Z", "M48 58 L90 60 Q87 68 48 65 Z"],
  beanie: ["M28 64 Q28 24 50 24 Q72 24 72 64 Z", "M25 60 L75 60 L75 74 L25 74 Z"],
  bag: ["M26 42 L74 42 L78 88 L22 88 Z", "M38 42 Q38 20 50 20 Q62 20 62 42 L58 42 Q58 25 50 25 Q42 25 42 42 Z"],
  ring: ["M50 28 A22 22 0 1 0 50.01 28 Z M50 36 A14 14 0 1 1 49.99 36 Z", "M42 18 L58 18 L60 30 L40 30 Z"],
};

function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

export function ProductArt({
  type,
  tone,
  label,
  variant = 0,
  className,
}: {
  type: ProductType;
  tone: string;
  label?: string;
  /** Shifts the composition slightly so gallery thumbnails look different. */
  variant?: number;
  className?: string;
}) {
  const light = isLight(tone);
  const shape = SHAPE_BY_TYPE[type];
  const scale = [1, 1.25, 0.85, 1.1, 0.95][variant % 5];
  const rotate = [0, -8, 6, 0, -4][variant % 5];

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ backgroundColor: tone }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(${light ? "#000" : "#fff"} 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }}
      />
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="relative h-3/4 w-3/4 drop-shadow-sm"
        style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
      >
        {PATHS[shape].map((d, i) => (
          <path
            key={i}
            d={d}
            fillRule="evenodd"
            fill={light ? "rgba(17,17,17,0.82)" : "rgba(250,248,244,0.9)"}
          />
        ))}
      </svg>
    </div>
  );
}
