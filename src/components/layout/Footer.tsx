import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
	return (
		<footer className="border-t border-border bg-card/70">
			<div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-5 md:px-8">
				<div className="space-y-3">
					
					<p className="text-sm text-muted-foreground">{BRAND_TAGLINE}</p>
					<div className="flex gap-2 text-xs text-muted-foreground">
						<span>Instagram</span>
						<span>•</span>
						<span>Facebook</span>
						<span>•</span>
						<span>X</span>
					</div>
				</div>

				<div>
					<h4 className="mb-3 font-accent text-lg text-foreground">Shop</h4>
					<div className="space-y-2 text-sm text-muted-foreground">
						{FOOTER_LINKS.shop.map((link) => (
							<Link key={link.href} href={link.href} className="block hover:text-primary">
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<div>
					<h4 className="mb-3 font-accent text-lg text-foreground">Company</h4>
					<div className="space-y-2 text-sm text-muted-foreground">
						{FOOTER_LINKS.company.map((link) => (
							<Link key={link.href} href={link.href} className="block hover:text-primary">
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<div>
					<h4 className="mb-3 font-accent text-lg text-foreground">Legal</h4>
					<div className="space-y-2 text-sm text-muted-foreground">
						{FOOTER_LINKS.legal.map((link) => (
							<Link key={link.href} href={link.href} className="block hover:text-primary">
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<div>
					<h4 className="mb-3 font-accent text-lg text-foreground">Contact</h4>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>support@dnortheasternessence.com</p>
						<p>+91 90000 00000</p>
						<p>Assam, India</p>
					</div>
				</div>
			</div>

			<div className="border-t border-border">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-8">
					<p>© 2025 {BRAND_NAME}. All rights reserved.</p>
					<p>Payments: Razorpay • Stripe • COD (India)</p>
				</div>
			</div>
		</footer>
	);
}
