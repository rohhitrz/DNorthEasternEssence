import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
				<h1 className="font-heading text-4xl">Terms & Conditions</h1>
				<p className="mt-4 text-sm text-muted-foreground">By using this site you agree to our product, payment, fulfillment, and usage terms.</p>
			</main>
			<Footer />
		</>
	);
}
