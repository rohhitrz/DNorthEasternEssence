import RatingStars from "@/components/common/RatingStars";

export default function ReviewCard({
	review,
}: {
	review: { rating: number; title?: string | null; comment: string; author: string; createdAt: string };
}) {
	return (
		<article className="rounded-lg border border-border bg-card p-4">
			<div className="flex items-center justify-between gap-3">
				<p className="font-medium">{review.author}</p>
				<RatingStars rating={review.rating} />
			</div>
			{review.title ? <h4 className="mt-2 font-heading text-lg">{review.title}</h4> : null}
			<p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
			<p className="mt-3 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
		</article>
	);
}
