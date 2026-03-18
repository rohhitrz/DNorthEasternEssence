import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
				<h1 className="font-heading text-4xl">Shipping Policy</h1>
				<p className="mt-4 text-sm text-muted-foreground">Orders are processed within 24-72 hours and shipped via tracked carriers based on destination.</p>
			</main>
			<Footer />
		</>
	);
}
