"use client";

import { useEffect, useState } from "react";

export type AddressItem = {
	id: string;
	label: string;
	fullName: string;
	email?: string | null;
	phone?: string;
	line1?: string;
	line2?: string | null;
	city: string;
	state: string;
	country: string;
	pincode: string;
	isDefault: boolean;
};

export function useAddresses() {
	const [addresses, setAddresses] = useState<AddressItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch("/api/addresses");
				const data = (await res.json()) as { addresses?: AddressItem[] };
				setAddresses(data.addresses || []);
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, []);

	return { addresses, loading, setAddresses };
}
