import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { id: string } }) {
	return (
		<main className="space-y-4">
			<h1 className="font-heading text-4xl">Order Detail</h1>
			<p className="text-sm text-muted-foreground">Order ID: {params.id}</p>
			<Link href="/admin/orders"><Button variant="outline">Back to Orders</Button></Link>
		</main>
	);
}
