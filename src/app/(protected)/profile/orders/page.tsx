"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/profile/OrderCard";
import EmptyState from "@/components/common/EmptyState";

type Order = {
	id: string;
	status: string;
	paymentMethod: string;
	paymentStatus: string;
	total: string | number;
	createdAt: string;
	items?: Array<{
		productName: string;
		product?: { slug: string };
	}>;
};

export default function Page() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch("/api/orders");
				const data = (await res.json()) as { data?: Order[] };
				setOrders(data.data || []);
			} finally {
				setLoading(false);
			}
		};
		void load();
	}, []);

	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
			<h1 className="font-heading text-4xl">My Orders</h1>
			<div className="mt-6 space-y-3">
				{loading ? <p className="text-sm text-muted-foreground">Loading orders...</p> : null}
				{!loading && orders.length === 0 ? <EmptyState title="No orders yet" ctaLabel="Start Shopping" ctaHref="/shop" /> : null}
				{orders.map((order) => (
					<OrderCard
						key={order.id}
						order={{
							...order,
							total: Number(order.total),
						}}
					/>
				))}
			</div>
		</main>
	);
}
