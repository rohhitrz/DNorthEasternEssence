import ProductCard, { ProductCardSkeleton } from "@/components/product/ProductCard";
import type { ProductCardData } from "@/types";

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
	if (products.length === 0) {
		return (
			<div className="rounded-xl border border-border bg-card p-10 text-center">
				<h3 className="font-heading text-2xl">No products found</h3>
				<p className="mt-2 text-sm text-muted-foreground">Try changing filters or check back soon.</p>
			</div>
		);
	}

	return (
		<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</section>
	);
}

export function ProductGridSkeleton() {
	return (
		<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, idx) => (
				<ProductCardSkeleton key={idx} />
			))}
		</section>
	);
}
