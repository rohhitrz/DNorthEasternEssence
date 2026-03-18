import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Page() {
	return (
		<>
			<Navbar />
			<main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
				<p className="font-accent text-2xl text-primary">About</p>
				<h1 className="mt-1 font-heading text-5xl">Crafted For Connoisseurs</h1>
				<p className="mt-5 text-muted-foreground">
					DNorthEasternEssence is an Assam-based pure natural essence brand creating perfume, attar, and deodorants through clean ingredients and small-batch craft.
				</p>
			</main>
			<Footer />
		</>
	);
}
