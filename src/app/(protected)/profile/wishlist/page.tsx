"use client";

import EmptyState from "@/components/common/EmptyState";
import WishlistItem from "@/components/profile/WishlistItem";
import { useWishlist } from "@/hooks/useWishlist";

export default function Page() {
	const { items, loading } = useWishlist();

	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
			<h1 className="font-heading text-4xl">My Wishlist</h1>
			<div className="mt-6 space-y-3">
				{loading ? <p className="text-sm text-muted-foreground">Loading wishlist...</p> : null}
				{!loading && items.length === 0 ? <EmptyState title="Wishlist is empty" ctaLabel="Explore Collection" ctaHref="/shop" /> : null}
				{items.map((item) => (
					<WishlistItem
						key={item.id}
						product={{
							slug: item.product.slug,
							name: item.product.name,
							images: item.product.images,
							basePrice: Number(item.product.basePrice),
						}}
					/>
				))}
			</div>
		</main>
	);
}
