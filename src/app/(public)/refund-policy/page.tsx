import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
				<h1 className="font-heading text-4xl">Refund Policy</h1>
				<p className="mt-4 text-sm text-muted-foreground">Refunds are evaluated case-by-case for damaged, incorrect, or undelivered items.</p>
			</main>
			<Footer />
		</>
	);
}
