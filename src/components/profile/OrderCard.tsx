import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";

export default function OrderCard({
	order,
}: {
	order: {
		id: string;
		status: string;
		paymentMethod: string;
		paymentStatus: string;
		total: number;
		createdAt: string;
		items?: Array<{
			productName: string;
			product?: { slug: string };
		}>;
	};
}) {
	return (
		<article className="rounded-lg border border-border bg-card p-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="font-medium">Order #{order.id.slice(0, 8)}</p>
				<div className="flex gap-2">
					<Badge variant="outline">{order.paymentMethod}</Badge>
					<Badge variant="outline">{order.status}</Badge>
					<Badge>{order.paymentStatus}</Badge>
				</div>
			</div>
			<p className="mt-2 text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
			<p className="mt-1 text-primary"><CurrencyDisplay amountInINR={order.total} /></p>
			{order.items && order.items.length > 0 ? (
				<div className="mt-2 flex flex-wrap gap-2">
					{order.items.slice(0, 2).map((item, index) =>
						item.product?.slug ? (
							<Link
								key={`${item.product.slug}-${index}`}
								href={`/shop/${item.product.slug}`}
								className="text-xs text-primary hover:underline"
							>
								{item.productName}
							</Link>
						) : null
					)}
					{order.items.length > 2 ? <span className="text-xs text-muted-foreground">+{order.items.length - 2} more</span> : null}
				</div>
			) : null}
			<Link href={`/profile/orders/${order.id}`} className="mt-3 inline-block">
				<Button variant="outline" size="sm">View Details</Button>
			</Link>
		</article>
	);
}
