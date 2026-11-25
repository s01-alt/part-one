import { brands } from "@/lib/mock/brands";
import type {
  Color,
  Product,
  ProductComment,
  ProductType,
  Review,
  StyleTag,
} from "@/lib/types";

/**
 * MOCK DATA — fictional products for UI development only.
 * Replaced by GET /v1/products once the backend exists.
 */

const C = {
  black: { name: "Black", hex: "#111111" },
  white: { name: "White", hex: "#F5F3EE" },
  cream: { name: "Cream", hex: "#E9DFC9" },
  sand: { name: "Sand", hex: "#C9B48E" },
  olive: { name: "Olive", hex: "#5C6342" },
  brown: { name: "Brown", hex: "#6B4A33" },
  grey: { name: "Washed Grey", hex: "#8C8C88" },
  navy: { name: "Navy", hex: "#1F2A44" },
  blue: { name: "Denim Blue", hex: "#4A6A93" },
  babyBlue: { name: "Baby Blue", hex: "#A9C3E6" },
  pink: { name: "Pink", hex: "#E8A6B8" },
  orange: { name: "Orange", hex: "#E0612F" },
  yellow: { name: "Danfo Yellow", hex: "#F2C230" },
  silver: { name: "Silver", hex: "#C0C4C8" },
} satisfies Record<string, Color>;

const APPAREL = ["S", "M", "L", "XL", "XXL"];
const WAIST = ["28", "30", "32", "34", "36"];
const SHOES = ["40", "41", "42", "43", "44", "45"];
const ONE = ["One size"];

interface Seed {
  slug: string;
  brandId: string;
  name: string;
  type: ProductType;
  styles: StyleTag[];
  priceNaira: number;
  colors: Color[];
  sizes: string[];
  material: string;
  description: string;
  createdAt: string;
  imageCount?: number;
  collectionIds?: string[];
}

