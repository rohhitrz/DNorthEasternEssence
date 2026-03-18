import { AddressItem } from "@/hooks/useAddresses";

export default function AddressSelector({
	addresses,
	value,
	onChange,
}: {
	addresses: AddressItem[];
	value: string;
	onChange: (id: string) => void;
}) {
	return (
		<select
			value={value}
			onChange={(event) => onChange(event.target.value)}
			className="w-full rounded-md border border-border bg-background p-2"
		>
			{addresses.map((address) => (
				<option key={address.id} value={address.id}>
					{address.fullName} • {address.city}, {address.country}
				</option>
			))}
		</select>
	);
}
