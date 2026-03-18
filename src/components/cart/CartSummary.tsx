import CurrencyDisplay from "@/components/common/CurrencyDisplay";

export default function CartSummary({ subtotal, shipping, discount }: { subtotal: number; shipping: number; discount: number }) {
	const total = subtotal + shipping - discount;

	return (
		<div className="rounded-lg border border-border bg-card p-4">
			<h3 className="font-heading text-xl">Order Summary</h3>
			<div className="mt-3 space-y-2 text-sm">
				<div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><CurrencyDisplay amountInINR={subtotal} /></div>
				<div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><CurrencyDisplay amountInINR={shipping} /></div>
				<div className="flex justify-between"><span className="text-muted-foreground">Discount</span><CurrencyDisplay amountInINR={discount} /></div>
				<div className="flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><CurrencyDisplay amountInINR={total} /></div>
			</div>
		</div>
	);
}
