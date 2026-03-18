import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
				<h1 className="font-heading text-4xl">Privacy Policy</h1>
				<p className="mt-4 text-sm text-muted-foreground">We collect only the data necessary to process orders, support accounts, and comply with legal obligations.</p>
			</main>
			<Footer />
		</>
	);
}
