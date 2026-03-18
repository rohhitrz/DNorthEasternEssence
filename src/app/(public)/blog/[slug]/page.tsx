import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const posts: Record<string, { title: string; body: string }> = {
	"how-to-identify-real-oud": {
		title: "How to Identify Real Oud",
		body: "Natural oud shows layered evolution, resin depth, and non-linear projection. Start with small heat and observe its transition over 30-60 minutes.",
	},
	"bakhoor-burning-guide": {
		title: "Natural Deodorant Care Guide",
		body: "Apply on clean skin, allow it to settle before layering fragrance, and store in a cool place for consistent natural performance.",
	},
	"attar-layering-basics": {
		title: "Attar Layering Basics",
		body: "Begin with one attar anchor and one floral or amber accent. Keep ratios light and test on skin before fabric application.",
	},
};

export default function Page({ params }: { params: { slug: string } }) {
	const post = posts[params.slug];
	if (!post) {
		notFound();
	}

	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
				<p className="font-accent text-2xl text-primary">Journal</p>
				<h1 className="mt-1 font-heading text-5xl">{post.title}</h1>
				<p className="mt-6 text-muted-foreground">{post.body}</p>
			</main>
			<Footer />
		</>
	);
}
