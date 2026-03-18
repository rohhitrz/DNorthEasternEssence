"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
	return (
		<main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			<p className="font-accent text-3xl text-primary">Unexpected Error</p>
			<h1 className="mt-2 font-heading text-4xl">We could not complete that ritual</h1>
			<p className="mt-3 max-w-xl text-muted-foreground">
				Please retry, or continue browsing the collection while we handle this issue.
			</p>
			<div className="mt-6 flex gap-3">
				<Button onClick={reset}>Try Again</Button>
				<Link href="/shop">
					<Button variant="outline">Go to Shop</Button>
				</Link>
			</div>
		</main>
	);
}
