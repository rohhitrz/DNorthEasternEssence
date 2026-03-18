import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HistoryTeaser() {
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
			<div className="rounded-2xl border border-border bg-card p-8">
				<p className="font-accent text-2xl text-primary">Legacy</p>
				<h2 className="mt-1 font-heading text-4xl">Centuries of Scent Craft</h2>
				<p className="mt-3 max-w-3xl text-sm text-muted-foreground">
					From Assam's fragrance roots to contemporary craft, DNorthEasternEssence honors natural perfumery while embracing modern quality standards.
				</p>
				<Link href="/history" className="mt-5 inline-block">
					<Button variant="outline">Read Our History</Button>
				</Link>
			</div>
		</section>
	);
}
