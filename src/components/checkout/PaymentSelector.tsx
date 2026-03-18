import { Button } from "@/components/ui/button";

export type PaymentMethod = "RAZORPAY" | "STRIPE" | "COD";

export default function PaymentSelector({
	methods,
	selected,
	onChange,
}: {
	methods: PaymentMethod[];
	selected: PaymentMethod;
	onChange: (method: PaymentMethod) => void;
}) {
	return (
		<div className="grid gap-2">
			{methods.map((method) => (
				<Button key={method} variant={selected === method ? "default" : "outline"} onClick={() => onChange(method)} className="justify-start">
					{method}
				</Button>
			))}
		</div>
	);
}
