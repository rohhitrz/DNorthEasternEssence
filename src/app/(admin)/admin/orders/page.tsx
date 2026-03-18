"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

type Order = {
	id: string;
	status: string;
	paymentStatus: string;
	total: string | number;
	createdAt: string;
	user?: { email?: string; name?: string | null };
};

export default function Page() {
	const [rows, setRows] = useState<Order[]>([]);

	useEffect(() => {
		const load = async () => {
			const response = await fetch("/api/admin/orders");
			const data = (await response.json()) as { data?: Order[] };
			setRows(data.data || []);
		};
		void load();
	}, []);

	return (
		<main className="space-y-4">
			<h1 className="font-heading text-4xl">Orders</h1>
			<DataTable
				rows={rows}
				columns={[
					{ header: "Order", render: (row) => `#${row.id.slice(0, 8)}` },
					{ header: "Customer", render: (row) => row.user?.name || row.user?.email || "N/A" },
					{ header: "Status", render: (row) => <OrderStatusBadge status={row.status} /> },
					{ header: "Payment", render: (row) => row.paymentStatus },
					{ header: "Total", render: (row) => Number(row.total).toFixed(2) },
					{ header: "Action", render: (row) => <Link className="text-primary" href={`/admin/orders/${row.id}`}>View</Link> },
				]}
			/>
		</main>
	);
}
