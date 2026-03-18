import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
				<p className="font-accent text-2xl text-primary">History</p>
				<h1 className="mt-1 font-heading text-5xl">The Assam Essence Story</h1>
				<p className="mt-5 text-muted-foreground">
					Our inspiration comes from Assam's fragrance heritage and botanicals. DNorthEasternEssence celebrates this legacy through pure natural perfume, attar, and deodorants with transparent craft notes.
				</p>
			</main>
			<Footer />
		</>
	);
}
