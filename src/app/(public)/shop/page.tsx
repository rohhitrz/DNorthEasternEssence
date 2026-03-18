import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/product/ProductGrid";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATALOG_SLUG_ORDER, PRODUCT_LOCAL_IMAGES } from "@/lib/constants";

export default async function Page({
	searchParams,
}: {
	searchParams?: { page?: string; limit?: string };
}) {
	const limit = Math.min(Number(searchParams?.limit || 12), 24);
	const page = Math.max(Number(searchParams?.page || 1), 1);
	const skip = (page - 1) * limit;

	const products = await prisma.product.findMany({
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

	const orderedProducts = PRODUCT_CATALOG_SLUG_ORDER
		.map((slug) => products.find((product) => product.slug === slug))
		.filter((product): product is NonNullable<typeof product> => Boolean(product));

	const pagedProducts = orderedProducts.slice(skip, skip + limit);

	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
				<div className="mb-8">
					<p className="font-accent text-2xl text-primary">Collection</p>
					<h1 className="font-heading text-4xl">Shop Pure Natural Perfume, Attar & Deodorants</h1>
				</div>
				<ProductGrid
					products={pagedProducts.map((product, index) => ({
						...product,
						images: [PRODUCT_LOCAL_IMAGES[(skip + index) % PRODUCT_LOCAL_IMAGES.length]],
						basePrice: Number(product.basePrice),
						compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
					}))}
				/>
			</main>
			<Footer />
		</>
	);
}
