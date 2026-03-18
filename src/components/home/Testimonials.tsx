const testimonials = [
	{ name: "Aarav S.", text: "The depth of the natural attar is exceptional. Easily one of my finest bottles." },
	{ name: "Nadia R.", text: "Packaging and blend quality feel truly premium from opening to dry-down." },
	{ name: "Omar K.", text: "The deodorant stays fresh all day and the perfume profile feels clean and natural." },
];

export default function Testimonials() {
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
			<p className="font-accent text-2xl text-primary">Voices</p>
			<h2 className="font-heading text-4xl">Collector Reviews</h2>
			<div className="mt-5 grid gap-4 md:grid-cols-3">
				{testimonials.map((item) => (
					<article key={item.name} className="rounded-xl border border-border bg-card p-5">
						<p className="text-sm text-muted-foreground">"{item.text}"</p>
						<p className="mt-3 font-medium">{item.name}</p>
					</article>
				))}
			</div>
		</section>
	);
}
