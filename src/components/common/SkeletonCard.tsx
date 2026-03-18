export default function SkeletonCard() {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-card">
			<div className="aspect-square animate-pulse bg-muted" />
			<div className="space-y-2 p-4">
				<div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
				<div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
			</div>
		</div>
	);
}
