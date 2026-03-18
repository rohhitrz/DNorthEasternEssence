"use client";

import { Card } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function RevenueChart({
	data,
}: {
	data: Array<{ label: string; revenue: number }>;
}) {
	return (
		<Card className="p-4">
			<h3 className="font-heading text-xl">Revenue Trend</h3>
			<div className="mt-4 h-64 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<XAxis dataKey="label" stroke="#9a8878" />
						<YAxis stroke="#9a8878" />
						<Tooltip />
						<Line type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}
