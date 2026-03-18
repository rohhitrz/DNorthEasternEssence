"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewForm({ productId }: { productId: string }) {
	const [rating, setRating] = useState(5);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<form
			className="space-y-3 rounded-lg border border-border bg-card p-4"
			onSubmit={async (event) => {
				event.preventDefault();
				setLoading(true);
				try {
					const response = await fetch("/api/reviews", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ productId, rating, title, comment }),
					});

					if (!response.ok) {
						const data = (await response.json()) as { error?: string };
						throw new Error(data.error || "Failed to submit review");
					}

					setTitle("");
					setComment("");
					toast.success("Review submitted");
				} catch (error) {
					toast.error(error instanceof Error ? error.message : "Something went wrong");
				} finally {
					setLoading(false);
				}
			}}
		>
			<h3 className="font-heading text-xl">Write a Review</h3>
			<Input type="number" min={1} max={5} value={rating} onChange={(event) => setRating(Number(event.target.value))} />
			<Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
			<Textarea placeholder="Share your experience" value={comment} onChange={(event) => setComment(event.target.value)} />
			<Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</Button>
		</form>
	);
}
