import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
				<h1 className="font-heading text-5xl">Contact Us</h1>
				<p className="mt-4 text-muted-foreground">For sourcing, support, and wholesale requests: support@dnortheasternessence.com</p>
			</main>
			<Footer />
		</>
	);
}
