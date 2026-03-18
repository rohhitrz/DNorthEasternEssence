"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddressForm from "@/components/checkout/AddressForm";
import { useCart } from "@/hooks/useCart";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { FREE_SHIPPING_THRESHOLD_INR, SHIPPING_COST_INR } from "@/lib/constants";

type Address = {
	id: string;
	fullName: string;
	email?: string | null;
	line1: string;
	city: string;
	state: string;
	country: string;
	pincode: string;
};

type PaymentMethod = "RAZORPAY" | "STRIPE" | "COD";

export default function Page() {
	const router = useRouter();
	const { subtotal, itemCount, clearCart, items } = useCart();
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [addressId, setAddressId] = useState<string>("");
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
	const [placingOrder, setPlacingOrder] = useState(false);

	useEffect(() => {
		const load = async () => {
			const response = await fetch("/api/addresses");
			const payload = (await response.json()) as { addresses?: Address[] };
			const first = payload.addresses?.[0];
			setAddresses(payload.addresses || []);
			if (first) {
				setAddressId(first.id);
			}
		};

		void load();
	}, []);

	const selectedAddress = useMemo(
		() => addresses.find((address) => address.id === addressId),
		[addresses, addressId]
	);

	useEffect(() => {
		if (!selectedAddress) {
			return;
		}

		setPaymentMethod("COD");
	}, [selectedAddress]);

	const availableMethods: Array<{ method: PaymentMethod; disabled: boolean; note?: string }> = [
		{
			method: "COD",
			disabled: selectedAddress?.country !== "IN",
			note: selectedAddress?.country !== "IN" ? "COD is only available for India addresses" : undefined,
		},
		{ method: "RAZORPAY", disabled: true, note: "Temporarily disabled" },
		{ method: "STRIPE", disabled: true, note: "Temporarily disabled" },
	];
	const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_COST_INR;
	const discount = 0;
	const total = subtotal + shipping - discount;

	const endpointByPaymentMethod: Record<PaymentMethod, string> = {
		COD: "/api/checkout/cod",
		RAZORPAY: "/api/checkout/razorpay",
		STRIPE: "/api/checkout/stripe",
	};

	const placeOrder = async () => {
		if (!selectedAddress) {
			toast.error("Please select a valid shipping address");
			return;
		}

		if (paymentMethod !== "COD") {
			toast.error("Razorpay and Stripe are temporarily disabled. Please use COD.");
			return;
		}

		if (itemCount === 0) {
			toast.error("Your cart is empty");
			return;
		}

		setPlacingOrder(true);
		try {
			// Sync local cart snapshot first, then derive canonical total from server cart.
			await fetch("/api/cart", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: items.map((item) => ({
						productId: item.productId,
						variantId: item.variantId ?? null,
						quantity: item.quantity,
					})),
				}),
			});

			const cartResponse = await fetch("/api/cart", { method: "GET" });
			if (!cartResponse.ok) {
				throw new Error("Unable to verify cart totals. Please try again.");
			}

			const cartPayload = (await cartResponse.json()) as {
				cart?: Array<{
					quantity: number;
					product: { basePrice: string | number };
					variant: { priceModifier: string | number } | null;
				}>;
			};

			const serverSubtotal = Number(
				(cartPayload.cart || [])
					.reduce((sum, line) => {
						const unitPrice = Number(line.product.basePrice) + Number(line.variant?.priceModifier || 0);
						return sum + unitPrice * line.quantity;
					}, 0)
					.toFixed(2)
			);
			const serverShipping = serverSubtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_COST_INR;
			const canonicalTotal = Number((serverSubtotal + serverShipping).toFixed(2));

			const idempotencyKey = typeof crypto !== "undefined" && crypto.randomUUID
				? crypto.randomUUID()
				: `${Date.now()}-${Math.random()}`;

			const response = await fetch(endpointByPaymentMethod[paymentMethod], {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					addressId,
					paymentMethod,
					couponCode: null,
					idempotencyKey,
					clientTotal: canonicalTotal,
					notes: null,
				}),
			});

			const payload = (await response.json()) as { error?: string; order?: { id: string } };
			if (!response.ok) {
				throw new Error(payload.error || "Unable to place order");
			}

			if (!payload.order?.id) {
				throw new Error("Order reference missing in response");
			}

			clearCart();
			router.push(`/order-confirmation/${payload.order.id}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unable to place order");
		} finally {
			setPlacingOrder(false);
		}
	};

	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
			<h1 className="font-heading text-4xl">Checkout</h1>
			<p className="mt-2 text-sm text-muted-foreground">Razorpay and Stripe are temporarily disabled. Cash on Delivery is active.</p>

			<div className="mt-8 grid gap-6 md:grid-cols-2">
				<Card className="space-y-3 p-4">
					<h2 className="font-heading text-xl">Shipping Address</h2>
					<div className="flex items-center justify-between">
						<p className="text-xs text-muted-foreground">Choose a saved address or add a new one.</p>
						<Link href="/profile/addresses" className="text-xs text-primary hover:underline">
							Manage
						</Link>
					</div>
					{addresses.length === 0 ? (
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground">Enter your complete shipping address before placing an order.</p>
							<AddressForm
								onSaved={() => {
									void (async () => {
										const response = await fetch("/api/addresses");
										const payload = (await response.json()) as { addresses?: Address[] };
										const next = payload.addresses || [];
										setAddresses(next);
										if (next[0]) {
											setAddressId(next[0].id);
										}
									})();
								}}
							/>
						</div>
					) : (
						<select
							value={addressId}
							onChange={(event) => setAddressId(event.target.value)}
							className="w-full rounded-md border border-border bg-background p-2"
						>
							{addresses.map((address) => (
								<option key={address.id} value={address.id}>
									{address.fullName} • {address.city}, {address.country}
								</option>
							))}
						</select>
					)}
				</Card>

				<Card className="space-y-3 p-4">
					<h2 className="font-heading text-xl">Payment Method</h2>
					<div className="grid gap-2">
						{availableMethods.map((option) => (
							<Button
								key={option.method}
								variant={paymentMethod === option.method ? "default" : "outline"}
								disabled={!selectedAddress || option.disabled}
								onClick={() => setPaymentMethod(option.method)}
								className="justify-start"
							>
								{option.method}
							</Button>
						))}
					</div>
					{availableMethods.map((option) =>
						option.note ? (
							<p key={`${option.method}-note`} className="text-xs text-muted-foreground">
								{option.method}: {option.note}
							</p>
						) : null
					)}
					{!selectedAddress ? (
						<p className="text-xs text-destructive">Please save and select a valid address first.</p>
					) : null}
					{selectedAddress?.country !== "IN" ? <p className="text-xs text-muted-foreground">Please use an India address for COD.</p> : null}
				</Card>

				<Card className="space-y-3 p-4">
					<h2 className="font-heading text-xl">Order Summary</h2>
					<div className="space-y-1 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Items</span>
							<span>{itemCount}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<CurrencyDisplay amountInINR={subtotal} />
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Shipping</span>
							{shipping === 0 ? "Free" : <CurrencyDisplay amountInINR={shipping} />}
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Discount</span>
							<CurrencyDisplay amountInINR={discount} />
						</div>
						<div className="flex justify-between border-t border-border pt-2 font-medium">
							<span>Total</span>
							<CurrencyDisplay amountInINR={total} />
						</div>
					</div>
					<Button className="w-full" onClick={placeOrder} disabled={placingOrder || !selectedAddress || itemCount === 0}>
						{placingOrder ? "Placing Order..." : "Place Order"}
					</Button>
				</Card>
			</div>
		</main>
	);
}
