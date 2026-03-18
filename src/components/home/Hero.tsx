"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 md:px-8">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,169,110,0.22),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(201,169,110,0.13),transparent_35%),linear-gradient(120deg,#090706_0%,#120f0d_40%,#090706_100%)]" />
			<div className="mx-auto w-full max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="max-w-3xl"
				>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mb-3 font-accent text-2xl text-primary"
					>
						Heritage Distilled
					</motion.p>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
						className="font-heading text-5xl leading-tight text-foreground md:text-7xl"
					>
							Pure Natural Essence for
						<span className="ml-3 text-primary">Modern Rituals</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.35 }}
						className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg"
					>
							Discover pure natural perfume, attar, and deodorants by DNorthEasternEssence, inspired by Assam and crafted for everyday luxury.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className="mt-8 flex flex-wrap gap-3"
					>
						<Link href="/shop">
							<Button className="h-11 px-6 text-sm">Explore Collection</Button>
						</Link>
						<Link href="/history">
							<Button variant="outline" className="h-11 px-6 text-sm">
								Our Story
							</Button>
						</Link>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1.2, delay: 0.8 }}
					className="absolute bottom-7 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
				>
					Scroll to discover
				</motion.div>
			</div>
		</section>
	);
}
