import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
	{ q: "Do you ship internationally?", a: "Yes, international shipping is available to most regions." },
	{ q: "Is COD available?", a: "COD is currently available only for India orders under 5000 INR." },
	{ q: "Can I return opened products?", a: "Due to product nature, opened items are generally non-returnable." },
];

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
				<h1 className="font-heading text-5xl">FAQ</h1>
				<div className="mt-6 space-y-3">
					{faqs.map((faq) => (
						<article key={faq.q} className="rounded-lg border border-border bg-card p-4">
							<h2 className="font-medium">{faq.q}</h2>
							<p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
						</article>
					))}
				</div>
			</main>
			<Footer />
		</>
	);
}
