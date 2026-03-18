import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductImages from "@/components/product/ProductImages";
import ProductDetailActions from "@/components/product/ProductDetailActions";
import { prisma } from "@/lib/prisma";

const CATEGORY_LABELS: Record<"BAKHOOR" | "OUD_OIL" | "PERFUME_BLEND", string> = {
	BAKHOOR: "Deodorants",
	OUD_OIL: "Attar",
	PERFUME_BLEND: "Perfume",
};

type Props = {
	params: { slug: string };
};

async function getProductBySlug(slug: string) {
	return prisma.product.findUnique({
		where: { slug, isActive: true },
		select: {
			id: true,
			slug: true,
			name: true,
			description: true,
			shortDescription: true,
			images: true,
			basePrice: true,
			stock: true,
			category: true,
		},
	});
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		return {
			title: "Product Not Found",
			description: "The requested product does not exist.",
		};
	}

	return {
		title: product.name,
		description: product.shortDescription,
		openGraph: {
			title: product.name,
			description: product.shortDescription,
			images: product.images[0] ? [product.images[0]] : [],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description: product.shortDescription,
			images: product.images[0] ? [product.images[0]] : [],
		},
	};
}

export default async function Page({ params }: Props) {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		notFound();
	}

	const schema = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		image: product.images,
		description: product.shortDescription,
		brand: {
			"@type": "Brand",
			name: process.env.NEXT_PUBLIC_APP_NAME || "DNorthEasternEssence",
		},
		offers: {
			"@type": "Offer",
			priceCurrency: "INR",
			price: Number(product.basePrice).toFixed(2),
			availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
		},
	};

	return (
		<>
			<Navbar />
			<main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
				<ProductImages images={product.images} />
				<div>
					<p className="font-accent text-2xl text-primary">{CATEGORY_LABELS[product.category]}</p>
					<h1 className="mt-1 font-heading text-4xl">{product.name}</h1>
					<p className="mt-4 text-muted-foreground">{product.description}</p>
					<ProductDetailActions
						product={{
							id: product.id,
							name: product.name,
							images: product.images,
							basePrice: Number(product.basePrice),
							stock: product.stock,
						}}
					/>
				</div>
			</main>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
			<Footer />
		</>
	);
}
