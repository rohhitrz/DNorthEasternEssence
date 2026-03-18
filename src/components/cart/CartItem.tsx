"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";

export default function CartItem({
	name,
	quantity,
	unitPrice,
	onIncrease,
	onDecrease,
	onRemove,
}: {
	name: string;
	quantity: number;
	unitPrice: number;
	onIncrease: () => void;
	onDecrease: () => void;
	onRemove: () => void;
}) {
	return (
		<div className="rounded-lg border border-border p-3">
			<div className="flex items-start justify-between gap-3">
				<p className="font-heading text-lg">{name}</p>
				<Button size="icon-xs" variant="ghost" onClick={onRemove}>
					<Trash2 />
				</Button>
			</div>
			<div className="mt-2 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button size="icon-xs" variant="outline" onClick={onDecrease}><Minus /></Button>
					<span className="w-8 text-center text-sm">{quantity}</span>
					<Button size="icon-xs" variant="outline" onClick={onIncrease}><Plus /></Button>
				</div>
				<span className="text-primary"><CurrencyDisplay amountInINR={quantity * unitPrice} /></span>
			</div>
		</div>
	);
}
