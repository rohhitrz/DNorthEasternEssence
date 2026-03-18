"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeImageSrc } from "@/lib/utils";

type OrderItem = {
	id: string;
	productId: string;
	productName: string;
	variantLabel: string | null;
	price: string | number;
	quantity: number;
	product: {
		slug: string;
		images: string[];
	};
};

type OrderDetail = {
	id: string;
	status: string;
	paymentMethod: string;
	paymentStatus: string;
	subtotal: string | number;
	shippingCost: string | number;
	discount: string | number;
	total: string | number;
	currency: string;
	createdAt: string;
	items: OrderItem[];
};

export default function Page({ params }: { params: { id: string } }) {
	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const response = await fetch(`/api/orders/${params.id}`);
				const payload = (await response.json()) as { order?: OrderDetail; error?: string };
				if (!response.ok) {
					throw new Error(payload.error || "Unable to load order details");
				}
				setOrder(payload.order || null);
			} catch {
				setOrder(null);
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, [params.id]);

	if (loading) {
		return (
			<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
				<p className="text-sm text-muted-foreground">Loading order details...</p>
			</main>
		);
	}

	if (!order) {
		return (
			<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
				<h1 className="font-heading text-4xl">Order Details</h1>
				<p className="mt-3 text-sm text-muted-foreground">Order not found.</p>
				<Link href="/profile/orders" className="mt-4 inline-block">
					<Button variant="outline">Back to Orders</Button>
				</Link>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="font-heading text-4xl">Order Details</h1>
				<div className="flex gap-2">
					<Badge variant="outline">{order.paymentMethod}</Badge>
					<Badge variant="outline">{order.status}</Badge>
					<Badge>{order.paymentStatus}</Badge>
				</div>
			</div>

			<p className="mt-3 text-sm text-muted-foreground">Order ID: {order.id}</p>
			<p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</p>

			<div className="mt-6 rounded-lg border border-border bg-card p-4">
				<h2 className="font-heading text-2xl">Items</h2>
				<div className="mt-4 space-y-3">
					{order.items.map((item) => {
						const imageSrc = normalizeImageSrc(item.product.images[0]);
						return (
							<div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
								<div className="flex min-w-0 items-center gap-3">
									<div className="relative h-14 w-14 overflow-hidden rounded-md border border-border">
										<Image src={imageSrc} alt={item.productName} fill className="object-cover" sizes="56px" />
									</div>
									<div className="min-w-0">
										<p className="truncate font-medium">{item.productName}</p>
										{item.variantLabel ? (
											<p className="text-xs text-muted-foreground">Variant: {item.variantLabel}</p>
										) : null}
										<p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<CurrencyDisplay amountInINR={Number(item.price) * item.quantity} />
									<Link href={`/shop/${item.product.slug}`}>
										<Button variant="outline" size="sm">View Product</Button>
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="mt-6 rounded-lg border border-border bg-card p-4">
				<h2 className="font-heading text-2xl">Summary</h2>
				<div className="mt-3 space-y-1 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Subtotal</span>
						<CurrencyDisplay amountInINR={Number(order.subtotal)} />
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Shipping</span>
						<CurrencyDisplay amountInINR={Number(order.shippingCost)} />
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Discount</span>
						<CurrencyDisplay amountInINR={Number(order.discount)} />
					</div>
					<div className="flex justify-between border-t border-border pt-2 font-medium">
						<span>Total</span>
						<CurrencyDisplay amountInINR={Number(order.total)} />
					</div>
				</div>
			</div>
		</main>
	);
}
