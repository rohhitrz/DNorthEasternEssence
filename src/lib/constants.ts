// ── Brand Constants ─────────────────────────────────

export const BRAND_NAME = "DNorthEasternEssence";
export const BRAND_TAGLINE = "Pure Natural Essence from Assam";
export const BRAND_DESCRIPTION =
  "DNorthEasternEssence crafts pure natural perfume, attar, and deodorants inspired by Assam's botanical heritage.";

// ── Navigation ──────────────────────────────────────

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "History", href: "/history" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "Deodorants", href: "/shop?category=BAKHOOR" },
    { label: "Attar", href: "/shop?category=OUD_OIL" },
    { label: "Perfume", href: "/shop?category=PERFUME_BLEND" },
    { label: "Bestsellers", href: "/shop?featured=true" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our History", href: "/history" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ],
} as const;

// ── Categories ──────────────────────────────────────

export const CATEGORIES = [
  {
    value: "BAKHOOR" as const,
    label: "Deodorants",
    description: "Pure natural deodorants crafted for clean, long-lasting freshness",
  },
  {
    value: "OUD_OIL" as const,
    label: "Attar",
    description: "Traditional natural attars with rich, skin-friendly aroma",
  },
  {
    value: "PERFUME_BLEND" as const,
    label: "Perfume",
    description: "Pure natural perfume blends inspired by Assam's essence culture",
  },
] as const;

// ── Currency ────────────────────────────────────────

export const CURRENCIES = {
  INR: { symbol: "₹", code: "INR", label: "Indian Rupee" },
  USD: { symbol: "$", code: "USD", label: "US Dollar" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

// INR to USD approximate conversion rate
export const EXCHANGE_RATE_INR_TO_USD = 0.012;

// ── Shipping ────────────────────────────────────────

export const FREE_SHIPPING_THRESHOLD_INR = 1500;
export const SHIPPING_COST_INR = 99;
export const FREE_SHIPPING_THRESHOLD_USD = 50;
export const SHIPPING_COST_USD = 5;

// ── COD ─────────────────────────────────────────────

export const COD_ALLOWED_COUNTRIES = ["IN"];

// ── Pagination ──────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// ── Social Links ────────────────────────────────────

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/dnortheasternessence", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com/dnortheasternessence", icon: "facebook" },
  { label: "Twitter", href: "https://twitter.com/dnortheasternessence", icon: "twitter" },
  { label: "Pinterest", href: "https://pinterest.com/dnortheasternessence", icon: "pinterest" },
] as const;

// ── Local Product Images ───────────────────────────

export const PRODUCT_LOCAL_IMAGES = [
  "/image/DnortheasternPerfume.png",
  "/image/DnortheasternDeo.png",
  "/image/DnortheasternAttar.png",
  "/image/DnortheasterEssence1.png",
  "/image/DnortheasterEssence2.png",
  "/image/DnortheasternEssence3.png",
  "/image/DnorthEasternEssence4.png",
  "/image/DnorthEasternEssence5.png",
  "/image/DnortheasternEssence6.png",
] as const;

export const PRODUCT_CATALOG_SLUG_ORDER = [
  "noir-oud-perfume-blend",
  "Assam Pure Perfume Oud",
  "royal-hindi-bakhoor-chips",
  "cambodian-bakhoor-reserve",
  "white-ash-bakhoor-blend",
  "cambodi-classic-oud-attar",
  "malay-oud-signature-oil",
  "rose-oud-velvet",
  "amber-smoke-elixir",
] as const;
