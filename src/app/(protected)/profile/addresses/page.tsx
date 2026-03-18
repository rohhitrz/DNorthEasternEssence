"use client";

import { useState } from "react";
import AddressCard from "@/components/profile/AddressCard";
import AddressForm from "@/components/checkout/AddressForm";
import EmptyState from "@/components/common/EmptyState";
import { useAddresses } from "@/hooks/useAddresses";

export default function Page() {
	const { addresses, loading, setAddresses } = useAddresses();
	const [editingId, setEditingId] = useState<string | null>(null);

	const refreshAddresses = async () => {
		const res = await fetch("/api/addresses");
		const data = (await res.json()) as { addresses?: typeof addresses };
		setAddresses(data.addresses || []);
	};

	const editingAddress = editingId ? addresses.find((item) => item.id === editingId) : null;

	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
			<h1 className="font-heading text-4xl">My Addresses</h1>
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<section className="space-y-3">
					{loading ? <p className="text-sm text-muted-foreground">Loading addresses...</p> : null}
					{!loading && addresses.length === 0 ? (
						<EmptyState title="No addresses yet" description="Add your first address to speed up checkout." />
					) : null}
					{addresses.map((address) => (
						<AddressCard
							key={address.id}
							address={address}
							onEdit={setEditingId}
							onDelete={async (id) => {
								await fetch(`/api/addresses/${id}`, { method: "DELETE" });
								if (editingId === id) {
									setEditingId(null);
								}
								await refreshAddresses();
							}}
						/>
					))}
				</section>
				<section className="rounded-lg border border-border bg-card p-4">
					<h2 className="font-heading text-2xl">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
					<div className="mt-3">
						<AddressForm
							initialValues={editingAddress || undefined}
							onCancel={() => setEditingId(null)}
							onSaved={async () => {
								setEditingId(null);
								await refreshAddresses();
							}}
						/>
					</div>
				</section>
			</div>
		</main>
	);
}
