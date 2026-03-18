import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
			<h1 className="font-heading text-4xl">My Account</h1>
			<p className="mt-2 text-sm text-muted-foreground">Manage orders, addresses, and wishlist.</p>
			<div className="mt-6 flex flex-wrap gap-3">
				<Link href="/profile/orders"><Button>My Orders</Button></Link>
				<Link href="/profile/addresses"><Button variant="outline">My Addresses</Button></Link>
				<Link href="/profile/wishlist"><Button variant="outline">My Wishlist</Button></Link>
			</div>
		</main>
	);
}
