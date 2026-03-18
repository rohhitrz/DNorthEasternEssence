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

(async () => {
  const products = await prisma.product.findMany({
    select: { slug: true, images: true },
    orderBy: { slug: "asc" },
  });

  console.log("Image URL audit:");
  for (const product of products) {
    for (const src of product.images) {
      let host = "INVALID";
      let query = "";
      try {
        const u = new URL(src);
        host = u.hostname;
        query = u.search;
      } catch {
        // keep invalid
      }
      console.log(`- ${product.slug} | ${host} | ${src}`);
      if (query.includes("to=") || query.includes("undefined") || src.includes(" ")) {
        console.log(`  suspicious-query: ${query}`);
      }
    }
  }

  await prisma.$disconnect();
})().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
