import StatsCard from "@/components/admin/StatsCard";
import RevenueChart from "@/components/admin/RevenueChart";

const chartData = [
	{ label: "Mon", revenue: 18000 },
	{ label: "Tue", revenue: 24000 },
	{ label: "Wed", revenue: 19000 },
	{ label: "Thu", revenue: 28000 },
	{ label: "Fri", revenue: 32000 },
	{ label: "Sat", revenue: 37000 },
	{ label: "Sun", revenue: 29000 },
];

export default function Page() {
	return (
		<main className="space-y-6">
			<h1 className="font-heading text-4xl">Admin Dashboard</h1>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatsCard label="Orders" value="142" hint="Last 30 days" />
				<StatsCard label="Revenue" value="INR 3.7L" hint="Last 30 days" />
				<StatsCard label="AOV" value="INR 2,890" />
				<StatsCard label="Conversion" value="3.9%" />
			</div>
			<RevenueChart data={chartData} />
		</main>
	);
}
