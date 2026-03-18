"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type CartLine = {
	productId: string;
	variantId?: string | null;
	name: string;
	image: string;
	price: number;
	quantity: number;
};

type CartContextValue = {
	items: CartLine[];
	itemCount: number;
	subtotal: number;
	addItem: (line: CartLine) => void;
	updateQty: (productId: string, variantId: string | null | undefined, quantity: number) => void;
	removeItem: (productId: string, variantId: string | null | undefined) => void;
	clearCart: () => void;
	mergeFromSession: (sessionLines: CartLine[]) => void;
};

const STORAGE_PREFIX = "maison_oudh_cart";
const CartContext = createContext<CartContextValue | null>(null);

function toKey(productId: string, variantId?: string | null) {
	return `${productId}:${variantId ?? "none"}`;
}

export function CartContextProvider({ children }: { children: React.ReactNode }) {
	const { isLoaded, isSignedIn, userId } = useAuth();
	const hasMergedRef = useRef(false);
	const storageKey = userId ? `${STORAGE_PREFIX}:${userId}` : null;

	const [items, setItems] = useState<CartLine[]>([]);

	const save = (next: CartLine[]) => {
		setItems(next);
		if (typeof window !== "undefined" && storageKey) {
			window.localStorage.setItem(storageKey, JSON.stringify(next));
		}
	};

	const addItem = (line: CartLine) => {
		if (!isSignedIn || !storageKey) {
			throw new Error("Please sign in to add items to cart");
		}

		const key = toKey(line.productId, line.variantId);
		const existing = items.find((item) => toKey(item.productId, item.variantId) === key);

		if (!existing) {
			save([...items, line]);
			return;
		}

		const next = items.map((item) =>
			toKey(item.productId, item.variantId) === key
				? { ...item, quantity: item.quantity + line.quantity }
				: item
		);
		save(next);
	};

	const updateQty = (productId: string, variantId: string | null | undefined, quantity: number) => {
		const safeQty = Math.max(1, quantity);
		const next = items.map((item) =>
			toKey(item.productId, item.variantId) === toKey(productId, variantId)
				? { ...item, quantity: safeQty }
				: item
		);
		save(next);
	};

	const removeItem = (productId: string, variantId: string | null | undefined) => {
		const next = items.filter(
			(item) => toKey(item.productId, item.variantId) !== toKey(productId, variantId)
		);
		save(next);
	};

	const clearCart = () => {
		save([]);
	};

	const mergeFromSession = (sessionLines: CartLine[]) => {
		const map = new Map<string, CartLine>();

		for (const line of items) {
			map.set(toKey(line.productId, line.variantId), line);
		}

		for (const line of sessionLines) {
			const key = toKey(line.productId, line.variantId);
			const existing = map.get(key);
			if (!existing) {
				map.set(key, line);
			} else {
				map.set(key, { ...existing, quantity: Math.max(existing.quantity, line.quantity) });
			}
		}

		const merged = Array.from(map.values());
		save(merged);
	};

	const value = useMemo<CartContextValue>(() => {
		const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
		const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

		return {
			items,
			itemCount,
			subtotal,
			addItem,
			updateQty,
			removeItem,
			clearCart,
			mergeFromSession,
		};
	}, [items]);

	useEffect(() => {
		if (!isLoaded) {
			return;
		}

		if (!isSignedIn || !storageKey) {
			setItems([]);
			hasMergedRef.current = false;
			return;
		}

		try {
			const raw = window.localStorage.getItem(storageKey);
			if (!raw) {
				setItems([]);
				return;
			}

			const parsed = JSON.parse(raw) as CartLine[];
			setItems(Array.isArray(parsed) ? parsed : []);
		} catch {
			setItems([]);
		}
	}, [isLoaded, isSignedIn, storageKey]);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !storageKey || hasMergedRef.current) {
			return;
		}

		const merge = async () => {
			try {
				const response = await fetch("/api/cart", { method: "GET" });
				if (!response.ok) {
					throw new Error("Unable to load server cart");
				}
				const payload = (await response.json()) as {
					cart?: Array<{
						productId: string;
						variantId: string | null;
						quantity: number;
						product: {
							name: string;
							images: string[];
							basePrice: string | number;
						};
						variant: {
							priceModifier: string | number;
						} | null;
					}>;
				};

				const dbLines: CartLine[] = (payload.cart || []).map((line) => ({
					productId: line.productId,
					variantId: line.variantId,
					quantity: line.quantity,
					name: line.product.name,
					image: line.product.images[0] || "/placeholder-product.svg",
					price: Number(line.product.basePrice) + Number(line.variant?.priceModifier || 0),
				}));

				mergeFromSession(dbLines);
			} catch (error) {
				console.error("[Cart] Merge failed", error);
			} finally {
				hasMergedRef.current = true;
			}
		};

		void merge();
	}, [isLoaded, isSignedIn, storageKey]);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !storageKey || items.length === 0) {
			return;
		}

		const handle = window.setTimeout(() => {
			const payload = {
				items: items.map((item) => ({
					productId: item.productId,
					variantId: item.variantId ?? null,
					quantity: item.quantity,
				})),
			};

			void fetch("/api/cart", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})
				.then(async (response) => {
					if (!response.ok) {
						throw new Error("Unable to sync cart");
					}

					const data = (await response.json()) as { skippedKeys?: string[] };
					if (Array.isArray(data.skippedKeys) && data.skippedKeys.length > 0) {
						const skipped = new Set(data.skippedKeys);
						setItems((current) => {
							const next = current.filter((line) => !skipped.has(toKey(line.productId, line.variantId)));
							if (storageKey) {
								window.localStorage.setItem(storageKey, JSON.stringify(next));
							}
							return next;
						});
					}
				})
				.catch((error) => {
					console.error("[Cart] Sync failed", error);
				});
		}, 500);

		return () => {
			window.clearTimeout(handle);
		};
	}, [isLoaded, isSignedIn, items, storageKey]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCartContext must be used within CartContextProvider");
	}

	return context;
}
