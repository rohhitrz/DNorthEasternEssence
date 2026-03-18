"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Search, ShoppingBag } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { NAV_LINKS, BRAND_NAME } from "@/lib/constants";
import { useCart } from "@/hooks/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Navbar() {
	const router = useRouter();
	const { itemCount } = useCart();
	const { currency, setCurrency } = useCurrency();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<header className="sticky top-0 z-40 overflow-x-clip border-b border-border/80 bg-background/70 backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-7xl min-w-0 items-center justify-between gap-2 px-4 md:px-8">
				<div className="flex min-w-0 items-center gap-2 sm:gap-3">
					<div className="md:hidden">
						<MobileNav />
					</div>
					<div className="hidden items-center gap-1 sm:flex">
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Go back"
							onClick={() => router.back()}
						>
							<ChevronLeft />
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Go forward"
							onClick={() => router.forward()}
						>
							<ChevronRight />
						</Button>
					</div>
					<Link
						href="/"
						className="max-w-[10.5rem] truncate font-heading text-lg text-primary transition hover:text-[#d4b87a] sm:max-w-[15rem] sm:text-xl md:max-w-none"
					>
						{BRAND_NAME}
					</Link>
				</div>

				<nav className="hidden items-center gap-7 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm text-foreground/90 transition hover:text-primary"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex shrink-0 items-center gap-1 sm:gap-2">
					<div className="hidden md:flex">
						<select
							value={currency}
							onChange={(event) => setCurrency(event.target.value as "INR" | "USD")}
							className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground"
							aria-label="Select currency"
						>
							<option value="INR">INR</option>
							<option value="USD">USD</option>
						</select>
					</div>

					<Button variant="ghost" size="icon-sm" aria-label="Search" className="hidden sm:inline-flex">
						<Search />
					</Button>

					<SignedIn>
						<Link href="/profile/wishlist" className="relative hidden sm:block">
							<Button variant="ghost" size="icon-sm" aria-label="Wishlist">
								<Heart />
							</Button>
							{mounted ? (
								<Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px]">•</Badge>
							) : null}
						</Link>
					</SignedIn>
					<SignedOut>
						<div className="relative hidden sm:block">
							<Link href="/sign-in" aria-label="Sign in to wishlist">
								<Button variant="ghost" size="icon-sm">
									<Heart />
								</Button>
							</Link>
							{mounted ? (
								<Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px]">0</Badge>
							) : null}
						</div>
					</SignedOut>

					<div className="relative">
						<CartDrawer trigger={<ShoppingBag className="size-4" />} />
						{mounted && itemCount > 0 && (
							<Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px]">{itemCount}</Badge>
						)}
					</div>

					<SignedIn>
						<Link href="/profile" className="hidden md:block">
							<Button variant="outline" size="sm">My Account</Button>
						</Link>
						<Link href="/profile/orders" className="hidden lg:block">
							<Button variant="ghost" size="sm">My Orders</Button>
						</Link>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
					<SignedOut>
						<Link href="/sign-in">
							<Button variant="outline" size="sm">
								Sign In
							</Button>
						</Link>
					</SignedOut>
				</div>
			</div>
		</header>
	);
}
