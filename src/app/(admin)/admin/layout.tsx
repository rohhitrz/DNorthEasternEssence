import Link from "next/link";

const links = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/products", label: "Products" },
	{ href: "/admin/orders", label: "Orders" },
	{ href: "/admin/users", label: "Users" },
	{ href: "/admin/coupons", label: "Coupons" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:px-8">
			<aside className="rounded-xl border border-border bg-card p-4">
				<p className="font-heading text-xl">Admin</p>
				<nav className="mt-4 space-y-1">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
							{link.label}
						</Link>
					))}
				</nav>
			</aside>
			<section>{children}</section>
		</div>
	);
}
