import Link from "next/link";

const categories = [
	{ title: "Deodorants", href: "/shop?category=BAKHOOR", text: "Pure natural deodorants with long-lasting freshness." },
	{ title: "Attar", href: "/shop?category=OUD_OIL", text: "Traditional natural attars with rich, elegant depth." },
	{ title: "Perfume", href: "/shop?category=PERFUME_BLEND", text: "Modern natural perfumes inspired by Assam's living essence." },
];

export default function CategorySection() {
	return (
		<section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 md:grid-cols-3 md:px-8">
			{categories.map((category) => (
				<Link key={category.title} href={category.href} className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/50">
					<h3 className="font-heading text-2xl">{category.title}</h3>
					<p className="mt-2 text-sm text-muted-foreground">{category.text}</p>
				</Link>
			))}
		</section>
	);
}