const seeds: Seed[] = [
  { slug: "conductor-heavyweight-tee", brandId: "brd_danfo", name: "Conductor Heavyweight Tee", type: "t-shirt", styles: ["minimalist", "baggy"], priceNaira: 18000, colors: [C.black, C.white, C.yellow], sizes: APPAREL, material: "100% cotton, 280gsm", description: "Boxy, dropped-shoulder tee in a dense 280gsm cotton that holds its shape wash after wash.", createdAt: "2026-11-18T09:00:00Z", imageCount: 4, collectionIds: ["col_danfo_core"] },
  { slug: "danfo-stripe-cargo", brandId: "brd_danfo", name: "Danfo Stripe Cargo Pants", type: "cargo-pants", styles: ["utility", "baggy"], priceNaira: 42000, colors: [C.black, C.olive], sizes: WAIST, material: "Cotton ripstop", description: "Wide-leg ripstop cargos with the signature yellow-and-black side stripe and six utility pockets.", createdAt: "2026-11-10T09:00:00Z", imageCount: 5, collectionIds: ["col_danfo_conductor"] },
  { slug: "route-12-hoodie", brandId: "brd_danfo", name: "Route 12 Hoodie", type: "hoodie", styles: ["baggy", "graphic"], priceNaira: 38000, colors: [C.grey, C.black], sizes: APPAREL, material: "Brushed fleece, 400gsm", description: "Oversized fleece hoodie with a puff-print route map across the back.", createdAt: "2026-10-28T09:00:00Z", imageCount: 3, collectionIds: ["col_danfo_core"] },
  { slug: "conductor-cap", brandId: "brd_danfo", name: "Conductor Cap", type: "cap", styles: ["utility"], priceNaira: 12000, colors: [C.yellow, C.black], sizes: ONE, material: "Cotton twill", description: "Six-panel twill cap with an embroidered bus number.", createdAt: "2026-09-20T09:00:00Z", imageCount: 2, collectionIds: ["col_danfo_conductor"] },

  { slug: "dune-linen-shirt", brandId: "brd_harmattan", name: "Dune Linen Shirt", type: "shirt", styles: ["minimalist"], priceNaira: 35000, colors: [C.sand, C.white], sizes: APPAREL, material: "100% linen", description: "Relaxed camp-collar shirt in washed linen. Breathes in Abuja heat.", createdAt: "2026-11-20T09:00:00Z", imageCount: 4 },
  { slug: "dust-pleated-trouser", brandId: "brd_harmattan", name: "Dust Pleated Trouser", type: "trousers", styles: ["minimalist", "luxury"], priceNaira: 46000, colors: [C.brown, C.cream], sizes: WAIST, material: "Wool-blend twill", description: "Double-pleated wide trousers with a clean drape and side adjusters.", createdAt: "2026-11-05T09:00:00Z", imageCount: 3 },
  { slug: "harmattan-crewneck", brandId: "brd_harmattan", name: "Harmattan Crewneck", type: "sweatshirt", styles: ["minimalist"], priceNaira: 30000, colors: [C.cream, C.olive, C.navy], sizes: APPAREL, material: "Loopback cotton", description: "Garment-dyed crewneck with a tonal chest embroidery.", createdAt: "2026-08-15T09:00:00Z", imageCount: 2 },

  { slug: "poster-boy-tee", brandId: "brd_yaba", name: "Poster Boy Tee", type: "t-shirt", styles: ["graphic", "vintage"], priceNaira: 16500, colors: [C.grey, C.black], sizes: APPAREL, material: "Cotton jersey, pigment-dyed", description: "Pigment-dyed tee with a cracked print taken from a 1980s Lagos concert poster.", createdAt: "2026-11-21T09:00:00Z", imageCount: 3, collectionIds: ["col_yaba_posters"] },
  { slug: "reworked-carpenter-jeans", brandId: "brd_yaba", name: "Reworked Carpenter Jeans", type: "jeans", styles: ["vintage", "baggy"], priceNaira: 52000, colors: [C.blue], sizes: WAIST, material: "Reclaimed 14oz denim", description: "Each pair reworked from deadstock denim — no two washes are the same.", createdAt: "2026-10-12T09:00:00Z", imageCount: 5 },
  { slug: "highlife-vinyl-tee", brandId: "brd_yaba", name: "Highlife Vinyl Tee", type: "t-shirt", styles: ["graphic", "vintage"], priceNaira: 16500, colors: [C.cream, C.black], sizes: APPAREL, material: "Cotton jersey", description: "Faded album-sleeve graphic printed with water-based inks.", createdAt: "2026-09-02T09:00:00Z", imageCount: 2, collectionIds: ["col_yaba_posters"] },
  { slug: "archive-denim-jacket", brandId: "brd_yaba", name: "Archive Denim Jacket", type: "jacket", styles: ["vintage"], priceNaira: 61000, colors: [C.blue, C.black], sizes: APPAREL, material: "Reclaimed denim", description: "Trucker jacket with patchwork panels and hand-distressed edges.", createdAt: "2026-07-25T09:00:00Z", imageCount: 4 },

  { slug: "chrome-baby-tee", brandId: "brd_eko", name: "Chrome Baby Tee", type: "t-shirt", styles: ["y2k", "graphic"], priceNaira: 14000, colors: [C.babyBlue, C.pink, C.white], sizes: ["XS", "S", "M", "L"], material: "Cotton-elastane rib", description: "Cropped fitted tee with a metallic chrome logo.", createdAt: "2026-11-22T09:00:00Z", imageCount: 3, collectionIds: ["col_eko_chrome"] },
  { slug: "low-rise-parachute-cargo", brandId: "brd_eko", name: "Low-Rise Parachute Cargo", type: "cargo-pants", styles: ["y2k", "baggy"], priceNaira: 39000, colors: [C.silver, C.black], sizes: WAIST, material: "Nylon taslan", description: "Swishy parachute pants with toggle hems and a low-rise fit.", createdAt: "2026-11-01T09:00:00Z", imageCount: 4, collectionIds: ["col_eko_chrome"] },
  { slug: "vi-nights-zip-hoodie", brandId: "brd_eko", name: "VI Nights Zip Hoodie", type: "hoodie", styles: ["y2k"], priceNaira: 41000, colors: [C.pink, C.grey], sizes: APPAREL, material: "Cotton fleece", description: "Fitted double-zip hoodie with rhinestone script.", createdAt: "2026-10-03T09:00:00Z", imageCount: 3 },
  { slug: "static-shades-beanie", brandId: "brd_eko", name: "Static Beanie", type: "beanie", styles: ["y2k", "grunge"], priceNaira: 9500, colors: [C.babyBlue, C.black], sizes: ONE, material: "Acrylic knit", description: "Skull-fit beanie with a woven chrome label.", createdAt: "2026-08-08T09:00:00Z", imageCount: 1 },

  { slug: "pit-lane-track-jacket", brandId: "brd_okada", name: "Pit Lane Track Jacket", type: "jacket", styles: ["athleisure"], priceNaira: 48000, colors: [C.orange, C.black], sizes: APPAREL, material: "Recycled poly tricot", description: "Moto-inspired track jacket with reflective piping and a stand collar.", createdAt: "2026-11-15T09:00:00Z", imageCount: 4 },
  { slug: "throttle-joggers", brandId: "brd_okada", name: "Throttle Joggers", type: "joggers", styles: ["athleisure"], priceNaira: 32000, colors: [C.black, C.grey], sizes: APPAREL, material: "Technical stretch", description: "Tapered joggers with zip ankles and a hidden phone pocket.", createdAt: "2026-10-20T09:00:00Z", imageCount: 3 },
  { slug: "dispatch-runner", brandId: "brd_okada", name: "Dispatch Runner", type: "sneakers", styles: ["athleisure", "y2k"], priceNaira: 78000, colors: [C.white, C.orange], sizes: SHOES, material: "Mesh and suede", description: "Chunky runner with a moulded sole and orange heel tab.", createdAt: "2026-09-28T09:00:00Z", imageCount: 5 },

  { slug: "market-day-chore-jacket", brandId: "brd_oja", name: "Market Day Chore Jacket", type: "jacket", styles: ["utility", "vintage"], priceNaira: 58000, colors: [C.olive, C.brown], sizes: APPAREL, material: "Cotton canvas, aso-oke trim", description: "Canvas chore coat with hand-woven aso-oke collar and pocket flaps.", createdAt: "2026-11-12T09:00:00Z", imageCount: 4, collectionIds: ["col_oja_market"] },
  { slug: "carpenter-work-pant", brandId: "brd_oja", name: "Carpenter Work Pant", type: "trousers", styles: ["utility", "baggy"], priceNaira: 40000, colors: [C.sand, C.black], sizes: WAIST, material: "12oz duck canvas", description: "Double-knee carpenter pants with a hammer loop.", createdAt: "2026-09-10T09:00:00Z", imageCount: 3, collectionIds: ["col_oja_market"] },
  { slug: "oja-tote", brandId: "brd_oja", name: "Oja Tote", type: "bag", styles: ["utility"], priceNaira: 15000, colors: [C.cream, C.olive], sizes: ONE, material: "Heavy canvas", description: "Oversized market tote with an inner zip pocket.", createdAt: "2026-07-18T09:00:00Z", imageCount: 2 },

  { slug: "acid-wash-flannel", brandId: "brd_coal", name: "Acid Wash Flannel", type: "shirt", styles: ["grunge", "baggy"], priceNaira: 29000, colors: [C.grey, C.brown], sizes: APPAREL, material: "Brushed cotton flannel", description: "Oversized flannel with an uneven acid wash.", createdAt: "2026-11-08T09:00:00Z", imageCount: 3 },
  { slug: "distressed-knit-sweater", brandId: "brd_coal", name: "Distressed Knit Sweater", type: "sweatshirt", styles: ["grunge"], priceNaira: 36000, colors: [C.black, C.olive], sizes: APPAREL, material: "Cotton-mohair blend", description: "Loose-gauge knit with hand-pulled holes at the hem and cuffs.", createdAt: "2026-10-16T09:00:00Z", imageCount: 2 },
  { slug: "coal-dust-shorts", brandId: "brd_coal", name: "Coal Dust Jorts", type: "shorts", styles: ["grunge", "baggy"], priceNaira: 24000, colors: [C.black, C.blue], sizes: WAIST, material: "Washed denim", description: "Long, wide denim shorts with raw hems.", createdAt: "2026-09-05T09:00:00Z", imageCount: 2 },

  { slug: "monogram-heavy-tee", brandId: "brd_ivory", name: "Monogram Heavy Tee", type: "t-shirt", styles: ["luxury", "minimalist"], priceNaira: 45000, colors: [C.white, C.black], sizes: APPAREL, material: "Supima cotton, 300gsm", description: "Premium heavyweight tee with a tonal embroidered monogram.", createdAt: "2026-11-19T09:00:00Z", imageCount: 4, collectionIds: ["col_ivory_mono"] },
  { slug: "tailored-wide-trouser", brandId: "brd_ivory", name: "Tailored Wide Trouser", type: "trousers", styles: ["luxury"], priceNaira: 85000, colors: [C.cream, C.black], sizes: WAIST, material: "Italian wool", description: "High-waisted tailored trouser with a pressed crease.", createdAt: "2026-10-25T09:00:00Z", imageCount: 3 },
  { slug: "club-varsity-jacket", brandId: "brd_ivory", name: "Club Varsity Jacket", type: "jacket", styles: ["luxury", "vintage"], priceNaira: 145000, colors: [C.navy, C.cream], sizes: APPAREL, material: "Wool body, leather sleeves", description: "Varsity jacket with chenille crest and leather sleeves.", createdAt: "2026-10-09T09:00:00Z", imageCount: 5, collectionIds: ["col_ivory_mono"] },
  { slug: "signet-ring", brandId: "brd_ivory", name: "Signet Ring", type: "accessory", styles: ["luxury"], priceNaira: 55000, colors: [C.silver], sizes: ["7", "8", "9", "10"], material: "925 sterling silver", description: "Engraved signet ring, hand-finished in Lagos.", createdAt: "2026-08-21T09:00:00Z", imageCount: 2 },
];

