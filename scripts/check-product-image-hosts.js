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
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const prisma = new PrismaClient();
const allowedHosts = new Set(["images.unsplash.com", "images.pexels.com", "res.cloudinary.com"]);

(async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, images: true },
  });

  const violations = [];

  for (const product of products) {
    for (const src of product.images) {
      try {
        const host = new URL(src).hostname;
        if (!allowedHosts.has(host)) {
          violations.push({ slug: product.slug, host, src });
        }
      } catch {
        violations.push({ slug: product.slug, host: "INVALID_URL", src });
      }
    }
  }

  if (violations.length === 0) {
    console.log("All active product image hosts are valid.");
  } else {
    console.log("Found disallowed product image hosts:");
    for (const v of violations) {
      console.log(`- ${v.slug}: ${v.host} -> ${v.src}`);
    }
  }

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
