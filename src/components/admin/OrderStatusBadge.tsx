import { Badge } from "@/components/ui/badge";

export default function OrderStatusBadge({ status }: { status: string }) {
	if (["DELIVERED", "CONFIRMED"].includes(status)) {
		return <Badge>{status}</Badge>;
	}

	if (["FAILED", "CANCELLED", "REFUNDED"].includes(status)) {
		return <Badge variant="destructive">{status}</Badge>;
	}

	return <Badge variant="outline">{status}</Badge>;
}