/** Deterministic pseudo-random so mock data is stable across renders and builds. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function buildProduct(seed: Seed, index: number): Product {
  const h = hash(seed.slug);
  const variants = seed.colors.flatMap((color) =>
    seed.sizes.map((size) => {
      const vh = hash(`${seed.slug}-${color.name}-${size}`);
      // ~20% of variants are sold out to exercise the UI.
      const stock = vh % 5 === 0 ? 0 : (vh % 14) + 1;
      return {
        id: `var_${seed.slug}_${color.name}_${size}`.replace(/\s+/g, "-").toLowerCase(),
        sku: `${seed.slug.slice(0, 6).toUpperCase()}-${color.name.slice(0, 3).toUpperCase()}-${size}`,
        size,
        color,
        stock,
        price: null,
      };
    }),
  );
  const imageCount = Math.min(seed.imageCount ?? 1, 5);
  const ratingCount = (h % 90) + 3;
  const ratingAvg = Math.round((3.6 + (h % 14) / 10) * 10) / 10;

  return {
    id: `prd_${index + 1}`,
    slug: seed.slug,
    brandId: seed.brandId,
    name: seed.name,
    description: seed.description,
    type: seed.type,
    styles: seed.styles,
    material: seed.material,
    careInstructions: "Cold wash inside out. Do not tumble dry. Iron on reverse.",
    price: seed.priceNaira * 100,
    images: Array.from({ length: imageCount }, (_, i) => ({
      id: `img_${seed.slug}_${i}`,
      url: null,
      alt: `${seed.name} — view ${i + 1}`,
    })),
    variants,
    status: "active",
    tone: seed.colors[0].hex,
    ratingAvg: Math.min(ratingAvg, 5),
    ratingCount,
    counts: {
      likes: (h % 1800) + 40,
      saves: (h % 600) + 12,
      reposts: (h % 220) + 3,
      shares: (h % 150) + 2,
      comments: (h % 60) + 1,
    },
    collectionIds: seed.collectionIds ?? [],
    createdAt: seed.createdAt,
  };
}

export const products: Product[] = seeds.map(buildProduct);

// ---------------------------------------------------------------------------
// Reviews and comments
// ---------------------------------------------------------------------------

const reviewers = ["Tobi A.", "Chiamaka O.", "Ifeanyi N.", "Aisha B.", "Seun K.", "Zainab M.", "Emeka U.", "Bisola F."];
const reviewBodies = [
  "Fit is exactly as described — boxy without being a tent. Quality is serious for the price.",
  "Arrived in three days in Lagos. Fabric is thick and the colour matches the photos.",
  "Love it. Sized up one and it's perfect oversized.",
  "Good piece but the sizing runs a bit small. Order one size up.",
  "Stitching is clean, print hasn't cracked after five washes.",
  "Took a little long to ship but the brand kept me updated. Worth it.",
];
const commentBodies = [
  "Does the black fade after washing?",
  "Need this in XXL 🙏🏾",
  "This colourway is crazy",
  "Restock when?",
  "Copped last week, quality is mad",
  "How's the fit for someone 6ft?",
];

export const reviews: Review[] = products.flatMap((p) => {
  const h = hash(p.slug + "rev");
  const n = (h % 4) + 1;
  return Array.from({ length: n }, (_, i) => {
    const v = p.variants[(h + i) % p.variants.length];
    return {
      id: `rev_${p.id}_${i}`,
      productId: p.id,
      authorName: reviewers[(h + i) % reviewers.length],
      rating: (5 - ((h + i) % 3 === 0 ? 1 : 0)) as Review["rating"],
      body: reviewBodies[(h + i) % reviewBodies.length],
      variantLabel: `${v.color.name} / ${v.size}`,
      createdAt: "2026-11-1" + ((h + i) % 9) + "T12:00:00Z",
    };
  });
});

export const comments: ProductComment[] = products.flatMap((p) => {
  const h = hash(p.slug + "com");
  const n = (h % 4) + 1;
  return Array.from({ length: n }, (_, i) => ({
    id: `com_${p.id}_${i}`,
    productId: p.id,
    authorName: reviewers[(h + i + 3) % reviewers.length],
    body: commentBodies[(h + i) % commentBodies.length],
    createdAt: "2026-11-2" + ((h + i) % 4) + "T18:00:00Z",
  }));
});

// Keep counts consistent with the mock reviews/comments actually listed on the page.
for (const p of products) {
  const pr = reviews.filter((r) => r.productId === p.id);
  p.ratingCount = pr.length;
  p.ratingAvg = pr.length ? Math.round((pr.reduce((n, r) => n + r.rating, 0) / pr.length) * 10) / 10 : 0;
  p.counts.comments = comments.filter((c) => c.productId === p.id).length;
}

// Brand rating is derived from its products' reviews (PRD §18: no separate seller rating).
for (const b of brands) {
  const br = reviews.filter((r) => products.find((p) => p.id === r.productId)?.brandId === b.id);
  b.ratingCount = br.length;
  b.ratingAvg = br.length ? Math.round((br.reduce((n, r) => n + r.rating, 0) / br.length) * 10) / 10 : 0;
}
