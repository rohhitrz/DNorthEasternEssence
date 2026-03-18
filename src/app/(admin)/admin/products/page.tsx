"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";

type Product = {
	id: string;
	name: string;
	category: string;
	stock: number;
	isActive: boolean;
};

export default function Page() {
	const [rows, setRows] = useState<Product[]>([]);

	useEffect(() => {
		const load = async () => {
			const response = await fetch("/api/admin/products");
			const data = (await response.json()) as { data?: Product[] };
			setRows(data.data || []);
		};

		void load();
	}, []);

	return (
		<main className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-4xl">Products</h1>
				<Link href="/admin/products/new"><Button>Add Product</Button></Link>
			</div>
			<DataTable
				rows={rows}
				columns={[
					{ header: "Name", render: (row) => row.name },
					{ header: "Category", render: (row) => row.category },
					{ header: "Stock", render: (row) => row.stock },
					{ header: "Status", render: (row) => (row.isActive ? "Active" : "Inactive") },
					{ header: "Action", render: (row) => <Link className="text-primary" href={`/admin/products/${row.id}/edit`}>Edit</Link> },
				]}
			/>
		</main>
	);
}
