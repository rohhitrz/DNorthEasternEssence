const points = [
	"Assam-inspired pure natural essence",
	"Small-batch artisan blending",
	"Secure checkout with trusted providers",
	"Global shipping with premium packaging",
];

export default function USPSection() {
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
			<h2 className="font-heading text-3xl">Why DNorthEasternEssence</h2>
			<div className="mt-4 grid gap-3 md:grid-cols-2">
				{points.map((point) => (
					<div key={point} className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
						{point}
					</div>
				))}
			</div>
		</section>
	);
}
