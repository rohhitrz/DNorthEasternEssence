import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const posts = [
	{ slug: "how-to-identify-real-oud", title: "How to Identify Real Oud", excerpt: "Markers of quality in natural oud materials." },
	{ slug: "bakhoor-burning-guide", title: "Natural Deodorant Care Guide", excerpt: "Simple routines for lasting freshness and clean wear." },
	{ slug: "attar-layering-basics", title: "Attar Layering Basics", excerpt: "Layer natural attars and perfumes with confidence." },
];

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
				<p className="font-accent text-2xl text-primary">Journal</p>
				<h1 className="mt-1 font-heading text-5xl">Scent Notes</h1>
				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{posts.map((post) => (
						<Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/50">
							<h2 className="font-heading text-2xl">{post.title}</h2>
							<p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
						</Link>
					))}
				</div>
			</main>
			<Footer />
		</>
	);
}
