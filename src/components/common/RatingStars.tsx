import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({ rating = 0, outOf = 5 }: { rating?: number; outOf?: number }) {
	return (
		<div className="flex items-center gap-1" aria-label={`Rating ${rating} out of ${outOf}`}>
			{Array.from({ length: outOf }).map((_, idx) => {
				const active = idx < Math.round(rating);
				return <Star key={idx} className={cn("size-4", active ? "fill-primary text-primary" : "text-muted-foreground")} />;
			})}
		</div>
	);
}
