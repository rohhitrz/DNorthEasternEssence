"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { NAV_LINKS } from "@/lib/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					"inline-flex size-7 items-center justify-center rounded-[min(var(--radius-md),12px)]",
					"hover:bg-muted hover:text-foreground"
				)}
				aria-label="Open menu"
			>
				<Menu />
				<span className="sr-only">Open menu</span>
			</SheetTrigger>
			<SheetContent side="right" className="bg-card/95 backdrop-blur-xl">
				<SheetHeader>
					<SheetTitle className="font-heading text-xl text-primary">Menu</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 p-4">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-md px-3 py-2 text-foreground transition hover:bg-muted"
						>
							{link.label}
						</Link>
					))}
					<SignedIn>
						<div className="mt-2 border-t border-border pt-2">
							<Link href="/profile" className="block rounded-md px-3 py-2 text-foreground transition hover:bg-muted">
								My Account
							</Link>
							<Link href="/profile/orders" className="block rounded-md px-3 py-2 text-foreground transition hover:bg-muted">
								My Orders
							</Link>
						</div>
					</SignedIn>
					<SignedOut>
						<Link href="/sign-in" className="mt-2">
							<Button variant="outline" className="w-full">Sign In</Button>
						</Link>
					</SignedOut>
					<Link href="/shop" className="mt-3">
						<Button className="w-full">Explore Collection</Button>
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
