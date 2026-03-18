import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
	title: string;
	description?: string;
	ctaLabel?: string;
	ctaHref?: string;
};

export default function EmptyState({ title, description, ctaLabel, ctaHref }: EmptyStateProps) {
	return (
		<div className="rounded-xl border border-border bg-card p-8 text-center">
			<h3 className="font-heading text-2xl">{title}</h3>
			{description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
			{ctaLabel && ctaHref ? (
				<div className="mt-5">
					<Link href={ctaHref}>
						<Button>{ctaLabel}</Button>
					</Link>
				</div>
			) : null}
		</div>
	);
}
