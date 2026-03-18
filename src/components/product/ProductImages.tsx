"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, normalizeImageSrc } from "@/lib/utils";

export default function ProductImages({ images }: { images: string[] }) {
	const safeImages = (images.length > 0 ? images : ["/placeholder-product.svg"]).map((src) => normalizeImageSrc(src));
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<div className="space-y-3">
			<div className="relative aspect-square overflow-hidden rounded-xl border border-border">
				<Image src={safeImages[activeIndex]} alt="Product image" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
			</div>
			<div className="grid grid-cols-4 gap-2">
				{safeImages.slice(0, 4).map((image, idx) => (
					<button
						type="button"
						key={`${image}-${idx}`}
						onClick={() => setActiveIndex(idx)}
						className={cn("relative aspect-square overflow-hidden rounded-md border", idx === activeIndex ? "border-primary" : "border-border")}
					>
						<Image src={image} alt={`Product thumbnail ${idx + 1}`} fill className="object-cover" sizes="120px" />
					</button>
				))}
			</div>
		</div>
	);
}
