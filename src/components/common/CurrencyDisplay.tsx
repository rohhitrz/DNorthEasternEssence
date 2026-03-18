"use client";

import { useCurrency } from "@/hooks/useCurrency";

export default function CurrencyDisplay({ amountInINR }: { amountInINR: number }) {
	const { format } = useCurrency();
	return <span>{format(amountInINR)}</span>;
}
