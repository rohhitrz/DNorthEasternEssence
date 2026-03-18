import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="space-y-4">
			<h1 className="font-heading text-4xl">New Product</h1>
			<p className="text-sm text-muted-foreground">Use the admin product API to create products from this screen.</p>
			<Link href="/admin/products"><Button variant="outline">Back to Products</Button></Link>
		</main>
	);
}
