"use client";

import { useEffect, useState } from "react";

export type WishlistEntry = {
	id: string;
	product: {
		id: string;
		slug: string;
		name: string;
		images: string[];
		basePrice: string | number;
		compareAtPrice?: string | number | null;
	};
};

export function useWishlist() {
	const [items, setItems] = useState<WishlistEntry[]>([]);
	const [loading, setLoading] = useState(true);

	const refresh = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/wishlist");
			if (response.status === 401 || response.status === 403) {
				setItems([]);
				return;
			}

			if (!response.ok) {
				throw new Error("Unable to load wishlist");
			}

			const payload = (await response.json()) as { items?: WishlistEntry[] };
			setItems(payload.items || []);
		} catch {
			setItems([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void refresh();
	}, []);

	return { items, loading, refresh };
}
