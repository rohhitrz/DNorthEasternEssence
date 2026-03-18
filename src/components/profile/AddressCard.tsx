import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AddressCard({
	address,
	onEdit,
	onDelete,
}: {
	address: {
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
	onEdit?: (addressId: string) => void;
	onDelete?: (addressId: string) => void;
}) {
	return (
		<article className="rounded-lg border border-border bg-card p-4">
			<div className="flex items-center justify-between gap-2">
				<h3 className="font-heading text-lg">{address.label}</h3>
				{address.isDefault ? <Badge>Default</Badge> : null}
			</div>
			<p className="mt-2 text-sm">{address.fullName}</p>
			{address.email ? <p className="text-sm text-muted-foreground">{address.email}</p> : null}
			{address.phone ? <p className="text-sm text-muted-foreground">{address.phone}</p> : null}
			<p className="text-sm text-muted-foreground">{address.line1}</p>
			{address.line2 ? <p className="text-sm text-muted-foreground">{address.line2}</p> : null}
			<p className="text-sm text-muted-foreground">{address.city}, {address.state}, {address.country} {address.pincode}</p>
			<div className="mt-3 flex gap-2">
				<Button size="sm" variant="outline" onClick={() => onEdit?.(address.id)}>Edit</Button>
				<Button size="sm" variant="destructive" onClick={() => onDelete?.(address.id)}>Delete</Button>
			</div>
		</article>
	);
}
