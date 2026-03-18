import ProductGrid from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

export default function FeaturedProducts({ products }: { products: ProductCardData[] }) {
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
			<p className="font-accent text-2xl text-primary">Curated Selection</p>
			<h2 className="mt-1 font-heading text-4xl">Featured Products</h2>
			<div className="mt-6">
				<ProductGrid products={products} />
			</div>
		</section>
	);
}
