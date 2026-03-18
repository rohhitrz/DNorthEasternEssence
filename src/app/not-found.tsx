import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			<p className="font-accent text-3xl text-primary">404</p>
			<h1 className="mt-2 font-heading text-4xl text-foreground">This trail has no scent</h1>
			<p className="mt-3 max-w-xl text-muted-foreground">
				The page you requested does not exist. Explore our pure natural perfume, attar, and deodorants collection or return home.
			</p>
			<div className="mt-6 flex gap-3">
				<Link href="/">
					<Button>Back Home</Button>
				</Link>
				<Link href="/shop">
					<Button variant="outline">Visit Shop</Button>
				</Link>
			</div>
		</main>
	);
}
