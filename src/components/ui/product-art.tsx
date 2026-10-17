import { cn } from "@/lib/utils";

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function initials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Deterministic, art-directed placeholder art (no network / no binaries).
 * Rendered as SVG so it scales crisply and inherits the brand palette.
 */
export function ProductArt({
  seed,
  accent = "#c6ff00",
  label,
  sub,
  variant = "product",
  className,
}: {
  seed: string;
  accent?: string;
  label: string;
  sub?: string;
  variant?: "product" | "hero" | "brand";
  className?: string;
}) {
  const h = hash(seed);
  const angle = (h % 4) * 3 - 4;
  const circleX = 120 + (h % 160);
  const circleY = 150 + ((h >> 3) % 180);
  const circleR = variant === "hero" ? 150 : 90 + ((h >> 6) % 40);
  const marks = initials(label);

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${label}${sub ? ` — ${sub}` : ""}`}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b1b20" />
          <stop offset="1" stopColor="#0b0b0c" />
        </linearGradient>
        <pattern
          id={`grid-${seed}`}
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M25 0H0V25"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id={`dots-${seed}`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.6" fill="rgba(255,255,255,0.10)" />
        </pattern>
      </defs>

      <rect width="400" height="500" fill={`url(#bg-${seed})`} />
      <rect width="400" height="500" fill={`url(#grid-${seed})`} />

      <circle
        cx={circleX}
        cy={circleY}
        r={circleR}
        fill={accent}
        opacity={0.16}
      />
      <circle
        cx={circleX}
        cy={circleY}
        r={circleR}
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        opacity={0.7}
      />

      <g transform={`rotate(${angle} 200 250)`}>
        <rect
          x="70"
          y="200"
          width="260"
          height="120"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
      </g>

      <rect width="400" height="500" fill={`url(#dots-${seed})`} />

      <text
        x="200"
        y="270"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontSize={variant === "hero" ? 200 : 150}
        fill="#f4f2ec"
        opacity="0.92"
      >
        {marks}
      </text>

      {sub ? (
        <text
          x="28"
          y="470"
          fontFamily="var(--font-mono), monospace"
          fontSize="13"
          letterSpacing="3"
          fill="rgba(244,242,236,0.6)"
        >
          {sub.toUpperCase()}
        </text>
      ) : null}

      <text
        x="28"
        y="40"
        fontFamily="var(--font-mono), monospace"
        fontSize="12"
        letterSpacing="4"
        fill={accent}
      >
        PART ONE
      </text>
      <text
        x="372"
        y="40"
        textAnchor="end"
        fontFamily="var(--font-mono), monospace"
        fontSize="12"
        letterSpacing="2"
        fill="rgba(244,242,236,0.5)"
      >
        {String(h % 999).padStart(3, "0")}
      </text>
    </svg>
  );
}
