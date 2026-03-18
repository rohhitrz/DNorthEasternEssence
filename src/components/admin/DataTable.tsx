type Column<T> = {
	header: string;
	render: (row: T) => React.ReactNode;
};

export default function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
	return (
		<div className="overflow-x-auto rounded-xl border border-border bg-card">
			<table className="w-full min-w-[720px] text-sm">
				<thead className="border-b border-border bg-muted/30">
					<tr>
						{columns.map((column) => (
							<th key={column.header} className="px-4 py-3 text-left font-medium text-muted-foreground">
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, idx) => (
						<tr key={idx} className="border-b border-border/60 last:border-none">
							{columns.map((column) => (
								<td key={`${column.header}-${idx}`} className="px-4 py-3">
									{column.render(row)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
