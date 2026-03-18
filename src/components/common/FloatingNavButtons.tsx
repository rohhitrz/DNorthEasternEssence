"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingNavButtons() {
	const router = useRouter();
	const [canGoBack, setCanGoBack] = useState(false);

	useEffect(() => {
		const updateBackState = () => {
			setCanGoBack(window.history.length > 1);
		};

		updateBackState();
		window.addEventListener("popstate", updateBackState);

		return () => {
			window.removeEventListener("popstate", updateBackState);
		};
	}, []);

	return (
		<div className="fixed right-3 bottom-5 z-50 flex items-center gap-1 rounded-full border border-border/70 bg-background/90 p-1 shadow-lg backdrop-blur sm:right-5 sm:bottom-6">
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="Navigate back"
				disabled={!canGoBack}
				onClick={() => router.back()}
			>
				<ChevronLeft />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="Navigate forward"
				onClick={() => router.forward()}
			>
				<ChevronRight />
			</Button>
		</div>
	);
}