"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";

type User = {
	id: string;
	email: string;
	name?: string | null;
	role: string;
	isActive: boolean;
};

export default function Page() {
	const [rows, setRows] = useState<User[]>([]);

	useEffect(() => {
		const load = async () => {
			const response = await fetch("/api/admin/users");
			const data = (await response.json()) as { data?: User[] };
			setRows(data.data || []);
		};
		void load();
	}, []);

	return (
		<main className="space-y-4">
			<h1 className="font-heading text-4xl">Users</h1>
			<DataTable
				rows={rows}
				columns={[
					{ header: "Name", render: (row) => row.name || "-" },
					{ header: "Email", render: (row) => row.email },
					{ header: "Role", render: (row) => row.role },
					{ header: "Status", render: (row) => (row.isActive ? "Active" : "Inactive") },
				]}
			/>
		</main>
	);
}
