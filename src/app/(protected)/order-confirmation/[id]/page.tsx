import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { id: string } }) {
	return (
		<main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
			<p className="font-accent text-2xl text-primary">Order Confirmed</p>
			<h1 className="mt-2 font-heading text-5xl">Thank You For Your Purchase</h1>
			<p className="mt-4 text-sm text-muted-foreground">Reference: {params.id}</p>
			<div className="mt-6 flex gap-3">
				<Link href="/profile/orders"><Button>Track Orders</Button></Link>
				<Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
			</div>
		</main>
	);
}
