"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { ProductCardData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { useCart } from "@/hooks/useCart";
import { cn, normalizeImageSrc } from "@/lib/utils";

const CATEGORY_LABELS: Record<ProductCardData["category"], string> = {
	BAKHOOR: "Deodorants",
	OUD_OIL: "Attar",
	PERFUME_BLEND: "Perfume",
};

export default function ProductCard({ product }: { product: ProductCardData }) {
	const [liked, setLiked] = useState(false);
	const [wishLoading, setWishLoading] = useState(false);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const { isSignedIn } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const { addItem } = useCart();

	const heroImage =
		normalizeImageSrc(product.images[0]);
	const activeImage = imageSrc || heroImage;

	return (
		<article className="group overflow-hidden rounded-xl border border-border bg-card">
			<div className="relative aspect-square overflow-hidden">
				<Link href={`/shop/${product.slug}`}>
					<Image
						src={activeImage}
						alt={`${product.name} pure natural fragrance product image`}
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
						className="object-cover transition duration-500 group-hover:scale-105"
						onError={() => setImageSrc("/placeholder-product.svg")}
					/>
				</Link>
				<Badge className="absolute top-3 left-3" variant="secondary">
					{CATEGORY_LABELS[product.category]}
				</Badge>
				<Button
					variant="secondary"
					size="icon-sm"
					className="absolute top-3 right-3"
					disabled={wishLoading}
					onClick={async () => {
						if (!isSignedIn) {
							router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname || "/shop")}`);
							return;
						}

						try {
							setWishLoading(true);
							if (!liked) {
								const response = await fetch("/api/wishlist", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ productId: product.id }),
								});

								if (!response.ok) {
									const payload = (await response.json()) as { error?: string };
									throw new Error(payload.error || "Unable to add to wishlist");
								}

								setLiked(true);
								toast.success("Added to wishlist");
							} else {
								const response = await fetch("/api/wishlist", {
									method: "DELETE",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ productId: product.id }),
								});

								if (!response.ok) {
									const payload = (await response.json()) as { error?: string };
									throw new Error(payload.error || "Unable to remove from wishlist");
								}

								setLiked(false);
								toast.success("Removed from wishlist");
							}
						} catch (error) {
							toast.error(error instanceof Error ? error.message : "Wishlist action failed");
						} finally {
							setWishLoading(false);
						}
					}}
					aria-label="Toggle wishlist"
				>
					<Heart className={cn(liked && "fill-current text-primary")} />
				</Button>
			</div>

			<div className="space-y-3 p-4">
				<div className="flex min-w-0 items-start justify-between gap-2">
					<h3 className="min-w-0 truncate font-heading text-lg text-foreground">{product.name}</h3>
					{product.isFeatured && <Badge className="shrink-0">Featured</Badge>}
				</div>

				{product.origin ? <Badge variant="outline">Origin: {product.origin}</Badge> : null}

				<div className="flex items-center gap-2">
					<span className="font-medium text-primary">
						<CurrencyDisplay amountInINR={product.basePrice} />
					</span>
					{product.compareAtPrice ? (
						<span className="text-sm text-muted-foreground line-through">
							<CurrencyDisplay amountInINR={product.compareAtPrice} />
						</span>
					) : null}
				</div>

				<Button
					className="w-full md:translate-y-2 md:opacity-0 md:transition md:group-hover:translate-y-0 md:group-hover:opacity-100"
					onClick={() => {
						if (!isSignedIn) {
							router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname || "/shop")}`);
							return;
						}

						try {
							addItem({
								productId: product.id,
								variantId: null,
								name: product.name,
								image: heroImage,
								price: product.basePrice,
								quantity: 1,
							});
							toast.success("Added to cart");
						} catch (error) {
							toast.error(error instanceof Error ? error.message : "Unable to add to cart");
						}
					}}
				>
					Add to Cart
				</Button>
			</div>
		</article>
	);
}

export function ProductCardSkeleton() {
	return (
		<article className="overflow-hidden rounded-xl border border-border bg-card">
			<div className="aspect-square animate-pulse bg-muted" />
			<div className="space-y-3 p-4">
				<div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
				<div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
				<div className="h-9 w-full animate-pulse rounded bg-muted" />
			</div>
		</article>
	);
}
