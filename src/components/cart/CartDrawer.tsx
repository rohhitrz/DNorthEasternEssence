"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn, normalizeImageSrc } from "@/lib/utils";

export default function CartDrawer({ trigger }: { trigger?: React.ReactNode }) {
	const { isSignedIn } = useAuth();
	const { items, itemCount, subtotal, removeItem, updateQty } = useCart();
	const shipping = subtotal > 1500 ? 0 : 99;
	const discount = 0;
	const total = subtotal + shipping - discount;

	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					"inline-flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)]",
					"hover:bg-muted hover:text-foreground"
				)}
				aria-label="Open cart"
			>
				{trigger || <ShoppingBag className="size-4" />}
			</SheetTrigger>
			<SheetContent side="right" className="w-full max-w-md bg-card">
				<SheetHeader>
					<SheetTitle className="font-heading text-xl text-foreground">Your Cart ({itemCount} items)</SheetTitle>
					<SheetDescription className="text-muted-foreground">
						Secure checkout with Razorpay and Stripe.
					</SheetDescription>
				</SheetHeader>

				{!isSignedIn ? (
					<div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
						<ShoppingBag className="size-10 text-primary" />
						<p className="font-heading text-lg">Sign in to view your cart</p>
						<p className="text-sm text-muted-foreground">Your cart is private and tied to your account.</p>
						<Link href="/sign-in">
							<Button>Sign In</Button>
						</Link>
					</div>
				) : items.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
						<ShoppingBag className="size-10 text-primary" />
						<p className="font-heading text-lg">Your cart is empty</p>
						<p className="text-sm text-muted-foreground">Add pure natural perfume, attar, or deodorants to continue.</p>
						<Link href="/shop">
							<Button>Shop Collection</Button>
						</Link>
					</div>
				) : (
					<div className="flex h-[calc(100vh-10rem)] flex-col">
						<div className="flex-1 space-y-3 overflow-y-auto p-4">
							{items.map((item) => (
								<div key={`${item.productId}:${item.variantId ?? "none"}`} className="rounded-lg border border-border p-3">
									<div className="flex gap-3">
										<div className="relative h-16 w-16 overflow-hidden rounded-md">
											<Image
												src={normalizeImageSrc(item.image)}
												alt={`${item.name} cart thumbnail`}
												fill
												className="object-cover"
												sizes="64px"
											/>
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate font-heading text-sm">{item.name}</p>
											{item.variantId ? (
												<p className="text-xs text-muted-foreground">Variant: {item.variantId}</p>
											) : null}
											<p className="mt-1 text-sm text-primary">
												<CurrencyDisplay amountInINR={item.price * item.quantity} />
											</p>
										</div>
										<Button
											size="icon-xs"
											variant="ghost"
											onClick={() => removeItem(item.productId, item.variantId)}
										>
											<X />
										</Button>
									</div>
									<div className="mt-3 flex items-center gap-2">
										<Button
											size="icon-xs"
											variant="outline"
											onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
										>
											<Minus />
										</Button>
										<span className="w-8 text-center text-sm">{item.quantity}</span>
										<Button
											size="icon-xs"
											variant="outline"
											onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
										>
											<Plus />
										</Button>
									</div>
								</div>
							))}
						</div>

						<div className="space-y-3 border-t border-border p-4">
							<div className="flex gap-2">
								<Input placeholder="Coupon code" />
								<Button variant="outline">Apply</Button>
							</div>

							<div className="space-y-1 text-sm">
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
								<div className="flex justify-between pt-2 font-medium">
									<span>Total</span>
									<span className="text-primary">
										<CurrencyDisplay amountInINR={total} />
									</span>
								</div>
							</div>

							<Link href="/checkout" className="block">
								<Button className="w-full">Checkout</Button>
							</Link>
							<Link href="/shop" className="block text-center text-sm text-muted-foreground hover:text-primary">
								Continue Shopping
							</Link>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
