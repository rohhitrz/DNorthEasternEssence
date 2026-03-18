export type ProductCardData = {
	id: string;
	slug: string;
	name: string;
	category: "BAKHOOR" | "OUD_OIL" | "PERFUME_BLEND";
	basePrice: number;
	compareAtPrice?: number | null;
	images: string[];
	isFeatured?: boolean;
	origin?: string | null;
};
