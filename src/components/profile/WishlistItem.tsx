"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { normalizeImageSrc } from "@/lib/utils";

export default function WishlistItem({
	product,
}: {
	product: { slug: string; name: string; images: string[]; basePrice: number };
}) {
	const [imageSrc, setImageSrc] = useState(product.images[0] || "/placeholder-product.svg");
	const safeImageSrc = normalizeImageSrc(imageSrc);

	return (
		<Link href={`/shop/${product.slug}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
			<div className="relative h-16 w-16 overflow-hidden rounded-md">
				<Image src={safeImageSrc} alt={product.name} fill className="object-cover" sizes="64px" onError={() => setImageSrc("/placeholder-product.svg")} />
			</div>
			<div>
				<p className="font-medium">{product.name}</p>
				<p className="text-sm text-primary"><CurrencyDisplay amountInINR={product.basePrice} /></p>
			</div>
		</Link>
	);
}
