"use client";

import { Button } from "@/components/ui/button";

export type VariantOption = {
	id: string;
	label: string;
	stock: number;
};

export default function VariantSelector({
	variants,
	selectedVariantId,
	onSelect,
}: {
	variants: VariantOption[];
	selectedVariantId?: string | null;
	onSelect: (id: string) => void;
}) {
	return (
		<div className="space-y-2">
			<p className="text-sm text-muted-foreground">Choose size / concentration</p>
			<div className="flex flex-wrap gap-2">
				{variants.map((variant) => (
					<Button
						key={variant.id}
						variant={selectedVariantId === variant.id ? "default" : "outline"}
						onClick={() => onSelect(variant.id)}
						disabled={variant.stock <= 0}
					>
						{variant.label}
					</Button>
				))}
			</div>
		</div>
	);
}
