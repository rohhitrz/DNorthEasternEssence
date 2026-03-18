const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const idx = line.indexOf("=");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Check .env.local or .env");
  process.exit(1);
}

const prisma = new PrismaClient();

const products = [
  {
    name: "Northeastern Attar Reserve",
    slug: "royal-hindi-bakhoor-chips",
    description:
      "Traditional Assamese attar crafted from premium aromatic oils with a warm floral-woody dry-down and long-lasting skin scent.",
    shortDescription: "Traditional attar with warm floral-woody character.",
    category: "OUD_OIL",
    basePrice: 2499,
    compareAtPrice: 2999,
    stock: 42,
    isFeatured: true,
    origin: "Assam, India",
    grade: "Reserve",
    scentNotes: "Amber, floral resin, soft wood",
    images: ["/image/DnortheasternAttar.png"],
  },
  {
    name: "Northeastern Essence I",
    slug: "cambodian-bakhoor-reserve",
    description:
      "A deep aromatic essence blend balancing smoky oud facets with a smooth amber base, designed for evening wear.",
    shortDescription: "Smoky oud essence with smooth amber finish.",
    category: "BAKHOOR",
    basePrice: 3199,
    compareAtPrice: 3799,
    stock: 28,
    isFeatured: false,
    origin: "Cambodia",
    grade: "Premium",
    scentNotes: "Smoked wood, amber, balsam",
    images: ["/image/DnortheasterEssence1.png"],
  },
  {
    name: "Northeastern Essence II",
    slug: "white-ash-bakhoor-blend",
    description:
      "Refined natural essence featuring clean projection, subtle sweetness, and a comforting woody trail.",
    shortDescription: "Clean woody essence with subtle sweetness.",
    category: "BAKHOOR",
    basePrice: 1899,
    compareAtPrice: 2299,
    stock: 65,
    isFeatured: false,
    origin: "UAE",
    grade: "Fine",
    scentNotes: "Soft oud, cedar, vanilla",
    images: ["/image/DnortheasterEssence2.png"],
  },
  {
    name: "Northeastern Pure Deo - Mountain Moss & Juniper",
    slug: "Assam Pure Perfume Oud",
    description:
      "100% natural deodorant with mountain moss and juniper accords, built for all-day freshness without harsh chemicals.",
    shortDescription: "Natural deodorant with mountain moss and juniper.",
    category: "PERFUME_BLEND",
    basePrice: 8999,
    compareAtPrice: 9999,
    stock: 19,
    isFeatured: true,
    origin: "Assam, India",
    grade: "Pure",
    scentNotes: "Mountain moss, juniper, green wood",
    images: ["/image/DnortheasternDeo.png"],
  },
  {
    name: "Northeastern Essence III",
    slug: "cambodi-classic-oud-attar",
    description:
      "Elegant essence composition with smooth woods and aromatic spice, ideal for premium daily wear.",
    shortDescription: "Elegant woody-spice essence for daily wear.",
    category: "OUD_OIL",
    basePrice: 5499,
    compareAtPrice: 6499,
    stock: 31,
    isFeatured: false,
    origin: "Cambodia",
    grade: "Premium",
    scentNotes: "Warm spice, oud, amber",
    images: ["/image/DnortheasternEssence3.png"],
  },
  {
    name: "Northeastern Essence IV",
    slug: "malay-oud-signature-oil",
    description:
      "A signature essence with balanced woody-floral lift and graceful persistence on skin and fabrics.",
    shortDescription: "Balanced woody-floral signature essence.",
    category: "OUD_OIL",
    basePrice: 6799,
    compareAtPrice: 7599,
    stock: 24,
    isFeatured: false,
    origin: "Malaysia",
    grade: "Select",
    scentNotes: "Woody floral, moss, resin",
    images: ["/image/DnorthEasternEssence4.png"],
  },
  {
    name: "Northeastern Perfume - Forest Moss & Pine",
    slug: "noir-oud-perfume-blend",
    description:
      "Oil-based natural perfume with forest moss and pine notes, handcrafted for a crisp woody aroma and premium projection.",
    shortDescription: "Oil-based natural perfume with forest moss and pine.",
    category: "PERFUME_BLEND",
    basePrice: 4299,
    compareAtPrice: 4999,
    stock: 54,
    isFeatured: true,
    origin: "Assam, India",
    grade: "Luxury",
    scentNotes: "Forest moss, pine, warm woods",
    images: ["/image/DnortheasternPerfume.png"],
  },
  {
    name: "Northeastern Essence V",
    slug: "rose-oud-velvet",
    description:
      "A rich essence profile with velvety floral top notes and an earthy woody base for long wear.",
    shortDescription: "Velvety floral essence with earthy woody base.",
    category: "PERFUME_BLEND",
    basePrice: 3899,
    compareAtPrice: 4599,
    stock: 47,
    isFeatured: false,
    origin: "Turkey / India",
    grade: "Premium",
    scentNotes: "Floral wood, musk, amber",
    images: ["/image/DnorthEasternEssence5.png"],
  },
  {
    name: "Northeastern Essence VI",
    slug: "amber-smoke-elixir",
    description:
      "Bold essence blend with warm amber body and smoky undertones, crafted for strong projection and longevity.",
    shortDescription: "Bold amber-smoky essence with strong projection.",
    category: "PERFUME_BLEND",
    basePrice: 4599,
    compareAtPrice: 5299,
    stock: 33,
    isFeatured: false,
    origin: "UAE",
    grade: "Signature",
    scentNotes: "Amber, smoke, resin, tonka",
    images: ["/image/DnortheasternEssence6.png"],
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        category: p.category,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        isActive: true,
        isFeatured: p.isFeatured,
        origin: p.origin,
        grade: p.grade,
        scentNotes: p.scentNotes,
        images: p.images,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        category: p.category,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        isActive: true,
        isFeatured: p.isFeatured,
        origin: p.origin,
        grade: p.grade,
        scentNotes: p.scentNotes,
        images: p.images,
      },
    });
  }

  const catalogSlugs = products.map((p) => p.slug);
  await prisma.product.updateMany({
    where: {
      slug: { notIn: catalogSlugs },
    },
    data: { isActive: false },
  });

  const grouped = await prisma.product.groupBy({
    by: ["category"],
    _count: { _all: true },
    where: { isActive: true },
  });

  console.log("Seed complete. Active product counts by category:");
  for (const row of grouped) {
    console.log(`- ${row.category}: ${row._count._all}`);
  }

  const total = await prisma.product.count({ where: { isActive: true } });
  console.log(`Total active products: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
