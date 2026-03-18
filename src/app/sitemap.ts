import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, priority: 1.0 },
    { url: `${BASE_URL}/shop`, priority: 0.9 },
    { url: `${BASE_URL}/about`, priority: 0.5 },
    { url: `${BASE_URL}/history`, priority: 0.5 },
    { url: `${BASE_URL}/blog`, priority: 0.5 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
    { url: `${BASE_URL}/faq`, priority: 0.5 },
  ];

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/shop/${product.slug}`,
      lastModified: product.updatedAt,
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
