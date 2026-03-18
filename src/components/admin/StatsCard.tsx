import { Card } from "@/components/ui/card";

export default function StatsCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
	return (
		<Card className="p-4">
			<p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
			<p className="mt-2 font-heading text-3xl text-primary">{value}</p>
			{hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
		</Card>
	);
}
