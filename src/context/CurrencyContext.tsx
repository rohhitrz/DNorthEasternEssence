"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CURRENCIES, EXCHANGE_RATE_INR_TO_USD, type CurrencyCode } from "@/lib/constants";

type CurrencyContextValue = {
	currency: CurrencyCode;
	setCurrency: (next: CurrencyCode) => void;
	convertFromINR: (amountInINR: number) => number;
	format: (amountInINR: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyContextProvider({ children }: { children: React.ReactNode }) {
	const [currency, setCurrency] = useState<CurrencyCode>("INR");

	const value = useMemo<CurrencyContextValue>(() => {
		const convertFromINR = (amountInINR: number) => {
			if (currency === "USD") {
				return Number((amountInINR * EXCHANGE_RATE_INR_TO_USD).toFixed(2));
			}

			return Number(amountInINR.toFixed(2));
		};

		const format = (amountInINR: number) => {
			const amount = convertFromINR(amountInINR);
			return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
				style: "currency",
				currency: CURRENCIES[currency].code,
				maximumFractionDigits: 2,
			}).format(amount);
		};

		return {
			currency,
			setCurrency,
			convertFromINR,
			format,
		};
	}, [currency]);

	return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrencyContext() {
	const context = useContext(CurrencyContext);

	if (!context) {
		throw new Error("useCurrencyContext must be used within CurrencyContextProvider");
	}

	return context;
}
