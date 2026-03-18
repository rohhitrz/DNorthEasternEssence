import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import USPSection from "@/components/home/USPSection";
import Testimonials from "@/components/home/Testimonials";
import HistoryTeaser from "@/components/home/HistoryTeaser";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATALOG_SLUG_ORDER, PRODUCT_LOCAL_IMAGES } from "@/lib/constants";

export default async function Page() {
	const catalogProducts = await prisma.product.findMany({
		where: {
			isActive: true,
			slug: { in: [...PRODUCT_CATALOG_SLUG_ORDER] },
		},
		select: {
			id: true,
			slug: true,
			name: true,
			category: true,
			basePrice: true,
			compareAtPrice: true,
			images: true,
			isFeatured: true,
			origin: true,
		},
	});

	const orderedCatalog = PRODUCT_CATALOG_SLUG_ORDER
		.map((slug) => catalogProducts.find((product) => product.slug === slug))
		.filter((product): product is NonNullable<typeof product> => Boolean(product));

	const featuredProducts = orderedCatalog.slice(0, 3);

	return (
		<>
			<Navbar />
			<main>
				<Hero />
				<CategorySection />
				<FeaturedProducts
					products={featuredProducts.map((product, index) => ({
						...product,
						images: [PRODUCT_LOCAL_IMAGES[index]],
						basePrice: Number(product.basePrice),
						compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
					}))}
				/>
				<USPSection />
				<Testimonials />
				<HistoryTeaser />
				<NewsletterSignup />
			</main>
			<Footer />
		</>
	);
}
