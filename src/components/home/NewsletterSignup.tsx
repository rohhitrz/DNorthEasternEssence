"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSignup() {
	const [email, setEmail] = useState("");
	const [done, setDone] = useState(false);

	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
			<div className="rounded-2xl border border-border bg-card p-8">
				<h2 className="font-heading text-3xl">Join The Scent Ledger</h2>
				<p className="mt-2 text-sm text-muted-foreground">Get launch drops, rare-stock alerts, and seasonal blend notes.</p>
				<form
					className="mt-4 flex flex-col gap-2 sm:flex-row"
					onSubmit={(event) => {
						event.preventDefault();
						if (!email) {
							return;
						}
						setDone(true);
						setEmail("");
					}}
				>
					<Input type="email" placeholder="Your email" value={email} onChange={(event) => setEmail(event.target.value)} className="sm:max-w-sm" />
					<Button type="submit">Subscribe</Button>
				</form>
				{done ? <p className="mt-2 text-xs text-primary">You are subscribed.</p> : null}
			</div>
		</section>
	);
}
